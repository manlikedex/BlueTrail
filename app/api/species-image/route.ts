import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

type SpeciesImage = {
  imageUrl: string;
  credit: string | null;
  source: string | null;
  sourceUrl: string | null;
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const speciesId = searchParams.get("speciesId");
  const commonName = searchParams.get("commonName") || "";
  const scientificName = searchParams.get("scientificName") || "";

  if (!speciesId || (!commonName && !scientificName)) {
    return NextResponse.json(
      { error: "Missing speciesId or species name." },
      { status: 400 }
    );
  }

  const numericSpeciesId = Number(speciesId);

  const { data: cachedImages } = await supabaseAdmin
    .from("species_gallery")
    .select("*")
    .eq("species_id", numericSpeciesId)
    .order("id", { ascending: true });

  if (cachedImages && cachedImages.length > 0) {
    return NextResponse.json({
      images: cachedImages.map((image) => ({
        imageUrl: image.image_url,
        credit: image.image_credit,
        source: image.image_source,
        sourceUrl: image.source_url,
      })),
      cached: true,
    });
  }

  let images: SpeciesImage[] = [];

  if (scientificName) {
    images = await getINaturalistImages(scientificName);
  }

  if (images.length === 0 && commonName) {
    images = await getINaturalistImages(commonName);
  }

  if (images.length === 0 && scientificName) {
    images = await getWikipediaImage(scientificName);
  }

  if (images.length === 0 && commonName) {
    images = await getWikipediaImage(commonName);
  }

  if (images.length > 0) {
    await supabaseAdmin.from("species_gallery").insert(
      images.map((image) => ({
        species_id: numericSpeciesId,
        image_url: image.imageUrl,
        image_credit: image.credit,
        image_source: image.source,
        source_url: image.sourceUrl,
      }))
    );
  }

  return NextResponse.json({
    images,
    cached: false,
  });
}

async function getINaturalistImages(searchTerm: string): Promise<SpeciesImage[]> {
  try {
    const url = new URL("https://api.inaturalist.org/v1/taxa");
    url.searchParams.set("q", searchTerm);
    url.searchParams.set("per_page", "5");
    url.searchParams.set("rank", "species,subspecies");

    const response = await fetch(url.toString(), {
      next: { revalidate: 60 * 60 * 24 * 30 },
    });

    const data = await response.json();
    const results = data?.results || [];

    const exactMatch =
      results.find((item: any) =>
        item?.name?.toLowerCase() === searchTerm.toLowerCase()
      ) || results[0];

    if (!exactMatch?.default_photo?.medium_url) return [];

    const photos = exactMatch.taxon_photos || [];

    const images: SpeciesImage[] = photos
      .map((photo: any) => {
        const imageUrl =
          photo?.photo?.large_url ||
          photo?.photo?.medium_url ||
          photo?.photo?.url ||
          null;

        if (!imageUrl) return null;

        return {
          imageUrl,
          credit: photo?.photo?.attribution || exactMatch.name || searchTerm,
          source: "iNaturalist",
          sourceUrl: `https://www.inaturalist.org/taxa/${exactMatch.id}`,
        };
      })
      .filter(Boolean)
      .slice(0, 8);

    if (images.length > 0) return images;

    return [
      {
        imageUrl:
          exactMatch.default_photo.large_url ||
          exactMatch.default_photo.medium_url,
        credit: exactMatch.default_photo.attribution || exactMatch.name,
        source: "iNaturalist",
        sourceUrl: `https://www.inaturalist.org/taxa/${exactMatch.id}`,
      },
    ];
  } catch {
    return [];
  }
}

async function getWikipediaImage(searchTerm: string): Promise<SpeciesImage[]> {
  try {
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
      searchTerm
    )}`;

    const response = await fetch(url, {
      next: { revalidate: 60 * 60 * 24 * 30 },
    });

    if (!response.ok) return [];

    const data = await response.json();

    const imageUrl =
      data?.originalimage?.source || data?.thumbnail?.source || null;

    if (!imageUrl) return [];

    return [
      {
        imageUrl,
        credit: data?.title || searchTerm,
        source: "Wikipedia / Wikimedia",
        sourceUrl: data?.content_urls?.desktop?.page || null,
      },
    ];
  } catch {
    return [];
  }
}