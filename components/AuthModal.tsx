"use client";
import React, { useState } from "react";
import { login } from "../lib/auth";

export default function AuthModal({ open, onClose, onSuccess }: { open: boolean; onClose: () => void; onSuccess?: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(username, password)) {
      setError("");
      onClose();
      onSuccess?.();
    } else {
      setError("Invalid username or password");
    }
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
      <div className="glass-card p-6 w-96 max-w-full">
        <h2 className="text-xl font-semibold mb-4 text-[#e8eaf6]">Sign In</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 rounded bg-[#0f1629] bg-opacity-60 text-[#e8eaf6] border border-[#6c63ff] focus:outline-none"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 rounded bg-[#0f1629] bg-opacity-60 text-[#e8eaf6] border border-[#6c63ff] focus:outline-none"
            required
          />
          {error && <p style={{ color: "var(--accent-rose)", fontSize: "0.85rem" }}>{error}</p>}
          <div className="flex justify-between items-center">
            <button type="submit" className="btn btn-primary">Sign In</button>
            <button type="button" onClick={onClose} className="btn btn-ghost">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
