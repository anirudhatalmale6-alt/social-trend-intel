import { NextResponse } from "next/server";
import { RawSignal } from "@/lib/trendEngine";
import { MOCK_TIKTOK_SIGNALS, MOCK_TWITTER_SIGNALS } from "@/lib/mockData";
import { processSignals } from "@/lib/trendEngine";

const BASE = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

async function fetchFeed(path: string): Promise<RawSignal[]> {
  try {
    const res = await fetch(new URL(path, BASE).toString(), {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data?.signals ?? [];
  } catch {
    return [];
  }
}

export async function GET() {
  const [reddit, polymarket, sec, whale] = await Promise.all([
    fetchFeed("/api/reddit"),
    fetchFeed("/api/polymarket"),
    fetchFeed("/api/sec"),
    fetchFeed("/api/whale"),
  ]);

  // Convert politician trades to RawSignals
  let congress: RawSignal[] = [];
  try {
    const polRes = await fetch(new URL("/api/politicians", BASE).toString(), {
      next: { revalidate: 300 },
    });
    if (polRes.ok) {
      const { trades } = await polRes.json();
      congress = (trades ?? []).map((t: Record<string, string>) => ({
        id: `congress-${t.politician}-${t.ticker}-${t.date}`.replace(/[^a-zA-Z0-9]/g, "-"),
        title: `${t.politician} (${t.party}) ${t.type === "Buy" ? "bought" : "sold"} ${t.ticker || t.issuer} — ${t.amount}`,
        body: `Congressional trade: ${t.politician} (${t.party}-${t.state}, ${t.chamber}) ${t.type.toLowerCase()} ${t.issuer} (${t.ticker}). Amount: ${t.amount}. Owner: ${t.owner}.`,
        source: "congress" as const,
        url: "https://www.capitoltrades.com/trades",
        score: estimateCongressScore(t.amount),
        comments: 0,
        timestamp: t.date ? new Date(t.date).getTime() : Date.now(),
      }));
    }
  } catch { /* skip */ }

  const allSignals: RawSignal[] = [
    ...reddit,
    ...MOCK_TIKTOK_SIGNALS,
    ...MOCK_TWITTER_SIGNALS,
    ...polymarket,
    ...sec,
    ...whale,
    ...congress,
  ];

  const trends = processSignals(allSignals);

  return NextResponse.json({
    trends,
    count: trends.length,
    meta: {
      total: trends.length,
      sources: {
        reddit: reddit.length,
        tiktok: MOCK_TIKTOK_SIGNALS.length,
        twitter: MOCK_TWITTER_SIGNALS.length,
        polymarket: polymarket.length,
        sec: sec.length,
        whale: whale.length,
        congress: congress.length,
      },
      lastUpdated: new Date().toISOString(),
    },
  });
}

function estimateCongressScore(amount: string): number {
  if (amount.includes("$5M") || amount.includes("$50M")) return 95;
  if (amount.includes("$1M")) return 85;
  if (amount.includes("$500K")) return 75;
  if (amount.includes("$250K")) return 65;
  if (amount.includes("$100K")) return 55;
  if (amount.includes("$50K")) return 45;
  return 30;
}
