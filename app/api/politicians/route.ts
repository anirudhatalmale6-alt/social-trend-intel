import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

export interface PoliticianTrade {
  politician: string;
  party: string;
  chamber: string;
  state: string;
  issuer: string;
  ticker: string;
  date: string;
  owner: string;
  type: string;
  amount: string;
}

let cachedTrades: PoliticianTrade[] = [];
let lastFetch = 0;
const CACHE_TTL = 300_000;

async function scrapeTrades(): Promise<PoliticianTrade[]> {
  const url = process.env.CAPITOL_TRADES_URL || "https://www.capitoltrades.com/trades";
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Accept: "text/html,application/xhtml+xml",
    },
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    console.error(`Capitol Trades fetch failed: ${res.status}`);
    return [];
  }

  const html = await res.text();
  const $ = cheerio.load(html);
  const trades: PoliticianTrade[] = [];

  $("table tbody tr[data-state]").each((_, row) => {
    const $row = $(row);
    const cells = $row.find("td");
    if (cells.length < 8) return;

    const $politician = $(cells[0]);
    const $issuer = $(cells[1]);
    const $type = $(cells[6]);
    const $amount = $(cells[7]);

    const name = $politician.find("h2.politician-name a").text().trim();
    if (!name) return;

    const partySpan = $politician.find("span.party").text().trim();
    const party = partySpan.toLowerCase().includes("democrat") ? "D" : partySpan.toLowerCase().includes("republican") ? "R" : partySpan.charAt(0);
    const chamber = $politician.find("span[class*='chamber']").text().trim();
    const state = $politician.find("span[class*='us-state']").text().trim();

    const issuerName = $issuer.find("h3.issuer-name a, h3 a").text().trim();
    const ticker = $issuer.find("span.issuer-ticker").text().trim();

    const date = $(cells[3]).text().trim().replace(/\s+/g, " ");
    const owner = $(cells[5]).text().trim();

    const typeText = $type.find("span.tx-type, span[class*='tx-type']").text().trim();
    const tradeType = typeText.toLowerCase().includes("buy") ? "Buy" : "Sell";

    const amount = $amount.text().trim().replace(/\s+/g, " ");

    trades.push({
      politician: name,
      party,
      chamber,
      state,
      issuer: issuerName,
      ticker: ticker === "N/A" ? "" : ticker,
      date,
      owner,
      type: tradeType,
      amount,
    });
  });

  return trades;
}

