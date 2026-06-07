"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, House, Map, Shield, User } from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();

  const items = [
    { href: "/app", icon: House, label: "Home" },
    { href: "/explore", icon: Compass, label: "Explore" },
    { href: "/map", icon: Map, label: "Map" },
    { href: "/ocean-care", icon: Shield, label: "Protect" },
    { href: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#1A2330] bg-[#05070A]/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-md justify-around px-3 py-3">
        {items.map((item) => {
          const Icon = item.icon;
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex min-w-[56px] flex-col items-center gap-1 rounded-xl px-2 py-1 text-[10px] font-black uppercase tracking-wide transition ${
                active ? "text-[#0094FF]" : "text-[#7D8896]"
              }`}
            >
              <Icon size={21} strokeWidth={2.2} />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}