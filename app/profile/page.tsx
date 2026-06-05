"use client";

import AppScreen from "../../components/AppScreen";
import AuthGuard from "../../components/AuthGuard";
import LogoutButton from "../../components/LogoutButton";
import GlassCard from "../../components/ui/GlassCard";
import StatCard from "../../components/ui/StatCard";
import { useProfile } from "../../hooks/useProfile";
import Link from "next/link";

export default function ProfilePage() {
  const { profile, loading } = useProfile();

  return (
    <AuthGuard>
      <AppScreen>
        <section className="text-center">
          <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-[2.5rem] border border-white/10 bg-white/10 text-5xl shadow-2xl">
            👤
          </div>

          <h1 className="mt-5 text-4xl font-black tracking-tight">
            {loading ? "Loading..." : profile?.display_name || "Your Profile"}
          </h1>

          <p className="mt-2 text-[#A9C7D8]">
            @{profile?.username || "username"}
          </p>

          {profile?.home_region && (
            <p className="mt-2 text-sm font-bold text-cyan-200">
              📍 {profile.home_region}
            </p>
          )}
        </section>

        <section className="mt-8 grid grid-cols-3 gap-3">
          <StatCard value="0" label="Dives" icon="🌊" />
          <StatCard value="0m" label="PB" icon="⌄" />
          <StatCard value="0" label="Friends" icon="◌" />
        </section>

        <GlassCard className="mt-6">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-[#00D4C8]">
            Activities
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {profile?.activities?.length ? (
              profile.activities.map((activity) => (
                <span
                  key={activity}
                  className="rounded-full bg-cyan-400/10 px-4 py-2 text-sm font-bold text-cyan-200"
                >
                  {activity}
                </span>
              ))
            ) : (
              <p className="text-sm text-[#A9C7D8]">
                No activities selected yet.
              </p>
            )}
          </div>
        </GlassCard>

        <GlassCard className="mt-4">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-[#00D4C8]">
            Experience
          </p>

          <p className="mt-3 text-2xl font-black">
            {profile?.experience_level || "Not set"}
          </p>
        </GlassCard>

        <GlassCard className="mt-4">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-[#00D4C8]">
            Achievements
          </p>

          <div className="mt-4 grid grid-cols-2 gap-3">
            {["First Dive", "Ocean Protector", "Species Hunter", "Depth PB"].map(
              (badge) => (
                <div
                  key={badge}
                  className="rounded-3xl border border-white/10 bg-[#071D2E] p-4 text-center"
                >
                  <p className="text-2xl">🏆</p>
                  <p className="mt-2 text-xs font-bold text-[#A9C7D8]">
                    {badge}
                  </p>
                </div>
              )
            )}
          </div>
        </GlassCard>

        <div className="mt-6 grid gap-3">
          <Link
            href="/onboarding"
            className="rounded-[1.5rem] border border-white/10 bg-white/[0.06] px-5 py-4 text-center font-bold text-cyan-100 backdrop-blur-xl"
          >
            Edit Profile Setup
          </Link>

          <LogoutButton />
        </div>
      </AppScreen>
    </AuthGuard>
  );
}