import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TrendArb — Social Trend Intelligence Platform",
  description: "Surface early-stage consumer trends from TikTok, Reddit, X, and News. Map them to publicly traded stocks before Wall Street catches on.",
  keywords: "social arbitrage, trend investing, stock signals, reddit investing, social media trends, stock market",
  openGraph: {
    title: "TrendArb — Social Trend Intelligence",
    description: "Detect market-moving trends from social media before Wall Street does.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
