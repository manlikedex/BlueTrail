"use client";

import {
  Waves,
  Wind,
  Eye,
  Thermometer,
  CloudRain,
  Compass,
  Activity,
  Timer,
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
      label: "Waves",
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
      sub: "requires tide/current API",
      icon: Compass,
    },
    {
      label: "Tide",
      value: "Soon",
      sub: "high/low tide API next",
      icon: Timer,
    },
  ];

  return (
    <section className="mt-5">
      <div className="rounded-[2.2rem] border border-white/10 bg-white/[0.06] p-5 shadow-2xl shadow-black/20 backdrop-blur-xl">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-[#00D4C8]">
          Dive Decision
        </p>

        <div className="mt-3 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-5xl font-black">{score}</h2>
            <p className="mt-2 text-sm leading-6 text-[#A9C7D8]">
              Based on waves, swell, wind and visibility.
            </p>
          </div>

          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-cyan-400/10">
            <Waves className="text-[#00D4C8]" size={32} />
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.label}
              className="rounded-[1.7rem] border border-white/10 bg-[#071D2E]/90 p-4"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-[#A9C7D8]">
                  {card.label}
                </p>

                <Icon size={18} className="text-[#00D4C8]" />
              </div>

              <p className="mt-3 text-3xl font-black">{card.value}</p>
              <p className="mt-1 text-xs text-[#A9C7D8]">{card.sub}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}