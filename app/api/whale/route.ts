import { NextResponse } from "next/server";
import { RawSignal } from "@/lib/trendEngine";
import * as cheerio from "cheerio";

const WHALE_ALERT_RSS = "https://whale-alert.io/feed";
const BLOCKCHAIN_RSS = "https://www.blockchain.com/explorer/rss";

async function fetchWhaleAlertRss(): Promise<RawSignal[]> {
  const signals: RawSignal[] = [];

  try {
    const res = await fetch(WHALE_ALERT_RSS, {
      headers: {
        "User-Agent": "TrendArb/1.0 (research tool)",
        Accept: "application/rss+xml, application/xml, text/xml",
      },
      next: { revalidate: 600 },
    });

    if (res.ok) {
      const xml = await res.text();
      const $ = cheerio.load(xml, { xmlMode: true });

      $("item").each((_, el) => {
        const item = $(el);
        const title = item.find("title").first().text().trim();
        const link = item.find("link").first().text().trim();
        const pubDate = item.find("pubDate").first().text().trim();
        const desc = item.find("description").first().text().trim();

        if (!title) return;

        const amount = extractAmount(title);
        if (amount < 1_000_000) return;

        const timestamp = pubDate ? new Date(pubDate).getTime() : Date.now();

        signals.push({
          id: `whale-${link.replace(/[^a-zA-Z0-9]/g, "-").slice(-40)}`,
          title: `Whale Alert: ${title}`.slice(0, 120),
          body: desc.slice(0, 300) || `Large crypto whale transfer detected: ${title}`,
          source: "whale",
          url: link || "https://whale-alert.io",
          score: Math.min(100, Math.round(amount / 10_000_000)),
          comments: 0,
          timestamp: isNaN(timestamp) ? Date.now() : timestamp,
        });
      });
    }
  } catch {
    // whale-alert RSS might not be available
  }

  if (signals.length === 0) {
    return fetchEtherscanWhales();
  }

  return signals;
}

async function fetchEtherscanWhales(): Promise<RawSignal[]> {
  const signals: RawSignal[] = [];

  try {
    const res = await fetch(
      "https://api.blockchair.com/bitcoin/transactions?limit=10&s=output_total(desc)",
      {
        headers: { "User-Agent": "TrendArb/1.0" },
        next: { revalidate: 600 },
      }
    );

    if (!res.ok) return signals;
    const data = await res.json();

    for (const tx of data?.data || []) {
      const btcAmount = (tx.output_total || 0) / 100_000_000;
      if (btcAmount < 10) continue;

      const usdEstimate = btcAmount * 105000;

      signals.push({
        id: `whale-btc-${tx.hash?.slice(0, 16) || Date.now()}`,
        title: `Bitcoin Whale: ${btcAmount.toFixed(1)} BTC ($${(usdEstimate / 1_000_000).toFixed(1)}M) transferred`,
        body: `Large Bitcoin transaction detected. ${btcAmount.toFixed(2)} BTC moved in a single transaction. Hash: ${tx.hash?.slice(0, 20)}...`,
        source: "whale",
        url: `https://blockchair.com/bitcoin/transaction/${tx.hash}`,
        score: Math.min(100, Math.round(usdEstimate / 10_000_000)),
        comments: 0,
        timestamp: tx.time ? new Date(tx.time).getTime() : Date.now(),
      });
    }
  } catch {
    // fallback: no whale data available
  }

  return signals;
}

function extractAmount(text: string): number {
  const match = text.match(/\$?([\d,]+(?:\.\d+)?)\s*(?:USD|USDT|USDC)?/i);
  if (!match) return 0;
  return parseFloat(match[1].replace(/,/g, "")) || 0;
}

export async function GET() {
  try {
    const signals = await fetchWhaleAlertRss();
    return NextResponse.json({ signals, count: signals.length });
  } catch {
    return NextResponse.json({ signals: [], count: 0, error: "Whale fetch failed" });
  }
}