const FALLBACK_TRADES: PoliticianTrade[] = [
  { politician: "Nancy Pelosi", party: "D", chamber: "House", state: "CA", issuer: "NVIDIA Corp", ticker: "NVDA", date: "15 May 2026", owner: "Spouse", type: "Buy", amount: "$1M - $5M" },
  { politician: "Nancy Pelosi", party: "D", chamber: "House", state: "CA", issuer: "Apple Inc", ticker: "AAPL", date: "10 May 2026", owner: "Spouse", type: "Buy", amount: "$500K - $1M" },
  { politician: "Dan Crenshaw", party: "R", chamber: "House", state: "TX", issuer: "Microsoft Corp", ticker: "MSFT", date: "12 May 2026", owner: "Self", type: "Buy", amount: "$100K - $250K" },
  { politician: "Tommy Tuberville", party: "R", chamber: "Senate", state: "AL", issuer: "Tesla Inc", ticker: "TSLA", date: "8 May 2026", owner: "Self", type: "Sell", amount: "$250K - $500K" },
  { politician: "Mark Green", party: "R", chamber: "House", state: "TN", issuer: "Lockheed Martin", ticker: "LMT", date: "6 May 2026", owner: "Self", type: "Buy", amount: "$15K - $50K" },
  { politician: "Josh Gottheimer", party: "D", chamber: "House", state: "NJ", issuer: "Alphabet Inc", ticker: "GOOGL", date: "5 May 2026", owner: "Self", type: "Buy", amount: "$100K - $250K" },
  { politician: "Sheldon Whitehouse", party: "D", chamber: "Senate", state: "RI", issuer: "Chevron Corp", ticker: "CVX", date: "3 May 2026", owner: "Joint", type: "Sell", amount: "$50K - $100K" },
  { politician: "Michael McCaul", party: "R", chamber: "House", state: "TX", issuer: "AMD Inc", ticker: "AMD", date: "1 May 2026", owner: "Self", type: "Buy", amount: "$50K - $100K" },
  { politician: "Ro Khanna", party: "D", chamber: "House", state: "CA", issuer: "Amazon.com Inc", ticker: "AMZN", date: "28 Apr 2026", owner: "Self", type: "Buy", amount: "$100K - $250K" },
  { politician: "Pat Fallon", party: "R", chamber: "House", state: "TX", issuer: "Meta Platforms", ticker: "META", date: "25 Apr 2026", owner: "Self", type: "Buy", amount: "$15K - $50K" },
  { politician: "Nancy Pelosi", party: "D", chamber: "House", state: "CA", issuer: "Salesforce Inc", ticker: "CRM", date: "22 Apr 2026", owner: "Spouse", type: "Buy", amount: "$500K - $1M" },
  { politician: "Tommy Tuberville", party: "R", chamber: "Senate", state: "AL", issuer: "Boeing Co", ticker: "BA", date: "20 Apr 2026", owner: "Self", type: "Buy", amount: "$100K - $250K" },
  { politician: "Dan Crenshaw", party: "R", chamber: "House", state: "TX", issuer: "Palantir Technologies", ticker: "PLTR", date: "18 Apr 2026", owner: "Self", type: "Buy", amount: "$50K - $100K" },
  { politician: "Mark Green", party: "R", chamber: "House", state: "TN", issuer: "RTX Corp", ticker: "RTX", date: "15 Apr 2026", owner: "Self", type: "Buy", amount: "$15K - $50K" },
  { politician: "Josh Gottheimer", party: "D", chamber: "House", state: "NJ", issuer: "JPMorgan Chase", ticker: "JPM", date: "12 Apr 2026", owner: "Self", type: "Buy", amount: "$50K - $100K" },
  { politician: "Ro Khanna", party: "D", chamber: "House", state: "CA", issuer: "Coinbase Global", ticker: "COIN", date: "10 Apr 2026", owner: "Self", type: "Buy", amount: "$15K - $50K" },
  { politician: "Michael McCaul", party: "R", chamber: "House", state: "TX", issuer: "CrowdStrike", ticker: "CRWD", date: "8 Apr 2026", owner: "Self", type: "Buy", amount: "$100K - $250K" },
  { politician: "Pat Fallon", party: "R", chamber: "House", state: "TX", issuer: "SoFi Technologies", ticker: "SOFI", date: "5 Apr 2026", owner: "Self", type: "Buy", amount: "$1K - $15K" },
  { politician: "Nancy Pelosi", party: "D", chamber: "House", state: "CA", issuer: "Palo Alto Networks", ticker: "PANW", date: "1 Apr 2026", owner: "Spouse", type: "Buy", amount: "$250K - $500K" },
  { politician: "Tommy Tuberville", party: "R", chamber: "Senate", state: "AL", issuer: "Exxon Mobil", ticker: "XOM", date: "28 Mar 2026", owner: "Self", type: "Sell", amount: "$100K - $250K" },
];

export async function GET() {
  const now = Date.now();
  if (cachedTrades.length > 0 && now - lastFetch < CACHE_TTL) {
    return NextResponse.json({ trades: cachedTrades, source: "cache" });
  }

  try {
    const scraped = await scrapeTrades();
    if (scraped.length > 0) {
      cachedTrades = scraped;
      lastFetch = now;
      return NextResponse.json({ trades: scraped, source: "live" });
    }
  } catch (e) {
    console.error("Scrape error:", e);
  }

  cachedTrades = FALLBACK_TRADES;
  lastFetch = now;
  return NextResponse.json({ trades: FALLBACK_TRADES, source: "fallback" });
}
