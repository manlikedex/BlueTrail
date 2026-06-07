"use client";

import {
  Activity,
  CloudRain,
  Compass,
  Eye,
  Thermometer,
  Timer,
  Waves,
  Wind,
} from "lucide-react";

type Forecast = {
  temperature: number | null;
  precipitation: number | null;
  windSpeed: number | null;
  windDirection: number | null;
  windGusts?: number | null;
  visibility: number | null;
  waveHeight: number | null;
  waveDirection: number | null;
  wavePeriod: number | null;
  swellHeight: number | null;
  swellPeriod: number | null;
  seaTemp: number | null;
};

export default function ForecastSummary({
  current,
  score,
}: {
  current: Forecast;
  score: string;
}) {
  function metresToKm(value: number | null) {
    if (value === null) return "-";
    return `${(value / 1000).toFixed(1)}km`;
  }

  const cards = [
    {
      label: "Wave Height",
      value: `${current.waveHeight ?? "-"}m`,
      sub: `${current.wavePeriod ?? "-"}s period`,
      icon: Waves,
    },
    {
      label: "Swell",
      value: `${current.swellHeight ?? "-"}m`,
      sub: `${current.swellPeriod ?? "-"}s period`,
      icon: Activity,
    },
    {
      label: "Wind",
      value: `${current.windSpeed ?? "-"}mph`,
      sub: `${current.windDirection ?? "-"}° direction`,
      icon: Wind,
    },
    {
      label: "Visibility",
      value: metresToKm(current.visibility),
      sub: "forecast estimate",
      icon: Eye,
    },
    {
      label: "Sea Temp",
      value: `${current.seaTemp ?? "-"}°C`,
      sub: "surface temp",
      icon: Thermometer,
    },
    {
      label: "Weather",
      value: `${current.temperature ?? "-"}°C`,
      sub: `Rain ${current.precipitation ?? "-"}mm`,
      icon: CloudRain,
    },
    {
      label: "Current",
      value: "Soon",
      sub: "tide API required",
      icon: Compass,
    },
    {
      label: "Tide",
      value: "Soon",
      sub: "high / low tide",
      icon: Timer,
    },
  ];

  return (
    <section className="mt-5">
      <div className="rounded-2xl border border-[#1A2330] bg-[#0B0F14] p-5">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-[#0094FF]">
          Dive Index
        </p>

        <div className="mt-4 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-5xl font-black tracking-tight text-white">
              {score}
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#9CA8B8]">
              Calculated from waves, swell, wind and visibility.
            </p>
          </div>

          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#1A2330] bg-[#10161E]">
            <Waves className="text-[#0094FF]" size={32} />
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.label}
              className="rounded-2xl border border-[#1A2330] bg-[#0B0F14] p-4"
            >
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#7D8896]">
                  {card.label}
                </p>

                <Icon size={18} className="text-[#0094FF]" />
              </div>

              <p className="mt-4 text-3xl font-black tracking-tight">
                {card.value}
              </p>

              <p className="mt-1 text-xs text-[#9CA8B8]">{card.sub}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}