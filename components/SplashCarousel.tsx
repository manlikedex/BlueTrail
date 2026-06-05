"use client";

import { useState } from "react";
import Link from "next/link";
import AlphaNotice from "../components/AlphaNotice";
<AlphaNotice />

const slides = [
  {
    step: "01",
    label: "Welcome",
    title: "Your ocean activity companion.",
    text: "Track freediving, snorkelling and spearfishing sessions with a modern app built around the ocean.",
    icon: "🌊",
  },
  {
    step: "02",
    label: "Track",
    title: "Log routes, depths and descents.",
    text: "Record GPS surface routes, dive sessions, depth personal bests, descents, time in water and photos.",
    icon: "📍",
  },
  {
    step: "03",
    label: "Explore",
    title: "Discover species and hotspots.",
    text: "Find marine life by area, explore dive spots, save locations and learn what you may see before entering the water.",
    icon: "🐠",
  },
  {
    step: "04",
    label: "Ocean Safety",
    title: "Safety comes first.",
    text: "Always dive with a buddy, check conditions, respect your limits and use this app as guidance, not a replacement for training.",
    icon: "🛟",
  },
  {
    step: "05",
    label: "Legal Rules",
    title: "Know local laws before catching.",
    text: "Spearfishing rules, species restrictions, size limits and protected areas change by region. Always confirm with official local sources.",
    icon: "⚖️",
  },
  {
    step: "06",
    label: "Ocean Care",
    title: "Protect the places you love.",
    text: "Report plastic, rubbish, sewage, fishing line, unsafe water and pollution to help keep the ocean clean.",
    icon: "♻️",
  },
  {
    step: "07",
    label: "Alpha Notice",
    title: "This app is still in development.",
    text: "Some features may not be functional yet and issues may occur while testing. Designed & Developed by Jordan Trevorrow.",
    icon: "🚧",
  },
];

export default function SplashCarousel() {
  const [index, setIndex] = useState(0);
  const slide = slides[index];
  const isLast = index === slides.length - 1;

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-[#031B2E] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#00D4C833,transparent_35%),linear-gradient(180deg,#053554_0%,#031B2E_45%,#020D18_100%)]" />

      <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />

      <section className="relative z-10 flex h-full flex-col px-5 py-6 sm:px-8 lg:px-12">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-xl font-black tracking-tight text-[#9FFFE0]">
              BlueTrail
            </p>
            <p className="text-xs text-cyan-100/60">
              Freedive • Snorkel • Spearfish
            </p>
          </div>

          <Link
            href="/login"
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-cyan-100 backdrop-blur"
          >
            Skip
          </Link>
        </header>

        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-6xl">
            <div className="grid items-center gap-8 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="mx-auto flex aspect-square w-full max-w-xs items-center justify-center rounded-[3rem] border border-white/10 bg-white/5 shadow-2xl backdrop-blur sm:max-w-sm lg:max-w-md">
                <div className="text-center">
                  <div className="text-8xl sm:text-9xl">{slide.icon}</div>
                  <p className="mt-6 text-sm font-bold tracking-[0.3em] text-cyan-200/70">
                    {slide.step} / 07
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm font-black uppercase tracking-[0.25em] text-[#00D4C8]">
                  {slide.label}
                </p>

                <h1 className="mt-4 text-4xl font-black leading-tight sm:text-6xl lg:text-7xl">
                  {slide.title}
                </h1>

                <p className="mt-5 max-w-2xl text-base leading-7 text-[#A9C7D8] sm:text-lg">
                  {slide.text}
                </p>

                <div className="mt-8 flex gap-2">
                  {slides.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setIndex(i)}
                      className={`h-2 rounded-full transition-all ${
                        i === index
                          ? "w-10 bg-[#00D4C8]"
                          : "w-2 bg-white/20"
                      }`}
                      aria-label={`Go to slide ${i + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <footer className="grid grid-cols-2 gap-3 sm:flex sm:justify-end">
          <button
            disabled={index === 0}
            onClick={() => setIndex(index - 1)}
            className="rounded-3xl border border-white/10 bg-white/5 px-6 py-4 font-bold text-cyan-100 disabled:opacity-30"
          >
            Back
          </button>

          {isLast ? (
            <Link
              href="/signup"
              className="rounded-3xl bg-[#00D4C8] px-6 py-4 text-center font-black text-[#031B2E]"
            >
              Enter App
            </Link>
          ) : (
            <button
              onClick={() => setIndex(index + 1)}
              className="rounded-3xl bg-[#00D4C8] px-6 py-4 font-black text-[#031B2E]"
            >
              Next
            </button>
          )}
        </footer>
      </section>
    </main>
  );
}