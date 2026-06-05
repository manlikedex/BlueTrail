"use client";

import AppScreen from "../../components/AppScreen";
import AuthGuard from "../../components/AuthGuard";
import AlphaNotice from "../../components/AlphaNotice";
import GlassCard from "../../components/ui/GlassCard";
import StatCard from "../../components/ui/StatCard";
import PrimaryButton from "../../components/ui/PrimaryButton";
import { useProfile } from "../../hooks/useProfile";

export default function AppHomePage() {
  const { profile, loading } = useProfile();

  return (
    <AuthGuard>
      <AppScreen>
        <header className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-cyan-100/60">
              {loading
                ? "Loading..."
                : `Good to see you, ${profile?.display_name || "Diver"}`}
            </p>

            <h1 className="mt-1 text-4xl font-black tracking-tight text-white">
              BlueTrail
            </h1>

            <p className="mt-1 text-sm text-[#A9C7D8]">
              {profile?.home_region || "Ocean activity dashboard"}
            </p>
          </div>

          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/10 text-2xl">
            🌊
          </div>
        </header>

        <div className="mt-6">
          <AlphaNotice />
        </div>

        <GlassCard className="mt-6">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-[#00D4C8]">
            Today’s Ocean
          </p>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div>
              <p className="text-3xl font-black">2/5</p>
              <p className="text-xs text-[#A9C7D8]">Sea State</p>
            </div>

            <div>
              <p className="text-3xl font-black">16°C</p>
              <p className="text-xs text-[#A9C7D8]">Water Temp</p>
            </div>

            <div>
              <p className="text-3xl font-black">12mph</p>
              <p className="text-xs text-[#A9C7D8]">Wind</p>
            </div>

            <div>
              <p className="text-3xl font-black">14:22</p>
              <p className="text-xs text-[#A9C7D8]">Next Tide</p>
            </div>
          </div>
        </GlassCard>

        <section className="mt-5 grid grid-cols-2 gap-3">
          <StatCard value="0" label="Dives Logged" icon="🌊" />
          <StatCard value="0m" label="Depth PB" icon="⌄" />
          <StatCard value="0" label="Species Seen" icon="🐠" />
          <StatCard value="0" label="Care Reports" icon="♻" />
        </section>

        <GlassCard className="mt-6">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-[#00D4C8]">
            Next Dive
          </p>

          <h2 className="mt-3 text-3xl font-black">Ready to get in?</h2>

          <p className="mt-3 text-sm leading-6 text-[#A9C7D8]">
            Start a freedive, snorkel or spearfishing session and log your
            route, depth, descents, photos and notes.
          </p>

          <div className="mt-5">
            <PrimaryButton href="/track">Start Session</PrimaryButton>
          </div>
        </GlassCard>
      </AppScreen>
    </AuthGuard>
  );
}