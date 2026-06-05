"use client";

import AppScreen from "../../../components/AppScreen";
import AuthGuard from "../../../components/AuthGuard";
import GlassCard from "../../../components/ui/GlassCard";
import BeachReportForm from "../../../components/BeachReportForm";
import BeachReports from "../../../components/BeachReports";
import ForecastSlider from "../../../components/ForecastSlider";
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

  function getScoreColor() {
    const score = getDiveScore();

    if (score === "Excellent") return "text-[#9FFFE0]";
    if (score === "Good") return "text-[#00D4C8]";
    if (score === "Caution") return "text-[#F4D35E]";
    if (score === "Poor") return "text-[#FF6B6B]";

    return "text-white";
  }

  function metresToKm(value: number | null) {
    if (value === null) return "-";
    return `${(value / 1000).toFixed(1)}km`;
  }

  if (loading) {
    return (
      <AuthGuard>
        <AppScreen>
          <p className="text-[#A9C7D8]">Loading beach...</p>
        </AppScreen>
      </AuthGuard>
    );
  }

  if (!beach) {
    return (
      <AuthGuard>
        <AppScreen>
          <h1 className="text-3xl font-black">Beach not found</h1>
        </AppScreen>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <AppScreen>
        <section>
          <p className="text-xs font-black uppercase tracking-[0.25em] text-[#00D4C8]">
            {beach.town ? `${beach.town}, ` : ""}
            {beach.region}
          </p>

          <h1 className="mt-3 text-5xl font-black tracking-tight">
            {beach.name}
          </h1>

          {beach.notes && (
            <p className="mt-4 text-sm leading-6 text-[#A9C7D8]">
              {beach.notes}
            </p>
          )}
        </section>

        {conditionsLoading && (
          <GlassCard className="mt-6">
            <p className="font-black text-[#9FFFE0]">
              Loading live forecast...
            </p>
            <p className="mt-2 text-sm text-[#A9C7D8]">
              Fetching latest wind, wave, swell and visibility data.
            </p>
          </GlassCard>
        )}

        {conditions?.current && (
          <>
            <GlassCard className="mt-6">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-[#00D4C8]">
                Condition Rating
              </p>

              <h2 className={`mt-3 text-5xl font-black ${getScoreColor()}`}>
                {getDiveScore()}
              </h2>

              <p className="mt-2 text-sm text-[#A9C7D8]">
                Calculated from wave height, swell, wind and visibility.
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

          

            {conditions?.hourly?.length ? (
  <ForecastSlider hourly={conditions.hourly} />
) : null}
          </>
        )}

        <GlassCard className="mt-4">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-[#00D4C8]">
            Tides
          </p>

          <p className="mt-3 text-sm leading-6 text-white">
            Tide times are next. We’ll connect this section to a licensed tide
            API for high tide, low tide, tide height and tide state.
          </p>
        </GlassCard>

        <GlassCard className="mt-4">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-[#00D4C8]">
            Safety
          </p>

          <p className="mt-3 text-sm leading-6 text-white">
            Forecast data is guidance only. Always check local signs, tide
            times, currents, visibility, entry/exit points and official warnings
            before entering the water.
          </p>
        </GlassCard>

        <div className="mt-6">
          <BeachReportForm beachId={beach.id} />
        </div>

        <BeachReports beachId={beach.id} />
      </AppScreen>
    </AuthGuard>
  );
}