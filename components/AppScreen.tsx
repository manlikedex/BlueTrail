import AppNav from "./AppNav";

export default function AppScreen({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#031B2E] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#00D4C822,transparent_35%),linear-gradient(180deg,#053554_0%,#031B2E_45%,#020D18_100%)]" />
      <div className="relative z-10 mx-auto min-h-screen w-full max-w-md px-4 pb-28 pt-6">
        {children}
      </div>
      <AppNav />
    </main>
  );
}