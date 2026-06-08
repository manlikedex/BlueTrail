"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  Compass,
  House,
  Map,
  Shield,
  Store,
  User,
} from "lucide-react";

const items = [
  { href: "/app", icon: House, label: "Home" },
  { href: "/explore", icon: Compass, label: "Explore" },
  { href: "/map", icon: Map, label: "Map" },
  { href: "/track", icon: Activity, label: "Track" },
  { href: "/store", icon: Store, label: "Store" },
  { href: "/ocean-care", icon: Shield, label: "Protect" },
  { href: "/profile", icon: User, label: "Profile" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#1A2330] bg-[#05070A]/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-md items-center justify-between overflow-x-auto px-2 py-2">
        {items.map((item) => {
          const Icon = item.icon;
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex min-w-[54px] flex-col items-center justify-center gap-1 rounded-xl px-1 py-1 text-[9px] font-black uppercase tracking-[0.08em] transition ${
                active ? "text-[#0094FF]" : "text-[#7D8896]"
              }`}
            >
              <Icon size={20} strokeWidth={2.3} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}