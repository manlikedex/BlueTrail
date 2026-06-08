"use client";

import AppScreen from "../../components/AppScreen";
import AuthGuard from "../../components/AuthGuard";
import DiveTracker from "../../components/DiveTracker";

export default function TrackPage() {
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
            Use your phone to record a dive route, duration, location and dive
            conditions. Trail Tag support will come later.
          </p>
        </header>

        <div className="mt-6">
          <DiveTracker />
        </div>
      </AppScreen>
    </AuthGuard>
  );
}