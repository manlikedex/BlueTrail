import AppScreen from "../../components/AppScreen";

export default function ExplorePage() {
  return (
    <AppScreen>
      <h1 className="text-3xl font-black">Explore</h1>
      <p className="mt-2 text-[#A9C7D8]">
        Discover species, hotspots, dive sites and local conditions.
      </p>

      <div className="mt-6 grid gap-3">
        {["Species near me", "Dive hotspots", "Spearfishing rules", "Marine protected areas"].map(
          (item) => (
            <div
              key={item}
              className="rounded-3xl border border-white/10 bg-[#082C46]/80 p-5 font-bold"
            >
              {item}
            </div>
          )
        )}
      </div>
    </AppScreen>
  );
}