"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Search,
  Waves,
  MapPin,
  Anchor,
  Compass,
  Star,
  Ship,
  Fish,
} from "lucide-react";
import AppScreen from "../../components/AppScreen";
import AuthGuard from "../../components/AuthGuard";
import GlassCard from "../../components/ui/GlassCard";
import { supabase } from "../../lib/supabase";

type Beach = {
  id: number;
  name: string;
  slug: string;
  town: string | null;
  region: string | null;
  country: string | null;
};

type DiveSite = {
  id: number;
  name: string;
  slug: string;
  region: string | null;
  country: string | null;
  site_type: string | null;
  entry_type: string | null;
  category: string | null;
};

const filters = [
  "All",
  "Beaches",
  "Wreck",
  "Reef",
  "Shore Dive",
  "Boat Dive",
  "Quarry",
  "Spearfishing Spot",
  "Snorkelling Spot",
];

export default function ExplorePage() {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [beaches, setBeaches] = useState<Beach[]>([]);
  const [diveSites, setDiveSites] = useState<DiveSite[]>([]);
  const [featuredBeaches, setFeaturedBeaches] = useState<Beach[]>([]);
  const [featuredDiveSites, setFeaturedDiveSites] = useState<DiveSite[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadFeatured();
  }, []);

  useEffect(() => {
    if (query.trim()) {
      searchLocations();
    }
  }, [activeFilter]);

  async function loadFeatured() {
    const [beachResult, diveSiteResult] = await Promise.all([
      supabase
        .from("beaches")
        .select("id,name,slug,town,region,country")
        .order("name", { ascending: true })
        .limit(8),

      supabase
        .from("dive_sites")
        .select("id,name,slug,region,country,site_type,entry_type,category")
        .order("name", { ascending: true })
        .limit(8),
    ]);

    setFeaturedBeaches(beachResult.data || []);
    setFeaturedDiveSites(diveSiteResult.data || []);
  }

  async function searchLocations() {
    setLoading(true);

    const safeQuery = query.trim().replace(/,/g, " ");

    const shouldSearchBeaches =
      activeFilter === "All" || activeFilter === "Beaches";

    const shouldSearchDiveSites =
      activeFilter !== "Beaches";

    const beachPromise = shouldSearchBeaches
      ? supabase
          .from("beaches")
          .select("id,name,slug,town,region,country")
          .or(
            `name.ilike.%${safeQuery}%,town.ilike.%${safeQuery}%,region.ilike.%${safeQuery}%`
          )
          .order("name", { ascending: true })
          .limit(30)
      : Promise.resolve({ data: [], error: null });

    let diveQuery = supabase
      .from("dive_sites")
      .select("id,name,slug,region,country,site_type,entry_type,category")
      .or(
        `name.ilike.%${safeQuery}%,region.ilike.%${safeQuery}%,site_type.ilike.%${safeQuery}%,entry_type.ilike.%${safeQuery}%,category.ilike.%${safeQuery}%`
      )
      .order("name", { ascending: true })
      .limit(30);

    if (activeFilter !== "All" && activeFilter !== "Beaches") {
      diveQuery = diveQuery.eq("category", activeFilter);
    }

    const divePromise = shouldSearchDiveSites
      ? diveQuery
      : Promise.resolve({ data: [], error: null });

    const [beachResult, diveSiteResult] = await Promise.all([
      beachPromise,
      divePromise,
    ]);

    if (beachResult.error) alert(beachResult.error.message);
    if (diveSiteResult.error) alert(diveSiteResult.error.message);

    setBeaches(beachResult.data || []);
    setDiveSites(diveSiteResult.data || []);
    setLoading(false);
  }

  function clearSearch() {
    setQuery("");
    setBeaches([]);
    setDiveSites([]);
    setActiveFilter("All");
  }

  const hasSearch = query.trim().length > 0;
  const hasResults = beaches.length > 0 || diveSites.length > 0;

  return (
    <AuthGuard>
      <AppScreen>
        <header>
          <p className="text-xs font-black uppercase tracking-[0.25em] text-[#00D4C8]">
            Explore
          </p>

          <h1 className="mt-3 text-5xl font-black tracking-tight">
            Find your next water.
          </h1>

          <p className="mt-3 text-sm leading-6 text-[#A9C7D8]">
            Search UK beaches, shore dives, wrecks, reefs, quarries, boat dives
            and popular dive spots.
          </p>
        </header>

        <GlassCard className="mt-6">
          <div className="flex items-center gap-3 rounded-3xl border border-white/10 bg-[#020B14] px-4 py-3">
            <Search size={20} className="shrink-0 text-[#00D4C8]" />

            <input
              className="w-full bg-transparent text-white outline-none placeholder:text-slate-500"
              placeholder="Search Fistral, Manacles, wreck..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") searchLocations();
              }}
            />
          </div>

          <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold ${
                  activeFilter === filter
                    ? "bg-[#00D4C8] text-[#020B14]"
                    : "border border-white/10 bg-white/[0.05] text-cyan-100"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              onClick={searchLocations}
              disabled={loading}
              className="rounded-3xl bg-[#00D4C8] py-4 font-black text-[#020B14] disabled:opacity-50"
            >
              {loading ? "Searching..." : "Search"}
            </button>

            <button
              onClick={clearSearch}
              className="rounded-3xl border border-white/10 bg-white/[0.05] py-4 font-black text-cyan-100"
            >
              Clear
            </button>
          </div>
        </GlassCard>

        {!hasSearch && (
          <>
            <section className="mt-6 grid grid-cols-2 gap-3">
              <Link href="/map" className="block">
                <GlassCard className="h-[150px]">
                  <MapPin size={24} className="text-[#00D4C8]" />
                  <p className="mt-4 text-lg font-black">Map View</p>
                  <p className="mt-1 text-xs leading-5 text-[#A9C7D8]">
                    Browse pins visually.
                  </p>
                </GlassCard>
              </Link>

              <Link href="/conditions" className="block">
                <GlassCard className="h-[150px]">
                  <Waves size={24} className="text-[#00D4C8]" />
                  <p className="mt-4 text-lg font-black">Conditions</p>
                  <p className="mt-1 text-xs leading-5 text-[#A9C7D8]">
                    Wind, swell, waves.
                  </p>
                </GlassCard>
              </Link>

              <GlassCard className="h-[150px]">
                <Ship size={24} className="text-[#00D4C8]" />
                <p className="mt-4 text-lg font-black">Wrecks</p>
                <p className="mt-1 text-xs leading-5 text-[#A9C7D8]">
                  Historic dive sites.
                </p>
              </GlassCard>

              <GlassCard className="h-[150px]">
                <Fish size={24} className="text-[#00D4C8]" />
                <p className="mt-4 text-lg font-black">Species</p>
                <p className="mt-1 text-xs leading-5 text-[#A9C7D8]">
                  Coming soon.
                </p>
              </GlassCard>
            </section>

            {featuredBeaches.length > 0 && (
              <section className="mt-8">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-xs font-black uppercase tracking-[0.25em] text-[#00D4C8]">
                    Top Beaches
                  </p>
                  <Star size={16} className="text-[#F4D35E]" />
                </div>

                <div className="flex gap-3 overflow-x-auto pb-3 snap-x snap-mandatory">
                  {featuredBeaches.map((beach) => (
                    <Link
                      key={beach.id}
                      href={`/beach/${beach.slug}`}
                      className="w-[240px] flex-shrink-0 snap-start"
                    >
                      <GlassCard className="h-[180px]">
                        <Waves size={24} className="text-[#00D4C8]" />
                        <p className="mt-4 line-clamp-2 text-lg font-black leading-6">
                          {beach.name}
                        </p>
                        <p className="mt-2 text-xs leading-5 text-[#A9C7D8]">
                          {beach.town ? `${beach.town}, ` : ""}
                          {beach.region}
                        </p>
                        <p className="mt-3 text-xs font-bold text-[#9FFFE0]">
                          View forecast →
                        </p>
                      </GlassCard>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {featuredDiveSites.length > 0 && (
              <section className="mt-8">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-xs font-black uppercase tracking-[0.25em] text-[#00D4C8]">
                    Popular Dive Sites
                  </p>
                  <Anchor size={16} className="text-[#00D4C8]" />
                </div>

                <div className="flex gap-3 overflow-x-auto pb-3 snap-x snap-mandatory">
                  {featuredDiveSites.map((site) => (
                    <Link
                      key={site.id}
                      href={`/dive-site/${site.slug}`}
                      className="w-[240px] flex-shrink-0 snap-start"
                    >
                      <GlassCard className="h-[180px]">
                        <Compass size={24} className="text-[#00D4C8]" />
                        <p className="mt-4 line-clamp-2 text-lg font-black leading-6">
                          {site.name}
                        </p>
                        <p className="mt-2 text-xs leading-5 text-[#A9C7D8]">
                          {site.category || site.site_type || "Dive Site"}
                          {site.region ? ` • ${site.region}` : ""}
                        </p>
                        <p className="mt-3 text-xs font-bold text-[#9FFFE0]">
                          View site →
                        </p>
                      </GlassCard>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        {hasSearch && hasResults && (
          <section className="mt-6 grid gap-6">
            {beaches.length > 0 && (
              <div>
                <p className="mb-3 text-xs font-black uppercase tracking-[0.25em] text-[#00D4C8]">
                  Beaches
                </p>

                <div className="grid gap-3">
                  {beaches.map((beach) => (
                    <Link key={beach.id} href={`/beach/${beach.slug}`}>
                      <GlassCard>
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cyan-400/10">
                            <Waves size={22} className="text-[#00D4C8]" />
                          </div>

                          <div className="min-w-0">
                            <p className="truncate font-black">{beach.name}</p>
                            <p className="mt-1 truncate text-sm text-[#A9C7D8]">
                              {beach.town ? `${beach.town}, ` : ""}
                              {beach.region}
                            </p>
                          </div>
                        </div>
                      </GlassCard>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {diveSites.length > 0 && (
              <div>
                <p className="mb-3 text-xs font-black uppercase tracking-[0.25em] text-[#00D4C8]">
                  Dive Sites
                </p>

                <div className="grid gap-3">
                  {diveSites.map((site) => (
                    <Link key={site.id} href={`/dive-site/${site.slug}`}>
                      <GlassCard>
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cyan-400/10">
                            <Compass size={22} className="text-[#00D4C8]" />
                          </div>

                          <div className="min-w-0">
                            <p className="truncate font-black">{site.name}</p>
                            <p className="mt-1 truncate text-sm text-[#A9C7D8]">
                              {site.category || site.site_type || "Dive Site"}
                              {site.region ? ` • ${site.region}` : ""}
                            </p>
                          </div>
                        </div>
                      </GlassCard>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {hasSearch && !loading && !hasResults && (
          <GlassCard className="mt-6">
            <p className="font-black">No results found</p>
            <p className="mt-2 text-sm text-[#A9C7D8]">
              Try a beach, town, region, reef, wreck, quarry or dive type.
            </p>
          </GlassCard>
        )}
      </AppScreen>
    </AuthGuard>
  );
}