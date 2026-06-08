"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import {
  ExternalLink,
  Fish,
  MapPin,
  RefreshCw,
  Satellite,
  Search,
  Waves,
} from "lucide-react";
import AppScreen from "../../components/AppScreen";
import AuthGuard from "../../components/AuthGuard";
import GlassCard from "../../components/ui/GlassCard";
import type { MarineSighting } from "../../components/TaggedAnimalMap";

const TaggedAnimalMap = dynamic(
  () => import("../../components/TaggedAnimalMap"),
  {
    ssr: false,
  }
);

const groups = ["All", "Shark", "Whale", "Cetacean"];

export default function TaggedAnimalsPage() {
  const [sightings, setSightings] = useState<MarineSighting[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeGroup, setActiveGroup] = useState("All");
  const [query, setQuery] = useState("");

  useEffect(() => {
    loadSightings();
  }, []);

  async function loadSightings() {
    setLoading(true);

    try {
      const res = await fetch("/api/marine-sightings", {
        cache: "no-store",
      });

      const data = await res.json();

      setSightings(Array.isArray(data.sightings) ? data.sightings : []);
    } catch {
      setSightings([]);
    }

    setLoading(false);
  }

  const filteredSightings = useMemo(() => {
    const search = query.toLowerCase().trim();

    return sightings.filter((item) => {
      const matchesGroup =
        activeGroup === "All" || item.species_group === activeGroup;

      const matchesSearch =
        !search ||
        item.common_name.toLowerCase().includes(search) ||
        item.scientific_name.toLowerCase().includes(search) ||
        item.locality?.toLowerCase().includes(search);

      return matchesGroup && matchesSearch;
    });
  }, [sightings, activeGroup, query]);

  const groupedSightings = useMemo(() => {
    return groups
      .filter((group) => group !== "All")
      .map((group) => ({
        group,
        items: filteredSightings.filter(
          (item) => item.species_group === group
        ),
      }))
      .filter((section) => section.items.length > 0);
  }, [filteredSightings]);

  const speciesCount = new Set(
    filteredSightings.map((item) => item.scientific_name)
  ).size;

  function formatDate(date: string | null) {
    if (!date) return "Unknown date";

    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  return (
    <AuthGuard>
      <AppScreen>
        <header>
          <p className="text-xs font-black uppercase tracking-[0.3em] text-[#0094FF]">
            Marine Sightings
          </p>

          <h1 className="mt-3 text-5xl font-black tracking-tight">
            Real UK occurrence data.
          </h1>

          <p className="mt-3 text-sm leading-6 text-[#9CA8B8]">
            View real marine animal occurrence records around UK waters using
            trusted biodiversity data. This is sightings and occurrence data,
            not live GPS tracking.
          </p>
        </header>

        <section className="mt-6 grid grid-cols-3 gap-3">
          <GlassCard>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#7D8896]">
              Records
            </p>
            <p className="mt-2 text-2xl font-black text-[#0094FF]">
              {filteredSightings.length}
            </p>
          </GlassCard>

          <GlassCard>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#7D8896]">
              Species
            </p>
            <p className="mt-2 text-2xl font-black text-[#0094FF]">
              {speciesCount}
            </p>
          </GlassCard>

          <GlassCard>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#7D8896]">
              Source
            </p>
            <p className="mt-2 text-lg font-black text-[#0094FF]">OBIS</p>
          </GlassCard>
        </section>

        <GlassCard className="mt-5">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#1A2330] bg-[#10161E]">
              <Satellite className="text-[#0094FF]" size={24} />
            </div>

            <div>
              <p className="text-xl font-black">Layer 1: Real sightings</p>

              <p className="mt-2 text-sm leading-6 text-[#9CA8B8]">
                BlueTrail pulls real marine occurrence records for sharks,
                whales, dolphins and porpoises around the UK. These records can
                help show where species have been observed historically or
                recently.
              </p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="mt-5">
          <div className="flex items-center gap-3 rounded-xl border border-[#1A2330] bg-[#05070A] px-4 py-3">
            <Search size={20} className="text-[#0094FF]" />

            <input
              className="w-full bg-transparent text-white outline-none placeholder:text-[#6F7A89]"
              placeholder="Search shark, dolphin, whale..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>

          <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
            {groups.map((group) => (
              <button
                key={group}
                onClick={() => setActiveGroup(group)}
                className={`shrink-0 rounded-xl px-4 py-2 text-xs font-black uppercase tracking-wide ${
                  activeGroup === group
                    ? "bg-[#0094FF] text-white"
                    : "border border-[#1A2330] bg-[#10161E] text-[#9CA8B8]"
                }`}
              >
                {group}
              </button>
            ))}
          </div>
        </GlassCard>

        <button
          onClick={loadSightings}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-[#0094FF]/40 bg-[#0094FF] px-5 py-4 text-sm font-black uppercase tracking-[0.14em] text-white"
        >
          <RefreshCw size={17} />
          {loading ? "Loading..." : "Refresh Sightings"}
        </button>

        <TaggedAnimalMap animals={filteredSightings} />

        <section className="mt-6">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.25em] text-[#0094FF]">
            Sighting Records
          </p>

          {loading ? (
            <GlassCard>
              <p className="text-[#9CA8B8]">Loading marine sighting data...</p>
            </GlassCard>
          ) : filteredSightings.length === 0 ? (
            <GlassCard>
              <p className="font-black">No records found</p>
              <p className="mt-2 text-sm leading-6 text-[#9CA8B8]">
                Try another filter or refresh the sightings layer.
              </p>
            </GlassCard>
          ) : (
            <div className="grid gap-6">
              {groupedSightings.map((section) => (
                <div key={section.group}>
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-xs font-black uppercase tracking-[0.25em] text-[#0094FF]">
                      {section.group}
                    </p>

                    <p className="text-xs font-black uppercase tracking-[0.16em] text-[#7D8896]">
                      {section.items.length}
                    </p>
                  </div>

                  <div className="grid gap-3">
                    {section.items.map((item) => (
                      <GlassCard key={item.id}>
                        <div className="flex items-start gap-4">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#1A2330] bg-[#10161E]">
                            {item.species_group === "Whale" ||
                            item.species_group === "Cetacean" ? (
                              <Waves className="text-[#0094FF]" size={23} />
                            ) : (
                              <Fish className="text-[#0094FF]" size={23} />
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="font-black">
                                  {item.common_name}
                                </p>

                                <p className="mt-1 text-sm italic text-[#9CA8B8]">
                                  {item.scientific_name}
                                </p>
                              </div>

                              <span className="rounded-full border border-[#0094FF]/30 bg-[#0094FF]/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-[#7CC6FF]">
                                {item.species_group}
                              </span>
                            </div>

                            <p className="mt-3 flex items-center gap-2 text-sm text-[#9CA8B8]">
                              <MapPin
                                size={15}
                                className="text-[#0094FF]"
                              />
                              {item.locality ||
                                `${Number(item.latitude).toFixed(
                                  3
                                )}, ${Number(item.longitude).toFixed(3)}`}
                            </p>

                            <p className="mt-2 text-sm text-[#9CA8B8]">
                              Observed: {formatDate(item.observed_at)}
                            </p>

                            {item.source_url && (
                              <a
                                href={item.source_url}
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
                </div>
              ))}
            </div>
          )}
        </section>
      </AppScreen>
    </AuthGuard>
  );
}