import SideMenu from "./SideMenu";

export default function AppScreen({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#05070A] text-white">
      <div className="fixed inset-0 z-0 bg-[radial-gradient(circle_at_top,#0A84FF22,transparent_35%),linear-gradient(180deg,#070A0F_0%,#05070A_45%,#020305_100%)]" />

      <div className="relative z-20">
        <SideMenu />
      </div>

      <div className="relative z-10 mx-auto min-h-screen w-full max-w-md px-4 pb-10 pt-6">
        {children}
      </div>
    </main>
  );
}