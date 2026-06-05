"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AppScreen from "../../components/AppScreen";
import AuthGuard from "../../components/AuthGuard";
import GlassCard from "../../components/ui/GlassCard";
import PrimaryButton from "../../components/ui/PrimaryButton";
import { supabase } from "../../lib/supabase";

const activities = [
  {
    name: "Freedive",
    desc: "Breath-hold diving, descents and depth logs.",
    icon: "⌄",
  },
  {
    name: "Snorkel",
    desc: "Surface routes, species sightings and photos.",
    icon: "◌",
  },
  {
    name: "Spearfish",
    desc: "Catch logs, legal checks and ocean conditions.",
    icon: "◎",
  },
  {
    name: "Scuba",
    desc: "Session notes, max depth and dive history.",
    icon: "◉",
  },
];

export default function TrackPage() {
  const router = useRouter();
  const [activity, setActivity] = useState("Freedive");
  const [loading, setLoading] = useState(false);

  async function startSession() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    const { data, error } = await supabase
      .from("dive_sessions")
      .insert({
        user_id: user.id,
        activity_type: activity,
        start_time: new Date().toISOString(),
      })
      .select()
      .single();

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    router.push(`/session/${data.id}`);
  }

  return (
    <AuthGuard>
      <AppScreen>
        <header>
          <p className="text-xs font-black uppercase tracking-[0.25em] text-[#00D4C8]">
            Start Dive
          </p>
          <h1 className="mt-3 text-5xl font-black tracking-tight">
            Choose your session.
          </h1>
          <p className="mt-3 text-sm leading-6 text-[#A9C7D8]">
            Pick the activity type before starting your log.
          </p>
        </header>

        <section className="mt-8 grid gap-3">
          {activities.map((item) => {
            const active = activity === item.name;

            return (
              <button
                key={item.name}
                onClick={() => setActivity(item.name)}
                className={`rounded-[2rem] border p-5 text-left transition active:scale-[0.98] ${
                  active
                    ? "border-[#00D4C8] bg-[#00D4C8] text-[#020B14] shadow-xl shadow-cyan-400/20"
                    : "border-white/10 bg-white/[0.06] text-white backdrop-blur-xl"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl text-2xl ${
                      active ? "bg-[#020B14]/10" : "bg-white/10"
                    }`}
                  >
                    {item.icon}
                  </div>

                  <div>
                    <p className="text-xl font-black">{item.name}</p>
                    <p
                      className={`mt-1 text-sm ${
                        active ? "text-[#020B14]/70" : "text-[#A9C7D8]"
                      }`}
                    >
                      {item.desc}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </section>

        <GlassCard className="mt-6">
          <p className="text-sm text-[#A9C7D8]">Selected session</p>
          <p className="mt-1 text-3xl font-black text-[#9FFFE0]">
            {activity}
          </p>

          <div className="mt-5">
            <PrimaryButton onClick={startSession}>
              {loading ? "Starting..." : "Start Session"}
            </PrimaryButton>
          </div>
        </GlassCard>
      </AppScreen>
    </AuthGuard>
  );
}