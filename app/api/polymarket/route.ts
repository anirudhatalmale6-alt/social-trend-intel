import { NextResponse } from "next/server";
import { RawSignal } from "@/lib/trendEngine";

export async function GET() {
  try {
    const res = await fetch(
      "https://gamma-api.polymarket.com/markets?limit=30&active=true&closed=false",
      { next: { revalidate: 300 } }
    );

    if (!res.ok) {
      return NextResponse.json({ signals: [], markets: [], count: 0 });
    }

    const markets = await res.json();

    const signals: RawSignal[] = [];

    for (const m of markets) {
      if (!m.question) continue;

      const volume = parseFloat(m.volume || "0");
      const liquidity = parseFloat(m.liquidity || "0");

      signals.push({
        id: `poly-${m.id || m.condition_id || Date.now()}`,
        title: m.question.slice(0, 120),
        body: m.description?.slice(0, 300) || "",
        source: "polymarket",
        url: m.url || `https://polymarket.com/event/${m.slug || m.id}`,
        score: Math.round(volume / 100),
        comments: 0,
        timestamp: m.end_date_iso
          ? new Date(m.end_date_iso).getTime()
          : Date.now(),
      });
    }

    return NextResponse.json({
      signals,
      markets,
      count: signals.length,
    });
  } catch {
    return NextResponse.json({
      signals: [],
      markets: [],
      count: 0,
      error: "Polymarket fetch failed",
    });
  }
}
