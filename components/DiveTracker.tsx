"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { Activity, MapPin, Square, Waves, WifiOff } from "lucide-react";
import { supabase } from "../lib/supabase";
import GlassCard from "./ui/GlassCard";
import PrimaryButton from "./ui/PrimaryButton";
import DiveCamera from "./DiveCamera";
import type { RoutePoint } from "./DiveRouteMap";

const DiveRouteMap = dynamic(() => import("./DiveRouteMap"), {
  ssr: false,
});

const OFFLINE_ROUTE_KEY = "bluetrail_offline_route_points";

type OfflineRoutePoint = {
  session_id: number;
  user_id: string;
  latitude: number;
  longitude: number;
  accuracy: number | null;
  recorded_at: string;
};

function getOfflinePoints(): OfflineRoutePoint[] {
  if (typeof window === "undefined") return [];

  try {
    return JSON.parse(localStorage.getItem(OFFLINE_ROUTE_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveOfflinePoint(point: OfflineRoutePoint) {
  const current = getOfflinePoints();
  localStorage.setItem(OFFLINE_ROUTE_KEY, JSON.stringify([...current, point]));
}

async function syncOfflinePoints() {
  const points = getOfflinePoints();

  if (points.length === 0) return;

  const { error } = await supabase.from("dive_route_points").insert(points);

  if (!error) {
    localStorage.removeItem(OFFLINE_ROUTE_KEY);
  }
}

function getDistanceMetres(a: RoutePoint, b: RoutePoint) {
  const earthRadius = 6371000;

  const lat1 = (Number(a.latitude) * Math.PI) / 180;
  const lat2 = (Number(b.latitude) * Math.PI) / 180;
  const deltaLat = ((Number(b.latitude) - Number(a.latitude)) * Math.PI) / 180;
  const deltaLon =
    ((Number(b.longitude) - Number(a.longitude)) * Math.PI) / 180;

  const value =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) *
      Math.cos(lat2) *
      Math.sin(deltaLon / 2) *
      Math.sin(deltaLon / 2);

  const angle = 2 * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value));

  return earthRadius * angle;
}

export default function DiveTracker() {
  const router = useRouter();

  const watchIdRef = useRef<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startedAtRef = useRef<number | null>(null);
  const lastSavedPointRef = useRef<RoutePoint | null>(null);
  const lastSavedAtRef = useRef<number>(0);

  const [sessionId, setSessionId] = useState<number | null>(null);
  const [tracking, setTracking] = useState(false);
  const [saving, setSaving] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [routePoints, setRoutePoints] = useState<RoutePoint[]>([]);
  const [offlineCount, setOfflineCount] = useState(0);
  const [isOnline, setIsOnline] = useState(true);
  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null);

  const [locationName, setLocationName] = useState("");
  const [maxDepth, setMaxDepth] = useState("");
  const [descents, setDescents] = useState("");
  const [waterTemp, setWaterTemp] = useState("");
  const [visibility, setVisibility] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    setOfflineCount(getOfflinePoints().length);
    setIsOnline(typeof navigator !== "undefined" ? navigator.onLine : true);

    syncOfflinePoints().then(() => {
      setOfflineCount(getOfflinePoints().length);
    });

    function handleOnline() {
      setIsOnline(true);

      syncOfflinePoints().then(() => {
        setOfflineCount(getOfflinePoints().length);
      });
    }

    function handleOffline() {
      setIsOnline(false);
    }

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      document.removeEventListener("visibilitychange", updateTimerFromStart);

      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }

      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  function updateTimerFromStart() {
    if (!startedAtRef.current) return;

    const elapsedSeconds = Math.floor(
      (Date.now() - startedAtRef.current) / 1000
    );

    setSeconds(elapsedSeconds);
  }

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
    const startedAtMs = new Date(now).getTime();

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

    startedAtRef.current = startedAtMs;

    setSessionId(data.id);
    setTracking(true);
    setSeconds(0);
    setRoutePoints([]);
    setGpsAccuracy(null);

    lastSavedPointRef.current = null;
    lastSavedAtRef.current = 0;

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      updateTimerFromStart();
    }, 1000);

    document.addEventListener("visibilitychange", updateTimerFromStart);

    if (!navigator.geolocation) {
      alert("GPS is not supported on this device.");
      setSaving(false);
      return;
    }

    watchIdRef.current = navigator.geolocation.watchPosition(
      async (position) => {
        const accuracy = position.coords.accuracy ?? 999;
        setGpsAccuracy(Math.round(accuracy));

        if (accuracy > 75) {
          return;
        }

        const point: RoutePoint = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          recorded_at: new Date().toISOString(),
        };

        const nowMs = Date.now();
        const lastPoint = lastSavedPointRef.current;
        const lastSavedAt = lastSavedAtRef.current;

        if (lastPoint) {
          const distance = getDistanceMetres(lastPoint, point);

          if (distance > 100 && accuracy > 25) {
            return;
          }
        }

        const movedEnough = lastPoint
          ? getDistanceMetres(lastPoint, point) >= 2
          : true;

        const waitedEnough = nowMs - lastSavedAt >= 3000;

        if (!movedEnough && !waitedEnough) return;

        lastSavedPointRef.current = point;
        lastSavedAtRef.current = nowMs;

        setRoutePoints((current) => [...current, point]);

        const routePayload: OfflineRoutePoint = {
          session_id: data.id,
          user_id: user.id,
          latitude: point.latitude,
          longitude: point.longitude,
          accuracy: point.accuracy ?? null,
          recorded_at: point.recorded_at || new Date().toISOString(),
        };

        if (!navigator.onLine) {
          saveOfflinePoint(routePayload);
          setOfflineCount(getOfflinePoints().length);
          return;
        }

        const { error: pointError } = await supabase
          .from("dive_route_points")
          .insert(routePayload);

        if (pointError) {
          saveOfflinePoint(routePayload);
          setOfflineCount(getOfflinePoints().length);
        }
      },
      () => {
        alert("Could not access GPS. Please allow location permission.");
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 10000,
      }
    );

    setSaving(false);
  }

  async function endDive() {
    if (!sessionId) return;

    setSaving(true);

    updateTimerFromStart();

    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    document.removeEventListener("visibilitychange", updateTimerFromStart);

    await syncOfflinePoints();
    setOfflineCount(getOfflinePoints().length);

    const now = new Date().toISOString();

    const finalDurationSeconds = startedAtRef.current
      ? Math.floor((Date.now() - startedAtRef.current) / 1000)
      : seconds;

    const { error } = await supabase
      .from("dive_sessions")
      .update({
        end_time: now,
        ended_at: now,
        duration_seconds: finalDurationSeconds,
        max_depth: maxDepth ? Number(maxDepth) : null,
        descents: descents ? Number(descents) : null,
        water_temp: waterTemp ? Number(waterTemp) : null,
        visibility: visibility ? Number(visibility) : null,
        location_name: locationName || null,
        title: locationName || "Tracked Dive",
        notes: notes || null,
        status: "completed",
      })
      .eq("id", sessionId);

    if (error) {
      alert(error.message);
      setSaving(false);
      return;
    }

    startedAtRef.current = null;
    setTracking(false);
    setSaving(false);

    router.push(`/session/${sessionId}`);
  }

  function formatDuration(totalSeconds: number) {
    const hours = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}:${String(mins).padStart(2, "0")}:${String(
        secs
      ).padStart(2, "0")}`;
    }

    return `${mins}:${String(secs).padStart(2, "0")}`;
  }

  function gpsStatusLabel() {
    if (!tracking) return "Ready";
    if (gpsAccuracy === null) return "Finding GPS";
    if (gpsAccuracy <= 15) return "Excellent";
    if (gpsAccuracy <= 35) return "Good";
    if (gpsAccuracy <= 75) return "Weak";
    return "Poor";
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
          Start a dive, record your GPS route, capture marine life photos, then
          add depth, descents, temperature, visibility and notes when you finish.
        </p>
      </GlassCard>

      {offlineCount > 0 && (
        <GlassCard className="mt-5">
          <div className="flex items-start gap-3">
            <WifiOff className="mt-1 text-[#0094FF]" size={22} />

            <div>
              <p className="font-black">Offline route points saved</p>
              <p className="mt-1 text-sm leading-6 text-[#9CA8B8]">
                {offlineCount} GPS point{offlineCount === 1 ? "" : "s"} waiting
                to sync when your connection returns.
              </p>
            </div>
          </div>
        </GlassCard>
      )}

      <section className="mt-5 grid grid-cols-3 gap-3">
        <GlassCard>
          <Activity className="text-[#0094FF]" size={22} />
          <p className="mt-3 text-[10px] font-black uppercase tracking-[0.16em] text-[#7D8896]">
            Duration
          </p>
          <p className="mt-1 text-xl font-black">{formatDuration(seconds)}</p>
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
            {tracking ? (isOnline ? "Live" : "Offline") : "Ready"}
          </p>
        </GlassCard>
      </section>

      {tracking && (
        <GlassCard className="mt-5">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#0094FF]">
            GPS Signal
          </p>

          <p className="mt-2 text-2xl font-black">{gpsStatusLabel()}</p>

          <p className="mt-2 text-sm leading-6 text-[#9CA8B8]">
            {gpsAccuracy !== null
              ? `Current accuracy: ${gpsAccuracy}m. Points with poor accuracy are ignored to reduce route jumps.`
              : "Waiting for your first accurate GPS point..."}
          </p>
        </GlassCard>
      )}

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
            Keep the phone above water with a clear sky view where possible.
            BlueTrail now records more frequent points and filters poor GPS
            readings to reduce straight-line jumps.
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
              value={descents}
              onChange={(event) => setDescents(event.target.value)}
              type="number"
              placeholder="Descents"
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
              className="col-span-2 rounded-xl border border-[#1A2330] bg-[#05070A] px-4 py-4 text-white outline-none placeholder:text-[#6F7A89]"
            />
          </div>

          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Dive notes..."
            className="mt-3 min-h-[120px] w-full rounded-xl border border-[#1A2330] bg-[#05070A] px-4 py-4 text-white outline-none placeholder:text-[#6F7A89]"
          />

          {sessionId && <DiveCamera sessionId={sessionId} />}

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