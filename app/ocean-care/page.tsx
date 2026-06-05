import Link from "next/link";
import {
  AlertTriangle,
  Fish,
  HeartHandshake,
  Leaf,
  Recycle,
  ShieldAlert,
  Waves,
  Wind,
  Droplets,
  Skull,
  Anchor,
  Eye,
  ExternalLink,
} from "lucide-react";
import AppScreen from "../../components/AppScreen";
import AuthGuard from "../../components/AuthGuard";
import GlassCard from "../../components/ui/GlassCard";

const facts = [
  {
    stat: "50%",
    label: "of Earth’s oxygen is produced by the ocean",
    detail:
      "Tiny ocean plants called phytoplankton produce around half of the oxygen on Earth.",
  },
  {
    stat: "90%",
    label: "of excess heat is absorbed by the ocean",
    detail:
      "The ocean helps regulate the planet’s climate by absorbing most excess heat trapped by greenhouse gases.",
  },
  {
    stat: "30%",
    label: "of human CO₂ emissions are absorbed by the ocean",
    detail:
      "This slows climate change, but also contributes to ocean acidification.",
  },
  {
    stat: "11m",
    label: "tonnes of plastic enter the ocean each year",
    detail:
      "Without action, this could get worse and continue damaging marine ecosystems.",
  },
];

const topics = [
  {
    title: "Plastic Pollution",
    icon: Recycle,
    emoji: "🗑️",
    text:
      "Plastic does not simply disappear. It breaks down into smaller pieces called microplastics, which can be eaten by fish, shellfish, seabirds and marine mammals.",
    harm: [
      "Animals can mistake plastic for food.",
      "Plastic can block stomachs and cause starvation.",
      "Microplastics can enter the food chain.",
      "Plastic can carry chemicals and pollutants.",
    ],
    signs: [
      "Plastic bottles, bags and wrappers on beaches.",
      "Fishing line tangled in rocks or seaweed.",
      "Fragments of plastic mixed with sand or shells.",
      "Litter trapped around harbour walls or reefs.",
    ],
    actions: [
      "Take litter home if safe to do so.",
      "Carry a small reusable bag for beach waste.",
      "Use reusable bottles and avoid single-use plastics.",
      "Join local beach cleans.",
    ],
  },
  {
    title: "Sewage & Water Pollution",
    icon: ShieldAlert,
    emoji: "💩",
    text:
      "Sewage pollution can introduce bacteria, viruses, nutrients and chemicals into the water. This can harm wildlife, damage habitats and make people ill.",
    harm: [
      "Can reduce oxygen levels in the water.",
      "Can trigger algal blooms.",
      "Can damage seagrass and shellfish beds.",
      "Can cause ear, eye, skin and stomach infections.",
    ],
    signs: [
      "Brown or grey water.",
      "Bad sewage smell.",
      "Foam, scum or unusual surface slicks.",
      "Dead fish or sudden algae growth.",
    ],
    actions: [
      "Avoid entering the water after heavy rain or known discharges.",
      "Check sewage alerts before swimming or diving.",
      "Report pollution incidents.",
      "Do not let pets enter visibly polluted water.",
    ],
  },
  {
    title: "Ghost Nets & Fishing Gear",
    icon: Skull,
    emoji: "🎣",
    text:
      "Lost fishing nets, ropes and lines can continue trapping animals for years. This is called ghost fishing.",
    harm: [
      "Seals, dolphins and seabirds can become entangled.",
      "Fish, crabs and lobsters can be trapped repeatedly.",
      "Nets can damage reefs, wrecks and seabed habitats.",
      "Fishing line can cut into wildlife and cause infection.",
    ],
    signs: [
      "Loose nets on rocks or reefs.",
      "Fishing line wrapped around kelp or structures.",
      "Rope, hooks or pots abandoned underwater.",
      "Animals with line or plastic around them.",
    ],
    actions: [
      "Remove small loose line only if safe.",
      "Do not pull heavy or trapped nets underwater.",
      "Take photos and record the location.",
      "Report dangerous or large ghost gear.",
    ],
  },
  {
    title: "Seagrass Meadows",
    icon: Leaf,
    emoji: "🌱",
    text:
      "Seagrass meadows are one of the most valuable marine habitats. They provide nursery grounds for fish, store carbon and help clean the water.",
    harm: [
      "Anchors can rip up seagrass beds.",
      "Poor water quality can stop sunlight reaching the plants.",
      "Damaged seagrass means fewer nursery areas for young fish.",
      "Loss of seagrass reduces natural carbon storage.",
    ],
    signs: [
      "Boat scars through seagrass beds.",
      "Cloudy water blocking sunlight.",
      "Loose torn seagrass washed ashore.",
      "Anchors dropped in shallow vegetated areas.",
    ],
    actions: [
      "Avoid anchoring in seagrass.",
      "Do not walk through shallow beds.",
      "Use eco-moorings where available.",
      "Support seagrass restoration projects.",
    ],
  },
  {
    title: "Kelp Forests & Reefs",
    icon: Waves,
    emoji: "🪸",
    text:
      "Kelp forests and reefs provide shelter and food for pollack, wrasse, crabs, lobsters, cuttlefish and many juvenile fish.",
    harm: [
      "Pollution can reduce biodiversity.",
      "Physical damage can remove shelter for marine life.",
      "Over-harvesting can weaken habitats.",
      "Climate change can alter species balance.",
    ],
    signs: [
      "Broken reef life or damaged kelp areas.",
      "Low numbers of fish where life is usually abundant.",
      "Smothering sediment or unusual algae growth.",
      "Visible damage from anchors or gear.",
    ],
    actions: [
      "Do not break, collect or disturb reef life.",
      "Control buoyancy when diving.",
      "Avoid dragging equipment across the seabed.",
      "Photograph wildlife without touching it.",
    ],
  },
  {
    title: "Wildlife Disturbance",
    icon: Fish,
    emoji: "🐬",
    text:
      "Marine animals need space to feed, rest and breed. Disturbance can cause stress, injury or abandonment of important areas.",
    harm: [
      "Seals may abandon resting areas.",
      "Birds may leave nests or chicks.",
      "Feeding wildlife can change natural behaviour.",
      "Chasing animals can cause stress and injury.",
    ],
    signs: [
      "Animals moving away quickly.",
      "Repeated diving, splashing or alarm calls.",
      "Seals raising heads or entering water suddenly.",
      "Birds leaving nests or young.",
    ],
    actions: [
      "Keep distance from wildlife.",
      "Move slowly and quietly.",
      "Never chase, feed or touch animals.",
      "Use zoom for photos instead of approaching.",
    ],
  },
];

