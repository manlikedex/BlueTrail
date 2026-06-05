"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { supabase } from "../lib/supabase";

type Beach = {
  id: number;
  name: string;
  slug: string;
  town: string | null;
  region: string | null;
  latitude: number;
  longitude: number;
};

const beachIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function BeachMap() {
  const [beaches, setBeaches] = useState<Beach[]>([]);

  useEffect(() => {
    loadBeaches();
  }, []);

  async function loadBeaches() {
    const { data, error } = await supabase
      .from("beaches")
      .select("id,name,slug,town,region,latitude,longitude")
      .limit(500);

    if (!error) {
      setBeaches(data || []);
    }
  }

  return (
    <div className="mt-5 overflow-hidden rounded-[2rem] border border-white/10">
      <MapContainer
        center={[50.4169, -5.1003]}
        zoom={9}
        scrollWheelZoom
        className="h-[520px] w-full"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {beaches.map((beach) => (
          <Marker
            key={beach.id}
            position={[Number(beach.latitude), Number(beach.longitude)]}
            icon={beachIcon}
          >
            <Popup>
              <div>
                <strong>{beach.name}</strong>
                <p>
                  {beach.town ? `${beach.town}, ` : ""}
                  {beach.region}
                </p>
                <Link href={`/beach/${beach.slug}`}>View forecast</Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}