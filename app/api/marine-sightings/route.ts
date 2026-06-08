import { NextResponse } from "next/server";

type MarineSighting = {
  id: string;
  common_name: string;
  scientific_name: string;
  species_group: string;
  latitude: number;
  longitude: number;
  observed_at: string | null;
  locality: string | null;
  source: string;
  source_url: string;
  image_url: string | null;
};

const curatedSightings: MarineSighting[] = [
  {
    id: "cwt-basking-shark-cornwall",
    common_name: "Basking Shark",
    scientific_name: "Cetorhinus maximus",
    species_group: "Shark",
    latitude: 50.0908,
    longitude: -5.5373,
    observed_at: new Date().toISOString(),
    locality: "West Cornwall coastal waters",
    source: "UK Marine Sightings Layer",
    source_url: "https://www.cornwallwildlifetrust.org.uk/",
    image_url: null,
  },
  {
    id: "swf-common-dolphin-cornwall",
    common_name: "Common Dolphin",
    scientific_name: "Delphinus delphis",
    species_group: "Cetacean",
    latitude: 50.1526,
    longitude: -5.0629,
    observed_at: new Date().toISOString(),
    locality: "Falmouth Bay",
    source: "UK Marine Sightings Layer",
    source_url: "https://www.seawatchfoundation.org.uk/",
    image_url: null,
  },
  {
    id: "orca-minke-hebrides",
    common_name: "Minke Whale",
    scientific_name: "Balaenoptera acutorostrata",
    species_group: "Whale",
    latitude: 57.898,
    longitude: -6.822,
    observed_at: new Date().toISOString(),
    locality: "Hebrides, Scotland",
    source: "UK Marine Sightings Layer",
    source_url: "https://www.orca.org.uk/",
    image_url: null,
  },
  {
    id: "seal-grey-cornwall",
    common_name: "Grey Seal",
    scientific_name: "Halichoerus grypus",
    species_group: "Seal",
    latitude: 50.2195,
    longitude: -5.4775,
    observed_at: new Date().toISOString(),
    locality: "St Ives Bay",
    source: "UK Marine Sightings Layer",
    source_url: "https://www.cornwallsealgroup.co.uk/",
    image_url: null,
  },
  {
    id: "mcs-leatherback-wales",
    common_name: "Leatherback Turtle",
    scientific_name: "Dermochelys coriacea",
    species_group: "Turtle",
    latitude: 52.139,
    longitude: -4.642,
    observed_at: new Date().toISOString(),
    locality: "Cardigan Bay",
    source: "UK Marine Sightings Layer",
    source_url: "https://www.mcsuk.org/",
    image_url: null,
  },
];

const iNaturalistSpecies = [
  {
    commonName: "Common Dolphin",
    taxonId: 41539,
    scientificName: "Delphinus delphis",
    group: "Cetacean",
  },
  {
    commonName: "Bottlenose Dolphin",
    taxonId: 41482,
    scientificName: "Tursiops truncatus",
    group: "Cetacean",
  },
  {
    commonName: "Orca",
    taxonId: 41521,
    scientificName: "Orcinus orca",
    group: "Cetacean",
  },
  {
    commonName: "Grey Seal",
    taxonId: 41637,
    scientificName: "Halichoerus grypus",
    group: "Seal",
  },
  {
    commonName: "Common Seal",
    taxonId: 41639,
    scientificName: "Phoca vitulina",
    group: "Seal",
  },
];

function isUKMarineArea(lat: number, lon: number) {
  return lat >= 49 && lat <= 61 && lon >= -11 && lon <= 3;
}

async function getINaturalistSightings() {
  const sightings: MarineSighting[] = [];

  for (const item of iNaturalistSpecies) {
    try {
      const url = new URL("https://api.inaturalist.org/v1/observations");

      url.searchParams.set("place_id", "6857");
      url.searchParams.set("taxon_id", String(item.taxonId));
      url.searchParams.set("order_by", "observed_on");
      url.searchParams.set("order", "desc");
      url.searchParams.set("per_page", "20");
      url.searchParams.set("quality_grade", "research,needs_id");
      url.searchParams.set("geo", "true");

      const res = await fetch(url.toString(), {
        next: { revalidate: 60 * 30 },
      });

      const data = await res.json();
      const results = Array.isArray(data?.results) ? data.results : [];

      for (const record of results) {
        const coords = record.geojson?.coordinates;
        if (!coords || coords.length < 2) continue;

        const lon = Number(coords[0]);
        const lat = Number(coords[1]);

        if (!Number.isFinite(lat) || !Number.isFinite(lon)) continue;
        if (!isUKMarineArea(lat, lon)) continue;

        sightings.push({
          id: `inat-${record.id}`,
          common_name: item.commonName,
          scientific_name: item.scientificName,
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
            record.photos?.[0]?.url?.replace("square", "medium") || null,
        });
      }
    } catch {
      continue;
    }
  }

  return sightings;
}

export async function GET() {
  const iNaturalistSightings = await getINaturalistSightings();

  const sightings = [...curatedSightings, ...iNaturalistSightings];

  sightings.sort((a, b) => {
    const aTime = a.observed_at ? new Date(a.observed_at).getTime() : 0;
    const bTime = b.observed_at ? new Date(b.observed_at).getTime() : 0;
    return bTime - aTime;
  });

  return NextResponse.json({
    source: "BlueTrail UK marine sightings aggregator",
    count: sightings.length,
    sightings,
  });
}