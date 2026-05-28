// app/api/portfolio/route.ts
import { NextResponse } from "next/server";
import { initPortfolio, getPortfolioState, PortfolioState } from "@/lib/portfolioSimulator";

/**
 * GET /api/portfolio?bundleId=<id>
 * Returns the current portfolio state for the given strategy bundle.
 * If the portfolio does not exist yet, it will be initialized with the
 * default capital (10 000 USD).
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const bundleId = searchParams.get("bundleId");
  if (!bundleId) {
    return NextResponse.json({ error: "bundleId query parameter required" }, { status: 400 });
  }

  // Lazy init – ensures a portfolio exists for the bundle.
  let state: PortfolioState | undefined = await getPortfolioState(bundleId);
  if (!state) {
    state = await initPortfolio(bundleId);
  }

  return NextResponse.json({ portfolio: state });
}
