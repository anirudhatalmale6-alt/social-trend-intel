import { mapKeywordsToStocks, StockMapping } from "./stockMap";

export type TrendSource = "reddit" | "tiktok" | "twitter" | "news" | "polymarket" | "sec" | "congress" | "whale";

export interface RawSignal {
  id: string;
  title: string;
  body?: string;
  source: TrendSource;
  subreddit?: string;
  url?: string;
  score: number;       // upvotes / likes / engagement
  comments?: number;
  timestamp: number;   // unix ms
}

export interface Trend {
  id: string;
  title: string;
  summary: string;
  source: TrendSource;
  sourceLabel: string;
  url?: string;
  signalScore: number;      // 0–100
  velocity: number;         // momentum score
  sentiment: "bullish" | "bearish" | "neutral";
  sentimentScore: number;   // -1 to 1
  keywords: string[];
  stocks: StockMapping[];
  rawScore: number;
  comments: number;
  timestamp: number;
  isNew?: boolean;
}

const BULLISH_WORDS = ["surge", "launch", "growth", "record", "beat", "new", "bullish", "buy", "moon", "🚀", "gain", "rise", "up", "profit", "revenue", "deal", "partner", "approve", "patent", "ai", "invest", "insider buy", "bought", "purchase", "accumulate", "dovish", "rate cut", "upgrade", "outperform", "breakout", "acquisition", "buyback", "dividend"];
const BEARISH_WORDS = ["crash", "fall", "drop", "sell", "short", "bear", "loss", "fail", "ban", "lawsuit", "layoff", "cut", "miss", "decline", "recall", "fraud", "debt", "tariff", "sanction", "insider sell", "sold", "disposition", "hawkish", "rate hike", "downgrade", "underperform", "breakdown"];

function extractKeywords(text: string): string[] {
  const lower = text.toLowerCase();
  const KEYWORD_POOL = [
    "ai", "artificial intelligence", "chip", "semiconductor", "gpu", "chatgpt", "llm",
    "electric vehicle", "ev", "tesla", "battery", "solar", "lithium",
    "weight loss", "ozempic", "wegovy", "mounjaro", "glp-1", "cancer", "drug", "vaccine", "biotech",
    "tiktok", "instagram", "streaming", "netflix", "apple", "iphone", "vr", "cloud", "cybersecurity",
    "bitcoin", "crypto", "ethereum", "fintech",
    "amazon", "walmart", "target", "costco", "nike", "coffee", "fast food", "food delivery",
    "space", "drone", "defense", "travel", "airline", "airbnb", "gaming", "disney",
    "insider buy", "insider sell", "form 4", "sec filing", "ceo", "cfo", "director",
    "13f", "institutional", "hedge fund", "berkshire", "renaissance", "bridgewater",
    "whale", "large transaction", "whale transfer",
    "congress", "senator", "representative", "politician", "pelosi", "tuberville",
    "fed", "federal reserve", "dovish", "hawkish", "rate cut", "rate hike", "fomc",
    "interest rate", "inflation", "treasury", "bond",
    "ipo", "earnings", "revenue", "merger", "acquisition", "buyback", "dividend",
  ];
  return KEYWORD_POOL.filter(kw => lower.includes(kw));
}

function scoreSentiment(text: string): { sentiment: Trend["sentiment"]; score: number } {
  const lower = text.toLowerCase();
  let score = 0;
  for (const w of BULLISH_WORDS) { if (lower.includes(w)) score += 1; }
  for (const w of BEARISH_WORDS) { if (lower.includes(w)) score -= 1; }
  const normalized = Math.max(-1, Math.min(1, score / 5));
  return {
    sentiment: normalized > 0.1 ? "bullish" : normalized < -0.1 ? "bearish" : "neutral",
    score: normalized,
  };
}

function calcSignalScore(raw: RawSignal, keywords: string[], stocks: StockMapping[]): number {
  // Base: engagement
  let score = Math.min(40, Math.log10(Math.max(1, raw.score) + 1) * 15);
  // Stock mapping boost
  score += Math.min(30, stocks.length * 8);
  // Keyword richness
  score += Math.min(20, keywords.length * 5);
  // Recency boost: < 2h = +10
  const ageHours = (Date.now() - raw.timestamp) / 3600000;
  if (ageHours < 2) score += 10;
  else if (ageHours < 6) score += 5;
  return Math.round(Math.min(100, Math.max(1, score)));
}

function sourceLabel(s: TrendSource, subreddit?: string): string {
  if (s === "reddit") return subreddit ? `r/${subreddit}` : "Reddit";
  if (s === "tiktok") return "TikTok";
  if (s === "twitter") return "X (Twitter)";
  if (s === "polymarket") return "Polymarket";
  if (s === "sec") return "SEC EDGAR";
  if (s === "congress") return "Congress Trades";
  if (s === "whale") return "Whale Alert";
  return "News";
}

export function processSignals(signals: RawSignal[]): Trend[] {
  const trends: Trend[] = signals.map((sig) => {
    const text = `${sig.title} ${sig.body ?? ""}`;
    const keywords = extractKeywords(text);
    const stocks = mapKeywordsToStocks(keywords);
    const { sentiment, score: sentimentScore } = scoreSentiment(text);
    const signalScore = calcSignalScore(sig, keywords, stocks);

    return {
      id: sig.id,
      title: sig.title.slice(0, 100),
      summary: sig.body ? sig.body.slice(0, 180) + (sig.body.length > 180 ? "…" : "") : "",
      source: sig.source,
      sourceLabel: sourceLabel(sig.source, sig.subreddit),
      url: sig.url,
      signalScore,
      velocity: Math.min(100, Math.round((sig.score / 1000) * 60 + signalScore * 0.4)),
      sentiment,
      sentimentScore,
      keywords,
      stocks,
      rawScore: sig.score,
      comments: sig.comments ?? 0,
      timestamp: sig.timestamp,
    };
  });

  return trends
    .filter(t => t.stocks.length > 0 || t.keywords.length > 0)
    .sort((a, b) => b.signalScore - a.signalScore);
}
