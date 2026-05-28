import { NextResponse } from "next/server";
import { RawSignal } from "@/lib/trendEngine";
import * as cheerio from "cheerio";

const SUBREDDITS = [
  "investing",
  "stocks",
  "wallstreetbets",
  "technology",
  "business",
  "SecurityAnalysis",
  "finance",
];

function stripHtml(html: string): string {
  const $ = cheerio.load(html);
  return $.text().trim().slice(0, 300);
}

export async function GET() {
  try {
    const signals: RawSignal[] = [];

    const fetches = SUBREDDITS.slice(0, 5).map(async (sub) => {
      try {
        const res = await fetch(
          `https://www.reddit.com/r/${sub}/.rss?limit=15`,
          {
            headers: {
              "User-Agent":
                "SocialTrendIntel/1.0 (web app research tool)",
              Accept: "application/atom+xml, application/xml, text/xml",
            },
            next: { revalidate: 300 },
          }
        );
        if (!res.ok) return [];

        const xml = await res.text();
        const $ = cheerio.load(xml, { xmlMode: true });
        const posts: RawSignal[] = [];

        $("entry").each((_, el) => {
          const entry = $(el);
          const title = entry.find("title").first().text().trim();
          if (!title) return;

          const id =
            entry.find("id").first().text().trim() || `reddit-${sub}-${Date.now()}`;
          const link = entry.find('link[href]').first().attr("href") || "";
          const published = entry.find("published").first().text().trim();
          const updated = entry.find("updated").first().text().trim();
          const contentHtml = entry.find("content").first().text() || "";
          const body = stripHtml(contentHtml);

          const timestamp = published || updated
            ? new Date(published || updated).getTime()
            : Date.now();

          posts.push({
            id: `reddit-${id.replace(/[^a-zA-Z0-9]/g, "-").slice(0, 60)}`,
            title,
            body: body || link,
            source: "reddit",
            subreddit: sub,
            url: link,
            score: 0,
            comments: 0,
            timestamp: isNaN(timestamp) ? Date.now() : timestamp,
          });
        });

        return posts;
      } catch {
        return [];
      }
    });

    const results = await Promise.all(fetches);
    for (const batch of results) {
      signals.push(...batch);
    }

    signals.sort((a, b) => b.timestamp - a.timestamp);

    return NextResponse.json({ signals, count: signals.length });
  } catch {
    return NextResponse.json({
      signals: [],
      count: 0,
      error: "Reddit fetch failed",
    });
  }
}
