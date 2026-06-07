"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  AlertTriangle,
  Compass,
  LifeBuoy,
  MapPin,
  Radio,
  Shield,
  Waves,
} from "lucide-react";
import AppScreen from "../../../components/AppScreen";
import AuthGuard from "../../../components/AuthGuard";
import GlassCard from "../../../components/ui/GlassCard";
import BeachReportForm from "../../../components/BeachReportForm";
import BeachReports from "../../../components/BeachReports";
import ForecastSlider from "../../../components/ForecastSlider";
import ForecastSummary from "../../../components/ForecastSummary";
import SaveBeachButton from "../../../components/SaveBeachButton";
import { supabase } from "../../../lib/supabase";

type Beach = {
  id: number;
  name: string;
  slug: string;
  town: string | null;
  region: string | null;
  country: string | null;
  latitude: number;
  longitude: number;
  notes: string | null;
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

export default function BeachPage() {
  const { slug } = useParams();

  const [beach, setBeach] = useState<Beach | null>(null);
  const [conditions, setConditions] = useState<Conditions | null>(null);
  const [loading, setLoading] = useState(true);
  const [conditionsLoading, setConditionsLoading] = useState(false);

  useEffect(() => {
    loadBeach();
  }, [slug]);

  async function loadBeach() {
    setLoading(true);

    const { data, error } = await supabase
      .from("beaches")
      .select("*")
      .eq("slug", slug)
      .single();

    setLoading(false);

    if (error || !data) {
      alert("Beach not found.");
      return;
    }

    setBeach(data);
    loadConditions(data);
  }

  async function loadConditions(selectedBeach: Beach) {
    setConditionsLoading(true);

    try {
      const res = await fetch(
        `/api/conditions?lat=${selectedBeach.latitude}&lon=${selectedBeach.longitude}`
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Could not load beach forecast.");
        setConditionsLoading(false);
        return;
      }

      setConditions({
        current: data.current,
        hourly: data.hourly || [],
      });
    } catch {
      alert("Could not load beach forecast.");
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

  function statusColor() {
    const score = getDiveScore();

    if (score === "Excellent") return "text-[#7CC6FF]";
    if (score === "Good") return "text-[#0094FF]";
    if (score === "Caution") return "text-[#F4D35E]";
    if (score === "Poor") return "text-[#FF5D5D]";

    return "text-white";
  }

  if (loading) {
    return (
      <AuthGuard>
        <AppScreen>
          <GlassCard>
            <p className="text-[#9CA8B8]">Loading beach briefing...</p>
          </GlassCard>
        </AppScreen>
      </AuthGuard>
    );
  }

  if (!beach) {
    return (
      <AuthGuard>
        <AppScreen>
          <GlassCard>
            <h1 className="text-3xl font-black">Beach not found</h1>
            <p className="mt-2 text-sm text-[#9CA8B8]">
              This location does not exist in the BlueTrail database.
            </p>
          </GlassCard>
        </AppScreen>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <AppScreen>
        <section className="rounded-3xl border border-[#1A2330] bg-[#0B0F14] p-5 shadow-[0_0_50px_rgba(0,0,0,0.35)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.3em] text-[#0094FF]">
                Beach Briefing
              </p>

              <h1 className="mt-3 text-5xl font-black tracking-tight">
                {beach.name}
              </h1>

              <div className="mt-4 flex items-center gap-2 text-sm text-[#9CA8B8]">
                <MapPin size={16} className="text-[#0094FF]" />
                <span>
                  {beach.town ? `${beach.town}, ` : ""}
                  {beach.region || beach.country || "United Kingdom"}
                </span>
              </div>
            </div>

            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[#1A2330] bg-[#10161E]">
              <Waves className="text-[#0094FF]" size={28} />
            </div>
          </div>

          {beach.notes && (
            <p className="mt-5 text-sm leading-6 text-[#9CA8B8]">
              {beach.notes}
            </p>
          )}

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-[#1A2330] bg-[#05070A] p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#7D8896]">
                Dive Status
              </p>
              <p className={`mt-2 text-2xl font-black ${statusColor()}`}>
                {conditions?.current ? getDiveScore() : "Pending"}
              </p>
            </div>

            <div className="rounded-xl border border-[#1A2330] bg-[#05070A] p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#7D8896]">
                Coordinates
              </p>
              <p className="mt-2 text-sm font-black text-white">
                {Number(beach.latitude).toFixed(3)},{" "}
                {Number(beach.longitude).toFixed(3)}
              </p>
            </div>
          </div>
        </section>

        <SaveBeachButton beachId={beach.id} />

        {conditionsLoading && (
          <GlassCard className="mt-6">
            <div className="flex items-center gap-3">
              <Radio className="text-[#0094FF]" size={22} />
              <div>
                <p className="font-black text-white">Loading live forecast</p>
                <p className="mt-1 text-sm text-[#9CA8B8]">
                  Fetching wind, wave, swell and visibility data.
                </p>
              </div>
            </div>
          </GlassCard>
        )}

        {conditions?.current && (
          <>
            <ForecastSummary
              current={conditions.current}
              score={getDiveScore()}
            />

            {conditions.hourly.length > 0 && (
              <ForecastSlider hourly={conditions.hourly} />
            )}
          </>
        )}

        <section className="mt-5 grid gap-3">
          <GlassCard>
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#1A2330] bg-[#10161E]">
                <Compass className="text-[#0094FF]" size={22} />
              </div>

              <div>
                <p className="text-xl font-black">Tide Intelligence</p>
                <p className="mt-2 text-sm leading-6 text-[#9CA8B8]">
                  Tide times are coming next. This section will show high tide,
                  low tide, tide height, tide state and slack-water guidance
                  where available.
                </p>
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#1A2330] bg-[#10161E]">
                <Shield className="text-[#0094FF]" size={22} />
              </div>

              <div>
                <p className="text-xl font-black">Safety Protocol</p>
                <p className="mt-2 text-sm leading-6 text-[#9CA8B8]">
                  Forecast data is guidance only. Always check local signs,
                  tides, currents, visibility, entry and exit points, boat
                  traffic and official warnings before entering the water.
                </p>
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#1A2330] bg-[#10161E]">
                <LifeBuoy className="text-[#0094FF]" size={22} />
              </div>

              <div>
                <p className="text-xl font-black">Emergency Awareness</p>
                <p className="mt-2 text-sm leading-6 text-[#9CA8B8]">
                  Never dive alone. Tell someone where you are going, carry
                  appropriate safety equipment and avoid entering the water if
                  conditions are beyond your ability.
                </p>
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#1A2330] bg-[#10161E]">
                <AlertTriangle className="text-[#FF5D5D]" size={22} />
              </div>

              <div>
                <p className="text-xl font-black">Report Conditions</p>
                <p className="mt-2 text-sm leading-6 text-[#9CA8B8]">
                  Help the community by sharing visibility, hazards, pollution,
                  wildlife sightings or unusual conditions at this beach.
                </p>
              </div>
            </div>
          </GlassCard>
        </section>

        <div className="mt-6">
          <BeachReportForm beachId={beach.id} />
        </div>

        <BeachReports beachId={beach.id} />
      </AppScreen>
    </AuthGuard>
  );
}