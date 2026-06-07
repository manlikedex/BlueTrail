export default function GlassCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-[#1A2330] bg-[#0B0F14] p-5 shadow-[0_0_40px_rgba(0,0,0,0.35)] ${className}`}
    >
      {children}
    </div>
  );
}