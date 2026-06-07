import Link from "next/link";
import {
  AlertTriangle,
  Anchor,
  Droplets,
  ExternalLink,
  Fish,
  HeartHandshake,
  Leaf,
  Recycle,
  ShieldAlert,
  Skull,
  Waves,
  Wind,
} from "lucide-react";
import AppScreen from "../../components/AppScreen";
import AuthGuard from "../../components/AuthGuard";
import GlassCard from "../../components/ui/GlassCard";

const facts = [
  {
    stat: "50%",
    label: "oxygen linked to the ocean",
    text: "Tiny marine plants called phytoplankton help produce around half of Earth’s oxygen.",
  },
  {
    stat: "90%",
    label: "excess heat absorbed",
    text: "The ocean absorbs most of the excess heat trapped by greenhouse gases.",
  },
  {
    stat: "30%",
    label: "CO₂ absorbed",
    text: "The ocean absorbs around a third of human carbon dioxide emissions.",
  },
  {
    stat: "11m",
    label: "tonnes of plastic yearly",
    text: "Millions of tonnes of plastic enter aquatic ecosystems every year.",
  },
];

const topics = [
  {
    title: "Plastic Pollution",
    icon: Recycle,
    emoji: "🗑️",
    text: "Plastic breaks down into microplastics that can be eaten by fish, shellfish, seabirds and marine mammals.",
    harm: [
      "Animals mistake plastic for food.",
      "Microplastics enter the food chain.",
      "Plastic can trap, injure or choke wildlife.",
    ],
    signs: [
      "Plastic bottles or bags on beaches.",
      "Fishing line tangled in rocks.",
      "Small plastic fragments in sand.",
    ],
    help: [
      "Take safe litter home.",
      "Use reusable bottles.",
      "Join beach cleans.",
    ],
  },
  {
    title: "Sewage & Pollution",
    icon: ShieldAlert,
    emoji: "💩",
    text: "Sewage can introduce bacteria, viruses, nutrients and chemicals into coastal waters.",
    harm: [
      "Can reduce oxygen in water.",
      "Can trigger algal blooms.",
      "Can make swimmers and divers ill.",
    ],
    signs: [
      "Brown or grey water.",
      "Bad sewage smell.",
      "Foam, slicks or dead fish.",
    ],
    help: [
      "Check alerts before entering water.",
      "Avoid polluted water.",
      "Report pollution incidents.",
    ],
  },
  {
    title: "Ghost Fishing Gear",
    icon: Skull,
    emoji: "🎣",
    text: "Lost nets, ropes and lines can continue trapping wildlife for years.",
    harm: [
      "Seals, dolphins and birds can become entangled.",
      "Fish and crabs can be repeatedly trapped.",
      "Gear can damage reefs and wrecks.",
    ],
    signs: [
      "Loose nets or rope.",
      "Line wrapped around kelp.",
      "Animals caught in gear.",
    ],
    help: [
      "Remove small loose line only if safe.",
      "Never pull heavy nets underwater.",
      "Record location and report it.",
    ],
  },
  {
    title: "Habitats",
    icon: Leaf,
    emoji: "🪸",
    text: "Seagrass, kelp, reefs and rock pools are homes, nurseries and feeding grounds for marine life.",
    harm: [
      "Anchors can rip up seagrass.",
      "Poor water quality blocks sunlight.",
      "Damaged habitats reduce biodiversity.",
    ],
    signs: [
      "Anchor scars.",
      "Broken reef life.",
      "Cloudy water or unusual algae.",
    ],
    help: [
      "Avoid anchoring in seagrass.",
      "Control buoyancy while diving.",
      "Do not disturb rock pools.",
    ],
  },
];

const reportLinks = [
  {
    title: "Report water pollution",
    subtitle: "Official GOV.UK water pollution reporting",
    href: "https://www.gov.uk/report-water-pollution",
  },
  {
    title: "Report environmental incident",
    subtitle: "Oil, chemicals, dead fish or illegal dumping",
    href: "https://www.gov.uk/report-environmental-problem",
  },
  {
    title: "Check sewage alerts",
    subtitle: "Surfers Against Sewage live sewage information",
    href: "https://datahq.sas.org.uk/sewage-data-hq/",
  },
  {
    title: "Injured wildlife advice",
    subtitle: "RSPCA guidance for injured wildlife",
    href: "https://www.rspca.org.uk/adviceandwelfare/wildlife/injured",
  },
];

