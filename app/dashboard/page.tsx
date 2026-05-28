"use client";
import { useState, useEffect, useCallback } from "react";
import Navbar from "@/components/Navbar";
import TrendFeed from "@/components/TrendFeed";
import StockMapper from "@/components/StockMapper";
import SectorHeatMap from "@/components/SectorHeatMap";
import { Trend } from "@/lib/trendEngine";

export default function DashboardPage() {
  const [trends, setTrends] = useState<Trend[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Trend | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [meta, setMeta] = useState<{ sources: Record<string, number> } | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTrends = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    try {
      const res = await fetch("/api/trends", { cache: "no-store" });
      const data = await res.json();
      setTrends(data.trends ?? []);
      setMeta(data.meta ?? null);
      setLastUpdated(new Date().toLocaleTimeString());
      // Auto-select top trend on first load
      if (!selected && data.trends?.length > 0) {
        setSelected(data.trends[0]);
      }
    } catch (e) {
      console.error("Failed to fetch trends", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selected]);

  useEffect(() => {
    fetchTrends();
    const interval = setInterval(() => fetchTrends(true), 5 * 60 * 1000); // refresh every 5 min
    return () => clearInterval(interval);
  }, []);

  const bullishCount = trends.filter(t => t.sentiment === "bullish").length;
  const bearishCount = trends.filter(t => t.sentiment === "bearish").length;
  const avgSignal = trends.length ? Math.round(trends.reduce((s, t) => s + t.signalScore, 0) / trends.length) : 0;

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />

      {/* Top stats bar */}
      <div style={{
        background: "var(--bg-surface)",
        borderBottom: "1px solid var(--border)",
        padding: "0.6rem 1.5rem",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: "0.75rem",
      }}>
        {/* Left: stats */}
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", flexWrap: "wrap" }}>
          <StatPill label="Trends" value={trends.length} color="var(--accent-violet)" />
          <StatPill label="Bullish" value={bullishCount} color="var(--bullish)" icon="▲" />
          <StatPill label="Bearish" value={bearishCount} color="var(--bearish)" icon="▼" />
          <StatPill label="Avg Signal" value={avgSignal} color="var(--accent-amber)" suffix="/100" />
          {meta && (
            <>
              <StatPill label="Reddit" value={meta.sources.reddit ?? 0} color="#ff6314" />
              <StatPill label="TikTok" value={meta.sources.tiktok ?? 0} color="#00f2ea" />
              <StatPill label="X" value={meta.sources.twitter ?? 0} color="#1da1f2" />
            </>
          )}
        </div>

        {/* Right: refresh + timestamp */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {lastUpdated && (
            <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
              Updated {lastUpdated}
            </span>
          )}
          <button
            onClick={() => fetchTrends(true)}
            disabled={refreshing}
            style={{
              display: "flex", alignItems: "center", gap: "0.35rem",
              padding: "0.35rem 0.85rem",
              background: "rgba(124,111,255,0.1)",
              border: "1px solid rgba(124,111,255,0.2)",
              borderRadius: 8, color: "var(--accent-violet)",
              fontSize: "0.78rem", fontWeight: 600, cursor: "pointer",
              transition: "all 0.2s",
              opacity: refreshing ? 0.6 : 1,
            }}
          >
            <span style={{ display: "inline-block", animation: refreshing ? "spin 1s linear infinite" : "none" }}>↻</span>
            {refreshing ? "Refreshing…" : "Refresh"}
          </button>
        </div>
      </div>

      {/* Sector heat map bar */}
      <div style={{ background: "var(--bg-surface)", borderBottom: "1px solid var(--border)" }}>
        <SectorHeatMap trends={trends} />
      </div>

      {/* Main 3-column layout */}
      <div style={{
        flex: 1,
        display: "grid",
        gridTemplateColumns: "340px 1fr 320px",
        gridTemplateRows: "1fr",
        gap: 0,
        height: "calc(100vh - 180px)",
        overflow: "hidden",
      }}>
        {/* LEFT: Feed */}
        <div style={{
          borderRight: "1px solid var(--border)",
          display: "flex", flexDirection: "column",
          overflow: "hidden",
          background: "var(--bg-surface)",
        }}>
          <div style={{
            padding: "0.75rem 1rem 0.5rem",
            borderBottom: "1px solid var(--border)",
            display: "flex", alignItems: "center", gap: "0.5rem",
          }}>
            <div className="live-dot" />
            <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-primary)" }}>Live Signal Feed</span>
          </div>
          <TrendFeed
            trends={trends}
            loading={loading}
            selectedId={selected?.id ?? null}
            onSelect={setSelected}
          />
        </div>

        {/* CENTER: Top trends grid */}
        <div style={{ overflowY: "auto", padding: "1.25rem", background: "var(--bg-base)" }}>
          <div style={{ marginBottom: "1rem" }}>
            <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.25rem" }}>Top Trending Signals</h2>
            <p style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>Highest signal-strength trends right now. Click to analyze.</p>
          </div>

          {loading ? (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem" }}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="skeleton" style={{ height: 150, borderRadius: 12 }} />
              ))}
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "0.85rem" }}>
              {trends.slice(0, 12).map(t => (
                <div key={t.id} onClick={() => setSelected(t)} style={{ cursor: "pointer" }}>
                  <div className="glass-card" style={{
                    padding: "1rem 1.1rem",
                    borderColor: selected?.id === t.id ? "var(--accent-violet)" : undefined,
                    boxShadow: selected?.id === t.id ? "0 0 0 1px var(--accent-violet), var(--shadow-glow-violet)" : undefined,
                    transition: "all 0.2s",
                  }}>
                    {/* Source + sentiment */}
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                      <SourceTag source={t.source} label={t.sourceLabel} />
                      <span style={{
                        fontSize: "0.7rem", fontWeight: 700,
                        color: t.sentiment === "bullish" ? "var(--bullish)" : t.sentiment === "bearish" ? "var(--bearish)" : "var(--neutral)",
                      }}>
                        {t.sentiment === "bullish" ? "▲" : t.sentiment === "bearish" ? "▼" : "●"} {t.sentiment}
                      </span>
                    </div>

                    <h4 style={{
                      fontSize: "0.88rem", fontWeight: 600, lineHeight: 1.4,
                      marginBottom: "0.75rem", color: "var(--text-primary)",
                      display: "-webkit-box", WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical", overflow: "hidden",
                    }}>{t.title}</h4>

                    {/* Signal meter */}
                    <div style={{ marginBottom: "0.65rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem" }}>
                        <span style={{ fontSize: "0.68rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Signal</span>
                        <span style={{ fontSize: "0.68rem", fontFamily: "DM Mono, monospace", color: t.signalScore >= 70 ? "var(--signal-high)" : t.signalScore >= 40 ? "var(--signal-med)" : "var(--signal-low)", fontWeight: 700 }}>{t.signalScore}</span>
                      </div>
                      <div className="signal-bar-wrap">
                        <div className={`signal-bar-fill ${t.signalScore >= 70 ? "signal-high" : t.signalScore >= 40 ? "signal-med" : "signal-low"}`} style={{ width: `${t.signalScore}%` }} />
                      </div>
                    </div>

                    {/* Tickers */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem" }}>
                      {t.stocks.slice(0, 4).map(s => (
                        <span key={s.ticker} style={{
                          fontSize: "0.68rem", fontFamily: "DM Mono, monospace", fontWeight: 700,
                          padding: "0.12rem 0.4rem", borderRadius: 5,
                          background: "rgba(124,111,255,0.12)", color: "var(--accent-violet)",
                          border: "1px solid rgba(124,111,255,0.2)",
                        }}>${s.ticker}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: Stock mapper panel */}
        <div style={{
          borderLeft: "1px solid var(--border)",
          background: "var(--bg-surface)",
          overflowY: "auto",
          display: "flex", flexDirection: "column",
        }}>
          <div style={{
            padding: "0.75rem 1.25rem 0.6rem",
            borderBottom: "1px solid var(--border)",
            position: "sticky", top: 0, background: "var(--bg-surface)", zIndex: 2,
          }}>
            <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-primary)" }}>
              {selected ? "Trend Analysis" : "Stock Mapper"}
            </span>
          </div>
          <StockMapper trend={selected} />
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (max-width: 900px) {
          .dashboard-grid { grid-template-columns: 1fr !important; height: auto !important; }
        }
      `}</style>
    </div>
  );
}

function StatPill({ label, value, color, icon, suffix }: { label: string; value: number; color: string; icon?: string; suffix?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
      {icon && <span style={{ fontSize: "0.65rem", color }}>{icon}</span>}
      <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{label}:</span>
      <span style={{ fontSize: "0.8rem", fontFamily: "DM Mono, monospace", fontWeight: 700, color }}>{value}{suffix ?? ""}</span>
    </div>
  );
}

function SourceTag({ source, label }: { source: string; label: string }) {
  const colors: Record<string, string> = { reddit: "#ff6314", tiktok: "#00f2ea", twitter: "#1da1f2", news: "#fbbf24" };
  const c = colors[source] ?? "#6c63ff";
  return (
    <span style={{
      fontSize: "0.68rem", fontWeight: 700, padding: "0.12rem 0.45rem",
      borderRadius: 999, background: `${c}15`, color: c, border: `1px solid ${c}25`,
    }}>{label}</span>
  );
}
