"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AppScreen from "../../../components/AppScreen";
import AuthGuard from "../../../components/AuthGuard";
import GlassCard from "../../../components/ui/GlassCard";
import PrimaryButton from "../../../components/ui/PrimaryButton";
import { supabase } from "../../../lib/supabase";

type DiveSession = {
  id: number;
  activity_type: string;
  start_time: string;
  notes: string | null;
};

export default function ActiveSessionPage() {
  const { id } = useParams();
  const router = useRouter();

  const [session, setSession] = useState<DiveSession | null>(null);
  const [seconds, setSeconds] = useState(0);
  const [notes, setNotes] = useState("");
  const [maxDepth, setMaxDepth] = useState("");
  const [descents, setDescents] = useState("");
  const [ending, setEnding] = useState(false);

  useEffect(() => {
    loadSession();
  }, []);

  useEffect(() => {
    if (!session?.start_time) return;

    const timer = setInterval(() => {
      const start = new Date(session.start_time).getTime();
      const now = Date.now();
      setSeconds(Math.floor((now - start) / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [session]);

  async function loadSession() {
    const { data, error } = await supabase
      .from("dive_sessions")
      .select("id, activity_type, start_time, notes")
      .eq("id", id)
      .single();

    if (error) {
      alert(error.message);
      router.push("/track");
      return;
    }

    setSession(data);
    setNotes(data.notes || "");
  }

  async function endSession() {
    if (!session) return;

    setEnding(true);

    const { error } = await supabase
      .from("dive_sessions")
      .update({
        end_time: new Date().toISOString(),
        duration_seconds: seconds,
        notes,
        max_depth: Number(maxDepth || 0),
        descents: Number(descents || 0),
      })
      .eq("id", session.id);

    setEnding(false);

    if (error) {
      alert(error.message);
      return;
    }

    router.push("/profile");
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return (
    <AuthGuard>
      <AppScreen>
        <header>
          <p className="text-xs font-black uppercase tracking-[0.25em] text-[#00D4C8]">
            Active Session
          </p>

          <h1 className="mt-3 text-4xl font-black">
            {session?.activity_type || "Loading..."}
          </h1>
        </header>

        <section className="mt-8 rounded-[2.5rem] border border-cyan-300/10 bg-[#03111F]/80 p-7 text-center shadow-2xl shadow-cyan-950/30">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-100/50">
            Time In Water
          </p>

          <p className="mt-5 text-7xl font-black tracking-tight text-[#9FFFE0]">
            {String(minutes).padStart(2, "0")}:
            {String(remainingSeconds).padStart(2, "0")}
          </p>

          <div className="mx-auto mt-6 h-1 w-24 rounded-full bg-[#00D4C8]" />
        </section>

        <section className="mt-5 grid grid-cols-2 gap-3">
          <GlassCard>
            <p className="text-xs text-[#A9C7D8]">Max Depth</p>
            <input
              className="mt-2 w-full bg-transparent text-3xl font-black text-white outline-none"
              placeholder="0"
              type="number"
              value={maxDepth}
              onChange={(e) => setMaxDepth(e.target.value)}
            />
            <p className="text-xs text-[#A9C7D8]">metres</p>
          </GlassCard>

          <GlassCard>
            <p className="text-xs text-[#A9C7D8]">Descents</p>
            <input
              className="mt-2 w-full bg-transparent text-3xl font-black text-white outline-none"
              placeholder="0"
              type="number"
              value={descents}
              onChange={(e) => setDescents(e.target.value)}
            />
            <p className="text-xs text-[#A9C7D8]">total</p>
          </GlassCard>
        </section>

        <GlassCard className="mt-5">
          <label className="text-sm font-black text-cyan-200">
            Session Notes
          </label>

          <textarea
            className="mt-3 min-h-32 w-full resize-none rounded-3xl border border-white/10 bg-[#020B14] p-4 text-sm text-white outline-none placeholder:text-slate-500"
            placeholder="Visibility, species seen, conditions, safety notes..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </GlassCard>

        <div className="mt-6">
          <PrimaryButton onClick={endSession} danger>
            {ending ? "Saving Session..." : "End Session"}
          </PrimaryButton>
        </div>
      </AppScreen>
    </AuthGuard>
  );
}