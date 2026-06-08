import { NextResponse } from "next/server";

const UK_PLACE_ID = "6857";

const species = [
  { commonName: "Blue Shark", scientificName: "Prionace glauca", group: "Shark" },
  { commonName: "Basking Shark", scientificName: "Cetorhinus maximus", group: "Shark" },
  { commonName: "Ocean Sunfish", scientificName: "Mola mola", group: "Fish" },
  { commonName: "Minke Whale", scientificName: "Balaenoptera acutorostrata", group: "Whale" },
  { commonName: "Fin Whale", scientificName: "Balaenoptera physalus", group: "Whale" },
  { commonName: "Humpback Whale", scientificName: "Megaptera novaeangliae", group: "Whale" },
  { commonName: "Harbour Porpoise", scientificName: "Phocoena phocoena", group: "Cetacean" },
  { commonName: "Common Dolphin", scientificName: "Delphinus delphis", group: "Cetacean" },
  { commonName: "Bottlenose Dolphin", scientificName: "Tursiops truncatus", group: "Cetacean" },
  { commonName: "Orca", scientificName: "Orcinus orca", group: "Cetacean" },
  { commonName: "Grey Seal", scientificName: "Halichoerus grypus", group: "Seal" },
  { commonName: "Common Seal", scientificName: "Phoca vitulina", group: "Seal" },
  { commonName: "Leatherback Turtle", scientificName: "Dermochelys coriacea", group: "Turtle" },
];

export async function GET() {
  const allSightings = [];
  const debug = [];

  for (const item of species) {
    try {
      const url = new URL("https://api.inaturalist.org/v1/observations");

      url.searchParams.set("place_id", UK_PLACE_ID);
      url.searchParams.set("taxon_name", item.scientificName);
      url.searchParams.set("order_by", "observed_on");
      url.searchParams.set("order", "desc");
      url.searchParams.set("per_page", "30");
      url.searchParams.set("quality_grade", "research,needs_id");

      const res = await fetch(url.toString(), {
        next: { revalidate: 60 * 30 },
      });

      const data = await res.json();
      const results = Array.isArray(data?.results) ? data.results : [];

      debug.push({
        species: item.commonName,
        status: res.status,
        count: results.length,
      });

      for (const record of results) {
        const coords = record.geojson?.coordinates;

        if (!coords || coords.length < 2) continue;

        const lon = Number(coords[0]);
        const lat = Number(coords[1]);

        if (!lat || !lon) continue;

        allSightings.push({
          id: `inat-${record.id}`,
          common_name:
            record.taxon?.preferred_common_name ||
            item.commonName,
          scientific_name:
            record.taxon?.name ||
            item.scientificName,
          species_group: item.group,
          latitude: lat,
          longitude: lon,
          observed_at:
            record.observed_on ||
            record.time_observed_at ||
            record.created_at ||
            null,
          locality:
            record.place_guess ||
            `${lat.toFixed(3)}, ${lon.toFixed(3)}`,
          source: "iNaturalist",
          source_url: record.uri || "https://www.inaturalist.org",
          image_url:
            record.photos?.[0]?.url?.replace("square", "medium") ||
            null,
        });
      }
    } catch {
      debug.push({
        species: item.commonName,
        error: "Fetch failed",
      });
    }
  }

  allSightings.sort((a, b) => {
    const aTime = a.observed_at ? new Date(a.observed_at).getTime() : 0;
    const bTime = b.observed_at ? new Date(b.observed_at).getTime() : 0;
    return bTime - aTime;
  });

  return NextResponse.json({
    source: "iNaturalist",
    count: allSightings.length,
    sightings: allSightings,
    debug,
  });
}