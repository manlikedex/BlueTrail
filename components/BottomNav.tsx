"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  House,
  Waves,
  Compass,
  Map,
  User,
} from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();

  const items = [
    {
      href: "/app",
      icon: House,
      label: "Home",
    },
    {
      href: "/conditions",
      icon: Waves,
      label: "Sea",
    },
    {
      href: "/track",
      icon: Map,
      label: "Track",
    },
    {
      href: "/explore",
      icon: Compass,
      label: "Explore",
    },
    {
      href: "/profile",
      icon: User,
      label: "Profile",
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-[#02111D]/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-xl justify-around py-3">
        {items.map((item) => {
          const Icon = item.icon;

          const active =
            pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 ${
                active
                  ? "text-[#00D4C8]"
                  : "text-[#6B8292]"
              }`}
            >
              <Icon size={22} />
              <span className="text-[10px] font-bold">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}