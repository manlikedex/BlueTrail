"use client";

type TaggedAnimal = {
  id: number;
  name: string;
  species: string;
  animal_type: string;
  source: string | null;
  source_url: string | null;
  latitude: number;
  longitude: number;
  last_ping_at: string | null;
  status: string | null;
  notes: string | null;
};

function getPosition(lat: number, lon: number) {
  const minLat = 49;
  const maxLat = 61;
  const minLon = -11;
  const maxLon = 3;

  const x = ((lon - minLon) / (maxLon - minLon)) * 100;
  const y = 100 - ((lat - minLat) / (maxLat - minLat)) * 100;

  return {
    left: `${Math.max(2, Math.min(98, x))}%`,
    top: `${Math.max(2, Math.min(98, y))}%`,
  };
}

function markerColor(type: string) {
  const value = type.toLowerCase();

  if (value.includes("shark")) return "bg-red-500";
  if (value.includes("whale")) return "bg-[#0094FF]";
  if (value.includes("cetacean")) return "bg-purple-400";
  if (value.includes("turtle")) return "bg-green-400";

  return "bg-[#0094FF]";
}

export default function TaggedAnimalMap({
  animals,
}: {
  animals: TaggedAnimal[];
}) {
  return (
    <div className="relative mt-6 h-[460px] overflow-hidden rounded-3xl border border-[#1A2330] bg-[#05070A]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#0094FF18,transparent_55%)]" />

      <div className="absolute inset-5 rounded-[2rem] border border-[#1A2330] bg-[#0B0F14]" />

      <div className="absolute left-[43%] top-[22%] h-[56%] w-[22%] rounded-full border border-[#0094FF]/20 bg-[#0094FF]/5 blur-[1px]" />
      <div className="absolute left-[35%] top-[63%] h-[20%] w-[25%] rounded-full border border-[#0094FF]/20 bg-[#0094FF]/5 blur-[1px]" />

      <p className="absolute left-5 top-5 rounded-full border border-[#1A2330] bg-[#05070A]/80 px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-[#7D8896]">
        UK Live Tracking Layer
      </p>

      {animals.map((animal) => {
        const pos = getPosition(Number(animal.latitude), Number(animal.longitude));

        return (
          <div
            key={animal.id}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={pos}
            title={`${animal.name} - ${animal.species}`}
          >
            <div
              className={`h-4 w-4 rounded-full ${markerColor(
                animal.animal_type
              )} shadow-[0_0_18px_rgba(0,148,255,0.8)]`}
            />

            <div className="mt-2 min-w-[120px] rounded-xl border border-[#1A2330] bg-[#05070A]/95 p-2 text-xs shadow-xl">
              <p className="font-black text-white">{animal.name}</p>
              <p className="mt-1 text-[#9CA8B8]">{animal.species}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}