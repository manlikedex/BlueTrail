"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AppScreen from "../../../components/AppScreen";
import AuthGuard from "../../../components/AuthGuard";
import GlassCard from "../../../components/ui/GlassCard";
import ForecastSlider from "../../../components/ForecastSlider";
import ForecastSummary from "../../../components/ForecastSummary";
import { supabase } from "../../../lib/supabase";
import SaveDiveSiteButton from "../../../components/SaveDiveSiteButton";

type DiveSite = {
  id: number;
  name: string;
  slug: string;
  region: string | null;
  latitude: number;
  longitude: number;
  site_type: string | null;
  description: string | null;
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

export default function DiveSitePage() {
  const { slug } = useParams();

  const [site, setSite] = useState<DiveSite | null>(null);
  const [conditions, setConditions] = useState<Conditions | null>(null);
  const [loading, setLoading] = useState(true);
  const [conditionsLoading, setConditionsLoading] = useState(false);

  useEffect(() => {
    loadSite();
  }, [slug]);

  async function loadSite() {
    setLoading(true);

    const { data, error } = await supabase
      .from("dive_sites")
      .select("*")
      .eq("slug", slug)
      .single();

    setLoading(false);

    if (error || !data) {
      alert("Dive site not found.");
      return;
    }

    setSite(data);
    loadConditions(data);
  }

  async function loadConditions(selectedSite: DiveSite) {
    setConditionsLoading(true);

    try {
      const res = await fetch(
        `/api/conditions?lat=${selectedSite.latitude}&lon=${selectedSite.longitude}`
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Could not load dive site forecast.");
        setConditionsLoading(false);
        return;
      }

      setConditions({
        current: data.current,
        hourly: data.hourly || [],
      });
    } catch {
      alert("Could not load dive site forecast.");
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

  if (loading) {
    return (
      <AuthGuard>
        <AppScreen>
          <p className="text-[#A9C7D8]">Loading dive site...</p>
        </AppScreen>
      </AuthGuard>
    );
  }

  if (!site) {
    return (
      <AuthGuard>
        <AppScreen>
          <h1 className="text-3xl font-black">Dive site not found</h1>
        </AppScreen>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <AppScreen>
        <section>
          <p className="text-xs font-black uppercase tracking-[0.25em] text-[#00D4C8]">
            {site.site_type || "Dive Site"}
            {site.region ? ` • ${site.region}` : ""}
          </p>

          
          {site.description && (
            <p className="mt-4 text-sm leading-6 text-[#A9C7D8]">
              {site.description}
            </p>
          )}
        </section>

        <section>


  <h1 className="mt-3 text-5xl font-black tracking-tight">
    {site.name}
  </h1>

  {site.description && (
    <p className="mt-4 text-sm leading-6 text-[#A9C7D8]">
      {site.description}
    </p>
  )}
</section>

<SaveDiveSiteButton diveSiteId={site.id} />



        {conditionsLoading && (
          <GlassCard className="mt-6">
            <p className="font-black text-[#9FFFE0]">
              Loading live forecast...
            </p>
            <p className="mt-2 text-sm text-[#A9C7D8]">
              Fetching latest wind, waves, swell and visibility.
            </p>
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

        <GlassCard className="mt-4">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-[#00D4C8]">
            Site Safety
          </p>

          <p className="mt-3 text-sm leading-6 text-white">
            Always check tides, currents, entry and exit points, local warnings,
            boat traffic and your own ability before diving this site.
          </p>
        </GlassCard>
      </AppScreen>
    </AuthGuard>
  );
}