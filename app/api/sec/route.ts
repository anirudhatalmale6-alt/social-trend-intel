import { NextResponse } from "next/server";
import { RawSignal } from "@/lib/trendEngine";

const EDGAR_RSS =
  "https://www.sec.gov/cgi-bin/browse-edgar?action=getcurrent&type=4&dateb=&owner=include&count=40&search_text=&start=0&output=atom";

export async function GET() {
  try {
    const signals = await fetchEdgarForm4();
    return NextResponse.json({ signals, count: signals.length });
  } catch {
    return NextResponse.json({ signals: [], count: 0, error: "SEC fetch failed" });
  }
}

async function fetchEdgarForm4(): Promise<RawSignal[]> {
  const signals: RawSignal[] = [];

  try {
    const res = await fetch(EDGAR_RSS, {
      headers: {
        "User-Agent": "TrendArb research@trendintel.app",
        Accept: "application/atom+xml, text/xml, text/html",
      },
      next: { revalidate: 600 },
    });

    if (!res.ok) return signals;
    const text = await res.text();

    const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
    const tagVal = (entry: string, tag: string) => {
      const m = entry.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`));
      return m ? m[1].replace(/<[^>]+>/g, "").trim() : "";
    };
    const tagAttr = (entry: string, tag: string, attr: string) => {
      const m = entry.match(new RegExp(`<${tag}[^>]*${attr}="([^"]+)"`));
      return m ? m[1] : "";
    };

    let match;
    while ((match = entryRegex.exec(text)) !== null) {
      const entry = match[1];

      const rawTitle = tagVal(entry, "title");
      const link = tagAttr(entry, "link", "href");
      const updated = tagVal(entry, "updated");
      const summary = tagVal(entry, "summary").slice(0, 400);

      if (!rawTitle.startsWith("4")) continue;

      const parsed = parseForm4Title(rawTitle);
      const title = parsed.isIssuer
        ? `SEC Insider Filing: ${parsed.name} — Form 4 filed`
        : `SEC Insider Trade: ${parsed.name} filed Form 4 for ${parsed.related || "company"}`;

      const timestamp = updated ? new Date(updated).getTime() : Date.now();

      signals.push({
        id: `sec-${(link || rawTitle).replace(/[^a-zA-Z0-9]/g, "-").slice(-50)}`,
        title: title.slice(0, 120),
        body: `Insider buy/sell detected via SEC Form 4. ${parsed.name} ${parsed.isIssuer ? "(issuer)" : "(reporting person)"}. Filed: ${updated?.split("T")[0] || "today"}. ${summary.slice(0, 150)}`,
        source: "sec",
        url: link.startsWith("http") ? link : `https://www.sec.gov${link}`,
        score: 70,
        comments: 0,
        timestamp: isNaN(timestamp) ? Date.now() : timestamp,
      });
    }
  } catch (e) {
    console.error("EDGAR fetch error:", e);
  }

  return signals;
}

function parseForm4Title(title: string): {
  name: string;
  cik: string;
  isIssuer: boolean;
  related?: string;
} {
  const nameMatch = title.match(/^4\s*-\s*(.+?)\s*\(/);
  const cikMatch = title.match(/\((\d+)\)/);
  const isIssuer = title.includes("(Issuer)");
  const isReporting = title.includes("(Reporting)");

  const name = nameMatch?.[1]?.trim() || title.replace(/^4\s*-\s*/, "").trim();
  const cik = cikMatch?.[1] || "";

  return { name, cik, isIssuer, related: isReporting ? "" : undefined };
}
