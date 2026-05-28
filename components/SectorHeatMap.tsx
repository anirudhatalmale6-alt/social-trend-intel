"use client";
import { Trend } from "@/lib/trendEngine";
import { SECTOR_COLORS } from "@/lib/stockMap";

interface SectorHeatMapProps {
  trends: Trend[];
}

const ALL_SECTORS = ["Technology", "Healthcare", "Finance", "Consumer Cyclical", "Consumer Defensive", "Energy", "Defense", "Industrials", "Materials", "Communication"];

export default function SectorHeatMap({ trends }: SectorHeatMapProps) {
  // Count signal strength per sector
  const sectorScores: Record<string, { total: number; count: number; bullish: number; bearish: number }> = {};

  for (const t of trends) {
    for (const s of t.stocks) {
      if (!sectorScores[s.sector]) sectorScores[s.sector] = { total: 0, count: 0, bullish: 0, bearish: 0 };
      sectorScores[s.sector].total += t.signalScore;
      sectorScores[s.sector].count += 1;
      if (t.sentiment === "bullish") sectorScores[s.sector].bullish++;
      if (t.sentiment === "bearish") sectorScores[s.sector].bearish++;
    }
  }

  const sectors = ALL_SECTORS.map(name => {
    const data = sectorScores[name] ?? { total: 0, count: 0, bullish: 0, bearish: 0 };
    const avg = data.count > 0 ? Math.round(data.total / data.count) : 0;
    const momentum = data.bullish - data.bearish;
    return { name, avg, count: data.count, momentum };
  }).filter(s => s.count > 0).sort((a, b) => b.avg - a.avg);

  if (sectors.length === 0) {
    return (
      <div style={{ padding: "1rem", display: "flex", gap: "0.5rem", alignItems: "center" }}>
        {ALL_SECTORS.slice(0, 6).map(name => (
          <div key={name} className="skeleton" style={{ height: 32, width: 90, borderRadius: 8 }} />
        ))}
      </div>
    );
  }

  return (
    <div style={{ padding: "0.75rem 1.25rem", display: "flex", gap: "0.5rem", alignItems: "center", overflowX: "auto" }}>
      <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 600, whiteSpace: "nowrap", textTransform: "uppercase", letterSpacing: "0.05em", marginRight: "0.25rem" }}>
        Sector Heat
      </span>
      {sectors.map(s => {
        const color = SECTOR_COLORS[s.name] ?? "#6c63ff";
        const intensity = Math.min(1, s.avg / 100);
        const momColor = s.momentum > 0 ? "var(--bullish)" : s.momentum < 0 ? "var(--bearish)" : "var(--neutral)";
        return (
          <div key={s.name} title={`${s.name}: Signal ${s.avg} | ${s.count} signals`} style={{
            display: "flex", alignItems: "center", gap: "0.4rem",
            padding: "0.3rem 0.75rem",
            borderRadius: 8,
            background: `${color}${Math.round(intensity * 25).toString(16).padStart(2, "0")}`,
            border: `1px solid ${color}${Math.round(intensity * 50).toString(16).padStart(2, "0")}`,
            cursor: "default",
            whiteSpace: "nowrap",
            transition: "all 0.2s",
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
          >
            <span style={{ fontSize: "0.68rem", color, fontWeight: 700 }}>{s.name}</span>
            <span style={{ fontSize: "0.65rem", fontFamily: "DM Mono, monospace", color: momColor, fontWeight: 600 }}>
              {s.momentum > 0 ? "▲" : s.momentum < 0 ? "▼" : "●"}{s.avg}
            </span>
          </div>
        );
      })}
    </div>
  );
}
