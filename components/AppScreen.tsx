"use client";

import SideMenu from "./SideMenu";
import BackButton from "./BackButton";
import AppUpdatePopup from "./AppUpdatePopup";

export default function AppScreen({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-[#05070A] text-white">
      <SideMenu />
      <AppUpdatePopup />

      <section className="mx-auto max-w-5xl px-4 pb-24 pt-6">
        <BackButton />
        {children}
      </section>
    </main>
  );
}