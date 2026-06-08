"use client";

type MarineSighting = {
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

function getPosition(lat: number, lon: number) {
  const minLat = 49;
  const maxLat = 61;

  const minLon = -11;
  const maxLon = 3;

  const x = ((lon - minLon) / (maxLon - minLon)) * 100;
  const y = 100 - ((lat - minLat) / (maxLat - minLat)) * 100;

  return {
    left: `${Math.max(3, Math.min(97, x))}%`,
    top: `${Math.max(3, Math.min(97, y))}%`,
  };
}

function getColor(group: string) {
  switch (group.toLowerCase()) {
    case "shark":
      return "bg-red-500";

    case "whale":
      return "bg-cyan-400";

    case "cetacean":
      return "bg-purple-400";

    default:
      return "bg-[#0094FF]";
  }
}

export default function TaggedAnimalMap({
  animals,
}: {
  animals: MarineSighting[];
}) {
  return (
    <div className="relative mt-6 h-[520px] overflow-hidden rounded-3xl border border-[#1A2330] bg-[#05070A]">
      {/* Ocean background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#0094FF20,transparent_45%)]" />

      <div className="absolute inset-0 bg-[linear-gradient(180deg,#07121D_0%,#05070A_100%)]" />

      {/* UK silhouette approximation */}
      <div className="absolute left-[44%] top-[15%] h-[52%] w-[20%] rounded-[40%] border border-[#0094FF]/20 bg-[#0094FF]/5" />

      <div className="absolute left-[38%] top-[62%] h-[18%] w-[26%] rounded-[45%] border border-[#0094FF]/20 bg-[#0094FF]/5" />

      <div className="absolute right-5 top-5 rounded-full border border-[#1A2330] bg-[#05070A]/80 px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#7D8896]">
        UK Marine Sightings
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-20 rounded-2xl border border-[#1A2330] bg-[#05070A]/95 p-3 backdrop-blur-xl">
        <div className="grid gap-2 text-[11px]">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-red-500" />
            <span className="text-[#9CA8B8]">Sharks</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-cyan-400" />
            <span className="text-[#9CA8B8]">Whales</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-purple-400" />
            <span className="text-[#9CA8B8]">Dolphins / Porpoises</span>
          </div>
        </div>
      </div>

      {/* Markers */}
      {animals.map((animal) => {
        const position = getPosition(
          Number(animal.latitude),
          Number(animal.longitude)
        );

        return (
          <div
            key={animal.id}
            className="group absolute -translate-x-1/2 -translate-y-1/2"
            style={position}
          >
            {/* Pulse */}
            <div
              className={`absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-25 animate-ping ${getColor(
                animal.species_group
              )}`}
            />

            {/* Marker */}
            <div
              className={`relative z-10 h-4 w-4 rounded-full border-2 border-white shadow-[0_0_20px_rgba(0,148,255,0.6)] ${getColor(
                animal.species_group
              )}`}
            />

            {/* Popup */}
            <div className="pointer-events-none absolute left-1/2 top-6 z-20 hidden min-w-[220px] -translate-x-1/2 rounded-2xl border border-[#1A2330] bg-[#05070A]/95 p-3 shadow-2xl backdrop-blur-xl group-hover:block">
              <p className="font-black text-white">
                {animal.common_name}
              </p>

              <p className="mt-1 text-xs italic text-[#9CA8B8]">
                {animal.scientific_name}
              </p>

              <p className="mt-2 text-xs text-[#7CC6FF]">
                {animal.species_group}
              </p>

              <p className="mt-2 text-xs text-[#9CA8B8]">
                {animal.locality || "UK Waters"}
              </p>

              <p className="mt-1 text-xs text-[#9CA8B8]">
                {Number(animal.latitude).toFixed(3)},{" "}
                {Number(animal.longitude).toFixed(3)}
              </p>

              {animal.observed_at && (
                <p className="mt-2 text-xs text-[#9CA8B8]">
                  {new Date(animal.observed_at).toLocaleDateString("en-GB")}
                </p>
              )}
            </div>
          </div>
        );
      })}

      {/* Empty state */}
      {animals.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="rounded-2xl border border-[#1A2330] bg-[#05070A]/90 p-6 text-center backdrop-blur-xl">
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
  );
}