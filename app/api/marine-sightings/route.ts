import { NextResponse } from "next/server";

const UK_WKT = "POLYGON((-11 49, 3 49, 3 61, -11 61, -11 49))";

const species = [
  { commonName: "Blue Shark", scientificName: "Prionace glauca", group: "Shark" },
  { commonName: "Basking Shark", scientificName: "Cetorhinus maximus", group: "Shark" },
  { commonName: "Minke Whale", scientificName: "Balaenoptera acutorostrata", group: "Whale" },
  { commonName: "Harbour Porpoise", scientificName: "Phocoena phocoena", group: "Cetacean" },
  { commonName: "Common Dolphin", scientificName: "Delphinus delphis", group: "Cetacean" },
  { commonName: "Bottlenose Dolphin", scientificName: "Tursiops truncatus", group: "Cetacean" },
];

export async function GET() {
  const allSightings = [];
  const debug: any[] = [];

  for (const item of species) {
    try {
      const url = new URL("https://api.obis.org/v3/occurrence");
      url.searchParams.set("scientificname", item.scientificName);
      url.searchParams.set("geometry", UK_WKT);
      url.searchParams.set("size", "50");

      const res = await fetch(url.toString(), {
        cache: "no-store",
      });

      const data = await res.json();
      const results = Array.isArray(data?.results) ? data.results : [];

      debug.push({
        species: item.commonName,
        status: res.status,
        count: results.length,
        url: url.toString(),
      });

      for (const record of results) {
        const lat = record.decimalLatitude ?? record.decimallatitude;
        const lon = record.decimalLongitude ?? record.decimallongitude;

        if (lat == null || lon == null) continue;

        allSightings.push({
          id: `${item.scientificName}-${record.id || record.occurrenceID || `${lat}-${lon}`}`,
          common_name: item.commonName,
          scientific_name: item.scientificName,
          species_group: item.group,
          latitude: Number(lat),
          longitude: Number(lon),
          observed_at: record.eventDate || record.date_year || null,
          locality:
            record.locality ||
            record.locationID ||
            `${Number(lat).toFixed(3)}, ${Number(lon).toFixed(3)}`,
          source: "OBIS",
          source_url: "https://obis.org",
        });
      }
    } catch (error) {
      debug.push({
        species: item.commonName,
        error: "Fetch failed",
      });
    }
  }

  return NextResponse.json({
    count: allSightings.length,
    sightings: allSightings,
    debug,
  });
}