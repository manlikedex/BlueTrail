"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/app", label: "Home", icon: "⌂" },
  { href: "/track", label: "Dive", icon: "◉" },
  { href: "/explore", label: "Explore", icon: "⌕" },
  { href: "/ocean-care", label: "Protect", icon: "♻" },
  { href: "/profile", label: "Profile", icon: "◌" },
];

export default function AppNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-4 left-0 right-0 z-50 px-4">
      <div className="mx-auto grid max-w-md grid-cols-5 gap-1 rounded-[2rem] border border-white/10 bg-[#04101C]/85 p-2 shadow-2xl shadow-black/40 backdrop-blur-2xl">
        {navItems.map((item) => {
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center rounded-[1.4rem] px-2 py-2 text-center text-[11px] font-bold transition ${
                active
                  ? "bg-[#00D4C8] text-[#020B14] shadow-lg shadow-cyan-400/30"
                  : "text-cyan-100/60 hover:bg-white/5 hover:text-cyan-100"
              }`}
            >
              <span className="text-lg leading-none">{item.icon}</span>
              <span className="mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}