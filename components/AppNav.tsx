import Link from "next/link";

const navItems = [
  { href: "/app", label: "Feed", icon: "🏠" },
  { href: "/track", label: "Track", icon: "📍" },
  { href: "/explore", label: "Explore", icon: "🔎" },
  { href: "/ocean-care", label: "Care", icon: "🌊" },
  { href: "/profile", label: "Profile", icon: "👤" },
];

export default function AppNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-[#020D18]/90 px-2 pb-3 pt-2 backdrop-blur-xl">
      <div className="mx-auto grid max-w-md grid-cols-5 gap-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-col items-center justify-center rounded-2xl px-2 py-2 text-center text-xs font-bold text-cyan-100/70 transition hover:bg-white/5 hover:text-[#00D4C8]"
          >
            <span className="text-xl">{item.icon}</span>
            <span className="mt-1">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}