"use client";

import { useEffect } from "react";
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

export type RoutePoint = {
  id?: number;
  latitude: number;
  longitude: number;
  accuracy?: number | null;
  recorded_at?: string | null;
};

function FitRoute({ points }: { points: RoutePoint[] }) {
  const map = useMap();

  useEffect(() => {
    if (points.length === 0) return;

    const bounds = points.map((point) => [
      Number(point.latitude),
      Number(point.longitude),
    ]) as [number, number][];

    map.fitBounds(bounds, {
      padding: [35, 35],
      maxZoom: 16,
    });
  }, [map, points]);

  return null;
}

export default function DiveRouteMap({ points }: { points: RoutePoint[] }) {
  const route = points.map((point) => [
    Number(point.latitude),
    Number(point.longitude),
  ]) as [number, number][];

  const start = points[0];
  const end = points[points.length - 1];

  return (
    <div className="mt-4 overflow-hidden rounded-3xl border border-[#1A2330] bg-[#05070A]">
      <div className="relative h-[420px]">
        <MapContainer
          center={[50.266, -5.052]}
          zoom={11}
          scrollWheelZoom
          className="h-full w-full"
          attributionControl={false}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            subdomains={["a", "b", "c", "d"]}
          />

          <FitRoute points={points} />

          {route.length > 1 && (
            <Polyline
              positions={route}
              pathOptions={{
                color: "#0094FF",
                weight: 5,
                opacity: 0.9,
              }}
            />
          )}

          {start && (
            <Marker position={[Number(start.latitude), Number(start.longitude)]}>
              <Popup>Start point</Popup>
            </Marker>
          )}

          {end && points.length > 1 && (
            <Marker position={[Number(end.latitude), Number(end.longitude)]}>
              <Popup>End point</Popup>
            </Marker>
          )}
        </MapContainer>

        {points.length === 0 && (
          <div className="absolute inset-0 z-[500] flex items-center justify-center bg-[#05070A]/80 backdrop-blur-sm">
            <div className="rounded-2xl border border-[#1A2330] bg-[#05070A] p-5 text-center">
              <p className="font-black text-white">No route recorded</p>
              <p className="mt-2 text-sm text-[#9CA8B8]">
                GPS route points will appear here after tracking.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}