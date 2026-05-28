import { NextResponse } from "next/server";
import { RawSignal } from "@/lib/trendEngine";

const SUBREDDITS = ["investing", "stocks", "wallstreetbets", "technology", "business", "SecurityAnalysis", "finance"];

export async function GET() {
  try {
    const signals: RawSignal[] = [];

    for (const sub of SUBREDDITS.slice(0, 4)) {
      try {
        const res = await fetch(
          `https://www.reddit.com/r/${sub}/hot.json?limit=15`,
          {
            headers: { "User-Agent": "SocialTrendIntel/1.0 (web app research tool)" },
            next: { revalidate: 300 },
          }
        );
        if (!res.ok) continue;
        const data = await res.json();
        const posts = data?.data?.children ?? [];

        for (const post of posts) {
          const p = post.data;
          if (!p?.title || p.stickied) continue;
          signals.push({
            id: `reddit-${p.id}`,
            title: p.title,
            body: p.selftext?.slice(0, 300) || p.url,
            source: "reddit",
            subreddit: sub,
            url: `https://reddit.com${p.permalink}`,
            score: p.score ?? 0,
            comments: p.num_comments ?? 0,
            timestamp: (p.created_utc ?? Date.now() / 1000) * 1000,
          });
        }
      } catch {
        // Ignore per-subreddit failures
      }
    }

    return NextResponse.json({ signals, count: signals.length });
  } catch {
    return NextResponse.json({ signals: [], count: 0, error: "Reddit fetch failed" });
  }
}
