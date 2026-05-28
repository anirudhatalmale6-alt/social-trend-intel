"use client";
import Script from "next/script";
import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import StrategyBundleCard from "../../components/StrategyBundleCard";
import AuthModal from "../../components/AuthModal";
import { isAuthenticated, logout } from "../../lib/auth";
import PortfolioChart from "../../components/PortfolioChart";
import PolymarketList from "../../components/PolymarketList";
import { STRATEGY_BUNDLES, StrategyBundle } from "../../lib/strategyBundles";
import { initPortfolio, applyTrend, getPortfolioState } from "../../lib/portfolioSimulator";
import { Trend } from "../../lib/type";

export default function CopyTradingDashboard() {
  const [selectedBundle, setSelectedBundle] = useState<StrategyBundle | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [portfolio, setPortfolio] = useState<any>(null);
  const [trends, setTrends] = useState<Trend[]>([]);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(isAuthenticated());
  }, []);

  useEffect(() => {
    if (selectedBundle) {
      (async () => {
        const p = await initPortfolio(selectedBundle.id);
        setPortfolio(p);
      })();
    }
  }, [selectedBundle]);

  useEffect(() => {
    const fetchTrends = async () => {
      const res = await fetch("/trend-intel/api/trends");
      const data = await res.json();
      setTrends(data.trends ?? []);
    };
    fetchTrends();
    const interval = setInterval(fetchTrends, 30_000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!selectedBundle) return;
    (async () => {
      for (const t of trends) {
        await applyTrend(selectedBundle.id, { score: t.score, tickers: t.tickers });
      }
      const updated = await getPortfolioState(selectedBundle.id);
      setPortfolio(updated);
    })();
  }, [trends, selectedBundle]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#080b14] to-[#0f1629] text-[#e8eaf6]">
      <Navbar />
      {loggedIn ? (
        <button
          onClick={() => { logout(); setLoggedIn(false); }}
          className="btn btn-ghost ml-4 mt-2"
          style={{ background: "rgba(15,22,41,0.6)", color: "#e8eaf6" }}
        >
          Sign Out
        </button>
      ) : (
        <button
          onClick={() => setAuthOpen(true)}
          className="btn btn-ghost ml-4 mt-2"
          style={{ background: "rgba(15,22,41,0.6)", color: "#e8eaf6" }}
        >
          Sign In
        </button>
      )}
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} onSuccess={() => setLoggedIn(true)} />
      <Script src="https://cdn.jsdelivr.net/npm/chart.js" strategy="beforeInteractive" />
      <div className="flex max-w-7xl mx-auto pt-8 px-4 space-x-6">
        {/* Sidebar */}
        <aside className="w-64 bg-[#0f1629] bg-opacity-60 backdrop-blur-md rounded-lg p-4 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Strategy Bundles</h2>
          {STRATEGY_BUNDLES.map((bundle) => (
            <StrategyBundleCard
              key={bundle.id}
              bundle={bundle}
              isSelected={selectedBundle?.id === bundle.id}
              onSelect={() => setSelectedBundle(bundle)}
            />
          ))}
        </aside>
        {/* Main */}
        <main className="flex-1 space-y-6">
          {loggedIn ? (
            selectedBundle ? (
              <>
                <h1 className="text-3xl font-bold mb-2">{selectedBundle.name}</h1>
                <p className="mb-4 text-[#7986cb]">{selectedBundle.description}</p>
                <PortfolioChart portfolio={portfolio} />
                <PolymarketList />
              </>
            ) : (
              <p className="text-center text-[#7986cb]">Select a strategy bundle to view its simulated portfolio.</p>
            )
          ) : (
            <div className="text-center py-20">
              <h2 className="text-2xl font-bold mb-4">Premium Dashboard</h2>
              <p className="text-[#7986cb] mb-6">Sign in to access copy-trading, portfolio simulation, and Polymarket data.</p>
              <button onClick={() => setAuthOpen(true)} className="btn btn-primary">Sign In to Continue</button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
