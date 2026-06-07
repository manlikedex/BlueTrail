"use client";

import { useState } from "react";
import Link from "next/link";
import { Lock, Mail, Waves } from "lucide-react";
import { supabase } from "../../lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email || !password) {
      alert("Please enter your email and password.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    window.location.href = "/app";
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#05070A] px-5 text-white">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top,#0A84FF22,transparent_35%),linear-gradient(180deg,#070A0F_0%,#05070A_50%,#020305_100%)]" />

      <section className="relative z-10 w-full max-w-md rounded-3xl border border-[#1A2330] bg-[#0B0F14] p-6 shadow-[0_0_50px_rgba(0,0,0,0.45)]">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#1A2330] bg-[#10161E]">
          <Waves className="text-[#0094FF]" size={32} />
        </div>

        <p className="mt-8 text-xs font-black uppercase tracking-[0.3em] text-[#0094FF]">
          BlueTrail Access
        </p>

        <h1 className="mt-3 text-4xl font-black tracking-tight">
          Welcome back.
        </h1>

        <p className="mt-3 text-sm leading-6 text-[#9CA8B8]">
          Sign in to continue exploring beaches, dive sites, forecasts and
          marine life.
        </p>

        <div className="mt-8 flex items-center gap-3 rounded-xl border border-[#1A2330] bg-[#05070A] px-4 py-3">
          <Mail size={18} className="text-[#0094FF]" />
          <input
            className="w-full bg-transparent text-white outline-none placeholder:text-[#6F7A89]"
            placeholder="Email address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mt-3 flex items-center gap-3 rounded-xl border border-[#1A2330] bg-[#05070A] px-4 py-3">
          <Lock size={18} className="text-[#0094FF]" />
          <input
            className="w-full bg-transparent text-white outline-none placeholder:text-[#6F7A89]"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleLogin();
            }}
          />
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          className="mt-6 w-full rounded-xl border border-[#0094FF]/40 bg-[#0094FF] py-4 text-sm font-black uppercase tracking-[0.16em] text-white shadow-[0_0_30px_rgba(0,148,255,0.25)] disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <Link
          href="/signup"
          className="mt-5 block text-center text-xs font-black uppercase tracking-[0.16em] text-[#7D8896]"
        >
          New to BlueTrail? Create account
        </Link>
      </section>
    </main>
  );
}