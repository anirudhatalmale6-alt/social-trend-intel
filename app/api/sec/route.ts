import { NextResponse } from "next/server";
import { RawSignal } from "@/lib/trendEngine";

const EDGAR_FULL_TEXT_URL =
  "https://efts.sec.gov/LATEST/search-index?q=%22Form+4%22&dateRange=custom&startdt=STARTDT&enddt=ENDDT&forms=4";

const EDGAR_RSS_URL =
  "https://www.sec.gov/cgi-bin/browse-edgar?action=getcurrent&type=4&dateb=&owner=include&count=40&search_text=&start=0&output=atom";

interface EdgarFiling {
  title: string;
  link: string;
  updated: string;
  summary: string;
}

async function fetchEdgarFilings(): Promise<RawSignal[]> {
  const signals: RawSignal[] = [];

  try {
    const res = await fetch(EDGAR_RSS_URL, {
      headers: {
        "User-Agent": "TrendArb/1.0 (research tool, contact@trendintel.app)",
        Accept: "application/atom+xml, application/xml, text/xml, text/html",
      },
      next: { revalidate: 600 },
    });

    if (!res.ok) return signals;

    const text = await res.text();

    const entryRegex =
      /<entry>([\s\S]*?)<\/entry>/g;
    const titleRegex = /<title[^>]*>([\s\S]*?)<\/title>/;
    const linkRegex = /<link[^>]*href="([^"]+)"/;
    const updatedRegex = /<updated>([\s\S]*?)<\/updated>/;
    const summaryRegex = /<summary[^>]*>([\s\S]*?)<\/summary>/;

    let match;
    while ((match = entryRegex.exec(text)) !== null) {
      const entry = match[1];

      const titleMatch = titleRegex.exec(entry);
      const linkMatch = linkRegex.exec(entry);
      const updatedMatch = updatedRegex.exec(entry);
      const summaryMatch = summaryRegex.exec(entry);

      if (!titleMatch) continue;

      const title = titleMatch[1].replace(/<[^>]+>/g, "").trim();
      const link = linkMatch?.[1] || "";
      const updated = updatedMatch?.[1]?.trim() || "";
      const summary = (summaryMatch?.[1] || "")
        .replace(/<[^>]+>/g, "")
        .trim()
        .slice(0, 300);

      if (!title.includes("4") && !title.toLowerCase().includes("insider")) continue;

      const insiderName = extractInsiderName(title);
      const companyName = extractCompanyName(title, summary);
      const tradeType = detectTradeType(summary);

      const enrichedTitle = insiderName && companyName
        ? `SEC Form 4: ${insiderName} ${tradeType} shares of ${companyName}`
        : title;

      const timestamp = updated ? new Date(updated).getTime() : Date.now();

      signals.push({
        id: `sec-${link.replace(/[^a-zA-Z0-9]/g, "-").slice(-50)}`,
        title: enrichedTitle.slice(0, 120),
        body: `${tradeType === "bought" ? "Insider buy" : tradeType === "sold" ? "Insider sell" : "SEC filing"} — ${summary}`.slice(0, 300),
        source: "sec",
        url: link.startsWith("http") ? link : `https://www.sec.gov${link}`,
        score: tradeType === "bought" ? 80 : tradeType === "sold" ? 60 : 40,
        comments: 0,
        timestamp: isNaN(timestamp) ? Date.now() : timestamp,
      });
    }
  } catch (e) {
    console.error("EDGAR fetch error:", e);
  }

  return signals;
}

function extractInsiderName(title: string): string {
  const match = title.match(/^([\w\s,.']+?)\s*[-–—]\s/);
  return match?.[1]?.trim().slice(0, 40) || "";
}

function extractCompanyName(title: string, summary: string): string {
  const combined = `${title} ${summary}`;
  const match = combined.match(
    /(?:issuer|company|reporting)\s*(?:name)?\s*[:\-]?\s*([A-Z][\w\s&.,]+?)(?:\s*\(|\s*-|\s*$)/i
  );
  return match?.[1]?.trim().slice(0, 50) || "";
}

function detectTradeType(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes("purchase") || lower.includes("acquisition") || lower.includes("buy")) return "bought";
  if (lower.includes("sale") || lower.includes("disposition") || lower.includes("sell")) return "sold";
  return "filed Form 4 for";
}

export async function GET() {
  try {
    const signals = await fetchEdgarFilings();
    return NextResponse.json({ signals, count: signals.length });
  } catch {
    return NextResponse.json({ signals: [], count: 0, error: "SEC fetch failed" });
  }
}
