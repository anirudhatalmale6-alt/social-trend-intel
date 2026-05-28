// components/SubscriptionBanner.tsx
"use client";
import React from "react";

export default function SubscriptionBanner({ onSubscribe }: { onSubscribe: () => void }) {
  return (
    <div className="glass-card p-4 mb-6 text-center">
      <h2 className="text-xl font-semibold mb-2 text-[#e8eaf6]">
        Unlock Premium Features
      </h2>
      <p className="text-[#b0b3c5] mb-4">
        Subscribe to get real‑time data, advanced analytics, and priority support.
      </p>
      <button
        onClick={onSubscribe}
        className="btn btn-primary"
        style={{ background: "var(--accent-violet)" }}
      >
        Subscribe Now
      </button>
    </div>
  );
}