const reportLinks = [
  {
    title: "Report water pollution",
    subtitle: "Official GOV.UK water pollution reporting page",
    href: "https://www.gov.uk/report-water-pollution",
  },
  {
    title: "Report an environmental incident",
    subtitle: "Oil, chemicals, dead fish, illegal dumping or pollution",
    href: "https://www.gov.uk/report-environmental-problem",
  },
  {
    title: "Check sewage alerts",
    subtitle: "Surfers Against Sewage live sewage information",
    href: "https://datahq.sas.org.uk/sewage-data-hq/",
  },
  {
    title: "Injured wildlife advice",
    subtitle: "RSPCA advice for injured or distressed wildlife",
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
            The ocean is not separate from us. It gives us oxygen, regulates the
            climate, supports food systems, protects coastlines and provides a
            home for millions of species.
          </p>
        </header>

        <GlassCard className="mt-6">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-cyan-400/10">
              <Waves className="text-[#00D4C8]" size={28} />
            </div>

            <div>
              <p className="text-xl font-black">Why it matters to humans</p>
              <p className="mt-2 text-sm leading-6 text-[#A9C7D8]">
                Healthy oceans help produce the air we breathe, regulate global
                temperature, create rainfall, support fisheries, store carbon
                and reduce coastal flooding. Protecting marine life also means
                protecting the systems humans depend on every day.
              </p>
            </div>
          </div>
        </GlassCard>

        <section className="mt-5 grid grid-cols-2 gap-3">
          {facts.map((fact) => (
            <GlassCard key={fact.label} className="min-h-[190px]">
              <p className="text-4xl font-black text-[#9FFFE0]">{fact.stat}</p>
              <p className="mt-2 text-sm font-black">{fact.label}</p>
              <p className="mt-2 text-xs leading-5 text-[#A9C7D8]">
                {fact.detail}
              </p>
            </GlassCard>
          ))}
        </section>

        <GlassCard className="mt-6">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-[#00D4C8]">
            Planet Support System
          </p>

          <div className="mt-4 grid gap-3">
            <div className="rounded-3xl bg-[#020B14]/70 p-4">
              <div className="flex items-center gap-3">
                <Wind className="text-[#00D4C8]" />
                <p className="font-black">Oxygen</p>
              </div>
              <p className="mt-2 text-sm leading-6 text-[#A9C7D8]">
                Phytoplankton in the ocean produce roughly half of the oxygen on
                Earth. Every second breath is closely linked to ocean life.
              </p>
            </div>

            <div className="rounded-3xl bg-[#020B14]/70 p-4">
              <div className="flex items-center gap-3">
                <Droplets className="text-[#00D4C8]" />
                <p className="font-black">Rainfall & Water Cycle</p>
              </div>
              <p className="mt-2 text-sm leading-6 text-[#A9C7D8]">
                Most evaporation happens from the ocean. This drives cloud
                formation, rainfall, rivers, reservoirs and freshwater supplies.
              </p>
            </div>

            <div className="rounded-3xl bg-[#020B14]/70 p-4">
              <div className="flex items-center gap-3">
                <Anchor className="text-[#00D4C8]" />
                <p className="font-black">Coastal Protection</p>
              </div>
              <p className="mt-2 text-sm leading-6 text-[#A9C7D8]">
                Habitats like reefs, salt marshes, kelp and seagrass help absorb
                wave energy, reduce erosion and protect coastal communities.
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
                  </div>
                </div>

                <div className="mt-5 grid gap-3">
                  <div className="rounded-3xl bg-red-400/10 p-4">
                    <p className="font-black text-[#FF6B6B]">
                      How it harms the ocean
                    </p>

                    <div className="mt-3 grid gap-2">
                      {topic.harm.map((item) => (
                        <p key={item} className="text-sm leading-6 text-white">
                          • {item}
                        </p>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-3xl bg-yellow-400/10 p-4">
                    <p className="font-black text-[#F4D35E]">
                      Warning signs to look for
                    </p>

                    <div className="mt-3 grid gap-2">
                      {topic.signs.map((item) => (
                        <p key={item} className="text-sm leading-6 text-white">
                          • {item}
                        </p>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-3xl bg-cyan-400/10 p-4">
                    <p className="font-black text-[#9FFFE0]">
                      How you can help
                    </p>

                    <div className="mt-3 grid gap-2">
                      {topic.actions.map((item) => (
                        <p key={item} className="text-sm leading-6 text-white">
                          ✓ {item}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </section>

        <GlassCard className="mt-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-green-400/10">
              <HeartHandshake className="text-[#9FFFE0]" size={24} />
            </div>

            <div>
              <p className="text-xl font-black">Small actions add up</p>
              <p className="mt-3 text-sm leading-6 text-[#A9C7D8]">
                If thousands of BlueTrail users remove a few safe items of
                litter, report pollution, avoid damaging habitats and share what
                they see, the combined impact can be huge.
              </p>
            </div>
          </div>
        </GlassCard>

        <section className="mt-8">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.25em] text-[#00D4C8]">
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
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-400/10">
                      <AlertTriangle className="text-[#FF6B6B]" size={22} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="font-black">{link.title}</p>
                      <p className="mt-1 text-sm text-[#A9C7D8]">
                        {link.subtitle}
                      </p>
                    </div>

                    <ExternalLink size={16} className="text-cyan-100/60" />
                  </div>
                </GlassCard>
              </a>
            ))}
          </div>
        </section>

        <GlassCard className="mt-6">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-[#00D4C8]">
            Safety First
          </p>

          <p className="mt-3 text-sm leading-6 text-white">
            Never risk your own safety to remove rubbish, ghost gear or
            pollution. If something is heavy, sharp, chemical, medical,
            sewage-related, underwater, under tension or near dangerous water,
            report it instead.
          </p>
        </GlassCard>

        <GlassCard className="mt-4">
          <p className="text-xl font-black">The BlueTrail message</p>

          <p className="mt-3 text-sm leading-6 text-[#A9C7D8]">
            Protecting the ocean is not just about saving marine life. It is
            about protecting oxygen, climate stability, food, coastlines,
            biodiversity and the future health of people and the planet.
          </p>
        </GlassCard>

        <Link
          href="/map"
          className="mt-6 block rounded-3xl bg-[#00D4C8] px-6 py-4 text-center font-black text-[#020B14]"
        >
          Find beaches and dive sites
        </Link>

        <p className="mt-5 text-xs leading-5 text-[#A9C7D8]">
          Data notes: NOAA estimates roughly half of Earth’s oxygen production
          comes from the ocean. The UN states the ocean absorbs around 30% of
          carbon dioxide emissions and about 90% of excess heat. UNEP reports
          millions of tonnes of plastic enter aquatic ecosystems every year.
        </p>
      </AppScreen>
    </AuthGuard>
  );
}