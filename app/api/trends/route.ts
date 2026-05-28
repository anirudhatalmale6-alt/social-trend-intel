import { NextResponse } from "next/server";
import { RawSignal } from "@/lib/trendEngine";
import { MOCK_TIKTOK_SIGNALS, MOCK_TWITTER_SIGNALS } from "@/lib/mockData";
import { processSignals } from "@/lib/trendEngine";

export async function GET() {
  const allSignals: RawSignal[] = [];

  // 1. Reddit (live)
  try {
    const redditRes = await fetch(new URL("/api/reddit", process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000").toString(), { next: { revalidate: 300 } });
    if (redditRes.ok) {
      const { signals } = await redditRes.json();
      allSignals.push(...(signals ?? []));
    }
  } catch { /* skip */ }

  // 2. TikTok (simulated)
  allSignals.push(...MOCK_TIKTOK_SIGNALS);

  // 3. Twitter/X (simulated)
  allSignals.push(...MOCK_TWITTER_SIGNALS);

  // 4. Polymarket (real API)
  try {
    const polyRes = await fetch(new URL("/api/polymarket", process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000").toString(), { next: { revalidate: 300 } });
    if (polyRes.ok) {
      const { signals } = await polyRes.json();
      allSignals.push(...(signals ?? []));
    }
  } catch { /* skip polymarket */ }

  const trends = processSignals(allSignals);

  return NextResponse.json({
    trends,
    meta: {
      total: trends.length,
      sources: {
        reddit: allSignals.filter(s => s.source === "reddit").length,
        tiktok: allSignals.filter(s => s.source === "tiktok").length,
        twitter: allSignals.filter(s => s.source === "twitter").length,
        news: allSignals.filter(s => s.source === "news").length,
        polymarket: allSignals.filter(s => s.source === "polymarket").length,
      },
      lastUpdated: new Date().toISOString(),
    },
  });
}
