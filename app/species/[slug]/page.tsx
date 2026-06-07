"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ExternalLink,
  Fish,
  Leaf,
  MapPin,
  Ruler,
  ShieldCheck,
  Star,
  Waves,
} from "lucide-react";
import AppScreen from "../../../components/AppScreen";
import AuthGuard from "../../../components/AuthGuard";
import GlassCard from "../../../components/ui/GlassCard";
import { supabase } from "../../../lib/supabase";

type Species = {
  id: number;
  common_name: string;
  slug: string;
  scientific_name: string | null;
  category: string | null;
  image_url: string | null;
  image_credit: string | null;
  image_source: string | null;
  source_url: string | null;
  description: string | null;
  min_depth: number | null;
  max_depth: number | null;
  best_months: string | null;
  conservation_status: string | null;
  uk_distribution?: string | null;
  common_uk_locations?: string | null;
  uk_habitat_notes?: string | null;
};

type SpeciesImage = {
  imageUrl: string;
  credit: string | null;
  source: string | null;
  sourceUrl: string | null;
};

type SpeciesLocation = {
  id: number;
  likelihood: string | null;
  notes: string | null;
  beaches: {
    id: number;
    name: string;
    slug: string;
    region: string | null;
  } | null;
  dive_sites: {
    id: number;
    name: string;
    slug: string;
    region: string | null;
    site_type: string | null;
  } | null;
};

type Hotspot = {
  id: number;
  location_name: string;
  region: string;
  hotspot_rating: number;
  notes: string | null;
};

