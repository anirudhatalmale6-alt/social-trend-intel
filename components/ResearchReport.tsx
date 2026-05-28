// components/ResearchReport.tsx
"use client";
import React from "react";

interface Trend {
  id: string;
  title: string;
  score: number;
  tickers?: string[];
  stocks?: { ticker: string }[];
  sector?: string;
}

interface Props {
  trends: Trend[];
}

export default function ResearchReport({ trends }: Props) {
  const handleExport = async () => {
    // Ensure html2canvas and jsPDF are loaded via <Script> in the page
    const html2canvas = (window as any).html2canvas;
    const { jsPDF } = (window as any).jspdf;
    if (!html2canvas || !jsPDF) {
      console.error("Export libraries not loaded");
      return;
    }
    const element = document.getElementById("report-content");
    if (!element) return;
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("market-research-report.pdf");
  };

  return (
    <section className="glass-card p-4" id="report-content">
      <h2 className="text-xl font-semibold mb-3 text-[#e8eaf6]">Research Report (Exportable)</h2>
      <button
        onClick={handleExport}
        className="btn btn-primary mb-4"
      >
        Export PDF
      </button>
      {/* Simple table of trends for the report */}
      <table className="w-full text-left">
        <thead className="text-[#7986cb]">
          <tr>
            <th className="pb-2">Trend</th>
            <th className="pb-2">Score</th>
            <th className="pb-2">Sector</th>
            <th className="pb-2">Tickers</th>
          </tr>
        </thead>
        <tbody>
          {trends.map((t) => (
            <tr key={t.id} className="border-t border-[#6c63ff]">
              <td className="py-2 truncate max-w-xs">{t.title}</td>
              <td className="py-2">{t.score}</td>
              <td className="py-2">{t.sector ?? "—"}</td>
              <td className="py-2">{t.tickers?.join(", ") ?? (t.stocks ? t.stocks.map((s:any)=>s.ticker).join(", ") : "—")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
