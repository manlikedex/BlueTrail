"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { supabase } from "../lib/supabase";

export default function SaveBeachButton({ beachId }: { beachId: number }) {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkSaved();
  }, [beachId]);

  async function checkSaved() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from("favourite_beaches")
      .select("*")
      .eq("user_id", user.id)
      .eq("beach_id", beachId)
      .maybeSingle();

    setSaved(!!data);
  }

  async function toggleSaved() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Please login first.");
      setLoading(false);
      return;
    }

    if (saved) {
      await supabase
        .from("favourite_beaches")
        .delete()
        .eq("user_id", user.id)
        .eq("beach_id", beachId);

      setSaved(false);
    } else {
      await supabase.from("favourite_beaches").insert({
        user_id: user.id,
        beach_id: beachId,
      });

      setSaved(true);
    }

    setLoading(false);
  }

  return (
    <button
      onClick={toggleSaved}
      disabled={loading}
      className={`mt-5 flex w-full items-center justify-center gap-2 rounded-3xl px-5 py-4 font-black transition active:scale-[0.98] ${
        saved
          ? "bg-[#00D4C8] text-[#020B14]"
          : "border border-white/10 bg-white/[0.06] text-cyan-100"
      }`}
    >
      <Star size={18} fill={saved ? "#020B14" : "none"} />
      {loading ? "Saving..." : saved ? "Saved Beach" : "Save Beach"}
    </button>
  );
}