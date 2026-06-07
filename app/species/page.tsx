"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Fish, Search } from "lucide-react";
import AppScreen from "../../components/AppScreen";
import AuthGuard from "../../components/AuthGuard";
import GlassCard from "../../components/ui/GlassCard";
import { supabase } from "../../lib/supabase";

type Species = {
  id: number;
  common_name: string;
  slug: string;
  scientific_name: string | null;
  category: string | null;
  image_url: string | null;
  description: string | null;
  best_months: string | null;
  conservation_status: string | null;
};

type SpeciesPreviewImage = {
  species_id: number;
  image_url: string;
};

const categoryOrder = [
  "Marine Mammal",
  "Shark",
  "Ray",
  "Fish",
  "Flatfish",
  "Crustacean",
  "Cephalopod",
  "Jellyfish",
  "Echinoderm",
  "Anemone",
  "Soft Coral",
  "Nudibranch",
  "Habitat",
];

export default function SpeciesPage() {
  const [species, setSpecies] = useState<Species[]>([]);
  const [previewImages, setPreviewImages] = useState<SpeciesPreviewImage[]>([]);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSpecies();
  }, []);

  async function loadSpecies() {
    setLoading(true);

    const { data, error } = await supabase
      .from("species")
      .select("*")
      .order("category", { ascending: true })
      .order("common_name", { ascending: true });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    const speciesData = data || [];
    setSpecies(speciesData);
    await loadPreviewImages(speciesData.map((item) => item.id));

    setLoading(false);
  }

  async function loadPreviewImages(speciesIds: number[]) {
    if (speciesIds.length === 0) {
      setPreviewImages([]);
      return;
    }

    const { data } = await supabase
      .from("species_gallery")
      .select("species_id,image_url")
      .in("species_id", speciesIds);

    setPreviewImages((data as SpeciesPreviewImage[]) || []);
  }

  function getPreviewImage(speciesId: number, fallback: string | null) {
    return (
      previewImages.find((image) => image.species_id === speciesId)
        ?.image_url ||
      fallback ||
      null
    );
  }

  const categories = [
    "All",
    ...categoryOrder.filter((category) =>
      species.some((item) => item.category === category)
    ),
    ...Array.from(
      new Set(
        species
          .map((item) => item.category || "Other")
          .filter((category) => !categoryOrder.includes(category))
      )
    ),
  ];

  const filteredSpecies = species.filter((item) => {
    const search = query.toLowerCase();

    const matchesSearch =
      item.common_name.toLowerCase().includes(search) ||
      item.scientific_name?.toLowerCase().includes(search) ||
      item.category?.toLowerCase().includes(search);

    const matchesCategory =
      activeCategory === "All" ||
      (item.category || "Other") === activeCategory;

    return matchesSearch && matchesCategory;
  });

  const groupedSpecies = categories
    .filter((category) => category !== "All")
    .map((category) => ({
      category,
      items: filteredSpecies.filter(
        (item) => (item.category || "Other") === category
      ),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <AuthGuard>
      <AppScreen>
        <header>
          <p className="text-xs font-black uppercase tracking-[0.3em] text-[#0094FF]">
            Species
          </p>

          <h1 className="mt-3 text-5xl font-black tracking-tight">
            Marine life guide.
          </h1>

          <p className="mt-3 text-sm leading-6 text-[#9CA8B8]">
            Browse UK marine life by category, discover what you might see, and
            learn where different species are commonly found.
          </p>
        </header>

        <GlassCard className="mt-6">
          <div className="flex items-center gap-3 rounded-xl border border-[#1A2330] bg-[#05070A] px-4 py-3">
            <Search size={20} className="text-[#0094FF]" />

            <input
              className="w-full bg-transparent text-white outline-none placeholder:text-[#6F7A89]"
              placeholder="Search seal, shark, lobster, wrasse..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`shrink-0 rounded-xl px-4 py-2 text-xs font-black uppercase tracking-wide ${
                  activeCategory === category
                    ? "bg-[#0094FF] text-white"
                    : "border border-[#1A2330] bg-[#10161E] text-[#9CA8B8]"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </GlassCard>

        {loading && (
          <GlassCard className="mt-6">
            <p className="text-[#9CA8B8]">Loading species...</p>
          </GlassCard>
        )}

        {!loading && filteredSpecies.length === 0 && (
          <GlassCard className="mt-6">
            <p className="font-black">No species found</p>
            <p className="mt-2 text-sm text-[#9CA8B8]">
              Try another species, category or common name.
            </p>
          </GlassCard>
        )}

        {!loading && groupedSpecies.length > 0 && (
          <section className="mt-6 grid gap-8">
            {groupedSpecies.map((group) => (
              <div key={group.category}>
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-xs font-black uppercase tracking-[0.25em] text-[#0094FF]">
                    {group.category}
                  </p>

                  <p className="text-xs font-black uppercase tracking-[0.16em] text-[#7D8896]">
                    {group.items.length}
                  </p>
                </div>

                <div className="grid gap-3">
                  {group.items.map((item) => {
                    const imageUrl = getPreviewImage(item.id, item.image_url);

                    return (
                      <Link key={item.id} href={`/species/${item.slug}`}>
                        <GlassCard>
                          <div className="flex items-start gap-4">
                            {imageUrl ? (
                              <img
                                src={imageUrl}
                                alt={item.common_name}
                                className="h-20 w-20 shrink-0 rounded-xl object-cover"
                              />
                            ) : (
                              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl border border-[#1A2330] bg-[#10161E]">
                                <Fish className="text-[#0094FF]" size={30} />
                              </div>
                            )}

                            <div className="min-w-0">
                              <p className="text-xl font-black">
                                {item.common_name}
                              </p>

                              {item.scientific_name && (
                                <p className="mt-1 text-sm italic text-[#9CA8B8]">
                                  {item.scientific_name}
                                </p>
                              )}

                              <p className="mt-2 text-xs font-black uppercase tracking-wide text-[#0094FF]">
                                {item.best_months || "Season varies"}
                                {item.conservation_status
                                  ? ` • ${item.conservation_status}`
                                  : ""}
                              </p>

                              {item.description && (
                                <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#9CA8B8]">
                                  {item.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </GlassCard>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </section>
        )}
      </AppScreen>
    </AuthGuard>
  );
}