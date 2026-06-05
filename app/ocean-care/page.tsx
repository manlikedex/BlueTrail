import AppScreen from "../../components/AppScreen";

const reports = [
  "Plastic pollution",
  "Fishing line or nets",
  "Sewage or bad water quality",
  "Dead marine life",
  "Oil or fuel pollution",
  "Unsafe dive conditions",
  "Other rubbish",
];

export default function OceanCarePage() {
  return (
    <AppScreen>
      <h1 className="text-3xl font-black">Ocean Care</h1>
      <p className="mt-2 text-[#A9C7D8]">
        Report pollution, rubbish and unsafe water conditions.
      </p>

      <div className="mt-6 grid gap-3">
        {reports.map((report) => (
          <button
            key={report}
            className="rounded-3xl border border-white/10 bg-[#082C46]/80 p-5 text-left font-bold"
          >
            {report}
          </button>
        ))}
      </div>
    </AppScreen>
  );
}