"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Activity, MapPin, Thermometer, Waves } from "lucide-react";
import AppScreen from "../../../components/AppScreen";
import AuthGuard from "../../../components/AuthGuard";
import GlassCard from "../../../components/ui/GlassCard";
import { supabase } from "../../../lib/supabase";

import dynamic from "next/dynamic";
import type { RoutePoint } from "../../../components/DiveRouteMap";

const DiveRouteMap = dynamic(
  () => import("../../../components/DiveRouteMap"),
  {
    ssr: false,
  }
);

type DiveSession = {
  id: number;
  title: string | null;
  activity_type: string | null;
  location_name: string | null;
  start_time: string | null;
  end_time: string | null;
  started_at: string | null;
  ended_at: string | null;
  duration_seconds: number | null;
  max_depth: number | null;
  water_temp: number | null;
  visibility: number | null;
  notes: string | null;
  status: string | null;
};

export default function SessionDetailPage() {
  const { id } = useParams();

  const [session, setSession] = useState<DiveSession | null>(null);
  const [routePoints, setRoutePoints] = useState<RoutePoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSession();
  }, [id]);

  async function loadSession() {
    setLoading(true);

    const { data: sessionData } = await supabase
      .from("dive_sessions")
      .select("*")
      .eq("id", id)
      .single();

    const { data: pointsData } = await supabase
      .from("dive_route_points")
      .select("id, latitude, longitude, accuracy, recorded_at")
      .eq("session_id", id)
      .order("recorded_at", { ascending: true });

    setSession(sessionData || null);
    setRoutePoints((pointsData as RoutePoint[]) || []);
    setLoading(false);
  }

  function formatDuration(totalSeconds: number | null) {
    if (!totalSeconds) return "-";

    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;

    return `${mins}m ${secs}s`;
  }

  function formatDate(date: string | null) {
    if (!date) return "-";

    return new Date(date).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  if (loading) {
    return (
      <AuthGuard>
        <AppScreen>
          <p className="text-[#9CA8B8]">Loading dive session...</p>
        </AppScreen>
      </AuthGuard>
    );
  }

  if (!session) {
    return (
      <AuthGuard>
        <AppScreen>
          <h1 className="text-3xl font-black">Dive session not found</h1>
        </AppScreen>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <AppScreen>
        <header>
          <p className="text-xs font-black uppercase tracking-[0.3em] text-[#0094FF]">
            Dive Log
          </p>

          <h1 className="mt-3 text-5xl font-black tracking-tight">
            {session.title || "Tracked Dive"}
          </h1>

          <p className="mt-3 text-sm leading-6 text-[#9CA8B8]">
            {session.location_name || "Unknown location"}
          </p>
        </header>

        <section className="mt-6 grid grid-cols-2 gap-3">
          <GlassCard>
            <Activity className="text-[#0094FF]" size={22} />
            <p className="mt-3 text-xs text-[#9CA8B8]">Duration</p>
            <p className="mt-1 text-xl font-black">
              {formatDuration(session.duration_seconds)}
            </p>
          </GlassCard>

          <GlassCard>
            <Waves className="text-[#0094FF]" size={22} />
            <p className="mt-3 text-xs text-[#9CA8B8]">Max Depth</p>
            <p className="mt-1 text-xl font-black">
              {session.max_depth ? `${session.max_depth}m` : "-"}
            </p>
          </GlassCard>

          <GlassCard>
            <Thermometer className="text-[#0094FF]" size={22} />
            <p className="mt-3 text-xs text-[#9CA8B8]">Water Temp</p>
            <p className="mt-1 text-xl font-black">
              {session.water_temp ? `${session.water_temp}°C` : "-"}
            </p>
          </GlassCard>

          <GlassCard>
            <MapPin className="text-[#0094FF]" size={22} />
            <p className="mt-3 text-xs text-[#9CA8B8]">Route Points</p>
            <p className="mt-1 text-xl font-black">{routePoints.length}</p>
          </GlassCard>
        </section>

        <GlassCard className="mt-5">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-[#0094FF]">
            Session Times
          </p>

          <p className="mt-3 text-sm text-[#9CA8B8]">
            Started: {formatDate(session.start_time || session.started_at)}
          </p>

          <p className="mt-2 text-sm text-[#9CA8B8]">
            Ended: {formatDate(session.end_time || session.ended_at)}
          </p>
        </GlassCard>

        <section className="mt-6">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.25em] text-[#0094FF]">
            GPS Route
          </p>

          <DiveRouteMap points={routePoints} />
        </section>

        {session.notes && (
          <GlassCard className="mt-5">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-[#0094FF]">
              Notes
            </p>

            <p className="mt-3 text-sm leading-6 text-[#9CA8B8]">
              {session.notes}
            </p>
          </GlassCard>
        )}
      </AppScreen>
    </AuthGuard>
  );
}