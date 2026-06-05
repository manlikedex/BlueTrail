import AppScreen from "../../components/AppScreen";
import Link from "next/link";

export default function AppHomePage() {
  return (
    <AppScreen>
      <header className="flex items-center justify-between">
        <div>
          <p className="text-sm text-cyan-100/60">Welcome back</p>
          <h1 className="text-3xl font-black text-[#9FFFE0]">BlueTrail</h1>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-xl">
          🌊
        </div>
      </header>

      <section className="mt-6 rounded-[2rem] border border-white/10 bg-white/5 p-5 backdrop-blur">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#00D4C8]">
          Next Dive
        </p>
        <h2 className="mt-3 text-2xl font-black">Ready to track?</h2>
        <p className="mt-2 text-sm leading-6 text-[#A9C7D8]">
          Start a freedive, snorkel or spearfishing session and log your route,
          descents, photos and notes.
        </p>

        <Link
          href="/track"
          className="mt-5 block rounded-3xl bg-[#00D4C8] px-6 py-4 text-center font-black text-[#031B2E]"
        >
          Start Session
        </Link>
      </section>

      <section className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-3xl border border-white/10 bg-[#082C46]/80 p-4">
          <p className="text-3xl font-black">0</p>
          <p className="mt-1 text-xs text-[#A9C7D8]">Dives logged</p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-[#082C46]/80 p-4">
          <p className="text-3xl font-black">0m</p>
          <p className="mt-1 text-xs text-[#A9C7D8]">Depth PB</p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-[#082C46]/80 p-4">
          <p className="text-3xl font-black">0</p>
          <p className="mt-1 text-xs text-[#A9C7D8]">Species seen</p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-[#082C46]/80 p-4">
          <p className="text-3xl font-black">0</p>
          <p className="mt-1 text-xs text-[#A9C7D8]">Care reports</p>
        </div>
      </section>

      <section className="mt-6">
        <h2 className="text-xl font-black">Ocean Care</h2>

        <div className="mt-3 rounded-[2rem] border border-cyan-500/20 bg-cyan-500/10 p-5">
          <p className="text-lg font-bold text-[#9FFFE0]">
            Protect your local waters
          </p>
          <p className="mt-2 text-sm leading-6 text-[#A9C7D8]">
            Report plastic, sewage, ghost nets and unsafe water conditions.
          </p>

          <Link
            href="/ocean-care"
            className="mt-4 block rounded-3xl border border-cyan-400/30 px-5 py-3 text-center text-sm font-bold text-cyan-100"
          >
            Create Report
          </Link>
        </div>
      </section>
    </AppScreen>
  );
}