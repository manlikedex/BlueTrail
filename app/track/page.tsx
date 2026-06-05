import AppScreen from "../../components/AppScreen";

export default function TrackPage() {
  return (
    <AppScreen>
      <h1 className="text-3xl font-black">Track Session</h1>
      <p className="mt-2 text-[#A9C7D8]">
        GPS tracking and dive logging will be added here.
      </p>

      <section className="mt-8 rounded-[2rem] border border-white/10 bg-white/5 p-5">
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-[#00D4C8]">
            Current Session
          </p>
          <p className="mt-4 text-6xl font-black">00:00</p>
          <p className="text-[#A9C7D8]">Time in water</p>
        </div>

        <button className="mt-8 w-full rounded-3xl bg-[#00D4C8] py-4 font-black text-[#031B2E]">
          Start Tracking
        </button>
      </section>
    </AppScreen>
  );
}