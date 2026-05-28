import Link from "next/link";
import Navbar from "@/components/Navbar";

const TICKER_ITEMS = [
  "NVDA ▲ +4.2%", "LLY ▲ +2.8%", "TSLA ▼ -1.4%", "META ▲ +3.1%", "NVO ▲ +5.6%",
  "CRWD ▲ +2.3%", "MSFT ▲ +1.9%", "AMZN ▲ +0.8%", "GOOGL ▲ +2.1%", "COIN ▼ -2.7%",
  "AMD ▲ +3.8%", "NFLX ▲ +1.2%", "RBLX ▼ -0.9%", "DASH ▲ +4.5%", "ABNB ▲ +1.7%",
];

const FEATURES = [
  {
    icon: "◈",
    iconColor: "#ff6314",
    title: "Reddit Intelligence",
    desc: "Real-time scraping of r/investing, r/wallstreetbets, r/technology and more. Surface what retail investors are actually talking about.",
  },
  {
    icon: "♪",
    iconColor: "#00f2ea",
    title: "TikTok Trend Radar",
    desc: "Detect viral consumer products, brand moments, and cultural shifts before they hit mainstream media — and before Wall Street notices.",
  },
  {
    icon: "𝕏",
    iconColor: "#1da1f2",
    title: "X Signal Monitor",
    desc: "Track breaking financial news, analyst commentary, and market-moving announcements in real time from X (formerly Twitter).",
  },
  {
    icon: "◉",
    iconColor: "#fbbf24",
    title: "News Aggregation",
    desc: "Curated business and tech news filtered for market-moving signals. No noise, only alpha-generating information.",
  },
  {
    icon: "⬡",
    iconColor: "#6c63ff",
    title: "Signal Scoring Engine",
    desc: "Proprietary algorithm scores every trend 0–100 based on velocity, engagement, sentiment, and stock-mapping depth.",
  },
  {
    icon: "▣",
    iconColor: "#00e5b3",
    title: "Stock Mapper",
    desc: "Automatically maps trending keywords to publicly traded companies. 300+ keyword–ticker relationships across every sector.",
  },
];

const PRICING = [
  {
    name: "Free",
    price: "$0",
    period: "/mo",
    desc: "For curious retail investors",
    color: "var(--text-muted)",
    features: ["10 trends/day", "Reddit + News sources", "Basic signal scoring", "3 sector views"],
    cta: "Get Started",
    href: "/dashboard",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$49",
    period: "/mo",
    desc: "For serious self-directed investors",
    color: "var(--accent-violet)",
    features: ["Unlimited trends", "All 4 sources incl. TikTok & X", "Full signal scoring + velocity", "All sectors + heatmap", "Export to CSV", "Email alerts"],
    cta: "Start Free Trial",
    href: "/dashboard",
    highlight: true,
  },
  {
    name: "Hedge",
    price: "$299",
    period: "/mo",
    desc: "For funds & brand strategists",
    color: "var(--accent-emerald)",
    features: ["Everything in Pro", "API access", "Custom keyword tracking", "Webhook alerts", "Team seats (5)", "Priority support"],
    cta: "Contact Sales",
    href: "/dashboard",
    highlight: false,
  },
];

const STATS = [
  { value: "300+", label: "Keyword → Ticker Mappings" },
  { value: "4",    label: "Signal Sources" },
  { value: "~5m",  label: "Refresh Interval" },
  { value: "100",  label: "Max Signal Score" },
];

