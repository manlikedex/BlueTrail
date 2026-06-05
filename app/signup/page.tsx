"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabase";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function signup() {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    window.location.href = "/onboarding";
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#031B2E] px-5 text-white">
      <section className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white/5 p-6">
        <h1 className="text-4xl font-black">Create account</h1>
        <p className="mt-2 text-[#A9C7D8]">
          Start tracking, exploring and protecting the ocean.
        </p>

        <input
          className="mt-8 w-full rounded-2xl border border-white/10 bg-[#082C46] p-4 outline-none"
          placeholder="Email"
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
          onClick={signup}
          className="mt-6 w-full rounded-3xl bg-[#00D4C8] py-4 font-black text-[#031B2E]"
        >
          Create Account
        </button>

        <Link
          href="/login"
          className="mt-5 block text-center text-sm text-cyan-200"
        >
          Already have an account? Login
        </Link>
      </section>
    </main>
  );
}