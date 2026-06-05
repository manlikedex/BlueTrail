export default function StatCard({
  value,
  label,
  icon,
}: {
  value: string;
  label: string;
  icon?: string;
}) {
  return (
    <div className="rounded-[1.6rem] border border-white/10 bg-[#071D2E]/90 p-4">
      <div className="text-xl">{icon}</div>
      <p className="mt-3 text-3xl font-black text-white">{value}</p>
      <p className="mt-1 text-xs font-medium text-[#A9C7D8]">{label}</p>
    </div>
  );
}