export default function HomePage() {
  return (
    <div style={{ position: "relative", zIndex: 1 }}>
      <Navbar />

      {/* ── TICKER TAPE ─────────────────────────────── */}
      <div className="ticker-tape">
        <div className="ticker-inner">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => {
            const bull = item.includes("▲");
            return (
              <span key={i} style={{
                fontSize: "0.75rem",
                fontFamily: "DM Mono, monospace",
                fontWeight: 600,
                color: bull ? "var(--bullish)" : "var(--bearish)",
                display: "flex", alignItems: "center", gap: "0.4rem",
              }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: bull ? "var(--bullish)" : "var(--bearish)", display: "inline-block" }} />
                {item}
              </span>
            );
          })}
        </div>
      </div>

      {/* ── HERO ────────────────────────────────────── */}
      <section style={{ padding: "6rem 1.5rem 5rem", maxWidth: 1100, margin: "0 auto", textAlign: "center" }}>
        {/* Badge */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem" }}>
          <span className="badge badge-violet">
            <span className="live-dot" style={{ width: 5, height: 5 }} /> Social Arbitrage Intelligence
          </span>
        </div>

        {/* Headline */}
        <h1 style={{ marginBottom: "1.25rem" }}>
          See the trend.{" "}
          <br />
          <span className="gradient-text">Find the stock.</span>
          <br />
          <span style={{ color: "var(--text-secondary)", fontWeight: 500, fontSize: "clamp(1.6rem, 3vw, 2.8rem)" }}>Before Wall Street does.</span>
        </h1>

        <p style={{ maxWidth: 620, margin: "0 auto 2.5rem", fontSize: "1.1rem", lineHeight: 1.8 }}>
          TrendArb monitors Reddit, TikTok, X, and News in real time — scoring signals and mapping them to publicly traded companies so you can act on information asymmetry.
        </p>

        {/* CTAs */}
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/dashboard" className="btn btn-primary" style={{ padding: "0.85rem 2rem", fontSize: "1rem" }}>
            Open Dashboard →
          </Link>
          <Link href="#features" className="btn btn-ghost" style={{ padding: "0.85rem 2rem", fontSize: "1rem" }}>
            How it works
          </Link>
        </div>

        {/* Social proof */}
        <p style={{ marginTop: "2rem", fontSize: "0.8rem", color: "var(--text-muted)" }}>
          Inspired by Chris Camillo's{" "}
          <span style={{ color: "var(--accent-violet)" }}>social arbitrage</span>
          {" "}strategy — $20K → $70M using observational investing
        </p>
      </section>

      {/* ── STATS BAR ───────────────────────────────── */}
      <section style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", padding: "2rem 1.5rem", background: "var(--bg-surface)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "2rem", textAlign: "center" }}>
          {STATS.map(s => (
            <div key={s.label}>
              <div style={{ fontSize: "2.25rem", fontWeight: 900, fontFamily: "DM Mono, monospace", background: "linear-gradient(135deg, var(--accent-violet), var(--accent-emerald))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", marginBottom: "0.3rem" }}>
                {s.value}
              </div>
              <div style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ────────────────────────────────── */}
      <section id="features" style={{ padding: "6rem 1.5rem", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <span className="badge badge-emerald" style={{ marginBottom: "1rem" }}>Platform Features</span>
          <h2>Everything you need to <br /><span className="gradient-text">trade on information</span></h2>
          <p style={{ marginTop: "1rem", maxWidth: 500, margin: "1rem auto 0", fontSize: "1rem" }}>
            Four signal sources. One unified intelligence layer. Mapped directly to the stocks that matter.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.25rem" }}>
          {FEATURES.map(f => (
            <div key={f.title} className="glass-card" style={{ padding: "1.75rem" }}>
              <div style={{
                width: 48, height: 48, borderRadius: 12, marginBottom: "1rem",
                background: `${f.iconColor}15`, border: `1px solid ${f.iconColor}30`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "1.4rem", color: f.iconColor,
              }}>
                {f.icon}
              </div>
              <h3 style={{ marginBottom: "0.5rem", color: "var(--text-primary)" }}>{f.title}</h3>
              <p style={{ fontSize: "0.88rem", lineHeight: 1.7 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────── */}
      <section style={{ padding: "5rem 1.5rem", background: "var(--bg-surface)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <span className="badge badge-amber" style={{ marginBottom: "1rem" }}>The Method</span>
            <h2>Social Arbitrage in <span className="gradient-text-warm">3 steps</span></h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem" }}>
            {[
              { step: "01", title: "Detect Change", desc: "Our engine continuously scans social platforms for emerging patterns — viral products, cultural shifts, regulatory news — before they reach mainstream financial media.", color: "var(--accent-violet)" },
              { step: "02", title: "Score the Signal", desc: "Every trend is scored 0–100 based on engagement velocity, sentiment analysis, recency, and the depth of stock-market connections found.", color: "var(--accent-emerald)" },
              { step: "03", title: "Map to Markets", desc: "Detected keywords are matched against 300+ company relationships to surface which publicly traded companies stand to benefit or suffer.", color: "var(--accent-amber)" },
            ].map(s => (
              <div key={s.step} className="glass-card" style={{ padding: "2rem" }}>
                <div style={{ fontSize: "3rem", fontFamily: "DM Mono, monospace", fontWeight: 900, color: s.color, opacity: 0.3, marginBottom: "0.5rem", lineHeight: 1 }}>{s.step}</div>
                <h3 style={{ color: s.color, marginBottom: "0.6rem" }}>{s.title}</h3>
                <p style={{ fontSize: "0.88rem", lineHeight: 1.7 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ─────────────────────────────────── */}
      <section style={{ padding: "6rem 1.5rem", maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <span className="badge badge-violet" style={{ marginBottom: "1rem" }}>Pricing</span>
          <h2>Simple, transparent <span className="gradient-text">pricing</span></h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.25rem", alignItems: "start" }}>
          {PRICING.map(p => (
            <div key={p.name} className="glass-card" style={{
              padding: "2rem",
              borderColor: p.highlight ? "var(--accent-violet)" : undefined,
              boxShadow: p.highlight ? "0 0 0 1px var(--accent-violet), var(--shadow-glow-violet)" : undefined,
              position: "relative",
              overflow: "hidden",
            }}>
              {p.highlight && (
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg, var(--accent-violet), var(--accent-emerald))" }} />
              )}
              {p.highlight && (
                <span className="badge badge-violet" style={{ marginBottom: "0.75rem" }}>Most Popular</span>
              )}
              <div style={{ marginBottom: "1.25rem" }}>
                <div style={{ fontSize: "0.85rem", fontWeight: 600, color: p.color, marginBottom: "0.25rem" }}>{p.name}</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: "0.25rem" }}>
                  <span style={{ fontSize: "2.25rem", fontWeight: 900, fontFamily: "DM Mono, monospace", color: "var(--text-primary)" }}>{p.price}</span>
                  <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{p.period}</span>
                </div>
                <p style={{ fontSize: "0.82rem", marginTop: "0.25rem" }}>{p.desc}</p>
              </div>
              <ul style={{ listStyle: "none", marginBottom: "1.5rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {p.features.map(f => (
                  <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                    <span style={{ color: "var(--accent-emerald)", flexShrink: 0, marginTop: "0.05rem" }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href={p.href} className={`btn ${p.highlight ? "btn-primary" : "btn-ghost"}`} style={{ width: "100%", justifyContent: "center" }}>
                {p.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA BANNER ──────────────────────────────── */}
      <section style={{ padding: "5rem 1.5rem", textAlign: "center", borderTop: "1px solid var(--border)" }}>
        <div style={{
          maxWidth: 700, margin: "0 auto",
          padding: "3.5rem 2rem",
          borderRadius: "var(--radius-xl)",
          background: "linear-gradient(135deg, rgba(124,111,255,0.12), rgba(0,229,179,0.08))",
          border: "1px solid rgba(124,111,255,0.2)",
          boxShadow: "var(--shadow-glow-violet)",
        }}>
          <h2 style={{ marginBottom: "1rem" }}>
            Start detecting <span className="gradient-text">market signals</span> today
          </h2>
          <p style={{ marginBottom: "2rem", fontSize: "1rem", maxWidth: 480, margin: "0 auto 2rem" }}>
            The dashboard is live and free. No signup required. See real trends mapped to real stocks — right now.
          </p>
          <Link href="/dashboard" className="btn btn-emerald" style={{ padding: "0.9rem 2.5rem", fontSize: "1.05rem" }}>
            Open Dashboard — It&apos;s Free →
          </Link>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────── */}
      <footer style={{ borderTop: "1px solid var(--border)", padding: "1.5rem", textAlign: "center" }}>
        <p style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
          TrendArb — For informational purposes only. Not financial advice.
          &nbsp;·&nbsp; Inspired by <span style={{ color: "var(--accent-violet)" }}>Chris Camillo's</span> social arbitrage method.
        </p>
      </footer>
    </div>
  );
}
