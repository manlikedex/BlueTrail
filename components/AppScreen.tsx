import BottomNav from "./BottomNav";

export default function AppScreen({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#020B14] text-white">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top_left,#00D4C82A,transparent_35%),radial-gradient(circle_at_bottom_right,#0A5C7C55,transparent_35%),linear-gradient(180deg,#05263B_0%,#020B14_55%,#01060A_100%)]" />

      <div className="pointer-events-none fixed -top-24 right-0 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="pointer-events-none fixed bottom-0 left-0 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />

      <div className="relative z-10 mx-auto min-h-screen w-full max-w-md px-4 pb-32 pt-6">
        {children}
      </div>

      <BottomNav />
    </main>
  );
}