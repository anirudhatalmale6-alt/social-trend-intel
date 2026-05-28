import { NextRequest, NextResponse } from "next/server";
import { processSignals, RawSignal } from "@/lib/trendEngine";
import { evaluateSignals, executeActions, TradeConfig } from "@/lib/autoTrader";
import { isConfigured } from "@/lib/alpaca";
import { sendTradeAlert, sendScanSummary, isAlertConfigured } from "@/lib/whatsappAlert";

const BASE = process.env.INTERNAL_BASE_URL || process.env.NEXT_PUBLIC_BASE_URL || `http://localhost:${process.env.PORT || 3000}`;

async function fetchAllSignals(): Promise<RawSignal[]> {
  const signals: RawSignal[] = [];
  const feeds = ["/api/reddit", "/api/sec", "/api/polymarket"];

  const results = await Promise.all(
    feeds.map(async (path) => {
      try {
        const res = await fetch(new URL(path, BASE).toString(), {
          next: { revalidate: 60 },
        });
        if (!res.ok) return [];
        const data = await res.json();
        return data?.signals ?? [];
      } catch {
        return [];
      }
    })
  );

  for (const batch of results) signals.push(...batch);

  // Congress trades
  try {
    const polRes = await fetch(new URL("/api/politicians", BASE).toString(), {
      next: { revalidate: 60 },
    });
    if (polRes.ok) {
      const { trades } = await polRes.json();
      for (const t of trades ?? []) {
        signals.push({
          id: `congress-${t.politician}-${t.ticker}`.replace(/[^a-zA-Z0-9]/g, "-"),
          title: `${t.politician} (${t.party}) ${t.type === "Buy" ? "bought" : "sold"} ${t.ticker} — ${t.amount}`,
          body: `Congressional trade by ${t.politician}`,
          source: "congress",
          score: 70,
          comments: 0,
          timestamp: t.date ? new Date(t.date).getTime() : Date.now(),
        });
      }
    }
  } catch { /* skip */ }

  return signals;
}

// GET: Evaluate signals and show proposed trades (dry run)
export async function GET(req: NextRequest) {
  if (!isConfigured()) {
    return NextResponse.json({ error: "Alpaca not configured" }, { status: 503 });
  }

  const threshold = Number(req.nextUrl.searchParams.get("threshold")) || 80;
  const tickers = req.nextUrl.searchParams.get("tickers")?.split(",") || ["NVDA", "MSFT", "LLY", "GOOGL"];

  try {
    const rawSignals = await fetchAllSignals();
    const trends = processSignals(rawSignals);

    const config: TradeConfig = {
      signalThreshold: threshold,
      maxPositionPct: 0.03,
      maxTotalPositions: 10,
      preferOptions: true,
      optionExpiryDaysMin: 5,
      optionExpiryDaysMax: 14,
      stopLossPct: 0.5,
      tickers,
    };

    const actions = await evaluateSignals(trends, config);
    const aboveThreshold = trends.filter((t) => t.signalScore >= threshold).length;

    const sendAlerts = req.nextUrl.searchParams.get("alert") === "true";
    let alertsSent = 0;

    if (sendAlerts && isAlertConfigured() && actions.length > 0) {
      for (const action of actions) {
        const sent = await sendTradeAlert({
          ticker: action.symbol,
          sentiment: action.sentiment as "bullish" | "bearish",
          signalScore: action.signalScore,
          bullishCount: parseInt(action.reason.match(/(\d+) bullish/)?.[1] || "0"),
          bearishCount: parseInt(action.reason.match(/(\d+) bearish/)?.[1] || "0"),
          proposedTrade: action.type === "option" ? "OPTIONS" : "STOCK",
          optionSymbol: action.optionSymbol,
          strike: action.strike,
          expiry: action.expiry,
          qty: action.qty,
        });
        if (sent) alertsSent++;
      }
    }

    if (sendAlerts && isAlertConfigured() && actions.length === 0) {
      await sendScanSummary(rawSignals.length, aboveThreshold, 0, []);
    }

    return NextResponse.json({
      mode: "dry-run",
      signalsProcessed: rawSignals.length,
      trendsAboveThreshold: aboveThreshold,
      proposedActions: actions,
      alertsSent,
      config: { threshold, tickers },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Evaluation failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// POST: Execute trades based on signals
export async function POST(req: NextRequest) {
  if (!isConfigured()) {
    return NextResponse.json({ error: "Alpaca not configured" }, { status: 503 });
  }

  try {
    const body = await req.json();
    const { execute, threshold, tickers } = body;

    const rawSignals = await fetchAllSignals();
    const trends = processSignals(rawSignals);

    const config: TradeConfig = {
      signalThreshold: threshold || 80,
      maxPositionPct: body.maxPositionPct || 0.03,
      maxTotalPositions: body.maxPositions || 10,
      preferOptions: body.preferOptions !== false,
      optionExpiryDaysMin: body.expiryMin || 5,
      optionExpiryDaysMax: body.expiryMax || 14,
      stopLossPct: body.stopLoss || 0.5,
      tickers: tickers || ["NVDA", "MSFT", "LLY", "GOOGL"],
    };

    const actions = await evaluateSignals(trends, config);

    if (!execute) {
      return NextResponse.json({
        mode: "preview",
        proposedActions: actions,
        message: "Set execute: true to place these trades",
      });
    }

    const results = await executeActions(actions);

    return NextResponse.json({
      mode: "live",
      ...results,
      actionsEvaluated: actions.length,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Trade execution failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
