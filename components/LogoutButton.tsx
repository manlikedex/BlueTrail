"use client";

import { supabase } from "../lib/supabase";

export default function LogoutButton() {
  async function logout() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  return (
    <button
      onClick={logout}
      className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-cyan-100"
    >
      Logout
    </button>
  );
}