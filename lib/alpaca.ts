const ALPACA_KEY = process.env.ALPACA_API_KEY || "";
const ALPACA_SECRET = process.env.ALPACA_API_SECRET || "";
const ALPACA_BASE =
  process.env.ALPACA_BASE_URL || "https://paper-api.alpaca.markets";
const ALPACA_DATA = "https://data.alpaca.markets";

const headers = () => ({
  "APCA-API-KEY-ID": ALPACA_KEY,
  "APCA-API-SECRET-KEY": ALPACA_SECRET,
  "Content-Type": "application/json",
});

export interface AlpacaAccount {
  id: string;
  status: string;
  currency: string;
  buying_power: string;
  cash: string;
  portfolio_value: string;
  equity: string;
  last_equity: string;
  daytrade_count: number;
}

export interface AlpacaPosition {
  asset_id: string;
  symbol: string;
  qty: string;
  avg_entry_price: string;
  market_value: string;
  unrealized_pl: string;
  unrealized_plpc: string;
  current_price: string;
  side: string;
}

export interface AlpacaOrder {
  id: string;
  symbol: string;
  qty: string;
  side: "buy" | "sell";
  type: string;
  time_in_force: string;
  status: string;
  filled_avg_price: string | null;
  filled_qty: string;
  created_at: string;
}

async function alpacaFetch<T>(
  path: string,
  opts?: RequestInit
): Promise<T> {
  const base = path.startsWith("/v2/") ? ALPACA_BASE : ALPACA_BASE;
  const res = await fetch(`${base}${path}`, {
    ...opts,
    headers: { ...headers(), ...(opts?.headers || {}) },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Alpaca ${res.status}: ${body}`);
  }
  return res.json();
}

export async function getAccount(): Promise<AlpacaAccount> {
  return alpacaFetch<AlpacaAccount>("/v2/account");
}

export async function getPositions(): Promise<AlpacaPosition[]> {
  return alpacaFetch<AlpacaPosition[]>("/v2/positions");
}

export async function getOrders(
  status: "open" | "closed" | "all" = "all",
  limit = 20
): Promise<AlpacaOrder[]> {
  return alpacaFetch<AlpacaOrder[]>(
    `/v2/orders?status=${status}&limit=${limit}&direction=desc`
  );
}

export async function placeOrder(params: {
  symbol: string;
  qty?: number;
  notional?: number;
  side: "buy" | "sell";
  type?: "market" | "limit" | "stop" | "stop_limit";
  time_in_force?: "day" | "gtc" | "ioc" | "fok";
  limit_price?: number;
  stop_price?: number;
}): Promise<AlpacaOrder> {
  const body: Record<string, unknown> = {
    symbol: params.symbol,
    side: params.side,
    type: params.type || "market",
    time_in_force: params.time_in_force || "day",
  };
  if (params.qty) body.qty = String(params.qty);
  if (params.notional) body.notional = String(params.notional);
  if (params.limit_price) body.limit_price = String(params.limit_price);
  if (params.stop_price) body.stop_price = String(params.stop_price);

  return alpacaFetch<AlpacaOrder>("/v2/orders", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function cancelOrder(orderId: string): Promise<void> {
  await alpacaFetch(`/v2/orders/${orderId}`, { method: "DELETE" });
}

export async function closePosition(symbol: string): Promise<AlpacaOrder> {
  return alpacaFetch<AlpacaOrder>(`/v2/positions/${symbol}`, {
    method: "DELETE",
  });
}

export async function getLatestQuote(
  symbol: string
): Promise<{ ask: number; bid: number; last: number }> {
  const res = await fetch(
    `${ALPACA_DATA}/v2/stocks/${symbol}/quotes/latest`,
    { headers: headers() }
  );
  if (!res.ok) throw new Error(`Quote fetch failed: ${res.status}`);
  const data = await res.json();
  const q = data.quote;
  return {
    ask: q.ap || 0,
    bid: q.bp || 0,
    last: q.ap ? (q.ap + q.bp) / 2 : 0,
  };
}

export async function getLatestBar(
  symbol: string
): Promise<{ open: number; high: number; low: number; close: number; volume: number }> {
  const res = await fetch(
    `${ALPACA_DATA}/v2/stocks/${symbol}/bars/latest`,
    { headers: headers() }
  );
  if (!res.ok) throw new Error(`Bar fetch failed: ${res.status}`);
  const data = await res.json();
  const b = data.bar;
  return {
    open: b.o,
    high: b.h,
    low: b.l,
    close: b.c,
    volume: b.v,
  };
}

export function isConfigured(): boolean {
  return ALPACA_KEY.length > 0 && ALPACA_SECRET.length > 0;
}