export default function SpeciesDetailPage() {
  const { slug } = useParams();

  const [species, setSpecies] = useState<Species | null>(null);
  const [locations, setLocations] = useState<SpeciesLocation[]>([]);
  const [hotspots, setHotspots] = useState<Hotspot[]>([]);
  const [images, setImages] = useState<SpeciesImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<SpeciesImage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSpecies();
  }, [slug]);

  async function loadSpecies() {
    setLoading(true);

    const { data, error } = await supabase
      .from("species")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error || !data) {
      setSpecies(null);
      setLoading(false);
      return;
    }

    setSpecies(data);

    await Promise.all([
      loadLocations(data.id),
      loadHotspots(data.id),
      loadSpeciesImages(data),
    ]);

    setLoading(false);
  }

  async function loadSpeciesImages(speciesData: Species) {
    try {
      const params = new URLSearchParams({
        speciesId: String(speciesData.id),
        commonName: speciesData.common_name,
        scientificName: speciesData.scientific_name || "",
      });

      const res = await fetch(`/api/species-image?${params.toString()}`);
      const data = await res.json();

      const gallery: SpeciesImage[] = data.images || [];

      if (gallery.length > 0) {
        setImages(gallery);
        setSelectedImage(gallery[0]);
        return;
      }

      if (speciesData.image_url) {
        const fallback = {
          imageUrl: speciesData.image_url,
          credit: speciesData.image_credit,
          source: speciesData.image_source,
          sourceUrl: speciesData.source_url,
        };

        setImages([fallback]);
        setSelectedImage(fallback);
      }
    } catch {
      if (speciesData.image_url) {
        const fallback = {
          imageUrl: speciesData.image_url,
          credit: speciesData.image_credit,
          source: speciesData.image_source,
          sourceUrl: speciesData.source_url,
        };

        setImages([fallback]);
        setSelectedImage(fallback);
      }
    }
  }

  async function loadLocations(speciesId: number) {
    const { data } = await supabase
      .from("species_locations")
      .select(
        `
        id,
        likelihood,
        notes,
        beaches (
          id,
          name,
          slug,
          region
        ),
        dive_sites (
          id,
          name,
          slug,
          region,
          site_type
        )
      `
      )
      .eq("species_id", speciesId);

    setLocations((data as unknown as SpeciesLocation[]) || []);
  }

  async function loadHotspots(speciesId: number) {
    const { data } = await supabase
      .from("species_hotspots")
      .select("*")
      .eq("species_id", speciesId)
      .order("hotspot_rating", { ascending: false });

    setHotspots((data as Hotspot[]) || []);
  }

  function depthRange() {
    if (!species) return "Unknown";

    if (species.min_depth !== null && species.max_depth !== null) {
      return `${species.min_depth}m - ${species.max_depth}m`;
    }

    if (species.min_depth !== null) return `${species.min_depth}m+`;
    if (species.max_depth !== null) return `0m - ${species.max_depth}m`;

    return "Variable";
  }

  function likelihoodClass(value: string | null) {
    const likelihood = value?.toLowerCase() || "";

    if (likelihood.includes("very")) return "bg-[#0094FF] text-white";
    if (likelihood.includes("common")) {
      return "bg-[#0094FF]/20 text-[#7CC6FF]";
    }
    if (likelihood.includes("season")) {
      return "bg-yellow-400/20 text-[#F4D35E]";
    }
    if (likelihood.includes("rare")) {
      return "bg-red-400/20 text-[#FF5D5D]";
    }

    return "bg-white/10 text-[#9CA8B8]";
  }

  function starRating(rating: number) {
    const safeRating = Math.max(1, Math.min(5, rating || 3));
    return "★".repeat(safeRating) + "☆".repeat(5 - safeRating);
  }

  if (loading) {
    return (
      <AuthGuard>
        <AppScreen>
          <GlassCard>
            <p className="text-[#9CA8B8]">Loading species profile...</p>
          </GlassCard>
        </AppScreen>
      </AuthGuard>
    );
  }

  if (!species) {
    return (
      <AuthGuard>
        <AppScreen>
          <GlassCard>
            <h1 className="text-3xl font-black">Species not found</h1>
            <p className="mt-2 text-sm text-[#9CA8B8]">
              This species is not currently in the BlueTrail database.
            </p>
          </GlassCard>

          <Link
            href="/species"
            className="mt-5 block rounded-xl border border-[#0094FF]/40 bg-[#0094FF] px-5 py-4 text-center text-sm font-black uppercase tracking-[0.14em] text-white"
          >
            Back to Species Guide
          </Link>
        </AppScreen>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <AppScreen>
        <section>
          <p className="text-xs font-black uppercase tracking-[0.3em] text-[#0094FF]">
            Species Profile
          </p>

          <h1 className="mt-3 text-5xl font-black tracking-tight">
            {species.common_name}
          </h1>

          {species.scientific_name && (
            <p className="mt-2 text-sm italic text-[#9CA8B8]">
              {species.scientific_name}
            </p>
          )}
        </section>

        <GlassCard className="mt-6">
          {selectedImage ? (
            <>
              <img
                src={selectedImage.imageUrl}
                alt={species.common_name}
                className="h-72 w-full rounded-2xl object-cover"
              />

              {images.length > 1 && (
                <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                  {images.map((image, index) => (
                    <button
                      key={`${image.imageUrl}-${index}`}
                      onClick={() => setSelectedImage(image)}
                      className={`h-20 w-20 shrink-0 overflow-hidden rounded-xl border ${
                        selectedImage.imageUrl === image.imageUrl
                          ? "border-[#0094FF]"
                          : "border-[#1A2330]"
                      }`}
                    >
                      <img
                        src={image.imageUrl}
                        alt={`${species.common_name} ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="flex h-72 w-full items-center justify-center rounded-2xl border border-[#1A2330] bg-[#10161E]">
              <Fish className="text-[#0094FF]" size={64} />
            </div>
          )}

          <div className="mt-5">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-[#0094FF]">
              {species.category || "Marine Life"}
            </p>

            <p className="mt-3 text-xl font-black">About this species</p>

            <p className="mt-3 text-sm leading-6 text-[#9CA8B8]">
              {species.description || "No description added yet."}
            </p>

            {(selectedImage?.credit || selectedImage?.source) && (
              <p className="mt-4 text-xs leading-5 text-[#7D8896]">
                Image credit: {selectedImage.credit || "Unknown"}
                {selectedImage.source ? ` • Source: ${selectedImage.source}` : ""}
              </p>
            )}

            {selectedImage?.sourceUrl && (
              <a
                href={selectedImage.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-[#0094FF]"
              >
                View trusted source <ExternalLink size={14} />
              </a>
            )}
          </div>
        </GlassCard>

        <section className="mt-4 grid grid-cols-2 gap-3">
          <GlassCard>
            <div className="flex items-center gap-2">
              <Waves size={18} className="text-[#0094FF]" />
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#7D8896]">
                Best Months
              </p>
            </div>

            <p className="mt-3 text-xl font-black">
              {species.best_months || "Unknown"}
            </p>
          </GlassCard>

          <GlassCard>
            <div className="flex items-center gap-2">
              <Ruler size={18} className="text-[#0094FF]" />
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#7D8896]">
                Depth Range
              </p>
            </div>

            <p className="mt-3 text-xl font-black">{depthRange()}</p>
          </GlassCard>

          <GlassCard className="col-span-2">
            <div className="flex items-center gap-2">
              <ShieldCheck size={18} className="text-[#0094FF]" />
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#7D8896]">
                Conservation Status
              </p>
            </div>

            <p className="mt-3 text-2xl font-black text-[#7CC6FF]">
              {species.conservation_status || "Unknown"}
            </p>
          </GlassCard>
        </section>

        <GlassCard className="mt-4">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-[#0094FF]">
            UK Where To Find
          </p>

          <p className="mt-3 text-sm leading-6 text-[#9CA8B8]">
            {species.uk_distribution ||
              "UK distribution information is being added for this species."}
          </p>

          {species.common_uk_locations && (
            <>
              <p className="mt-4 text-sm font-black text-white">
                Common UK areas
              </p>
              <p className="mt-2 text-sm leading-6 text-[#9CA8B8]">
                {species.common_uk_locations}
              </p>
            </>
          )}

          {species.uk_habitat_notes && (
            <>
              <p className="mt-4 text-sm font-black text-white">
                Typical habitat
              </p>
              <p className="mt-2 text-sm leading-6 text-[#9CA8B8]">
                {species.uk_habitat_notes}
              </p>
            </>
          )}
        </GlassCard>

        <GlassCard className="mt-4">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#1A2330] bg-[#10161E]">
              <Leaf className="text-[#0094FF]" size={24} />
            </div>

            <div>
              <p className="text-xl font-black">Responsible viewing</p>

              <p className="mt-3 text-sm leading-6 text-[#9CA8B8]">
                Observe wildlife calmly, keep your distance, never chase or
                touch animals, and avoid disturbing habitats. Take photos, leave
                only bubbles.
              </p>
            </div>
          </div>
        </GlassCard>

        <section className="mt-6">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.25em] text-[#0094FF]">
            Best UK Locations
          </p>

          {hotspots.length > 0 ? (
            <div className="grid gap-3">
              {hotspots.map((spot) => (
                <GlassCard key={spot.id}>
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#1A2330] bg-[#10161E]">
                      <Star className="text-[#0094FF]" size={22} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-black">{spot.location_name}</p>
                          <p className="mt-1 text-sm text-[#9CA8B8]">
                            {spot.region}
                          </p>
                        </div>

                        <p className="shrink-0 text-sm text-[#0094FF]">
                          {starRating(spot.hotspot_rating)}
                        </p>
                      </div>

                      {spot.notes && (
                        <p className="mt-3 text-sm leading-6 text-[#9CA8B8]">
                          {spot.notes}
                        </p>
                      )}
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          ) : (
            <GlassCard>
              <p className="font-black">Hotspots being added</p>
              <p className="mt-2 text-sm leading-6 text-[#9CA8B8]">
                Best UK sighting areas for this species will appear here.
              </p>
            </GlassCard>
          )}
        </section>

        <section className="mt-6">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.25em] text-[#0094FF]">
            Linked BlueTrail Locations
          </p>

          <div className="grid gap-3">
            {locations.map((location) => {
              const beach = location.beaches;
              const site = location.dive_sites;

              if (beach) {
                return (
                  <Link key={location.id} href={`/beach/${beach.slug}`}>
                    <GlassCard>
                      <LocationRow
                        title={beach.name}
                        subtitle={`Beach ${
                          beach.region ? `• ${beach.region}` : ""
                        }`}
                        likelihood={location.likelihood}
                        notes={location.notes}
                        likelihoodClass={likelihoodClass}
                      />
                    </GlassCard>
                  </Link>
                );
              }

              if (site) {
                return (
                  <Link key={location.id} href={`/dive-site/${site.slug}`}>
                    <GlassCard>
                      <LocationRow
                        title={site.name}
                        subtitle={`${site.site_type || "Dive Site"}${
                          site.region ? ` • ${site.region}` : ""
                        }`}
                        likelihood={location.likelihood}
                        notes={location.notes}
                        likelihoodClass={likelihoodClass}
                      />
                    </GlassCard>
                  </Link>
                );
              }

              return null;
            })}
          </div>

          {locations.length === 0 && (
            <GlassCard>
              <p className="font-black">No linked locations yet</p>

              <p className="mt-2 text-sm leading-6 text-[#9CA8B8]">
                Once this species is connected to beaches and dive sites, those
                locations will appear here.
              </p>
            </GlassCard>
          )}
        </section>
      </AppScreen>
    </AuthGuard>
  );
}

function LocationRow({
  title,
  subtitle,
  likelihood,
  notes,
  likelihoodClass,
}: {
  title: string;
  subtitle: string;
  likelihood: string | null;
  notes: string | null;
  likelihoodClass: (value: string | null) => string;
}) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#1A2330] bg-[#10161E]">
        <MapPin className="text-[#0094FF]" size={22} />
      </div>

      <div className="min-w-0">
        <p className="truncate font-black">{title}</p>

        <p className="mt-1 text-sm text-[#9CA8B8]">{subtitle}</p>

        {likelihood && (
          <span
            className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-bold ${likelihoodClass(
              likelihood
            )}`}
          >
            {likelihood}
          </span>
        )}

        {notes && (
          <p className="mt-2 text-xs leading-5 text-[#7D8896]">{notes}</p>
        )}
      </div>
    </div>
  );
}