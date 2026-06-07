import BottomNav from "./BottomNav";

export default function AppScreen({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#05070A] text-white">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top,#0A84FF22,transparent_35%),linear-gradient(180deg,#070A0F_0%,#05070A_45%,#020305_100%)]" />

      <div className="pointer-events-none fixed left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-[#0094FF]/50 to-transparent" />

      <div className="relative z-10 mx-auto min-h-screen w-full max-w-md px-4 pb-32 pt-6">
        {children}
      </div>

      <BottomNav />
    </main>
  );
}