"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import {
  Anchor,
  Compass,
  Fish,
  MapPin,
  Search,
  Shield,
  Waves,
} from "lucide-react";
import AppScreen from "../../components/AppScreen";
import AuthGuard from "../../components/AuthGuard";
import GlassCard from "../../components/ui/GlassCard";

const BeachMap = dynamic(() => import("../../components/BeachMap"), {
  ssr: false,
});

export default function MapPage() {
  return (
    <AuthGuard>
      <AppScreen>
        <header>
          <p className="text-xs font-black uppercase tracking-[0.3em] text-[#0094FF]">
            Mission Map
          </p>

          <h1 className="mt-3 text-5xl font-black tracking-tight">
            Explore the coastline.
          </h1>

          <p className="mt-3 text-sm leading-6 text-[#9CA8B8]">
            Browse beaches, dive sites, wrecks and marine locations from the
            map. Tap a marker to open its live conditions page.
          </p>
        </header>

        <GlassCard className="mt-6">
          <div className="flex items-center gap-3 rounded-xl border border-[#1A2330] bg-[#05070A] px-4 py-3">
            <Search size={20} className="text-[#0094FF]" />
            <input
              className="w-full bg-transparent text-white outline-none placeholder:text-[#6F7A89]"
              placeholder="Search map locations soon..."
              disabled
            />
          </div>
        </GlassCard>

        <section className="mt-4 grid grid-cols-4 gap-2">
          <Link href="/explore">
            <div className="rounded-xl border border-[#1A2330] bg-[#0B0F14] p-3 text-center">
              <Waves className="mx-auto text-[#0094FF]" size={20} />
              <p className="mt-2 text-[10px] font-black uppercase text-[#9CA8B8]">
                Beaches
              </p>
            </div>
          </Link>

          <Link href="/explore">
            <div className="rounded-xl border border-[#1A2330] bg-[#0B0F14] p-3 text-center">
              <Anchor className="mx-auto text-[#0094FF]" size={20} />
              <p className="mt-2 text-[10px] font-black uppercase text-[#9CA8B8]">
                Dives
              </p>
            </div>
          </Link>

          <Link href="/species">
            <div className="rounded-xl border border-[#1A2330] bg-[#0B0F14] p-3 text-center">
              <Fish className="mx-auto text-[#0094FF]" size={20} />
              <p className="mt-2 text-[10px] font-black uppercase text-[#9CA8B8]">
                Species
              </p>
            </div>
          </Link>

          <Link href="/ocean-care">
            <div className="rounded-xl border border-[#1A2330] bg-[#0B0F14] p-3 text-center">
              <Shield className="mx-auto text-[#0094FF]" size={20} />
              <p className="mt-2 text-[10px] font-black uppercase text-[#9CA8B8]">
                Protect
              </p>
            </div>
          </Link>
        </section>

        <BeachMap />

        <GlassCard className="mt-5">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#1A2330] bg-[#10161E]">
              <MapPin className="text-[#0094FF]" size={22} />
            </div>

            <div>
              <p className="text-xl font-black">Map Intelligence</p>
              <p className="mt-2 text-sm leading-6 text-[#9CA8B8]">
                Future map layers will show beaches, wrecks, reefs, species
                areas, pollution reports, saved locations and condition ratings.
              </p>

              <Link
                href="/explore"
                className="mt-4 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-[#0094FF]"
              >
                Browse all locations <Compass size={14} />
              </Link>
            </div>
          </div>
        </GlassCard>
      </AppScreen>
    </AuthGuard>
  );
}