"use client";

import dynamic from "next/dynamic";
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
          <p className="text-xs font-black uppercase tracking-[0.25em] text-[#00D4C8]">
            Beach Map
          </p>

          <h1 className="mt-3 text-5xl font-black tracking-tight">
            Find your next dive.
          </h1>

          <p className="mt-3 text-sm leading-6 text-[#A9C7D8]">
            Explore beaches, dive spots and live condition pages from the map.
          </p>
        </header>

        <GlassCard className="mt-6">
          <p className="font-black text-[#9FFFE0]">Tap a beach marker</p>
          <p className="mt-2 text-sm text-[#A9C7D8]">
            Open the full beach profile to view forecasts, reports, safety notes
            and future species data.
          </p>
        </GlassCard>

        <BeachMap />
      </AppScreen>
    </AuthGuard>
  );
}