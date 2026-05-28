const WA_PHONE_ID = process.env.WA_PHONE_NUMBER_ID || "1143445968855160";
const WA_TOKEN = process.env.WA_ACCESS_TOKEN || "";
const ALERT_RECIPIENT = process.env.WA_ALERT_RECIPIENT || "";

interface TradeAlert {
  ticker: string;
  sentiment: "bullish" | "bearish";
  signalScore: number;
  bullishCount: number;
  bearishCount: number;
  proposedTrade: string;
  optionSymbol?: string;
  strike?: number;
  expiry?: string;
  qty?: number;
}

export async function sendTradeAlert(alert: TradeAlert): Promise<boolean> {
  if (!WA_TOKEN || !ALERT_RECIPIENT) return false;

  const emoji = alert.sentiment === "bullish" ? "+" : "-";
  const direction = alert.sentiment === "bullish" ? "BUY CALLS" : "BUY PUTS";

  const message = [
    `TRENDARB SIGNAL ALERT`,
    ``,
    `Ticker: ${alert.ticker}`,
    `Sentiment: ${alert.sentiment.toUpperCase()} (${emoji})`,
    `Signal Score: ${alert.signalScore}/100`,
    `Signals: ${alert.bullishCount} bullish / ${alert.bearishCount} bearish`,
    ``,
    `Proposed: ${direction}`,
    alert.optionSymbol ? `Contract: ${alert.optionSymbol}` : "",
    alert.strike ? `Strike: $${alert.strike}` : "",
    alert.expiry ? `Expiry: ${alert.expiry}` : "",
    alert.qty ? `Qty: ${alert.qty} contracts` : "",
    ``,
    `Reply EXECUTE ${alert.ticker} to place this trade`,
    `Reply SKIP to pass`,
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const res = await fetch(
      `https://graph.facebook.com/v21.0/${WA_PHONE_ID}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${WA_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: ALERT_RECIPIENT,
          type: "text",
          text: { body: message },
        }),
      }
    );

    return res.ok;
  } catch {
    return false;
  }
}

export async function sendScanSummary(
  signalsProcessed: number,
  trendsAboveThreshold: number,
  actionsProposed: number,
  details: string[]
): Promise<boolean> {
  if (!WA_TOKEN || !ALERT_RECIPIENT) return false;

  const message = [
    `TRENDARB SCAN COMPLETE`,
    ``,
    `Signals processed: ${signalsProcessed}`,
    `Strong trends: ${trendsAboveThreshold}`,
    `Trade opportunities: ${actionsProposed}`,
    actionsProposed === 0 ? `\nNo trades meet the threshold right now. Will scan again in 30 min.` : "",
    ...details.map((d) => `\n${d}`),
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const res = await fetch(
      `https://graph.facebook.com/v21.0/${WA_PHONE_ID}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${WA_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: ALERT_RECIPIENT,
          type: "text",
          text: { body: message },
        }),
      }
    );

    return res.ok;
  } catch {
    return false;
  }
}

export function isAlertConfigured(): boolean {
  return WA_TOKEN.length > 0 && ALERT_RECIPIENT.length > 0;
}
