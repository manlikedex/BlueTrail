"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useParams, useRouter } from "next/navigation";
import {
  Activity,
  Camera,
  MapPin,
  Thermometer,
  Trash2,
  Waves,
} from "lucide-react";
import AppScreen from "../../../components/AppScreen";
import AuthGuard from "../../../components/AuthGuard";
import GlassCard from "../../../components/ui/GlassCard";
import type { RoutePoint } from "../../../components/DiveRouteMap";
import { supabase } from "../../../lib/supabase";

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
  descents: number | null;
  notes: string | null;
  status: string | null;
};

type DivePhoto = {
  id: number;
  image_url: string;
  species_name: string | null;
  scientific_name: string | null;
  confidence: number | null;
  latitude: number | null;
  longitude: number | null;
  created_at: string | null;
};

export default function SessionDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [session, setSession] = useState<DiveSession | null>(null);
  const [routePoints, setRoutePoints] = useState<RoutePoint[]>([]);
  const [photos, setPhotos] = useState<DivePhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

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

    const { data: photosData } = await supabase
      .from("dive_photos")
      .select("*")
      .eq("session_id", id)
      .order("created_at", { ascending: false });

    setSession(sessionData || null);
    setRoutePoints((pointsData as RoutePoint[]) || []);
    setPhotos((photosData as DivePhoto[]) || []);
    setLoading(false);
  }

  async function deleteDive() {
    if (!session) return;

    const ok = confirm("Delete this dive log? This cannot be undone.");
    if (!ok) return;

    setDeleting(true);

    const { error } = await supabase
      .from("dive_sessions")
      .delete()
      .eq("id", session.id);

    if (error) {
      alert(error.message);
      setDeleting(false);
      return;
    }

    router.push("/track");
  }

  function formatDuration(totalSeconds: number | null) {
    if (!totalSeconds) return "-";

    const hours = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}h ${mins}m ${secs}s`;
    }

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

  function formatPhotoDate(date: string | null) {
    if (!date) return "-";

    return new Date(date).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
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

          <GlassCard>
            <Waves className="text-[#0094FF]" size={22} />
            <p className="mt-3 text-xs text-[#9CA8B8]">Visibility</p>
            <p className="mt-1 text-xl font-black">
              {session.visibility ? `${session.visibility}m` : "-"}
            </p>
          </GlassCard>

          <GlassCard>
            <Activity className="text-[#0094FF]" size={22} />
            <p className="mt-3 text-xs text-[#9CA8B8]">Descents</p>
            <p className="mt-1 text-xl font-black">
              {session.descents ?? "-"}
            </p>
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

          {session.status && (
            <p className="mt-2 text-sm text-[#9CA8B8]">
              Status: {session.status}
            </p>
          )}
        </GlassCard>

        <section className="mt-6">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.25em] text-[#0094FF]">
            GPS Route
          </p>

          <DiveRouteMap points={routePoints} />
        </section>

        {photos.length > 0 && (
          <section className="mt-6">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-[#0094FF]">
                Marine Life Photos
              </p>

              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#7D8896]">
                {photos.length}
              </p>
            </div>

            <div className="grid gap-3">
              {photos.map((photo) => (
                <GlassCard key={photo.id}>
                  <img
                    src={photo.image_url}
                    alt={photo.species_name || "Dive photo"}
                    className="max-h-[360px] w-full rounded-2xl object-cover"
                  />

                  <div className="mt-4 flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#1A2330] bg-[#10161E]">
                      <Camera className="text-[#0094FF]" size={22} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xl font-black">
                        {photo.species_name || "Unknown species"}
                      </p>

                      {photo.scientific_name && (
                        <p className="mt-1 text-sm italic text-[#9CA8B8]">
                          {photo.scientific_name}
                        </p>
                      )}

                      {photo.confidence !== null && (
                        <p className="mt-2 text-sm text-[#9CA8B8]">
                          Confidence: {photo.confidence}%
                        </p>
                      )}

                      <p className="mt-2 text-sm text-[#9CA8B8]">
                        Captured: {formatPhotoDate(photo.created_at)}
                      </p>

                      {photo.latitude && photo.longitude && (
                        <p className="mt-2 text-sm text-[#9CA8B8]">
                          Location: {Number(photo.latitude).toFixed(4)},{" "}
                          {Number(photo.longitude).toFixed(4)}
                        </p>
                      )}
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </section>
        )}

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

        <button
          onClick={deleteDive}
          disabled={deleting}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/40 bg-red-500/10 px-5 py-4 text-sm font-black uppercase tracking-[0.14em] text-red-300"
        >
          <Trash2 size={17} />
          {deleting ? "Deleting..." : "Delete Dive Log"}
        </button>
      </AppScreen>
    </AuthGuard>
  );
}