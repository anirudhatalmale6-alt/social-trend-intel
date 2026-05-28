"use client";
import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";

interface PoliticianTrade {
  politician: string;
  party: string;
  chamber: string;
  state: string;
  issuer: string;
  ticker: string;
  date: string;
  owner: string;
  type: string;
  amount: string;
}

export default function PoliticiansPage() {
  const [trades, setTrades] = useState<PoliticianTrade[]>([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState("");
  const [filter, setFilter] = useState<"All" | "Buy" | "Sell">("All");
  const [partyFilter, setPartyFilter] = useState<"All" | "D" | "R">("All");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/politicians");
        const data = await res.json();
        setTrades(data.trades ?? []);
        setSource(data.source ?? "");
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = trades.filter((t) => {
    if (filter !== "All" && t.type !== filter) return false;
    if (partyFilter !== "All" && t.party !== partyFilter) return false;
    return true;
  });

  const buyCount = trades.filter((t) => t.type === "Buy").length;
  const sellCount = trades.filter((t) => t.type === "Sell").length;

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(to bottom, #080b14, #0f1629)", color: "#e8eaf6" }}>
      <Navbar />
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem 1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h1 style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)", fontWeight: 800, letterSpacing: "-0.02em" }}>
              Politician Trades
            </h1>
            <p style={{ color: "var(--text-secondary)", marginTop: "0.25rem" }}>
              Track what Congress is buying and selling
              {source === "live" && <span className="badge badge-emerald" style={{ marginLeft: 8 }}>LIVE</span>}
              {source === "fallback" && <span className="badge badge-amber" style={{ marginLeft: 8 }}>SAMPLE DATA</span>}
              {source === "cache" && <span className="badge badge-violet" style={{ marginLeft: 8 }}>CACHED</span>}
            </p>
          </div>
          <a
            href="https://www.capitoltrades.com/trades"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost"
            style={{ fontSize: "0.85rem" }}
          >
            View on Capitol Trades &rarr;
          </a>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
          <div className="glass-card" style={{ padding: "1.25rem", textAlign: "center" }}>
            <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--accent-violet)" }}>{trades.length}</div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>Total Trades</div>
          </div>
          <div className="glass-card" style={{ padding: "1.25rem", textAlign: "center" }}>
            <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--bullish)" }}>{buyCount}</div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>Buys</div>
          </div>
          <div className="glass-card" style={{ padding: "1.25rem", textAlign: "center" }}>
            <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--bearish)" }}>{sellCount}</div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>Sells</div>
          </div>
          <div className="glass-card" style={{ padding: "1.25rem", textAlign: "center" }}>
            <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--accent-emerald)" }}>
              {new Set(trades.map((t) => t.politician)).size}
            </div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>Politicians</div>
          </div>
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
          {(["All", "Buy", "Sell"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={filter === f ? "btn btn-primary" : "btn btn-ghost"}
              style={{ padding: "0.4rem 1rem", fontSize: "0.85rem" }}
            >
              {f}
            </button>
          ))}
          <div style={{ width: 1, background: "var(--border)", margin: "0 0.5rem" }} />
          {([["All", "All Parties"], ["D", "Democrat"], ["R", "Republican"]] as const).map(([val, label]) => (
            <button
              key={val}
              onClick={() => setPartyFilter(val as "All" | "D" | "R")}
              className={partyFilter === val ? "btn btn-primary" : "btn btn-ghost"}
              style={{ padding: "0.4rem 1rem", fontSize: "0.85rem" }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Table */}
        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 48, borderRadius: 8 }} />
            ))}
          </div>
        ) : (
          <div className="glass-card" style={{ overflow: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                  {["Politician", "Traded Issuer", "Date", "Owner", "Type", "Amount"].map((h) => (
                    <th key={h} style={{ padding: "0.75rem 1rem", color: "var(--text-secondary)", fontSize: "0.8rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((t, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid var(--border)", transition: "background 0.15s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(124, 111, 255, 0.06)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <td style={{ padding: "0.75rem 1rem" }}>
                      <div style={{ fontWeight: 600 }}>{t.politician}</div>
                      <div style={{ display: "flex", gap: "0.4rem", marginTop: "0.2rem" }}>
                        <span className={t.party === "D" ? "badge badge-violet" : "badge badge-rose"} style={{ fontSize: "0.65rem" }}>
                          {t.party === "D" ? "DEM" : "REP"}
                        </span>
                        {t.chamber && <span className="badge badge-amber" style={{ fontSize: "0.65rem" }}>{t.chamber}</span>}
                        {t.state && <span style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>{t.state}</span>}
                      </div>
                    </td>
                    <td style={{ padding: "0.75rem 1rem" }}>
                      <div style={{ fontWeight: 500 }}>{t.issuer || "—"}</div>
                      {t.ticker && (
                        <span style={{ fontFamily: "'DM Mono', monospace", color: "var(--accent-emerald)", fontWeight: 600, fontSize: "0.8rem" }}>
                          ${t.ticker}
                        </span>
                      )}
                    </td>
                    <td style={{ padding: "0.75rem 1rem", color: "var(--text-secondary)" }}>{t.date}</td>
                    <td style={{ padding: "0.75rem 1rem", color: "var(--text-secondary)" }}>{t.owner || "—"}</td>
                    <td style={{ padding: "0.75rem 1rem" }}>
                      <span style={{
                        color: t.type === "Buy" ? "var(--bullish)" : "var(--bearish)",
                        fontWeight: 700,
                        fontSize: "0.85rem",
                      }}>
                        {t.type === "Buy" ? "▲ BUY" : "▼ SELL"}
                      </span>
                    </td>
                    <td style={{ padding: "0.75rem 1rem", color: "var(--text-secondary)", fontFamily: "'DM Mono', monospace", fontSize: "0.85rem" }}>{t.amount || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>No trades match the current filters</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
