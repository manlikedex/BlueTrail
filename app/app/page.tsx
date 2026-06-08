"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Activity,
  Compass,
  Fish,
  Map,
  Radio,
  Shield,
  Store,
} from "lucide-react";

import AppScreen from "../../components/AppScreen";
import AuthGuard from "../../components/AuthGuard";
import GlassCard from "../../components/ui/GlassCard";

export default function HomePage() {
  return (
    <AuthGuard>
      <AppScreen>
        <section className="overflow-hidden rounded-3xl border border-[#1A2330] bg-[#0B0F14] p-6 shadow-[0_0_60px_rgba(0,0,0,0.45)]">
          <div className="flex justify-center">
            <div className="relative h-44 w-44">
              <Image
                src="/logo.png"
                alt="BlueTrail"
                fill
                priority
                className="object-contain drop-shadow-[0_0_40px_rgba(0,148,255,0.25)]"
              />
            </div>
          </div>

          <p className="mt-2 text-center text-xs font-black uppercase tracking-[0.35em] text-[#0094FF]">
            Ocean Intelligence Platform
          </p>

          <h1 className="mt-5 text-center text-4xl font-black tracking-tight">
            Explore. Dive. Protect.
          </h1>

          <p className="mx-auto mt-4 max-w-sm text-center text-sm leading-7 text-[#9CA8B8]">
            Discover beaches, dive sites, marine life, sea conditions and ocean
            conservation across the UK coastline. BlueTrail brings everything
            together into one modern diving and ocean exploration platform.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-3">
            <Link
              href="/explore"
              className="rounded-xl border border-[#0094FF]/40 bg-[#0094FF] px-5 py-4 text-center text-sm font-black uppercase tracking-[0.14em] text-white"
            >
              Explore
            </Link>

            <Link
              href="/track"
              className="rounded-xl border border-[#1A2330] bg-[#10161E] px-5 py-4 text-center text-sm font-black uppercase tracking-[0.14em] text-[#C5D1DD]"
            >
              Start Dive
            </Link>
          </div>
        </section>

        <GlassCard className="mt-5">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-[#0094FF]">
            About BlueTrail
          </p>

          <p className="mt-4 text-sm leading-7 text-[#9CA8B8]">
            BlueTrail is being built as the ultimate UK ocean exploration
            platform. Whether you're a scuba diver, freediver, snorkeller,
            marine enthusiast or conservation supporter, BlueTrail helps you
            discover and understand the ocean around you.
          </p>
        </GlassCard>

        <section className="mt-6">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-[#0094FF]">
            Core Features
          </p>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <FeatureCard
              href="/explore"
              icon={<Compass />}
              title="Explore"
              description="Discover beaches, reefs, wrecks and dive sites."
            />

            <FeatureCard
              href="/map"
              icon={<Map />}
              title="Map"
              description="Browse dive locations around the UK coastline."
            />

            <FeatureCard
              href="/species"
              icon={<Fish />}
              title="Species"
              description="Learn about UK marine life and where to find it."
            />

            <FeatureCard
              href="/track"
              icon={<Activity />}
              title="Track"
              description="Log dives, depth, visibility and dive notes."
            />

            <FeatureCard
              href="/ocean-care"
              icon={<Shield />}
              title="Protect"
              description="Ocean conservation, education and reporting."
            />

            <FeatureCard
              href="/store"
              icon={<Store />}
              title="Store"
              description="Future Trail Tag hardware ecosystem."
            />
          </div>
        </section>

        <GlassCard className="mt-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#1A2330] bg-[#10161E]">
              <Activity className="text-[#0094FF]" size={24} />
            </div>

            <div>
              <p className="text-xl font-black">Dive Tracking</p>

              <p className="mt-2 text-sm leading-6 text-[#9CA8B8]">
                Record your dives, log conditions, note marine life sightings
                and build a personal dive logbook directly inside BlueTrail.
              </p>

              <Link
                href="/track"
                className="mt-4 inline-block text-xs font-black uppercase tracking-[0.16em] text-[#0094FF]"
              >
                Start Tracking →
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
              <p className="text-xl font-black">Trail Tag</p>

              <p className="mt-2 text-sm leading-6 text-[#9CA8B8]">
                The future BlueTrail hardware companion. Designed to sync dive
                sessions, underwater activity, depth data and achievements
                directly into your BlueTrail account.
              </p>

              <Link
                href="/store"
                className="mt-4 inline-block text-xs font-black uppercase tracking-[0.16em] text-[#0094FF]"
              >
                Learn More →
              </Link>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="mt-5">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-[#0094FF]">
            Why The Ocean Matters
          </p>

          <div className="mt-4 grid gap-3">
            <Fact
              value="50%"
              text="of Earth's oxygen is produced by ocean phytoplankton."
            />

            <Fact value="71%" text="of our planet is covered by ocean." />

            <Fact value="97%" text="of Earth's water exists in the ocean." />

            <Fact
              value="3 Billion"
              text="people rely on marine and coastal biodiversity."
            />
          </div>
        </GlassCard>
      </AppScreen>
    </AuthGuard>
  );
}

function FeatureCard({
  href,
  icon,
  title,
  description,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Link href={href}>
      <GlassCard className="min-h-[165px]">
        <div className="text-[#0094FF]">{icon}</div>

        <p className="mt-4 text-lg font-black">{title}</p>

        <p className="mt-2 text-xs leading-5 text-[#9CA8B8]">
          {description}
        </p>
      </GlassCard>
    </Link>
  );
}

function Fact({ value, text }: { value: string; text: string }) {
  return (
    <div className="rounded-xl border border-[#1A2330] bg-[#05070A] p-4">
      <p className="text-2xl font-black text-[#0094FF]">{value}</p>
      <p className="mt-1 text-sm text-[#9CA8B8]">{text}</p>
    </div>
  );
}