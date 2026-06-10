"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Lock, UserPlus, CheckCircle } from "lucide-react";
import { supabase } from "../../lib/supabase";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [creating, setCreating] = useState(false);
  const [created, setCreated] = useState(false);

  async function signup() {
    if (!email.trim() || !password.trim()) {
      alert("Please enter your email and password.");
      return;
    }

    setCreating(true);

    const cleanUsername = username
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "_")
      .replace(/[^a-z0-9_]/g, "");

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        emailRedirectTo: "https://blue-trail.vercel.app/login",
        data: {
          full_name: fullName.trim() || null,
          username: cleanUsername || null,
        },
      },
    });

    setCreating(false);

    if (error) {
      alert(error.message);
      return;
    }

    const userId = data.user?.id;

    if (userId) {
      await supabase.from("profiles").upsert({
        id: userId,
        full_name: fullName.trim() || null,
        display_name: fullName.trim() || null,
        username: cleanUsername || null,
        updated_at: new Date().toISOString(),
      });
    }

    setCreated(true);
  }

  if (created) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#05070A] px-5 text-white">
        <div className="w-full max-w-md rounded-3xl border border-[#1A2330] bg-[#0B0F14] p-6 text-center shadow-[0_0_60px_rgba(0,0,0,0.45)]">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-[#0094FF]/40 bg-[#0094FF]/10">
            <CheckCircle className="text-[#0094FF]" size={40} />
          </div>

          <p className="mt-6 text-xs font-black uppercase tracking-[0.3em] text-[#0094FF]">
            Check Your Email
          </p>

          <h1 className="mt-3 text-4xl font-black tracking-tight">
            Confirm your account.
          </h1>

          <p className="mt-4 text-sm leading-7 text-[#9CA8B8]">
            Your BlueTrail account has been created. Please confirm your email
            address before logging in.
          </p>

          <p className="mt-4 rounded-2xl border border-[#1A2330] bg-[#05070A] p-4 text-sm text-[#C5D1DD]">
            We sent a confirmation link to:
            <br />
            <span className="font-black text-white">{email}</span>
          </p>

          <Link
            href="/login"
            className="mt-6 flex w-full items-center justify-center rounded-xl bg-[#0094FF] px-5 py-4 text-sm font-black uppercase tracking-[0.14em] text-white"
          >
            Go To Login
          </Link>

          <p className="mt-4 text-xs leading-5 text-[#6F7A89]">
            If you do not see the email, check your spam or junk folder.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#05070A] px-5 text-white">
      <div className="w-full max-w-md rounded-3xl border border-[#1A2330] bg-[#0B0F14] p-6 shadow-[0_0_60px_rgba(0,0,0,0.45)]">
        <p className="text-xs font-black uppercase tracking-[0.35em] text-[#0094FF]">
          BlueTrail
        </p>

        <h1 className="mt-3 text-4xl font-black tracking-tight">
          Create account.
        </h1>

        <p className="mt-3 text-sm leading-7 text-[#9CA8B8]">
          Join BlueTrail to log dives, discover marine life, share sightings and
          help protect our oceans.
        </p>

        <div className="mt-6 grid gap-3">
          <InputBlock
            icon={<UserPlus size={18} />}
            value={fullName}
            setValue={setFullName}
            placeholder="Full name"
            type="text"
          />

          <InputBlock
            icon={<UserPlus size={18} />}
            value={username}
            setValue={setUsername}
            placeholder="Username"
            type="text"
          />

          <InputBlock
            icon={<Mail size={18} />}
            value={email}
            setValue={setEmail}
            placeholder="Email address"
            type="email"
          />

          <InputBlock
            icon={<Lock size={18} />}
            value={password}
            setValue={setPassword}
            placeholder="Password"
            type="password"
          />
        </div>

        <button
          onClick={signup}
          disabled={creating}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0094FF] px-5 py-4 text-sm font-black uppercase tracking-[0.14em] text-white disabled:opacity-60"
        >
          <UserPlus size={18} />
          {creating ? "Creating..." : "Create Account"}
        </button>

        <p className="mt-4 text-center text-xs leading-5 text-[#7D8896]">
          You must confirm your email before you can log in.
        </p>

        <Link
          href="/login"
          className="mt-5 block text-center text-xs font-black uppercase tracking-[0.16em] text-[#0094FF]"
        >
          Already have an account? Log in
        </Link>
      </div>
    </main>
  );
}

function InputBlock({
  icon,
  value,
  setValue,
  placeholder,
  type,
}: {
  icon: React.ReactNode;
  value: string;
  setValue: (value: string) => void;
  placeholder: string;
  type: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-[#1A2330] bg-[#05070A] px-4 py-4">
      <div className="text-[#0094FF]">{icon}</div>

      <input
        value={value}
        type={type}
        placeholder={placeholder}
        onChange={(event) => setValue(event.target.value)}
        className="w-full bg-transparent text-white outline-none placeholder:text-[#6F7A89]"
      />
    </div>
  );
}