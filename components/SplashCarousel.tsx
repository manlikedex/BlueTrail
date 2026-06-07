"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Compass,
  Fish,
  Radio,
  Shield,
  Waves,
} from "lucide-react";

const slides = [
  {
    title: "Explore Britain’s Coastline",
    text: "Discover beaches, shore dives, wrecks, reefs and popular marine locations across the UK.",
    icon: Compass,
  },
  {
    title: "Know Before You Go",
    text: "Check waves, swell, wind, visibility, sea temperature and daily forecasts before entering the water.",
    icon: Waves,
  },
  {
    title: "Discover Marine Life",
    text: "Learn which species are common in each area and where you are most likely to find them.",
    icon: Fish,
  },
  {
    title: "Protect The Ocean",
    text: "Understand pollution, report issues, protect wildlife and help keep marine ecosystems healthy.",
    icon: Shield,
  },
  {
    title: "Trail Tag Ready",
    text: "Built for the future of connected dive tracking, logged sessions and ocean intelligence.",
    icon: Radio,
  },
];

export default function SplashCarousel() {
  const [index, setIndex] = useState(0);
  const slide = slides[index];
  const Icon = slide.icon;

  function nextSlide() {
    if (index < slides.length - 1) setIndex(index + 1);
  }

  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-[#05070A] px-5 py-8 text-white">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top,#0A84FF22,transparent_35%),linear-gradient(180deg,#070A0F_0%,#05070A_50%,#020305_100%)]" />

      <div className="relative z-10 flex flex-1 flex-col">
        <header>
          <p className="text-xs font-black uppercase tracking-[0.35em] text-[#0094FF]">
            BlueTrail
          </p>

          <h1 className="mt-3 text-4xl font-black tracking-tight">
            Ocean intelligence for explorers.
          </h1>
        </header>

        <section className="mt-10 flex flex-1 flex-col justify-center">
          <div className="rounded-3xl border border-[#1A2330] bg-[#0B0F14] p-6 shadow-[0_0_50px_rgba(0,0,0,0.45)]">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-[#1A2330] bg-[#10161E]">
              <Icon className="text-[#0094FF]" size={38} />
            </div>

            <p className="mt-8 text-xs font-black uppercase tracking-[0.25em] text-[#0094FF]">
              0{index + 1} / 0{slides.length}
            </p>

            <h2 className="mt-3 text-4xl font-black tracking-tight">
              {slide.title}
            </h2>

            <p className="mt-4 text-sm leading-7 text-[#9CA8B8]">
              {slide.text}
            </p>

            <div className="mt-8 flex gap-2">
              {slides.map((_, dotIndex) => (
                <div
                  key={dotIndex}
                  className={`h-1.5 rounded-full transition-all ${
                    dotIndex === index
                      ? "w-10 bg-[#0094FF]"
                      : "w-3 bg-[#1A2330]"
                  }`}
                />
              ))}
            </div>
          </div>
        </section>

        <footer className="relative z-10 mt-8">
          {index < slides.length - 1 ? (
            <button
              onClick={nextSlide}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-[#0094FF]/40 bg-[#0094FF] py-4 text-sm font-black uppercase tracking-[0.16em] text-white"
            >
              Continue <ArrowRight size={18} />
            </button>
          ) : (
            <Link
              href="/login"
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-[#0094FF]/40 bg-[#0094FF] py-4 text-sm font-black uppercase tracking-[0.16em] text-white"
            >
              Get Started <ArrowRight size={18} />
            </Link>
          )}

          <Link
            href="/login"
            className="mt-4 block text-center text-xs font-black uppercase tracking-[0.18em] text-[#7D8896]"
          >
            Already have an account?
          </Link>
        </footer>
      </div>
    </main>
  );
}