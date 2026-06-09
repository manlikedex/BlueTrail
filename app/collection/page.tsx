"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Camera,
  Fish,
  ImageIcon,
  Search,
  Video,
} from "lucide-react";
import AppScreen from "../../components/AppScreen";
import AuthGuard from "../../components/AuthGuard";
import GlassCard from "../../components/ui/GlassCard";
import { supabase } from "../../lib/supabase";

type CollectionItem = {
  id: number;
  image_url: string;
  edited_image_url: string | null;
  media_type: string;
  camera_mode: string | null;
  species_name: string | null;
  scientific_name: string | null;
  confidence: number | null;
  is_underwater_enhanced: boolean | null;
  created_at: string;
};

export default function CollectionPage() {
  const [items, setItems] = useState<CollectionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<
    "all" | "photos" | "videos" | "species"
  >("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadCollection();
  }, []);

  async function loadCollection() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from("dive_photos")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    setItems((data as CollectionItem[]) || []);
    setLoading(false);
  }

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        !search ||
        item.species_name
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        item.scientific_name
          ?.toLowerCase()
          .includes(search.toLowerCase());

      if (!matchesSearch) return false;

      if (filter === "photos") {
        return item.media_type === "photo";
      }

      if (filter === "videos") {
        return item.media_type === "video";
      }

      if (filter === "species") {
        return (
          item.species_name &&
          item.species_name !== "Unknown marine species"
        );
      }

      return true;
    });
  }, [items, filter, search]);

  const speciesCount = new Set(
    items
      .filter(
        (item) =>
          item.species_name &&
          item.species_name !== "Unknown marine species"
      )
      .map((item) => item.species_name)
  ).size;

  const photoCount = items.filter(
    (item) => item.media_type === "photo"
  ).length;

  const videoCount = items.filter(
    (item) => item.media_type === "video"
  ).length;

  return (
    <AuthGuard>
      <AppScreen>
        <header>
          <p className="text-xs font-black uppercase tracking-[0.3em] text-[#0094FF]">
            Collection
          </p>

          <h1 className="mt-3 text-5xl font-black tracking-tight">
            Marine Life Collection
          </h1>

          <p className="mt-3 text-sm leading-6 text-[#9CA8B8]">
            Every photo, video and species discovered during your dives.
          </p>
        </header>

        <section className="mt-6 grid grid-cols-3 gap-3">
          <GlassCard>
            <Fish className="text-[#0094FF]" size={22} />
            <p className="mt-3 text-xs text-[#9CA8B8]">Species</p>
            <p className="mt-1 text-2xl font-black">{speciesCount}</p>
          </GlassCard>

          <GlassCard>
            <ImageIcon className="text-[#0094FF]" size={22} />
            <p className="mt-3 text-xs text-[#9CA8B8]">Photos</p>
            <p className="mt-1 text-2xl font-black">{photoCount}</p>
          </GlassCard>

          <GlassCard>
            <Video className="text-[#0094FF]" size={22} />
            <p className="mt-3 text-xs text-[#9CA8B8]">Videos</p>
            <p className="mt-1 text-2xl font-black">{videoCount}</p>
          </GlassCard>
        </section>

        <div className="relative mt-6">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6F7A89]"
          />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search species..."
            className="w-full rounded-2xl border border-[#1A2330] bg-[#10161E] py-4 pl-12 pr-4 text-white outline-none"
          />
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {[
            ["all", "All"],
            ["photos", "Photos"],
            ["videos", "Videos"],
            ["species", "Species"],
          ].map(([value, label]) => (
            <button
              key={value}
              onClick={() => setFilter(value as any)}
              className={`rounded-xl px-4 py-3 text-xs font-black uppercase tracking-[0.14em] ${
                filter === value
                  ? "bg-[#0094FF] text-white"
                  : "bg-[#10161E] text-[#9CA8B8]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="mt-8 text-center text-[#9CA8B8]">
            Loading collection...
          </div>
        ) : filteredItems.length === 0 ? (
          <GlassCard className="mt-6">
            <p className="text-center text-[#9CA8B8]">
              No collection items found.
            </p>
          </GlassCard>
        ) : (
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredItems.map((item) => (
              <GlassCard key={item.id}>
                {item.media_type === "video" ? (
                  <video
                    src={item.image_url}
                    controls
                    className="h-[240px] w-full rounded-2xl object-cover"
                  />
                ) : (
                  <img
                    src={
                      item.edited_image_url ||
                      item.image_url
                    }
                    alt={item.species_name || "Collection item"}
                    className="h-[240px] w-full rounded-2xl object-cover"
                  />
                )}

                <div className="mt-4">
                  <div className="flex items-center gap-2">
                    {item.media_type === "video" ? (
                      <Video size={18} className="text-[#0094FF]" />
                    ) : (
                      <Camera size={18} className="text-[#0094FF]" />
                    )}

                    <p className="text-lg font-black">
                      {item.species_name || "Unknown marine species"}
                    </p>
                  </div>

                  {item.scientific_name && (
                    <p className="mt-1 text-sm italic text-[#9CA8B8]">
                      {item.scientific_name}
                    </p>
                  )}

                  <div className="mt-3 flex flex-wrap gap-2">
                    {item.camera_mode && (
                      <span className="rounded-lg bg-[#10161E] px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-[#9CA8B8]">
                        {item.camera_mode}
                      </span>
                    )}

                    {item.is_underwater_enhanced && (
                      <span className="rounded-lg bg-cyan-500/20 px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-cyan-300">
                        Underwater Enhanced
                      </span>
                    )}
                  </div>

                  {item.confidence !== null && (
                    <p className="mt-3 text-sm text-[#9CA8B8]">
                      Confidence: {item.confidence}%
                    </p>
                  )}

                  <p className="mt-2 text-sm text-[#6F7A89]">
                    {new Date(item.created_at).toLocaleDateString(
                      "en-GB"
                    )}
                  </p>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </AppScreen>
    </AuthGuard>
  );
}