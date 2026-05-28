// components/PortfolioChart.tsx
"use client";
import React, { useEffect, useRef } from "react";

interface Props {
  portfolio: {
    capital: number;
    history: { timestamp: number; capital: number }[];
  } | null;
}

/**
 * Renders a line chart using Chart.js loaded via CDN.
 * The parent page must include the Chart.js script (already added in the page).
 */
export default function PortfolioChart({ portfolio }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<any>(null);

  useEffect(() => {
    if (!portfolio || !canvasRef.current) return;

    const labels = portfolio.history.map((h) =>
      new Date(h.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
    const data = portfolio.history.map((h) => h.capital);

    // Destroy previous instance if any
    if (chartRef.current) chartRef.current.destroy();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    chartRef.current = new (window as any).Chart(canvasRef.current, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Portfolio Value",
            data,
            borderColor: "var(--accent-emerald)",
            backgroundColor: "rgba(0, 229, 179, 0.2)",
            tension: 0.3,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          y: {
            beginAtZero: false,
            ticks: { color: "var(--text-secondary)" },
            grid: { color: "rgba(255,255,255,0.05)" },
          },
          x: {
            ticks: { color: "var(--text-secondary)" },
            grid: { display: false },
          },
        },
      },
    });
  }, [portfolio]);

  return (
    <div className="glass-card p-4">
      <h3 className="text-lg font-semibold mb-2 text-[#e8eaf6]">Simulated Portfolio</h3>
      <canvas ref={canvasRef} height={200} />
      {portfolio && (
        <p className="mt-2 text-sm text-[#7986cb]">
          Current capital: <span className="font-medium text-[#e8eaf6]">${portfolio.capital.toFixed(2)}</span>
        </p>
      )}
    </div>
  );
}
