// lib/strategyBundles.ts
// Definitions of curated strategy bundles for the Copy‑Trading Dashboard.
// Each bundle maps a set of sectors/tickers and provides a description.

export interface StrategyBundle {
  id: string;
  name: string;
  description: string;
  sectorFocus: string[]; // e.g. ["Technology", "Consumer"]
  tickers: string[]; // list of stock symbols included in the bundle
  riskScore: number; // 1 (low) – 5 (high)
  initialAllocation: number; // % of virtual capital allocated initially
}

export const STRATEGY_BUNDLES: StrategyBundle[] = [
  {
    id: "tech-buzz",
    name: "Tech Buzz",
    description: "Focuses on emerging tech trends such as AI chips, cloud infrastructure, and quantum computing.",
    sectorFocus: ["Technology"],
    tickers: ["NVDA", "AMD", "GOOGL", "MSFT", "ASML"],
    riskScore: 3,
    initialAllocation: 20,
  },
  {
    id: "meme-stocks",
    name: "Meme Stocks",
    description: "Captures high‑volatility, social‑media‑driven equities that frequently appear in Reddit and TikTok.",
    sectorFocus: ["Consumer", "Finance"],
    tickers: ["GME", "AMC", "BB", "NOK", "DOGE"],
    riskScore: 5,
    initialAllocation: 15,
  },
  {
    id: "consumer-growth",
    name: "Consumer Growth",
    description: "Tracks consumer‑facing products with strong viral marketing, health & wellness, and lifestyle trends.",
    sectorFocus: ["Consumer", "Health"],
    tickers: ["LLY", "NVO", "PG", "PEP", "COST"],
    riskScore: 2,
    initialAllocation: 25,
  },
  {
    id: "green-energy",
    name: "Green Energy",
    description: "Targets renewable‑energy and sustainability trends, from EVs to solar infrastructure.",
    sectorFocus: ["Energy", "Technology"],
    tickers: ["TSLA", "F", "GM", "ENPH", "SEDG"],
    riskScore: 3,
    initialAllocation: 20,
  },
];
