"use client";

import { useEffect, useRef, useState } from "react";
import { Activity, MapPin, Square, Waves } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";
import GlassCard from "./ui/GlassCard";
import PrimaryButton from "./ui/PrimaryButton";
import dynamic from "next/dynamic";
import type { RoutePoint } from "./DiveRouteMap";

const DiveRouteMap = dynamic(() => import("./DiveRouteMap"), {
  ssr: false,
});

export default function DiveTracker() {
  const router = useRouter();

  const watchIdRef = useRef<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const [sessionId, setSessionId] = useState<number | null>(null);
  const [tracking, setTracking] = useState(false);
  const [saving, setSaving] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [routePoints, setRoutePoints] = useState<RoutePoint[]>([]);

  const [locationName, setLocationName] = useState("");
  const [maxDepth, setMaxDepth] = useState("");
  const [waterTemp, setWaterTemp] = useState("");
  const [visibility, setVisibility] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }

      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  async function startDive() {
    setSaving(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("You must be logged in.");
      setSaving(false);
      return;
    }

    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from("dive_sessions")
      .insert({
        user_id: user.id,
        title: locationName || "Tracked Dive",
        activity_type: "dive",
        location_name: locationName || null,
        start_time: now,
        started_at: now,
        status: "active",
      })
      .select("id")
      .single();

    if (error || !data) {
      alert(error?.message || "Could not start dive.");
      setSaving(false);
      return;
    }

    setSessionId(data.id);
    setTracking(true);
    setSeconds(0);
    setRoutePoints([]);

    timerRef.current = setInterval(() => {
      setSeconds((value) => value + 1);
    }, 1000);

    if (!navigator.geolocation) {
      alert("GPS is not supported on this device.");
      setSaving(false);
      return;
    }

    watchIdRef.current = navigator.geolocation.watchPosition(
      async (position) => {
        const point = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          recorded_at: new Date().toISOString(),
        };

        setRoutePoints((current) => [...current, point]);

        await supabase.from("dive_route_points").insert({
          session_id: data.id,
          user_id: user.id,
          latitude: point.latitude,
          longitude: point.longitude,
          accuracy: point.accuracy,
          recorded_at: point.recorded_at,
        });
      },
      () => {
        alert("Could not access GPS. Please allow location permission.");
      },
      {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 15000,
      }
    );

    setSaving(false);
  }

  async function endDive() {
    if (!sessionId) return;

    setSaving(true);

    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    const now = new Date().toISOString();

    const { error } = await supabase
      .from("dive_sessions")
      .update({
        end_time: now,
        ended_at: now,
        duration_seconds: seconds,
        max_depth: maxDepth ? Number(maxDepth) : null,
        water_temp: waterTemp ? Number(waterTemp) : null,
        visibility: visibility ? Number(visibility) : null,
        notes: notes || null,
        status: "completed",
      })
      .eq("id", sessionId);

    if (error) {
      alert(error.message);
      setSaving(false);
      return;
    }

    setTracking(false);
    setSaving(false);

    router.push(`/session/${sessionId}`);
  }

  function formatDuration(totalSeconds: number) {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;

    return `${mins}:${String(secs).padStart(2, "0")}`;
  }

  return (
    <div>
      <GlassCard>
        <p className="text-xs font-black uppercase tracking-[0.25em] text-[#0094FF]">
          Phone Dive Tracking
        </p>

        <h2 className="mt-3 text-3xl font-black tracking-tight">
          Track your dive route.
        </h2>

        <p className="mt-3 text-sm leading-6 text-[#9CA8B8]">
          Start a dive, record your GPS route, then add depth, temperature,
          visibility and notes when you finish.
        </p>
      </GlassCard>

      <section className="mt-5 grid grid-cols-3 gap-3">
        <GlassCard>
          <Activity className="text-[#0094FF]" size={22} />
          <p className="mt-3 text-[10px] font-black uppercase tracking-[0.16em] text-[#7D8896]">
            Duration
          </p>
          <p className="mt-1 text-xl font-black">
            {formatDuration(seconds)}
          </p>
        </GlassCard>

        <GlassCard>
          <MapPin className="text-[#0094FF]" size={22} />
          <p className="mt-3 text-[10px] font-black uppercase tracking-[0.16em] text-[#7D8896]">
            Route Points
          </p>
          <p className="mt-1 text-xl font-black">{routePoints.length}</p>
        </GlassCard>

        <GlassCard>
          <Waves className="text-[#0094FF]" size={22} />
          <p className="mt-3 text-[10px] font-black uppercase tracking-[0.16em] text-[#7D8896]">
            Status
          </p>
          <p className="mt-1 text-xl font-black">
            {tracking ? "Live" : "Ready"}
          </p>
        </GlassCard>
      </section>

      {!tracking && (
        <GlassCard className="mt-5">
          <label className="text-xs font-black uppercase tracking-[0.18em] text-[#7D8896]">
            Location name
          </label>

          <input
            value={locationName}
            onChange={(event) => setLocationName(event.target.value)}
            placeholder="Example: Porthkerris, Swanage Pier..."
            className="mt-3 w-full rounded-xl border border-[#1A2330] bg-[#05070A] px-4 py-4 text-white outline-none placeholder:text-[#6F7A89]"
          />

          <div className="mt-5">
            <PrimaryButton onClick={startDive} disabled={saving}>
              {saving ? "Starting..." : "Start Dive"}
            </PrimaryButton>
          </div>
        </GlassCard>
      )}

      {tracking && (
        <GlassCard className="mt-5">
          <p className="text-xl font-black">Live dive session</p>

          <p className="mt-2 text-sm leading-6 text-[#9CA8B8]">
            Keep the app open while tracking. Add your depth and conditions
            before ending the dive.
          </p>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <input
              value={maxDepth}
              onChange={(event) => setMaxDepth(event.target.value)}
              type="number"
              placeholder="Max depth (m)"
              className="rounded-xl border border-[#1A2330] bg-[#05070A] px-4 py-4 text-white outline-none placeholder:text-[#6F7A89]"
            />

            <input
              value={waterTemp}
              onChange={(event) => setWaterTemp(event.target.value)}
              type="number"
              placeholder="Water temp °C"
              className="rounded-xl border border-[#1A2330] bg-[#05070A] px-4 py-4 text-white outline-none placeholder:text-[#6F7A89]"
            />

            <input
              value={visibility}
              onChange={(event) => setVisibility(event.target.value)}
              type="number"
              placeholder="Visibility (m)"
              className="rounded-xl border border-[#1A2330] bg-[#05070A] px-4 py-4 text-white outline-none placeholder:text-[#6F7A89]"
            />

            <input
              value={locationName}
              onChange={(event) => setLocationName(event.target.value)}
              placeholder="Location"
              className="rounded-xl border border-[#1A2330] bg-[#05070A] px-4 py-4 text-white outline-none placeholder:text-[#6F7A89]"
            />
          </div>

          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Dive notes..."
            className="mt-3 min-h-[120px] w-full rounded-xl border border-[#1A2330] bg-[#05070A] px-4 py-4 text-white outline-none placeholder:text-[#6F7A89]"
          />

          <button
            onClick={endDive}
            disabled={saving}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/40 bg-red-500 px-5 py-4 text-sm font-black uppercase tracking-[0.14em] text-white"
          >
            <Square size={17} />
            {saving ? "Saving..." : "End Dive"}
          </button>
        </GlassCard>
      )}

      <DiveRouteMap points={routePoints} />
    </div>
  );
}