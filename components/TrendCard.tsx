"use client";
import { Trend } from "@/lib/trendEngine";
import { SECTOR_COLORS } from "@/lib/stockMap";

const SOURCE_CONFIG: Record<string, { label: string; color: string; icon: string }> = {
  reddit:  { label: "Reddit",   color: "#ff6314", icon: "◈" },
  tiktok:  { label: "TikTok",   color: "#00f2ea", icon: "♪" },
  twitter: { label: "X",        color: "#1da1f2", icon: "𝕏" },
  news:    { label: "News",     color: "#fbbf24", icon: "◉" },
};

function SignalBar({ score }: { score: number }) {
  const cls = score >= 70 ? "signal-high" : score >= 40 ? "signal-med" : "signal-low";
  const color = score >= 70 ? "var(--signal-high)" : score >= 40 ? "var(--signal-med)" : "var(--signal-low)";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
      <div className="signal-bar-wrap" style={{ flex: 1 }}>
        <div className={`signal-bar-fill ${cls}`} style={{ width: `${score}%` }} />
      </div>
      <span style={{ fontSize: "0.75rem", fontFamily: "DM Mono, monospace", color, fontWeight: 600, minWidth: 28 }}>
        {score}
      </span>
    </div>
  );
}

function timeAgo(ts: number): string {
  const diff = (Date.now() - ts) / 60000;
  if (diff < 1) return "just now";
  if (diff < 60) return `${Math.round(diff)}m ago`;
  if (diff < 1440) return `${Math.round(diff / 60)}h ago`;
  return `${Math.round(diff / 1440)}d ago`;
}

interface TrendCardProps {
  trend: Trend;
  isSelected?: boolean;
  onClick?: () => void;
  compact?: boolean;
}

export default function TrendCard({ trend, isSelected, onClick, compact }: TrendCardProps) {
  const src = SOURCE_CONFIG[trend.source] ?? SOURCE_CONFIG.news;
  const sentimentColor = trend.sentiment === "bullish" ? "var(--bullish)" : trend.sentiment === "bearish" ? "var(--bearish)" : "var(--neutral)";
  const sentimentEmoji = trend.sentiment === "bullish" ? "▲" : trend.sentiment === "bearish" ? "▼" : "●";

  return (
    <div
      onClick={onClick}
      className="glass-card"
      style={{
        padding: compact ? "0.85rem 1rem" : "1.1rem 1.2rem",
        cursor: onClick ? "pointer" : "default",
        borderColor: isSelected ? "var(--accent-violet)" : undefined,
        boxShadow: isSelected ? "0 0 0 1px var(--accent-violet), var(--shadow-glow-violet)" : undefined,
        animation: "fadeInUp 0.4s ease both",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Selected glow strip */}
      {isSelected && (
        <div style={{
          position: "absolute", left: 0, top: 0, bottom: 0, width: 3,
          background: "linear-gradient(180deg, var(--accent-violet), var(--accent-emerald))",
          borderRadius: "3px 0 0 3px",
        }} />
      )}

      {/* Header row */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "0.5rem", marginBottom: "0.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", flexShrink: 0 }}>
          {/* Source badge */}
          <span style={{
            fontSize: "0.7rem", fontWeight: 700, padding: "0.15rem 0.5rem",
            borderRadius: 999, background: `${src.color}18`, color: src.color,
            border: `1px solid ${src.color}30`,
          }}>
            {src.icon} {trend.sourceLabel}
          </span>
          {/* New indicator */}
          {(Date.now() - trend.timestamp) < 3600000 && (
            <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
              <div className="live-dot" style={{ width: 6, height: 6 }} />
              <span style={{ fontSize: "0.65rem", color: "var(--signal-high)", fontWeight: 700 }}>NEW</span>
            </span>
          )}
        </div>
        {/* Sentiment */}
        <span style={{ fontSize: "0.72rem", color: sentimentColor, fontWeight: 700, display: "flex", alignItems: "center", gap: "0.2rem", flexShrink: 0 }}>
          {sentimentEmoji} {trend.sentiment}
        </span>
      </div>

      {/* Title */}
      <h4 style={{
        fontSize: compact ? "0.85rem" : "0.92rem",
        fontWeight: 600,
        color: "var(--text-primary)",
        lineHeight: 1.4,
        marginBottom: "0.4rem",
        display: "-webkit-box",
        WebkitLineClamp: 2,
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
      }}>
        {trend.title}
      </h4>

      {/* Signal score */}
      <div style={{ marginBottom: "0.6rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.3rem" }}>
          <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 500 }}>SIGNAL STRENGTH</span>
          <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{timeAgo(trend.timestamp)}</span>
        </div>
        <SignalBar score={trend.signalScore} />
      </div>

      {/* Stocks */}
      {trend.stocks.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
          {trend.stocks.slice(0, compact ? 3 : 5).map(s => (
            <span key={s.ticker} style={{
              fontSize: "0.7rem",
              fontFamily: "DM Mono, monospace",
              fontWeight: 600,
              padding: "0.15rem 0.5rem",
              borderRadius: 6,
              background: `${SECTOR_COLORS[s.sector] ?? "#6c63ff"}15`,
              color: SECTOR_COLORS[s.sector] ?? "var(--accent-violet)",
              border: `1px solid ${SECTOR_COLORS[s.sector] ?? "#6c63ff"}25`,
              cursor: "default",
            }} title={`${s.company} (${s.exchange})`}>
              ${s.ticker}
            </span>
          ))}
          {trend.stocks.length > (compact ? 3 : 5) && (
            <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", padding: "0.15rem 0.3rem" }}>
              +{trend.stocks.length - (compact ? 3 : 5)}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