export default function OceanCarePage() {
  return (
    <AuthGuard>
      <AppScreen>
        <header>
          <p className="text-xs font-black uppercase tracking-[0.3em] text-[#0094FF]">
            Ocean Protection Hub
          </p>

          <h1 className="mt-3 text-5xl font-black tracking-tight">
            Protect the ocean.
          </h1>

          <p className="mt-3 text-sm leading-6 text-[#9CA8B8]">
            Learn how ocean ecosystems support human life, how pollution damages
            marine habitats and what you can do to help.
          </p>
        </header>

        <GlassCard className="mt-6">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-[#0094FF]">
            Planet Support System
          </p>

          <h2 className="mt-3 text-3xl font-black tracking-tight">
            Protecting the ocean protects us.
          </h2>

          <p className="mt-3 text-sm leading-6 text-[#9CA8B8]">
            The ocean helps produce oxygen, regulate climate, create rainfall,
            feed communities, protect coastlines and support biodiversity.
          </p>
        </GlassCard>

        <section className="mt-4 grid grid-cols-2 gap-3">
          {facts.map((fact) => (
            <GlassCard key={fact.label} className="min-h-[190px]">
              <p className="text-4xl font-black text-[#0094FF]">{fact.stat}</p>
              <p className="mt-2 text-xs font-black uppercase tracking-[0.15em]">
                {fact.label}
              </p>
              <p className="mt-2 text-xs leading-5 text-[#9CA8B8]">
                {fact.text}
              </p>
            </GlassCard>
          ))}
        </section>

        <GlassCard className="mt-5">
          <div className="grid gap-3">
            <div className="rounded-xl border border-[#1A2330] bg-[#05070A] p-4">
              <div className="flex items-center gap-3">
                <Wind className="text-[#0094FF]" />
                <p className="font-black">Oxygen</p>
              </div>
              <p className="mt-2 text-sm leading-6 text-[#9CA8B8]">
                Ocean life plays a major role in producing the air we breathe.
              </p>
            </div>

            <div className="rounded-xl border border-[#1A2330] bg-[#05070A] p-4">
              <div className="flex items-center gap-3">
                <Droplets className="text-[#0094FF]" />
                <p className="font-black">Rainfall</p>
              </div>
              <p className="mt-2 text-sm leading-6 text-[#9CA8B8]">
                Ocean evaporation helps drive clouds, rain, rivers and
                freshwater supplies.
              </p>
            </div>

            <div className="rounded-xl border border-[#1A2330] bg-[#05070A] p-4">
              <div className="flex items-center gap-3">
                <Anchor className="text-[#0094FF]" />
                <p className="font-black">Coastal Protection</p>
              </div>
              <p className="mt-2 text-sm leading-6 text-[#9CA8B8]">
                Reefs, kelp, seagrass and salt marshes reduce erosion and wave
                impact.
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
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-[#1A2330] bg-[#10161E] text-2xl">
                    {topic.emoji}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <Icon size={18} className="text-[#0094FF]" />
                      <h2 className="text-xl font-black">{topic.title}</h2>
                    </div>

                    <p className="mt-3 text-sm leading-6 text-[#9CA8B8]">
                      {topic.text}
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid gap-3">
                  <InfoBlock
                    title="How it harms the ocean"
                    tone="danger"
                    items={topic.harm}
                  />
                  <InfoBlock
                    title="Warning signs"
                    tone="warning"
                    items={topic.signs}
                  />
                  <InfoBlock
                    title="How you can help"
                    tone="good"
                    items={topic.help}
                  />
                </div>
              </GlassCard>
            );
          })}
        </section>

        <GlassCard className="mt-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#1A2330] bg-[#10161E]">
              <HeartHandshake className="text-[#0094FF]" size={24} />
            </div>

            <div>
              <p className="text-xl font-black">Small actions scale</p>
              <p className="mt-3 text-sm leading-6 text-[#9CA8B8]">
                If thousands of BlueTrail users remove safe litter, report
                pollution and protect habitats, the combined impact becomes
                significant.
              </p>
            </div>
          </div>
        </GlassCard>

        <section className="mt-8">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.25em] text-[#0094FF]">
            Report Problems
          </p>

          <div className="grid gap-3">
            {reportLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer"
              >
                <GlassCard>
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#1A2330] bg-[#10161E]">
                      <AlertTriangle className="text-[#FF5D5D]" size={22} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="font-black">{link.title}</p>
                      <p className="mt-1 text-sm text-[#9CA8B8]">
                        {link.subtitle}
                      </p>
                    </div>

                    <ExternalLink size={16} className="text-[#7D8896]" />
                  </div>
                </GlassCard>
              </a>
            ))}
          </div>
        </section>

        <GlassCard className="mt-6">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-[#0094FF]">
            Safety First
          </p>

          <p className="mt-3 text-sm leading-6 text-white">
            Never risk your safety to remove rubbish, ghost gear or pollution.
            If something is heavy, sharp, chemical, sewage-related, underwater
            or near dangerous water, report it instead.
          </p>
        </GlassCard>

        <Link
          href="/map"
          className="mt-6 block rounded-xl border border-[#0094FF]/40 bg-[#0094FF] px-6 py-4 text-center text-sm font-black uppercase tracking-[0.14em] text-white"
        >
          Find beaches and dive sites
        </Link>
      </AppScreen>
    </AuthGuard>
  );
}

function InfoBlock({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "danger" | "warning" | "good";
}) {
  const styles = {
    danger: "border-red-400/20 bg-red-400/10 text-[#FF5D5D]",
    warning: "border-yellow-400/20 bg-yellow-400/10 text-[#F4D35E]",
    good: "border-[#0094FF]/20 bg-[#0094FF]/10 text-[#7CC6FF]",
  };

  return (
    <div className={`rounded-xl border p-4 ${styles[tone]}`}>
      <p className="font-black">{title}</p>

      <div className="mt-3 grid gap-2">
        {items.map((item) => (
          <p key={item} className="text-sm leading-6 text-white">
            • {item}
          </p>
        ))}
      </div>
    </div>
  );
}