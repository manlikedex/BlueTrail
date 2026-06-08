"use client";

import { useEffect } from "react";
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
  image_url?: string | null;
};

function markerColour(group: string) {
  const value = group.toLowerCase();

  if (value.includes("shark")) return "#EF4444";
  if (value.includes("whale")) return "#22D3EE";
  if (value.includes("cetacean")) return "#A78BFA";
  if (value.includes("seal")) return "#38BDF8";
  if (value.includes("turtle")) return "#34D399";
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

function FitBounds({ animals }: { animals: MarineSighting[] }) {
  const map = useMap();

  useEffect(() => {
    if (animals.length === 0) return;

    const bounds = animals.map((item) => [
      Number(item.latitude),
      Number(item.longitude),
    ]) as [number, number][];

    map.fitBounds(bounds, {
      padding: [40, 40],
      maxZoom: 8,
    });
  }, [map, animals]);

  return null;
}

export default function TaggedAnimalMap({
  animals,
}: {
  animals: MarineSighting[];
}) {
  return (
    <div className="mt-6 overflow-hidden rounded-3xl border border-[#1A2330] bg-[#05070A]">
      <div className="relative h-[540px]">
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

          <FitBounds animals={animals} />

          {animals.map((animal) => {
            const colour = markerColour(animal.species_group);

            return (
              <CircleMarker
                key={animal.id}
                center={[Number(animal.latitude), Number(animal.longitude)]}
                radius={8}
                pathOptions={{
                  color: "#FFFFFF",
                  weight: 1,
                  fillColor: colour,
                  fillOpacity: 0.9,
                }}
              >
                <Popup>
                  <div style={{ minWidth: 230 }}>
                    {animal.image_url && (
                      <img
                        src={animal.image_url}
                        alt={animal.common_name}
                        style={{
                          width: "100%",
                          height: 120,
                          objectFit: "cover",
                          borderRadius: 10,
                          marginBottom: 10,
                        }}
                      />
                    )}

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
                      Location: {animal.locality || "UK waters"}
                    </p>

                    <p style={{ margin: "6px 0" }}>
                      Observed: {formatDate(animal.observed_at)}
                    </p>

                    <p style={{ margin: "6px 0" }}>
                      Source: {animal.source || "Unknown"}
                    </p>

                    {animal.source_url && (
                      <a
                        href={animal.source_url}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          display: "inline-block",
                          marginTop: 8,
                          color: "#0094FF",
                          fontWeight: 800,
                          textDecoration: "none",
                        }}
                      >
                        View source →
                      </a>
                    )}
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
            UK Marine Sightings
          </p>
        </div>

        {animals.length === 0 && (
          <div className="absolute inset-0 z-[600] flex items-center justify-center bg-[#05070A]/80 backdrop-blur-sm">
            <div className="rounded-2xl border border-[#1A2330] bg-[#05070A] p-6 text-center">
              <p className="text-lg font-black text-white">
                No marine sightings loaded
              </p>
              <p className="mt-2 text-sm text-[#9CA8B8]">
                Refresh sightings or try another filter.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}