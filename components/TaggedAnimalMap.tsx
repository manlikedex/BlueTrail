"use client";

import { useMemo } from "react";
import {
  CircleMarker,
  MapContainer,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

export type MarineSighting = {
  id: string;
  common_name: string;
  scientific_name: string;
  species_group: string;
  latitude: number;
  longitude: number;
  observed_at: string | null;
  locality: string | null;
  source: string | null;
  source_url: string | null;
};

function markerColour(group: string) {
  const value = group.toLowerCase();

  if (value.includes("shark")) return "#EF4444";
  if (value.includes("whale")) return "#22D3EE";
  if (value.includes("cetacean")) return "#A78BFA";

  return "#0094FF";
}

function formatDate(date: string | null) {
  if (!date) return "Unknown date";

  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function FitBounds({ sightings }: { sightings: MarineSighting[] }) {
  const map = useMap();

  useMemo(() => {
    if (sightings.length === 0) return;

    const bounds = sightings.map((item) => [
      Number(item.latitude),
      Number(item.longitude),
    ]) as [number, number][];

    map.fitBounds(bounds, {
      padding: [35, 35],
      maxZoom: 8,
    });
  }, [map, sightings]);

  return null;
}

export default function TaggedAnimalMap({
  animals,
}: {
  animals: MarineSighting[];
}) {
  return (
    <div className="mt-6 overflow-hidden rounded-3xl border border-[#1A2330] bg-[#05070A]">
      <div className="relative h-[520px]">
        <MapContainer
          center={[55.3, -4.5]}
          zoom={5}
          scrollWheelZoom
          className="h-full w-full"
          attributionControl={false}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            subdomains={["a", "b", "c", "d"]}
          />

          <FitBounds sightings={animals} />

          {animals.map((animal) => {
            const colour = markerColour(animal.species_group);

            return (
              <CircleMarker
                key={animal.id}
                center={[Number(animal.latitude), Number(animal.longitude)]}
                radius={7}
                pathOptions={{
                  color: "#FFFFFF",
                  weight: 1,
                  fillColor: colour,
                  fillOpacity: 0.85,
                }}
              >
                <Popup>
                  <div style={{ minWidth: 180 }}>
                    <p style={{ fontWeight: 800, margin: 0 }}>
                      {animal.common_name}
                    </p>

                    <p style={{ margin: "4px 0", fontStyle: "italic" }}>
                      {animal.scientific_name}
                    </p>

                    <p style={{ margin: "6px 0" }}>
                      Group: {animal.species_group}
                    </p>

                    <p style={{ margin: "6px 0" }}>
                      {animal.locality || "UK waters"}
                    </p>

                    <p style={{ margin: "6px 0" }}>
                      Observed: {formatDate(animal.observed_at)}
                    </p>

                    <p style={{ margin: "6px 0" }}>
                      {Number(animal.latitude).toFixed(3)},{" "}
                      {Number(animal.longitude).toFixed(3)}
                    </p>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>

        <div className="pointer-events-none absolute left-4 top-4 z-[500] rounded-2xl border border-[#1A2330] bg-[#05070A]/90 p-3 backdrop-blur-xl">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#7D8896]">
            Interactive Map
          </p>
          <p className="mt-1 text-sm font-black text-white">
            UK marine sightings
          </p>
        </div>

        <div className="pointer-events-none absolute bottom-4 left-4 z-[500] rounded-2xl border border-[#1A2330] bg-[#05070A]/90 p-3 backdrop-blur-xl">
          <div className="grid gap-2 text-[11px]">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-red-500" />
              <span className="text-[#9CA8B8]">Sharks</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-cyan-400" />
              <span className="text-[#9CA8B8]">Whales</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-purple-400" />
              <span className="text-[#9CA8B8]">Dolphins / Porpoises</span>
            </div>
          </div>
        </div>

        {animals.length === 0 && (
          <div className="absolute inset-0 z-[600] flex items-center justify-center bg-[#05070A]/80 backdrop-blur-sm">
            <div className="rounded-2xl border border-[#1A2330] bg-[#05070A] p-6 text-center">
              <p className="text-lg font-black text-white">
                No sightings loaded
              </p>
              <p className="mt-2 text-sm text-[#9CA8B8]">
                Refresh marine sightings to load occurrence data.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}