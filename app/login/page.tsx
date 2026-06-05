"use client";

import { useState } from "react";
import Link from "next/link";
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
    <main className="flex min-h-screen items-center justify-center bg-[#031B2E] px-5 text-white">
      <section className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white/5 p-6">
        <h1 className="text-4xl font-black">Welcome back</h1>
        <p className="mt-2 text-[#A9C7D8]">Login to continue to BlueTrail.</p>

        <input
          className="mt-8 w-full rounded-2xl border border-white/10 bg-[#082C46] p-4 outline-none"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="mt-3 w-full rounded-2xl border border-white/10 bg-[#082C46] p-4 outline-none"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className="mt-6 w-full rounded-3xl bg-[#00D4C8] py-4 font-black text-[#031B2E] disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <Link href="/signup" className="mt-5 block text-center text-sm text-cyan-200">
          New to BlueTrail? Create account
        </Link>
      </section>
    </main>
  );
}