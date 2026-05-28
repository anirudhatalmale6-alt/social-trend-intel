import { NextRequest, NextResponse } from "next/server";
import {
  getAccount,
  getPositions,
  getOrders,
  placeOrder,
  cancelOrder,
  closePosition,
  isConfigured,
} from "@/lib/alpaca";

export async function GET(req: NextRequest) {
  if (!isConfigured()) {
    return NextResponse.json(
      { error: "Alpaca API keys not configured" },
      { status: 503 }
    );
  }

  const action = req.nextUrl.searchParams.get("action") || "account";

  try {
    switch (action) {
      case "account": {
        const account = await getAccount();
        return NextResponse.json({ account });
      }
      case "positions": {
        const positions = await getPositions();
        return NextResponse.json({ positions });
      }
      case "orders": {
        const status =
          (req.nextUrl.searchParams.get("status") as "open" | "closed" | "all") || "all";
        const orders = await getOrders(status);
        return NextResponse.json({ orders });
      }
      default:
        return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Alpaca request failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!isConfigured()) {
    return NextResponse.json(
      { error: "Alpaca API keys not configured" },
      { status: 503 }
    );
  }

  try {
    const body = await req.json();
    const { action } = body;

    switch (action) {
      case "order": {
        const { symbol, qty, notional, side, type, time_in_force, limit_price, stop_price } = body;
        if (!symbol || !side) {
          return NextResponse.json(
            { error: "symbol and side are required" },
            { status: 400 }
          );
        }
        const order = await placeOrder({
          symbol,
          qty,
          notional,
          side,
          type,
          time_in_force,
          limit_price,
          stop_price,
        });
        return NextResponse.json({ order });
      }
      case "cancel": {
        const { orderId } = body;
        if (!orderId) {
          return NextResponse.json(
            { error: "orderId is required" },
            { status: 400 }
          );
        }
        await cancelOrder(orderId);
        return NextResponse.json({ success: true });
      }
      case "close": {
        const { symbol } = body;
        if (!symbol) {
          return NextResponse.json(
            { error: "symbol is required" },
            { status: 400 }
          );
        }
        const result = await closePosition(symbol);
        return NextResponse.json({ order: result });
      }
      default:
        return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Alpaca request failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
