// lib/portfolioSimulator.ts
// Simple in‑memory portfolio simulator (client‑safe, no fs).

import { Trend } from "./type";
import { STRATEGY_BUNDLES } from "./strategyBundles";

export interface PortfolioState {
  bundleId: string;
  capital: number; // virtual USD
  history: { timestamp: number; capital: number }[];
}

// In‑memory cache (persisted only for the lifetime of the server process)
let portfolios: Record<string, PortfolioState> = {};

/** Initialize a portfolio for a strategy bundle */
export async function initPortfolio(
  bundleId: string,
  initialCapital = 10000
): Promise<PortfolioState> {
  const bundle = STRATEGY_BUNDLES.find(b => b.id === bundleId);
  if (!bundle) throw new Error(`Unknown bundle ${bundleId}`);

  const state: PortfolioState = {
    bundleId,
    capital: initialCapital,
    history: [{ timestamp: Date.now(), capital: initialCapital }],
  };
  portfolios[bundleId] = state;
  return state;
}

/** Apply a trend impact to the portfolio */
export async function applyTrend(
  bundleId: string,
  trend: { score: number; tickers: string[] }
) {
  const state = portfolios[bundleId];
  if (!state) throw new Error(`Portfolio for bundle ${bundleId} not initialized`);

  const bundle = STRATEGY_BUNDLES.find(b => b.id === bundleId)!;
  const matching = trend.tickers.filter(t => bundle.tickers.includes(t)).length;
  if (matching === 0) return state; // no impact

  const impactFactor = (trend.score / 100) * (matching / bundle.tickers.length) * 0.05; // up to 5% per trend
  const delta = state.capital * impactFactor;
  state.capital += delta;
  state.history.push({ timestamp: Date.now(), capital: state.capital });
  return state;
}

/** Retrieve portfolio state */
export async function getPortfolioState(
  bundleId: string
): Promise<PortfolioState | undefined> {
  return portfolios[bundleId];
}

/** Return all portfolios (for potential admin view) */
export async function getAllPortfolios(): Promise<PortfolioState[]> {
  return Object.values(portfolios);
}
