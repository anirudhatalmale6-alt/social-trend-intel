// app/api/polymarket/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  const res = await fetch('https://gamma-api.polymarket.com/markets');
  if (!res.ok) {
    return NextResponse.json({ error: 'Failed to fetch markets' }, { status: 500 });
  }
  const markets = await res.json();
  return NextResponse.json({ markets });
}
