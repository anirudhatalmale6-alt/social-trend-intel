"use client";
import SectorHeatMap from "../../components/SectorHeatMap"; // corrected import
import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";

import ResearchReport from "../../components/ResearchReport";
import Script from "next/script";

export default function MarketResearchDashboard() {
  const [trends, setTrends] = useState<any[]>([]);
  const [selectedSector, setSelectedSector] = useState<string>("All");

  // Load trends from the existing API
  useEffect(() => {
    const fetchTrends = async () => {
      const res = await fetch("/trend-intel/api/trends");
      const data = await res.json();
      setTrends(data.trends ?? []);
    };
    fetchTrends();
  }, []);

  // Simple sector filter – each trend may include a `sector` field (optional)
  const filtered = selectedSector === "All" ? trends : trends.filter((t) => t.sector === selectedSector);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#080b14] to-[#0f1629] text-[#e8eaf6]">
      <Navbar />
      {/* Load external libs for PDF export */}
      <Script src="https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js" strategy="beforeInteractive" />
      <Script src="https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js" strategy="beforeInteractive" />
      <div className="max-w-7xl mx-auto py-8 space-y-8">
        {/* Header & sector selector */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <h1 className="text-3xl font-bold">Market‑Research SaaS</h1>
          <select
            value={selectedSector}
            onChange={(e) => setSelectedSector(e.target.value)}
            className="bg-[#0f1629] bg-opacity-60 backdrop-blur-md border border-[#6c63ff] text-[#e8eaf6] rounded-md px-3 py-2"
          >
            <option value="All">All Sectors</option>
            <option value="Technology">Technology</option>
            <option value="Health">Health</option>
            <option value="Consumer">Consumer</option>
            <option value="Energy">Energy</option>
            <option value="Finance">Finance</option>
          </select>
        </div>
        {/* Heat‑map visualization */}
        <SectorHeatMap trends={filtered} />
        {/* Trend analytics table */}
        <section className="glass-card p-4">
          <h2 className="text-xl font-semibold mb-3 text-[#e8eaf6]">Top Trends (Live)</h2>
          <table className="w-full text-left">
            <thead className="text-[#7986cb]">
              <tr>
                <th className="pb-2">Trend</th>
                <th className="pb-2">Score</th>
                <th className="pb-2">Sentiment</th>
                <th className="pb-2">Mapped Stocks</th>
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, 10).map((t) => (
                <tr key={t.id} className="border-t border-[#6c63ff]">
                  <td className="py-2 truncate max-w-xs">{t.title}</td>
                  <td className="py-2">{t.signalScore}</td>
                  <td className="py-2">{t.sentiment}</td>
                  <td className="py-2">{t.stocks?.map((s: any) => s.ticker).join(", ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        {/* Exportable PDF report */}
        <ResearchReport trends={filtered} />
      </div>
    </div>
  );
}
