"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  Compass,
  House,
  Map,
  Satellite,
  Shield,
  Store,
  User,
} from "lucide-react";

const navItems = [
  { href: "/app", label: "Home", icon: House },
  { href: "/track", label: "Dive", icon: Activity },
  { href: "/explore", label: "Explore", icon: Compass },
  { href: "/map", label: "Map", icon: Map },
  { href: "/tagged-animals", label: "Tagged", icon: Satellite },
  { href: "/store", label: "Store", icon: Store },
  { href: "/ocean-care", label: "Protect", icon: Shield },
  { href: "/profile", label: "Profile", icon: User },
];

export default function AppNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-4 left-0 right-0 z-50 px-4">
      <div className="mx-auto flex max-w-md gap-2 overflow-x-auto rounded-[2rem] border border-[#1A2330] bg-[#05070A]/90 p-2 shadow-2xl shadow-black/40 backdrop-blur-2xl">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex min-w-[68px] flex-col items-center justify-center rounded-[1.4rem] px-2 py-2 text-center text-[10px] font-black uppercase tracking-[0.08em] transition ${
                active
                  ? "bg-[#0094FF] text-white shadow-lg shadow-[#0094FF]/25"
                  : "text-[#7D8896] hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon size={19} strokeWidth={2.4} />
              <span className="mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}