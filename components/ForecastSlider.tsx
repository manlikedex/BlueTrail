"use client";

import { useRef } from "react";
import {
  Waves,
  Wind,
  Thermometer,
  Eye,
  CloudRain,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";

type HourlyForecast = {
  time: string;
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

export default function ForecastSlider({
  hourly,
}: {
  hourly: HourlyForecast[];
}) {
  const sliderRef = useRef<HTMLDivElement | null>(null);

  function formatTime(time: string) {
    return new Date(time).toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function barHeight(value: number | null, max: number) {
    if (!value) return 12;
    return Math.max(12, Math.min(90, (value / max) * 90));
  }

  function scroll(direction: "left" | "right") {
    sliderRef.current?.scrollBy({
      left: direction === "right" ? 260 : -260,
      behavior: "smooth",
    });
  }

  if (!hourly?.length) return null;

  return (
    <section className="mt-5 rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 shadow-2xl shadow-black/20 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.25em] text-[#00D4C8]">
            Full Day Forecast
          </p>
          <h2 className="mt-2 text-2xl font-black">Hourly Sea Conditions</h2>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => scroll("left")}
            className="rounded-full bg-white/10 p-2"
          >
            <ArrowLeft size={16} />
          </button>

          <button
            onClick={() => scroll("right")}
            className="rounded-full bg-[#00D4C8] p-2 text-[#020B14]"
          >
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      <div
        ref={sliderRef}
        className="mt-5 flex snap-x snap-mandatory gap-3 overflow-x-scroll pb-3"
        style={{
          WebkitOverflowScrolling: "touch",
          touchAction: "pan-x",
          scrollbarWidth: "none",
        }}
      >
        {hourly.map((hour) => (
          <div
            key={hour.time}
            className="w-[210px] shrink-0 snap-start rounded-[1.8rem] border border-white/10 bg-[#020B14]/90 p-4"
          >
            <div className="flex items-center justify-between">
              <p className="text-lg font-black">{formatTime(hour.time)}</p>
              <p className="text-sm font-bold text-[#9FFFE0]">
                {hour.temperature ?? "-"}°C
              </p>
            </div>

            <div className="mt-5 flex h-28 items-end justify-around rounded-3xl bg-white/[0.04] px-3 py-4">
              <div className="flex flex-col items-center">
                <div
                  className="w-4 rounded-full bg-[#00D4C8]"
                  style={{ height: `${barHeight(hour.waveHeight, 3)}px` }}
                />
                <Waves className="mt-2 text-[#00D4C8]" size={16} />
              </div>

              <div className="flex flex-col items-center">
                <div
                  className="w-4 rounded-full bg-[#9FFFE0]"
                  style={{ height: `${barHeight(hour.swellHeight, 3)}px` }}
                />
                <span className="mt-2 text-xs text-[#9FFFE0]">SW</span>
              </div>

              <div className="flex flex-col items-center">
                <div
                  className="w-4 rounded-full bg-[#F4D35E]"
                  style={{ height: `${barHeight(hour.windSpeed, 50)}px` }}
                />
                <Wind className="mt-2 text-[#F4D35E]" size={16} />
              </div>
            </div>

            <div className="mt-4 grid gap-2 text-xs text-[#A9C7D8]">
              <p className="flex items-center gap-2">
                <Waves size={14} /> Wave {hour.waveHeight ?? "-"}m
              </p>

              <p className="flex items-center gap-2">
                🌊 Swell {hour.swellHeight ?? "-"}m /{" "}
                {hour.swellPeriod ?? "-"}s
              </p>

              <p className="flex items-center gap-2">
                <Wind size={14} /> Wind {hour.windSpeed ?? "-"}mph
              </p>

              <p className="flex items-center gap-2">
                <Eye size={14} /> Visibility{" "}
                {hour.visibility ? `${(hour.visibility / 1000).toFixed(1)}km` : "-"}
              </p>

              <p className="flex items-center gap-2">
                <Thermometer size={14} /> Sea {hour.seaTemp ?? "-"}°C
              </p>

              <p className="flex items-center gap-2">
                <CloudRain size={14} /> Rain {hour.precipitation ?? "-"}mm
              </p>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-2 text-center text-xs text-[#A9C7D8]">
        Swipe sideways or use arrows to view the full day.
      </p>
    </section>
  );
}