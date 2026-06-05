"use client";

import { useState } from "react";
import AppScreen from "../../components/AppScreen";
import AuthGuard from "../../components/AuthGuard";
import GlassCard from "../../components/ui/GlassCard";
import { supabase } from "../../lib/supabase";

type LocationResult = {
  id: number;
  name: string;
  town: string | null;
  region: string | null;
  country: string | null;
  latitude: number;
  longitude: number;
  notes: string | null;
  slug: string;
};

type HourlyForecast = {
  time: string;
  temperature: number | null;
  precipitation: number | null;
  windSpeed: number | null;
  windDirection: number | null;
  windGusts?: number | null;
  visibility: number | null;
  weatherCode?: number | null;
  waveHeight: number | null;
  waveDirection: number | null;
  wavePeriod: number | null;
  swellHeight: number | null;
  swellPeriod: number | null;
  seaTemp: number | null;
};

type Conditions = {
  current: HourlyForecast | null;
  hourly: HourlyForecast[];
};

export default function ConditionsPage() {
  const [query, setQuery] = useState("");
  const [locations, setLocations] = useState<LocationResult[]>([]);
  const [selected, setSelected] = useState<LocationResult | null>(null);
  const [conditions, setConditions] = useState<Conditions | null>(null);
  const [loading, setLoading] = useState(false);
  const [conditionsLoading, setConditionsLoading] = useState(false);

  async function searchLocations() {
    if (!query.trim()) return;

    setLoading(true);
    setSelected(null);
    setConditions(null);

    const safeQuery = query.trim().replace(/,/g, " ");

    const { data, error } = await supabase
      .from("beaches")
      .select("*")
      .or(
        `name.ilike.%${safeQuery}%,town.ilike.%${safeQuery}%,region.ilike.%${safeQuery}%`
      )
      .order("name", { ascending: true })
      .limit(30);

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    setLocations(data || []);
  }

  async function loadConditions(location: LocationResult) {
    setSelected(location);
    setConditions(null);
    setConditionsLoading(true);

    try {
      const res = await fetch(
        `/api/conditions?lat=${location.latitude}&lon=${location.longitude}`
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Could not load conditions.");
        setConditionsLoading(false);
        return;
      }

      setConditions({
        current: data.current,
        hourly: data.hourly,
      });
    } catch {
      alert("Could not load live conditions for this beach.");
    }

    setConditionsLoading(false);
  }

  function getDiveScore() {
    if (!conditions?.current) return "Unknown";

    const wave = conditions.current.waveHeight || 0;
    const swell = conditions.current.swellHeight || 0;
    const wind = conditions.current.windSpeed || 0;
    const visibility = conditions.current.visibility || 0;

    if (wave < 0.5 && swell < 0.5 && wind < 15 && visibility > 8000) {
      return "Excellent";
    }

    if (wave < 1 && swell < 1 && wind < 25 && visibility > 5000) {
      return "Good";
    }

    if (wave < 1.8 && swell < 1.8 && wind < 40) {
      return "Caution";
    }

    return "Poor";
  }

  function getDiveScoreTextColor() {
    const score = getDiveScore();

    if (score === "Excellent") return "text-[#9FFFE0]";
    if (score === "Good") return "text-[#00D4C8]";
    if (score === "Caution") return "text-[#F4D35E]";
    if (score === "Poor") return "text-[#FF6B6B]";

    return "text-white";
  }

  function formatTime(time: string) {
    return new Date(time).toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function metresToKm(value: number | null) {
    if (value === null) return "-";
    return `${(value / 1000).toFixed(1)}km`;
  }

  return (
    <AuthGuard>
      <AppScreen>
        <header>
          <p className="text-xs font-black uppercase tracking-[0.25em] text-[#00D4C8]">
            BlueTrail Conditions
          </p>

          <h1 className="mt-3 text-5xl font-black tracking-tight">
            Live beach forecast.
          </h1>

          <p className="mt-3 text-sm leading-6 text-[#A9C7D8]">
            Search specific beaches and view hourly marine, wind, weather and
            visibility data.
          </p>
        </header>

        <GlassCard className="mt-6">
          <input
            className="w-full rounded-3xl border border-white/10 bg-[#020B14] p-4 text-white outline-none placeholder:text-slate-500"
            placeholder="Search beach, town or region..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") searchLocations();
            }}
          />

          <button
            onClick={searchLocations}
            disabled={loading}
            className="mt-4 w-full rounded-3xl bg-[#00D4C8] py-4 font-black text-[#020B14] disabled:opacity-50"
          >
            {loading ? "Searching..." : "Search Beaches"}
          </button>
        </GlassCard>

        {locations.length > 0 && (
          <section className="mt-5 grid gap-3">
            {locations.map((location) => (
              <button
                key={location.id}
                onClick={() => {
  window.location.href = `/beach/${location.slug}`;
}}
                className={`rounded-[1.6rem] border p-4 text-left backdrop-blur-xl transition active:scale-[0.98] ${
                  selected?.id === location.id
                    ? "border-[#00D4C8] bg-[#00D4C8] text-[#020B14]"
                    : "border-white/10 bg-white/[0.06] text-white"
                }`}
              >
                <p className="font-black">{location.name}</p>

                <p
                  className={`mt-1 text-sm ${
                    selected?.id === location.id
                      ? "text-[#020B14]/70"
                      : "text-[#A9C7D8]"
                  }`}
                >
                  {location.town ? `${location.town}, ` : ""}
                  {location.region ? `${location.region}, ` : ""}
                  {location.country || "United Kingdom"}
                </p>

                {location.notes && (
                  <p
                    className={`mt-2 text-xs ${
                      selected?.id === location.id
                        ? "text-[#020B14]/60"
                        : "text-cyan-100/50"
                    }`}
                  >
                    {location.notes}
                  </p>
                )}
              </button>
            ))}
          </section>
        )}

        {conditionsLoading && (
          <GlassCard className="mt-6">
            <p className="font-black text-[#9FFFE0]">Loading live forecast...</p>
            <p className="mt-2 text-sm text-[#A9C7D8]">
              Fetching marine and weather data for {selected?.name}.
            </p>
          </GlassCard>
        )}

        {selected && conditions?.current && (
          <section className="mt-6">
            <GlassCard>
              <p className="text-xs font-black uppercase tracking-[0.25em] text-[#00D4C8]">
                {selected.name}
              </p>

              <h2
                className={`mt-3 text-4xl font-black ${getDiveScoreTextColor()}`}
              >
                {getDiveScore()}
              </h2>

              <p className="mt-2 text-sm text-[#A9C7D8]">
                Dive score based on wave height, swell, wind and visibility.
              </p>
            </GlassCard>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <GlassCard>
                <p className="text-xs text-[#A9C7D8]">Wind</p>
                <p className="mt-2 text-3xl font-black">
                  {conditions.current.windSpeed ?? "-"}
                </p>
                <p className="text-xs text-[#A9C7D8]">
                  mph / {conditions.current.windDirection ?? "-"}°
                </p>
              </GlassCard>

              <GlassCard>
                <p className="text-xs text-[#A9C7D8]">Visibility</p>
                <p className="mt-2 text-3xl font-black">
                  {metresToKm(conditions.current.visibility)}
                </p>
              </GlassCard>

              <GlassCard>
                <p className="text-xs text-[#A9C7D8]">Wave Height</p>
                <p className="mt-2 text-3xl font-black">
                  {conditions.current.waveHeight ?? "-"}m
                </p>
              </GlassCard>

              <GlassCard>
                <p className="text-xs text-[#A9C7D8]">Swell</p>
                <p className="mt-2 text-3xl font-black">
                  {conditions.current.swellHeight ?? "-"}m
                </p>
                <p className="text-xs text-[#A9C7D8]">
                  {conditions.current.swellPeriod ?? "-"}s period
                </p>
              </GlassCard>

              <GlassCard>
                <p className="text-xs text-[#A9C7D8]">Sea Temp</p>
                <p className="mt-2 text-3xl font-black">
                  {conditions.current.seaTemp ?? "-"}°C
                </p>
              </GlassCard>

              <GlassCard>
                <p className="text-xs text-[#A9C7D8]">Weather</p>
                <p className="mt-2 text-3xl font-black">
                  {conditions.current.temperature ?? "-"}°C
                </p>
                <p className="text-xs text-[#A9C7D8]">
                  Rain {conditions.current.precipitation ?? "-"}mm
                </p>
              </GlassCard>
            </div>

            <GlassCard className="mt-5">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-[#00D4C8]">
                Today Hour by Hour
              </p>

              <div className="mt-4 grid gap-3">
                {conditions.hourly.map((hour) => (
                  <div
                    key={hour.time}
                    className="rounded-3xl border border-white/10 bg-[#020B14]/70 p-4"
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-black">{formatTime(hour.time)}</p>
                      <p className="text-sm text-[#A9C7D8]">
                        {hour.temperature ?? "-"}°C
                      </p>
                    </div>

                    <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-[#A9C7D8]">
                      <p>Wind {hour.windSpeed ?? "-"}mph</p>
                      <p>Wave {hour.waveHeight ?? "-"}m</p>
                      <p>Swell {hour.swellHeight ?? "-"}m</p>
                      <p>Period {hour.wavePeriod ?? "-"}s</p>
                      <p>Vis {metresToKm(hour.visibility)}</p>
                      <p>Rain {hour.precipitation ?? "-"}mm</p>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>

            <GlassCard className="mt-4">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-[#00D4C8]">
                Tide Data
              </p>

              <p className="mt-3 text-sm leading-6 text-white">
                Tide times are the next data layer. For proper UK high tide and
                low tide predictions, BlueTrail should connect to UKHO/ADMIRALTY
                Tidal API access or a licensed tide provider.
              </p>
            </GlassCard>

            <GlassCard className="mt-4">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-[#00D4C8]">
                Safety Note
              </p>

              <p className="mt-3 text-sm leading-6 text-white">
                Always check local signs, tides, currents, visibility and entry
                points before diving. BlueTrail conditions are guidance only and
                should not replace local knowledge or official warnings.
              </p>
            </GlassCard>
          </section>
        )}
      </AppScreen>
    </AuthGuard>
  );
}