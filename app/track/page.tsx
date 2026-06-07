"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Activity, MapPin, Play, Waves } from "lucide-react";
import AppScreen from "../../components/AppScreen";
import AuthGuard from "../../components/AuthGuard";
import GlassCard from "../../components/ui/GlassCard";
import PrimaryButton from "../../components/ui/PrimaryButton";
import { supabase } from "../../lib/supabase";

export default function TrackPage() {
  const router = useRouter();

  const [locationName, setLocationName] = useState("");
  const [title, setTitle] = useState("");
  const [starting, setStarting] = useState(false);

  async function startSession() {
    if (starting) return;

    setStarting(true);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      alert("Please login first.");
      setStarting(false);
      return;
    }

    const { data, error } = await supabase
      .from("dive_sessions")
      .insert({
        user_id: user.id,
        title: title.trim() || "Untitled Dive",
        location_name: locationName.trim() || "Manual Location",
        status: "active",
        started_at: new Date().toISOString(),
      })
      .select("id")
      .single();

    setStarting(false);

    if (error || !data) {
      alert(error?.message || "Could not start dive session.");
      return;
    }

    router.push(`/session/${data.id}`);
  }

  return (
    <AuthGuard>
      <AppScreen>
        <header>
          <p className="text-xs font-black uppercase tracking-[0.3em] text-[#0094FF]">
            Dive Tracking
          </p>

          <h1 className="mt-3 text-5xl font-black tracking-tight">
            Start a dive.
          </h1>

          <p className="mt-3 text-sm leading-6 text-[#9CA8B8]">
            Log any dive manually — beach, boat, pool, wreck, reef or private
            location. It does not need to exist in the BlueTrail database.
          </p>
        </header>

        <GlassCard className="mt-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-[#1A2330] bg-[#10161E]">
            <Activity className="text-[#0094FF]" size={38} />
          </div>

          <p className="mt-6 text-xs font-black uppercase tracking-[0.25em] text-[#0094FF]">
            Manual Session Setup
          </p>

          <div className="mt-5 grid gap-3">
            <div className="flex items-center gap-3 rounded-xl border border-[#1A2330] bg-[#05070A] px-4 py-3">
              <Waves size={18} className="text-[#0094FF]" />

              <input
                className="w-full bg-transparent text-white outline-none placeholder:text-[#6F7A89]"
                placeholder="Dive title, e.g. Evening shore dive"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-[#1A2330] bg-[#05070A] px-4 py-3">
              <MapPin size={18} className="text-[#0094FF]" />

              <input
                className="w-full bg-transparent text-white outline-none placeholder:text-[#6F7A89]"
                placeholder="Manual location, e.g. Off Newquay"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") startSession();
                }}
              />
            </div>
          </div>

          <PrimaryButton
            onClick={startSession}
            disabled={starting}
            className="mt-6 w-full"
          >
            {starting ? "Starting..." : "Start Dive"}
          </PrimaryButton>
        </GlassCard>

        <GlassCard className="mt-5">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#1A2330] bg-[#10161E]">
              <Play className="text-[#0094FF]" size={22} />
            </div>

            <div>
              <p className="text-xl font-black">Works anywhere</p>

              <p className="mt-2 text-sm leading-6 text-[#9CA8B8]">
                You can track dives at places that are not yet in BlueTrail,
                including boat dives, training pools, private shore entries,
                wreck marks, reefs and manual GPS spots.
              </p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="mt-5">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-[#0094FF]">
            Trail Tag Ready
          </p>

          <p className="mt-3 text-sm leading-6 text-[#9CA8B8]">
            Manual tracking is available now. Future Trail Tag integration will
            add automatic depth, water temperature, duration and dive sync.
          </p>
        </GlassCard>
      </AppScreen>
    </AuthGuard>
  );
}