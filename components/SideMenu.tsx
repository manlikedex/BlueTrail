"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  Compass,
  Fish,
  House,
  Map,
  Shield,
  Store,
  User,
  Waves,
} from "lucide-react";

const menuItems = [
  {
    href: "/app",
    icon: House,
    label: "Home",
  },
  {
    href: "/explore",
    icon: Compass,
    label: "Explore",
  },
  {
    href: "/map",
    icon: Map,
    label: "Map",
  },
  {
    href: "/track",
    icon: Activity,
    label: "Dive Tracking",
  },
  {
    href: "/species",
    icon: Fish,
    label: "Species Guide",
  },
  {
    href: "/store",
    icon: Store,
    label: "Trail Tag Store",
  },
  {
    href: "/ocean-care",
    icon: Shield,
    label: "Protect Ocean",
  },
  {
    href: "/profile",
    icon: User,
    label: "Profile",
  },
];

export default function SideMenu() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* TOP BAR */}
      <header className="sticky top-0 z-[100] border-b border-[#1A2330] bg-[#05070A]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-20 w-full max-w-md items-center justify-between px-4">
          <button
            onClick={() => setOpen(true)}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#1A2330] bg-[#10161E] text-2xl font-black text-[#0094FF]"
          >
            ☰
          </button>

          <div className="text-center">
            <p className="text-xs font-black uppercase tracking-[0.35em] text-[#0094FF]">
              BLUETRAIL
            </p>
          </div>

          <div className="w-11" />
        </div>
      </header>

      {/* MENU */}
      {open && (
        <div
          className="fixed inset-0 z-[999999]"
          style={{
            position: "fixed",
            inset: 0,
          }}
        >
          {/* BACKDROP */}
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* DRAWER */}
          <div className="absolute left-0 top-0 h-screen w-[88%] max-w-[380px] border-r border-[#1A2330] bg-[#05070A] shadow-[0_0_80px_rgba(0,0,0,0.8)]">
            <div className="border-b border-[#1A2330] p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.35em] text-[#0094FF]">
                    BLUETRAIL
                  </p>

                  <p className="mt-2 text-sm text-[#7D8896]">
                    Ocean Intelligence Platform
                  </p>
                </div>

                <button
                  onClick={() => setOpen(false)}
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#1A2330] bg-[#10161E] text-xl text-[#0094FF]"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="overflow-y-auto p-4">
              <div className="grid gap-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;

                  const active =
                    pathname === item.href ||
                    pathname.startsWith(`${item.href}/`);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={`flex items-center gap-4 rounded-2xl border px-4 py-4 transition ${
                        active
                          ? "border-[#0094FF]/40 bg-[#0094FF]/10"
                          : "border-[#1A2330] bg-[#0B0F14]"
                      }`}
                    >
                      <div
                        className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                          active
                            ? "bg-[#0094FF]/15"
                            : "bg-[#10161E]"
                        }`}
                      >
                        <Icon
                          size={22}
                          className={
                            active
                              ? "text-[#0094FF]"
                              : "text-[#7D8896]"
                          }
                        />
                      </div>

                      <div>
                        <p
                          className={`text-sm font-black uppercase tracking-[0.12em] ${
                            active ? "text-white" : "text-[#C5D1DD]"
                          }`}
                        >
                          {item.label}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>

              <div className="mt-8 rounded-2xl border border-[#1A2330] bg-[#0B0F14] p-4">
                <p className="text-xs font-black uppercase tracking-[0.25em] text-[#0094FF]">
                  Trail Tag
                </p>

                <p className="mt-2 text-sm leading-6 text-[#9CA8B8]">
                  Dive tracking hardware coming soon. Sync your dives,
                  temperatures, depth profiles and underwater activity directly
                  into BlueTrail.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}