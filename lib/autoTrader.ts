import { Trend } from "./trendEngine";
import {
  getAccount,
  getPositions,
  getOptionsChain,
  placeOrder,
  placeOptionOrder,
  AlpacaPosition,
} from "./alpaca";

export interface TradeConfig {
  signalThreshold: number;
  maxPositionPct: number;
  maxTotalPositions: number;
  preferOptions: boolean;
  optionExpiryDaysMin: number;
  optionExpiryDaysMax: number;
  stopLossPct: number;
  tickers: string[];
}

const DEFAULT_CONFIG: TradeConfig = {
  signalThreshold: 80,
  maxPositionPct: 0.03,
  maxTotalPositions: 10,
  preferOptions: true,
  optionExpiryDaysMin: 5,
  optionExpiryDaysMax: 14,
  stopLossPct: 0.5,
  tickers: ["NVDA", "MSFT", "LLY", "GOOGL"],
};

export interface TradeAction {
  type: "stock" | "option";
  symbol: string;
  optionSymbol?: string;
  side: "buy" | "sell";
  qty: number;
  notional?: number;
  reason: string;
  signalScore: number;
  sentiment: string;
  strike?: number;
  expiry?: string;
}

function dateStr(daysFromNow: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString().split("T")[0];
}

function tickerFromTrend(trend: Trend, watchlist: string[]): string | null {
  for (const stock of trend.stocks) {
    if (watchlist.includes(stock.ticker)) return stock.ticker;
  }
  return null;
}

export async function evaluateSignals(
  trends: Trend[],
  config: TradeConfig = DEFAULT_CONFIG
): Promise<TradeAction[]> {
  const actions: TradeAction[] = [];

  let account;
  let positions: AlpacaPosition[];
  try {
    account = await getAccount();
    positions = await getPositions();
  } catch {
    return [];
  }

  const equity = parseFloat(account.equity) || 0;
  if (equity <= 0) return [];

  const maxPerTrade = equity * config.maxPositionPct;
  const heldSymbols = new Set(positions.map((p) => p.symbol));

  const strongSignals = trends
    .filter((t) => t.signalScore >= config.signalThreshold)
    .filter((t) => t.sentiment === "bullish" || t.sentiment === "bearish");

  const tickerSignals = new Map<string, { bullish: number; bearish: number; topTrend: Trend }>();

  for (const trend of strongSignals) {
    const ticker = tickerFromTrend(trend, config.tickers);
    if (!ticker) continue;

    const existing = tickerSignals.get(ticker) || { bullish: 0, bearish: 0, topTrend: trend };
    if (trend.sentiment === "bullish") existing.bullish++;
    else existing.bearish++;
    if (trend.signalScore > existing.topTrend.signalScore) existing.topTrend = trend;
    tickerSignals.set(ticker, existing);
  }

  for (const [ticker, signal] of tickerSignals) {
    const net = signal.bullish - signal.bearish;
    if (Math.abs(net) < 2) continue;

    const side: "buy" | "sell" = net > 0 ? "buy" : "sell";
    const sentiment = net > 0 ? "bullish" : "bearish";
    const trend = signal.topTrend;

    if (config.preferOptions && positions.length < config.maxTotalPositions) {
      try {
        const optionType = net > 0 ? "call" : "put";
        const contracts = await getOptionsChain({
          underlying: ticker,
          type: optionType as "call" | "put",
          expirationFrom: dateStr(config.optionExpiryDaysMin),
          expirationTo: dateStr(config.optionExpiryDaysMax),
          limit: 20,
        });

        if (contracts.length > 0) {
          const bestContract = contracts.reduce((best, c) => {
            const bestOI = parseInt(best.open_interest || "0") || 0;
            const cOI = parseInt(c.open_interest || "0") || 0;
            return cOI > bestOI ? c : best;
          });

          const strikePrice = parseFloat(bestContract.strike_price);
          const estimatedPremium = strikePrice * 0.03;
          const qty = Math.max(1, Math.floor(maxPerTrade / (estimatedPremium * 100)));

          actions.push({
            type: "option",
            symbol: ticker,
            optionSymbol: bestContract.symbol,
            side: "buy",
            qty: Math.min(qty, 5),
            reason: `${signal.bullish} bullish / ${signal.bearish} bearish signals, score ${trend.signalScore}`,
            signalScore: trend.signalScore,
            sentiment,
            strike: strikePrice,
            expiry: bestContract.expiration_date,
          });
          continue;
        }
      } catch {
        // fall through to stock order
      }
    }

    if (!heldSymbols.has(ticker) || side === "buy") {
      actions.push({
        type: "stock",
        symbol: ticker,
        side,
        qty: 0,
        notional: maxPerTrade,
        reason: `${signal.bullish} bullish / ${signal.bearish} bearish signals, score ${trend.signalScore}`,
        signalScore: trend.signalScore,
        sentiment,
      });
    }
  }

  return actions;
}

export async function executeActions(
  actions: TradeAction[]
): Promise<{ executed: string[]; errors: string[] }> {
  const executed: string[] = [];
  const errors: string[] = [];

  for (const action of actions) {
    try {
      if (action.type === "option" && action.optionSymbol) {
        const order = await placeOptionOrder({
          symbol: action.optionSymbol,
          qty: action.qty,
          side: action.side,
          type: "market",
          time_in_force: "day",
        });
        executed.push(
          `${action.side.toUpperCase()} ${action.qty}x ${action.optionSymbol} (${action.sentiment}) - order ${order.status}`
        );
      } else {
        const order = await placeOrder({
          symbol: action.symbol,
          notional: action.notional,
          side: action.side,
          type: "market",
          time_in_force: "day",
        });
        executed.push(
          `${action.side.toUpperCase()} $${action.notional} of ${action.symbol} (${action.sentiment}) - order ${order.status}`
        );
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      errors.push(`Failed ${action.symbol}: ${msg}`);
    }
  }

  return { executed, errors };
}
