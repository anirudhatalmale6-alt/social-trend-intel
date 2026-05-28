// lib/type.ts
// Minimal shared types for the front‑end.

export interface Trend {
  id: string;
  title: string;
  score: number; // engagement score used by the portfolio simulator
  tickers: string[]; // mapped stock symbols
  // additional fields may exist – we only require the ones above for the demo
}
