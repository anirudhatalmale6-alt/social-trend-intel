"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const path = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 100,
      background: "rgba(6, 10, 20, 0.85)",
      backdropFilter: "blur(24px)",
      WebkitBackdropFilter: "blur(24px)",
      borderBottom: "1px solid var(--border)",
    }}>
      <div style={{
        maxWidth: 1200, margin: "0 auto",
        padding: "0 1.5rem",
        height: 64,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <div style={{
            width: 32, height: 32,
            background: "linear-gradient(135deg, var(--accent-violet), var(--accent-emerald))",
            borderRadius: 8,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1rem", fontWeight: 900,
          }}>T</div>
          <span style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
            Trend<span style={{ color: "var(--accent-violet)" }}>Arb</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div style={{ display: "flex", alignItems: "center", gap: "2rem" }} className="desktop-nav">
          {[
            { href: "/", label: "Home" },
            { href: "/dashboard", label: "Dashboard" },
            { href: "/copy-trading", label: "Copy Trading" },
            { href: "/politicians", label: "Politicians" },
          ].map(({ href, label }) => (
            <Link key={href} href={href} style={{
              textDecoration: "none",
              fontSize: "0.9rem",
              fontWeight: 500,
              color: path === href ? "var(--accent-violet)" : "var(--text-secondary)",
              transition: "color 0.2s",
              borderBottom: path === href ? "2px solid var(--accent-violet)" : "2px solid transparent",
              paddingBottom: "2px",
            }}>
              {label}
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <div className="live-dot" style={{ width: 6, height: 6 }} />
            <span style={{ fontSize: "0.75rem", color: "var(--signal-high)", fontWeight: 600 }}>LIVE</span>
          </div>
          <Link href="/dashboard" className="btn btn-primary" style={{ padding: "0.5rem 1.1rem", fontSize: "0.85rem" }}>
            Open Dashboard →
          </Link>
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) { .desktop-nav { display: none !important; } }
      `}</style>
    </nav>
  );
}
