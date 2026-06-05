"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabase";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup() {
    if (!email || !password || !confirmPassword) {
      alert("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Account created. Please check your email if confirmation is enabled.");
    window.location.href = "/onboarding";
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#031B2E] px-5 text-white">
      <section className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white/5 p-6">
        <h1 className="text-4xl font-black">Create account</h1>
        <p className="mt-2 text-[#A9C7D8]">
          Join BlueTrail and start tracking your ocean adventures.
        </p>

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

        <input
          className="mt-3 w-full rounded-2xl border border-white/10 bg-[#082C46] p-4 outline-none"
          placeholder="Confirm password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button
          onClick={handleSignup}
          disabled={loading}
          className="mt-6 w-full rounded-3xl bg-[#00D4C8] py-4 font-black text-[#031B2E] disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Create Account"}
        </button>

        <Link href="/login" className="mt-5 block text-center text-sm text-cyan-200">
          Already have an account? Login
        </Link>
      </section>
    </main>
  );
}