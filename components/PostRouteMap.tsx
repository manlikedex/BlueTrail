"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import type { RoutePoint } from "./DiveRouteMap";
import { supabase } from "../lib/supabase";

const DiveRouteMap = dynamic(() => import("./DiveRouteMap"), {
  ssr: false,
});

export default function PostRouteMap({
  diveSessionId,
}: {
  diveSessionId: number;
}) {
  const [points, setPoints] = useState<RoutePoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRoute();
  }, [diveSessionId]);

  async function loadRoute() {
    setLoading(true);

    const { data } = await supabase
      .from("dive_route_points")
      .select("id, latitude, longitude, accuracy, recorded_at")
      .eq("session_id", diveSessionId)
      .order("recorded_at", { ascending: true });

    setPoints((data as RoutePoint[]) || []);
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="mt-4 rounded-2xl border border-[#1A2330] bg-[#05070A] p-4 text-sm text-[#9CA8B8]">
        Loading route map...
      </div>
    );
  }

  if (points.length === 0) {
    return null;
  }

  return (
    <div className="mt-4">
      <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-[#0094FF]">
        Shared Dive Route
      </p>

      <DiveRouteMap points={points} />
    </div>
  );
}