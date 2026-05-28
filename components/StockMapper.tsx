"use client";
import { Trend, TrendSource } from "@/lib/trendEngine";
import { SECTOR_COLORS, StockMapping } from "@/lib/stockMap";

interface StockMapperProps {
  trend: Trend | null;
}

function StockDetail({ stock, sentimentColor }: { stock: StockMapping; sentimentColor: string }) {
  const color = SECTOR_COLORS[stock.sector] ?? "var(--accent-violet)";
  // Simulated price change for display
  const fakeChange = ((stock.ticker.charCodeAt(0) + stock.ticker.charCodeAt(1)) % 20) - 8;
  const changeStr = fakeChange >= 0 ? `+${fakeChange.toFixed(2)}%` : `${fakeChange.toFixed(2)}%`;
  const changeColor = fakeChange >= 0 ? "var(--bullish)" : "var(--bearish)";

  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0.75rem 1rem",
      background: "rgba(255,255,255,0.03)",
      borderRadius: "var(--radius-sm)",
      border: "1px solid var(--border)",
      transition: "all 0.2s",
    }}
    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = color + "40"; (e.currentTarget as HTMLElement).style.background = color + "08"; }}
    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)"; }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <div style={{
          width: 36, height: 36,
          background: `${color}18`,
          borderRadius: 8,
          display: "flex", alignItems: "center", justifyContent: "center",
          border: `1px solid ${color}30`,
        }}>
          <span style={{ fontSize: "0.7rem", fontFamily: "DM Mono, monospace", fontWeight: 700, color }}>{stock.ticker.slice(0, 3)}</span>
        </div>
        <div>
          <div style={{ fontFamily: "DM Mono, monospace", fontWeight: 700, fontSize: "0.9rem", color: "var(--text-primary)" }}>${stock.ticker}</div>
          <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{stock.company}</div>
        </div>
      </div>
      <div style={{ textAlign: "right" }}>
        <div style={{ fontSize: "0.75rem", fontWeight: 700, color: changeColor, fontFamily: "DM Mono, monospace" }}>{changeStr}</div>
        <div style={{ fontSize: "0.68rem", color }}>
          {stock.sector} · {stock.exchange}
        </div>
      </div>
    </div>
  );
}

export default function StockMapper({ trend }: StockMapperProps) {
  if (!trend) {
    return (
      <div style={{
        height: "100%", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "3rem 1.5rem", textAlign: "center",
        color: "var(--text-muted)",
      }}>
        <div style={{ fontSize: "3rem", marginBottom: "1rem", opacity: 0.3 }}>◎</div>
        <h4 style={{ fontSize: "1rem", color: "var(--text-secondary)", marginBottom: "0.5rem" }}>No Trend Selected</h4>
        <p style={{ fontSize: "0.85rem" }}>Click any trend in the feed to see mapped stocks and analysis</p>
      </div>
    );
  }

  const sentimentColor = trend.sentiment === "bullish" ? "var(--bullish)" : trend.sentiment === "bearish" ? "var(--bearish)" : "var(--neutral)";
  const sentimentBg = trend.sentiment === "bullish" ? "rgba(0,230,118,0.08)" : trend.sentiment === "bearish" ? "rgba(244,63,94,0.08)" : "rgba(120,144,156,0.08)";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem", padding: "1.25rem" }}>
      {/* Trend header */}
      <div>
        <h3 style={{ fontSize: "0.95rem", fontWeight: 700, lineHeight: 1.4, marginBottom: "0.5rem", color: "var(--text-primary)" }}>
          {trend.title}
        </h3>
        {trend.summary && (
          <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>{trend.summary}</p>
        )}
      </div>

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
        <div style={{ padding: "0.75rem", background: "rgba(124,111,255,0.07)", borderRadius: "var(--radius-sm)", border: "1px solid rgba(124,111,255,0.15)" }}>
          <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", fontWeight: 600, marginBottom: "0.25rem", textTransform: "uppercase" }}>Signal Score</div>
          <div style={{ fontSize: "1.4rem", fontWeight: 800, fontFamily: "DM Mono, monospace", color: "var(--accent-violet)" }}>{trend.signalScore}</div>
        </div>
        <div style={{ padding: "0.75rem", background: sentimentBg, borderRadius: "var(--radius-sm)", border: `1px solid ${sentimentColor}20` }}>
          <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", fontWeight: 600, marginBottom: "0.25rem", textTransform: "uppercase" }}>Sentiment</div>
          <div style={{ fontSize: "1rem", fontWeight: 800, color: sentimentColor, textTransform: "capitalize" }}>{trend.sentiment}</div>
        </div>
        <div style={{ padding: "0.75rem", background: "rgba(0,229,179,0.07)", borderRadius: "var(--radius-sm)", border: "1px solid rgba(0,229,179,0.15)" }}>
          <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", fontWeight: 600, marginBottom: "0.25rem", textTransform: "uppercase" }}>Engagement</div>
          <div style={{ fontSize: "1rem", fontWeight: 700, fontFamily: "DM Mono, monospace", color: "var(--accent-emerald)" }}>
            {trend.rawScore >= 1000 ? `${(trend.rawScore / 1000).toFixed(1)}k` : trend.rawScore}
          </div>
        </div>
        <div style={{ padding: "0.75rem", background: "rgba(251,191,36,0.07)", borderRadius: "var(--radius-sm)", border: "1px solid rgba(251,191,36,0.15)" }}>
          <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", fontWeight: 600, marginBottom: "0.25rem", textTransform: "uppercase" }}>Velocity</div>
          <div style={{ fontSize: "1rem", fontWeight: 700, fontFamily: "DM Mono, monospace", color: "var(--accent-amber)" }}>{trend.velocity}</div>
        </div>
      </div>

      {/* Keywords */}
      {trend.keywords.length > 0 && (
        <div>
          <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 600, marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Detected Keywords</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
            {trend.keywords.map(kw => (
              <span key={kw} style={{
                fontSize: "0.72rem", padding: "0.2rem 0.55rem", borderRadius: 6,
                background: "rgba(124,111,255,0.1)", color: "var(--text-accent)",
                border: "1px solid rgba(124,111,255,0.2)",
              }}>{kw}</span>
            ))}
          </div>
        </div>
      )}

      {/* Stocks */}
      <div>
        <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 600, marginBottom: "0.6rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Mapped Stocks ({trend.stocks.length})
        </div>
        {trend.stocks.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {trend.stocks.map(s => (
              <StockDetail key={s.ticker} stock={s} sentimentColor={sentimentColor} />
            ))}
          </div>
        ) : (
          <p style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>No directly mapped stocks found for this trend.</p>
        )}
      </div>

      {/* Source link */}
      {trend.url && (
        <a href={trend.url} target="_blank" rel="noopener noreferrer" className="btn btn-ghost" style={{ fontSize: "0.82rem", justifyContent: "center" }}>
          View Original Source ↗
        </a>
      )}
    </div>
  );
}
