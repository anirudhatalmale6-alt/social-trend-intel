"use client";
import { useState, useEffect, useRef } from "react";
import { Trend, TrendSource } from "@/lib/trendEngine";
import TrendCard from "./TrendCard";

interface TrendFeedProps {
  trends: Trend[];
  loading: boolean;
  selectedId: string | null;
  onSelect: (trend: Trend) => void;
}

const SOURCES: { key: TrendSource | "all"; label: string; icon: string }[] = [
  { key: "all",     label: "All",    icon: "⬡" },
  { key: "reddit",  label: "Reddit", icon: "◈" },
  { key: "tiktok",  label: "TikTok", icon: "♪" },
  { key: "twitter", label: "X",      icon: "𝕏" },
  { key: "news",    label: "News",   icon: "◉" },
];

const SORTS = [
  { key: "signal", label: "Signal ↓" },
  { key: "recent", label: "Recent ↓" },
  { key: "velocity", label: "Velocity ↓" },
];

export default function TrendFeed({ trends, loading, selectedId, onSelect }: TrendFeedProps) {
  const [sourceFilter, setSourceFilter] = useState<TrendSource | "all">("all");
  const [sortKey, setSortKey] = useState("signal");
  const [search, setSearch] = useState("");
  const feedRef = useRef<HTMLDivElement>(null);

  // Filter + sort
  let filtered = trends
    .filter(t => sourceFilter === "all" || t.source === sourceFilter)
    .filter(t => !search || t.title.toLowerCase().includes(search.toLowerCase()) || t.keywords.some(k => k.includes(search.toLowerCase())));

  if (sortKey === "recent")   filtered = [...filtered].sort((a, b) => b.timestamp - a.timestamp);
  if (sortKey === "velocity") filtered = [...filtered].sort((a, b) => b.velocity - a.velocity);

  const counts: Record<string, number> = { all: trends.length };
  for (const t of trends) counts[t.source] = (counts[t.source] ?? 0) + 1;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", minHeight: 0 }}>
      {/* Search */}
      <div style={{ padding: "0.75rem 1rem 0" }}>
        <div style={{ position: "relative" }}>
          <span style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", fontSize: "0.85rem", color: "var(--text-muted)", pointerEvents: "none" }}>⌕</span>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search trends…"
            style={{
              width: "100%",
              padding: "0.55rem 0.75rem 0.55rem 2rem",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-sm)",
              color: "var(--text-primary)",
              fontSize: "0.85rem",
              outline: "none",
              transition: "border-color 0.2s",
            }}
            onFocus={e => (e.target.style.borderColor = "var(--accent-violet)")}
            onBlur={e => (e.target.style.borderColor = "var(--border)")}
          />
        </div>
      </div>

      {/* Source filter tabs */}
      <div style={{ display: "flex", gap: "0.3rem", padding: "0.6rem 1rem 0", overflowX: "auto" }}>
        {SOURCES.map(s => {
          const active = sourceFilter === s.key;
          return (
            <button key={s.key} onClick={() => setSourceFilter(s.key)}
              style={{
                display: "flex", alignItems: "center", gap: "0.3rem",
                padding: "0.3rem 0.7rem",
                borderRadius: 8,
                border: active ? "1px solid var(--accent-violet)" : "1px solid var(--border)",
                background: active ? "rgba(124,111,255,0.15)" : "transparent",
                color: active ? "var(--accent-violet)" : "var(--text-muted)",
                fontSize: "0.75rem", fontWeight: 600,
                cursor: "pointer", whiteSpace: "nowrap",
                transition: "all 0.15s",
              }}
            >
              <span>{s.icon}</span>
              <span>{s.label}</span>
              {counts[s.key] != null && (
                <span style={{
                  fontSize: "0.65rem", padding: "0.05rem 0.35rem", borderRadius: 999,
                  background: active ? "rgba(124,111,255,0.25)" : "rgba(255,255,255,0.06)",
                  color: active ? "var(--accent-violet)" : "var(--text-muted)",
                }}>{counts[s.key]}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Sort row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.5rem 1rem" }}>
        <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
          {filtered.length} trend{filtered.length !== 1 ? "s" : ""}
        </span>
        <div style={{ display: "flex", gap: "0.25rem" }}>
          {SORTS.map(s => (
            <button key={s.key} onClick={() => setSortKey(s.key)} style={{
              padding: "0.2rem 0.55rem",
              borderRadius: 6,
              border: "none",
              background: sortKey === s.key ? "rgba(124,111,255,0.15)" : "transparent",
              color: sortKey === s.key ? "var(--accent-violet)" : "var(--text-muted)",
              fontSize: "0.7rem", fontWeight: 600, cursor: "pointer",
              transition: "all 0.15s",
            }}>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Feed list */}
      <div ref={feedRef} style={{ flex: 1, overflowY: "auto", padding: "0 0.75rem 0.75rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 110, borderRadius: 12, animationDelay: `${i * 0.1}s` }} />
          ))
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem 1rem", color: "var(--text-muted)" }}>
            <div style={{ fontSize: "2rem", marginBottom: "0.75rem", opacity: 0.3 }}>◎</div>
            <p style={{ fontSize: "0.85rem" }}>No trends found{search ? ` for "${search}"` : ""}</p>
          </div>
        ) : (
          filtered.map((t, i) => (
            <div key={t.id} style={{ animationDelay: `${i * 0.05}s` }}>
              <TrendCard
                trend={t}
                isSelected={selectedId === t.id}
                onClick={() => onSelect(t)}
                compact
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
