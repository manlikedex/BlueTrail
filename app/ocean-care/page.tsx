import Link from "next/link";
import {
  AlertTriangle,
  Fish,
  HeartHandshake,
  Leaf,
  Recycle,
  ShieldAlert,
  Waves,
} from "lucide-react";
import AppScreen from "../../components/AppScreen";
import AuthGuard from "../../components/AuthGuard";
import GlassCard from "../../components/ui/GlassCard";

const topics = [
  {
    title: "Marine Litter",
    icon: Recycle,
    emoji: "🗑️",
    text: "Plastic, fishing line, bottles, food wrappers and ghost gear can trap wildlife, be swallowed by marine animals, and break down into microplastics.",
    actions: [
      "Remove small litter if it is safe.",
      "Use gloves or a litter picker where possible.",
      "Never touch sharp, chemical or medical waste.",
      "Report large or dangerous waste.",
    ],
  },
  {
    title: "Sewage & Pollution",
    icon: ShieldAlert,
    emoji: "💩",
    text: "Sewage and chemical pollution can harm marine life, lower water quality, damage habitats and make swimmers, divers and beach users ill.",
    actions: [
      "Check pollution alerts before entering the water.",
      "Avoid water after heavy rain or known discharges.",
      "Report obvious sewage, oil, chemicals or dead fish.",
      "Do not enter polluted water.",
    ],
  },
  {
    title: "Ghost Nets & Fishing Line",
    icon: Fish,
    emoji: "🎣",
    text: "Lost fishing gear can keep catching animals for years. Seals, birds, fish, crabs and dolphins can become trapped or injured.",
    actions: [
      "Do not put yourself at risk removing heavy nets.",
      "Cut small loose line only if safe.",
      "Mark the location if possible.",
      "Report larger gear for proper removal.",
    ],
  },
  {
    title: "Habitats",
    icon: Leaf,
    emoji: "🪸",
    text: "Seagrass, kelp forests, reefs and rock pools support fish, crabs, lobster, cuttlefish, rays and many other species.",
    actions: [
      "Avoid trampling rock pools and seagrass.",
      "Do not anchor on sensitive habitats.",
      "Take photos, not wildlife.",
      "Leave rocks and animals where you found them.",
    ],
  },
];

const reportLinks = [
  {
    title: "Report water pollution",
    subtitle: "Environment Agency official reporting service",
    href: "https://www.gov.uk/report-water-pollution",
  },
  {
    title: "Report environmental incident",
    subtitle: "Pollution, chemicals, oil, dead fish or dumping",
    href: "https://www.gov.uk/report-environmental-problem",
  },
  {
    title: "Check sewage alerts",
    subtitle: "Surfers Against Sewage live sewage map",
    href: "https://datahq.sas.org.uk/sewage-data-hq/",
  },
  {
    title: "Injured wildlife advice",
    subtitle: "RSPCA wildlife help and reporting guidance",
    href: "https://www.rspca.org.uk/adviceandwelfare/wildlife/injured",
  },
];

export default function OceanCarePage() {
  return (
    <AuthGuard>
      <AppScreen>
        <header>
          <p className="text-xs font-black uppercase tracking-[0.25em] text-[#00D4C8]">
            Protect
          </p>

          <h1 className="mt-3 text-5xl font-black tracking-tight">
            Protect the Ocean.
          </h1>

          <p className="mt-3 text-sm leading-6 text-[#A9C7D8]">
            Learn what harms our seas, what to do if you find pollution, and how
            to report issues to the right organisations.
          </p>
        </header>

        <GlassCard className="mt-6">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-cyan-400/10">
              <Waves className="text-[#00D4C8]" size={28} />
            </div>

            <div>
              <p className="text-xl font-black">BlueTrail Ocean Promise</p>
              <p className="mt-2 text-sm leading-6 text-[#A9C7D8]">
                Enjoy the ocean, leave no trace, respect wildlife, report
                pollution, and help keep beaches, reefs and dive sites safe.
              </p>
            </div>
          </div>
        </GlassCard>

        <section className="mt-6 grid gap-4">
          {topics.map((topic) => {
            const Icon = topic.icon;

            return (
              <GlassCard key={topic.title}>
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-cyan-400/10 text-2xl">
                    {topic.emoji}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <Icon size={18} className="text-[#00D4C8]" />
                      <h2 className="text-xl font-black">{topic.title}</h2>
                    </div>

                    <p className="mt-3 text-sm leading-6 text-[#A9C7D8]">
                      {topic.text}
                    </p>

                    <div className="mt-4 grid gap-2">
                      {topic.actions.map((action) => (
                        <p
                          key={action}
                          className="rounded-2xl bg-[#020B14]/70 px-4 py-3 text-sm text-cyan-100"
                        >
                          ✓ {action}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </section>

        <section className="mt-8">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.25em] text-[#00D4C8]">
            Report Problems
          </p>

          <div className="grid gap-3">
            {reportLinks.map((link) => (
              <a key={link.href} href={link.href} target="_blank">
                <GlassCard>
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-400/10">
                      <AlertTriangle className="text-[#FF6B6B]" size={22} />
                    </div>

                    <div>
                      <p className="font-black">{link.title}</p>
                      <p className="mt-1 text-sm text-[#A9C7D8]">
                        {link.subtitle}
                      </p>
                    </div>
                  </div>
                </GlassCard>
              </a>
            ))}
          </div>
        </section>

        <GlassCard className="mt-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-green-400/10">
              <HeartHandshake className="text-[#9FFFE0]" size={24} />
            </div>

            <div>
              <p className="text-xl font-black">What BlueTrail users can do</p>
              <p className="mt-3 text-sm leading-6 text-[#A9C7D8]">
                Log reports, share visibility and pollution sightings, remove
                safe litter, join beach cleans, avoid disturbing wildlife and
                help build a better picture of UK water conditions.
              </p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="mt-4">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-[#00D4C8]">
            Safety First
          </p>

          <p className="mt-3 text-sm leading-6 text-white">
            Never risk your own safety to remove rubbish, nets or pollution. If
            something is heavy, sharp, chemical, medical, sewage-related, or near
            dangerous water, report it instead.
          </p>
        </GlassCard>

        <Link
          href="/map"
          className="mt-6 block rounded-3xl bg-[#00D4C8] px-6 py-4 text-center font-black text-[#020B14]"
        >
          Find beaches and dive sites
        </Link>
      </AppScreen>
    </AuthGuard>
  );
}