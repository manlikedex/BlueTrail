import Link from "next/link";
import AppScreen from "../../components/AppScreen";
import AuthGuard from "../../components/AuthGuard";
import GlassCard from "../../components/ui/GlassCard";

export default function ExplorePage() {
  return (
    <AuthGuard>
      <AppScreen>
        <header>
          <p className="text-xs font-black uppercase tracking-[0.25em] text-[#00D4C8]">
            Explore
          </p>

          <h1 className="mt-3 text-5xl font-black tracking-tight">
            Find the best water.
          </h1>

          <p className="mt-3 text-sm leading-6 text-[#A9C7D8]">
            Search beaches, check live conditions, discover species and explore
            safe places to dive.
          </p>
        </header>

        <section className="mt-6 grid gap-4">
          <Link href="/conditions">
            <GlassCard>
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400/10 text-3xl">
                  🌊
                </div>

                <div>
                  <p className="text-xl font-black">Sea Conditions</p>
                  <p className="mt-1 text-sm text-[#A9C7D8]">
                    Search beaches for wave, swell, wind and visibility data.
                  </p>
                </div>
              </div>
            </GlassCard>
          </Link>

          <GlassCard>
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400/10 text-3xl">
                🐠
              </div>

              <div>
                <p className="text-xl font-black">Species Explorer</p>
                <p className="mt-1 text-sm text-[#A9C7D8]">
                  Discover what marine life can be found by area.
                </p>
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400/10 text-3xl">
                ⚖️
              </div>

              <div>
                <p className="text-xl font-black">Spearfishing Rules</p>
                <p className="mt-1 text-sm text-[#A9C7D8]">
                  Regional laws, protected species and minimum sizes.
                </p>
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400/10 text-3xl">
                📍
              </div>

              <div>
                <p className="text-xl font-black">Hotspots</p>
                <p className="mt-1 text-sm text-[#A9C7D8]">
                  Dive spots, reefs, beach entries and community reports.
                </p>
              </div>
            </div>
          </GlassCard>
        </section>
      </AppScreen>
    </AuthGuard>
  );
}