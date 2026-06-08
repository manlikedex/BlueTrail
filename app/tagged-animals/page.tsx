"use client";

import { useEffect, useState } from "react";
import {
  ExternalLink,
  Fish,
  MapPin,
  Radio,
  RefreshCw,
  Satellite,
  Waves,
} from "lucide-react";
import AppScreen from "../../components/AppScreen";
import AuthGuard from "../../components/AuthGuard";
import GlassCard from "../../components/ui/GlassCard";
import TaggedAnimalMap from "../../components/TaggedAnimalMap";

type TaggedAnimal = {
  id: number;
  name: string;
  species: string;
  animal_type: string;
  source: string | null;
  source_url: string | null;
  latitude: number;
  longitude: number;
  last_ping_at: string | null;
  status: string | null;
  notes: string | null;
};

export default function TaggedAnimalsPage() {
  const [animals, setAnimals] = useState<TaggedAnimal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnimals();
  }, []);

  async function loadAnimals() {
    setLoading(true);

    const res = await fetch("/api/tagged-animals");
    const data = await res.json();

    setAnimals(data.animals || []);
    setLoading(false);
  }

  function formatPing(date: string | null) {
    if (!date) return "Unknown";

    return new Date(date).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <AuthGuard>
      <AppScreen>
        <header>
          <p className="text-xs font-black uppercase tracking-[0.3em] text-[#0094FF]">
            Tagged Animals
          </p>

          <h1 className="mt-3 text-5xl font-black tracking-tight">
            Live ocean movement.
          </h1>

          <p className="mt-3 text-sm leading-6 text-[#9CA8B8]">
            View tagged sharks, whales, dolphins and other tracked marine
            animals on a UK-focused ocean map.
          </p>
        </header>

        <GlassCard className="mt-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#1A2330] bg-[#10161E]">
              <Satellite className="text-[#0094FF]" size={24} />
            </div>

            <div>
              <p className="text-xl font-black">Tracking intelligence</p>
              <p className="mt-2 text-sm leading-6 text-[#9CA8B8]">
                This page is ready for trusted animal tracking datasets such as
                Movebank, Ocean Tracking Network or approved research partners.
              </p>
            </div>
          </div>
        </GlassCard>

        <button
          onClick={loadAnimals}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-[#0094FF]/40 bg-[#0094FF] px-5 py-4 text-sm font-black uppercase tracking-[0.14em] text-white"
        >
          <RefreshCw size={17} />
          {loading ? "Loading..." : "Refresh Tracking Data"}
        </button>

        <TaggedAnimalMap animals={animals} />

        <section className="mt-6">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.25em] text-[#0094FF]">
            Active Tagged Animals
          </p>

          {animals.length === 0 ? (
            <GlassCard>
              <p className="font-black">No tagged animals loaded</p>
              <p className="mt-2 text-sm leading-6 text-[#9CA8B8]">
                Add rows to the tagged_animals table to start showing animal
                tracking points.
              </p>
            </GlassCard>
          ) : (
            <div className="grid gap-3">
              {animals.map((animal) => (
                <GlassCard key={animal.id}>
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#1A2330] bg-[#10161E]">
                      {animal.animal_type.toLowerCase().includes("whale") ? (
                        <Waves className="text-[#0094FF]" size={23} />
                      ) : (
                        <Fish className="text-[#0094FF]" size={23} />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-black">{animal.name}</p>
                          <p className="mt-1 text-sm italic text-[#9CA8B8]">
                            {animal.species}
                          </p>
                        </div>

                        <span className="rounded-full border border-[#0094FF]/30 bg-[#0094FF]/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-[#7CC6FF]">
                          {animal.animal_type}
                        </span>
                      </div>

                      <p className="mt-3 flex items-center gap-2 text-sm text-[#9CA8B8]">
                        <MapPin size={15} className="text-[#0094FF]" />
                        {Number(animal.latitude).toFixed(3)},{" "}
                        {Number(animal.longitude).toFixed(3)}
                      </p>

                      <p className="mt-2 flex items-center gap-2 text-sm text-[#9CA8B8]">
                        <Radio size={15} className="text-[#0094FF]" />
                        Last ping: {formatPing(animal.last_ping_at)}
                      </p>

                      {animal.notes && (
                        <p className="mt-3 text-sm leading-6 text-[#9CA8B8]">
                          {animal.notes}
                        </p>
                      )}

                      {animal.source_url && (
                        <a
                          href={animal.source_url}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-4 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-[#0094FF]"
                        >
                          Data source <ExternalLink size={14} />
                        </a>
                      )}
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          )}
        </section>
      </AppScreen>
    </AuthGuard>
  );
}