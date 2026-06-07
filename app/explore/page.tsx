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

    const shouldSearchDiveSites = activeFilter !== "Beaches";

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
          <p className="text-xs font-black uppercase tracking-[0.25em] text-[#0094FF]">
            Explore
          </p>

          <h1 className="mt-3 text-5xl font-black tracking-tight">
            Find your next water.
          </h1>

          <p className="mt-3 text-sm leading-6 text-[#9CA8B8]">
            Search UK beaches, shore dives, wrecks, reefs, quarries, boat dives
            and popular dive spots.
          </p>
        </header>

        <GlassCard className="mt-6">
          <div className="flex items-center gap-3 rounded-xl border border-[#1A2330] bg-[#05070A] px-4 py-3">
            <Search size={20} className="shrink-0 text-[#0094FF]" />

            <input
              className="w-full bg-transparent text-white outline-none placeholder:text-[#6F7A89]"
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
                className={`shrink-0 rounded-xl px-4 py-2 text-xs font-black uppercase tracking-wide ${
                  activeFilter === filter
                    ? "bg-[#0094FF] text-white"
                    : "border border-[#1A2330] bg-[#10161E] text-[#9CA8B8]"
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
              className="rounded-xl border border-[#0094FF]/40 bg-[#0094FF] py-4 text-sm font-black uppercase tracking-[0.12em] text-white disabled:opacity-50"
            >
              {loading ? "Searching..." : "Search"}
            </button>

            <button
              onClick={clearSearch}
              className="rounded-xl border border-[#1A2330] bg-[#10161E] py-4 text-sm font-black uppercase tracking-[0.12em] text-[#9CA8B8]"
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
                  <MapPin size={24} className="text-[#0094FF]" />
                  <p className="mt-4 text-lg font-black">Map View</p>
                  <p className="mt-1 text-xs leading-5 text-[#9CA8B8]">
                    Browse pins visually.
                  </p>
                </GlassCard>
              </Link>

              <Link href="/conditions" className="block">
                <GlassCard className="h-[150px]">
                  <Waves size={24} className="text-[#0094FF]" />
                  <p className="mt-4 text-lg font-black">Conditions</p>
                  <p className="mt-1 text-xs leading-5 text-[#9CA8B8]">
                    Wind, swell, waves.
                  </p>
                </GlassCard>
              </Link>

              <GlassCard className="h-[150px]">
                <Ship size={24} className="text-[#0094FF]" />
                <p className="mt-4 text-lg font-black">Wrecks</p>
                <p className="mt-1 text-xs leading-5 text-[#9CA8B8]">
                  Historic dive sites.
                </p>
              </GlassCard>

              <Link href="/species" className="block">
                <GlassCard className="h-[150px]">
                  <Fish size={24} className="text-[#0094FF]" />
                  <p className="mt-4 text-lg font-black">Species</p>
                  <p className="mt-1 text-xs leading-5 text-[#9CA8B8]">
                    Marine life guide.
                  </p>
                </GlassCard>
              </Link>
            </section>

            {featuredBeaches.length > 0 && (
              <section className="mt-8">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-xs font-black uppercase tracking-[0.25em] text-[#0094FF]">
                    Top Beaches
                  </p>
                  <Star size={16} className="text-[#0094FF]" />
                </div>

                <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-3">
                  {featuredBeaches.map((beach) => (
                    <Link
                      key={beach.id}
                      href={`/beach/${beach.slug}`}
                      className="w-[240px] flex-shrink-0 snap-start"
                    >
                      <GlassCard className="h-[180px]">
                        <Waves size={24} className="text-[#0094FF]" />

                        <p className="mt-4 line-clamp-2 text-lg font-black leading-6">
                          {beach.name}
                        </p>

                        <p className="mt-2 text-xs leading-5 text-[#9CA8B8]">
                          {beach.town ? `${beach.town}, ` : ""}
                          {beach.region}
                        </p>

                        <p className="mt-3 text-xs font-black uppercase tracking-wide text-[#0094FF]">
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
                  <p className="text-xs font-black uppercase tracking-[0.25em] text-[#0094FF]">
                    Popular Dive Sites
                  </p>
                  <Anchor size={16} className="text-[#0094FF]" />
                </div>

                <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-3">
                  {featuredDiveSites.map((site) => (
                    <Link
                      key={site.id}
                      href={`/dive-site/${site.slug}`}
                      className="w-[240px] flex-shrink-0 snap-start"
                    >
                      <GlassCard className="h-[180px]">
                        <Compass size={24} className="text-[#0094FF]" />

                        <p className="mt-4 line-clamp-2 text-lg font-black leading-6">
                          {site.name}
                        </p>

                        <p className="mt-2 text-xs leading-5 text-[#9CA8B8]">
                          {site.category || site.site_type || "Dive Site"}
                          {site.region ? ` • ${site.region}` : ""}
                        </p>

                        <p className="mt-3 text-xs font-black uppercase tracking-wide text-[#0094FF]">
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
                <p className="mb-3 text-xs font-black uppercase tracking-[0.25em] text-[#0094FF]">
                  Beaches
                </p>

                <div className="grid gap-3">
                  {beaches.map((beach) => (
                    <Link key={beach.id} href={`/beach/${beach.slug}`}>
                      <GlassCard>
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#1A2330] bg-[#10161E]">
                            <Waves size={22} className="text-[#0094FF]" />
                          </div>

                          <div className="min-w-0">
                            <p className="truncate font-black">{beach.name}</p>
                            <p className="mt-1 truncate text-sm text-[#9CA8B8]">
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
                <p className="mb-3 text-xs font-black uppercase tracking-[0.25em] text-[#0094FF]">
                  Dive Sites
                </p>

                <div className="grid gap-3">
                  {diveSites.map((site) => (
                    <Link key={site.id} href={`/dive-site/${site.slug}`}>
                      <GlassCard>
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#1A2330] bg-[#10161E]">
                            <Compass size={22} className="text-[#0094FF]" />
                          </div>

                          <div className="min-w-0">
                            <p className="truncate font-black">{site.name}</p>
                            <p className="mt-1 truncate text-sm text-[#9CA8B8]">
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
            <p className="mt-2 text-sm text-[#9CA8B8]">
              Try a beach, town, region, reef, wreck, quarry or dive type.
            </p>
          </GlassCard>
        )}
      </AppScreen>
    </AuthGuard>
  );
}