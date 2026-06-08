"use client";

import Link from "next/link";
import {
  Activity,
  Compass,
  Fish,
  Map,
  Radio,
  Shield,
  Store,
  Waves,
} from "lucide-react";
import AppScreen from "../../components/AppScreen";
import AuthGuard from "../../components/AuthGuard";
import GlassCard from "../../components/ui/GlassCard";
import { useProfile } from "../../hooks/useProfile";

export default function AppHomePage() {
  const { profile, loading } = useProfile();

  const displayName = profile?.full_name || profile?.username || "Explorer";

  return (
    <AuthGuard>
      <AppScreen>
        <section className="overflow-hidden rounded-3xl border border-[#1A2330] bg-[#0B0F14] p-6 shadow-[0_0_60px_rgba(0,0,0,0.45)]">
          <div className="flex justify-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-3xl border border-[#0094FF]/30 bg-[#05070A] shadow-[0_0_40px_rgba(0,148,255,0.2)]">
              <Waves className="text-[#0094FF]" size={46} />
            </div>
          </div>

          <p className="mt-6 text-center text-xs font-black uppercase tracking-[0.35em] text-[#0094FF]">
            BlueTrail
          </p>

          <h1 className="mt-4 text-center text-4xl font-black tracking-tight">
            Ocean intelligence for UK explorers.
          </h1>

          <p className="mt-4 text-center text-sm leading-7 text-[#9CA8B8]">
            Discover beaches, dive sites, marine life, sea conditions, ocean
            protection tools and future Trail Tag dive tracking — all in one app.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <Link
              href="/explore"
              className="rounded-xl border border-[#0094FF]/40 bg-[#0094FF] px-5 py-4 text-center text-sm font-black uppercase tracking-[0.14em] text-white"
            >
              Explore
            </Link>

            <Link
              href="/track"
              className="rounded-xl border border-[#1A2330] bg-[#10161E] px-5 py-4 text-center text-sm font-black uppercase tracking-[0.14em] text-[#9CA8B8]"
            >
              Track Dive
            </Link>
          </div>
        </section>

        <section className="mt-6">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-[#0094FF]">
            Welcome {loading ? "..." : displayName}
          </p>

          <h2 className="mt-3 text-3xl font-black tracking-tight">
            What can you do with BlueTrail?
          </h2>
        </section>

        <section className="mt-4 grid grid-cols-2 gap-3">
          <HomeCard
            href="/explore"
            icon={<Compass />}
            title="Explore"
            text="Find beaches, wrecks, reefs, shore dives and boat dive spots."
          />

          <HomeCard
            href="/map"
            icon={<Map />}
            title="Map"
            text="Browse coastal locations visually across the UK."
          />

          <HomeCard
            href="/species"
            icon={<Fish />}
            title="Species"
            text="Learn what marine life can be found around UK waters."
          />

          <HomeCard
            href="/conditions"
            icon={<Waves />}
            title="Conditions"
            text="Check wind, waves, swell, visibility and sea temperature."
          />

          <HomeCard
            href="/ocean-care"
            icon={<Shield />}
            title="Protect"
            text="Learn about ocean damage, pollution and how to report issues."
          />

          <HomeCard
            href="/store"
            icon={<Store />}
            title="Trail Tag"
            text="Future hardware for dive tracking and BlueTrail sync."
          />
        </section>

        <GlassCard className="mt-5">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#1A2330] bg-[#10161E]">
              <Activity className="text-[#0094FF]" size={24} />
            </div>

            <div>
              <p className="text-xl font-black">Dive tracking is live</p>
              <p className="mt-2 text-sm leading-6 text-[#9CA8B8]">
                Log manual dive sessions now with duration, location, depth,
                water temperature, visibility and notes.
              </p>

              <Link
                href="/track"
                className="mt-4 inline-block text-xs font-black uppercase tracking-[0.16em] text-[#0094FF]"
              >
                Start tracking →
              </Link>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="mt-5">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#1A2330] bg-[#10161E]">
              <Radio className="text-[#0094FF]" size={24} />
            </div>

            <div>
              <p className="text-xl font-black">Trail Tag ecosystem</p>
              <p className="mt-2 text-sm leading-6 text-[#9CA8B8]">
                BlueTrail is being built around future Trail Tag hardware,
                allowing dives, depth, temperature and session data to sync into
                your profile.
              </p>

              <Link
                href="/store"
                className="mt-4 inline-block text-xs font-black uppercase tracking-[0.16em] text-[#0094FF]"
              >
                View Trail Tag →
              </Link>
            </div>
          </div>
        </GlassCard>
      </AppScreen>
    </AuthGuard>
  );
}

function HomeCard({
  href,
  icon,
  title,
  text,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <Link href={href}>
      <GlassCard className="min-h-[170px]">
        <div className="text-[#0094FF]">{icon}</div>
        <p className="mt-4 text-lg font-black">{title}</p>
        <p className="mt-2 text-xs leading-5 text-[#9CA8B8]">{text}</p>
      </GlassCard>
    </Link>
  );
}