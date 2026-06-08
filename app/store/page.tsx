import Link from "next/link";
import {
  Activity,
  BatteryCharging,
  Bluetooth,
  ChevronRight,
  Clock,
  Droplets,
  Gauge,
  Radio,
  ShieldCheck,
  Signal,
  Smartphone,
  Timer,
  Waves,
} from "lucide-react";
import AppScreen from "../../components/AppScreen";
import AuthGuard from "../../components/AuthGuard";
import GlassCard from "../../components/ui/GlassCard";

export default function StorePage() {
  return (
    <AuthGuard>
      <AppScreen>
        <header>
          <p className="text-xs font-black uppercase tracking-[0.3em] text-[#0094FF]">
            BlueTrail Store
          </p>

          <h1 className="mt-3 text-5xl font-black tracking-tight">
            Trail Tag.
          </h1>

          <p className="mt-3 text-sm leading-6 text-[#9CA8B8]">
            A compact dive tracker concept built for the BlueTrail ecosystem.
            Track, sync and relive your dives from app to ocean.
          </p>
        </header>

        <section className="mt-6 overflow-hidden rounded-3xl border border-[#1A2330] bg-[#0B0F14] shadow-[0_0_60px_rgba(0,0,0,0.5)]">
          <div className="relative p-6">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#0094FF22,transparent_45%)]" />

            <div className="relative">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-[#0094FF]">
                Version 1 MVP
              </p>

              <div className="mt-6 flex justify-center">
                <div className="relative flex h-56 w-40 items-center justify-center rounded-[2.4rem] border border-[#1A2330] bg-[#05070A] shadow-[0_0_50px_rgba(0,148,255,0.18)]">
                  <div className="absolute -top-5 h-12 w-20 rounded-xl border border-[#1A2330] bg-[#10161E]" />
                  <div className="absolute -bottom-5 h-12 w-20 rounded-xl border border-[#1A2330] bg-[#10161E]" />

                  <div className="absolute top-8 h-2 w-10 rounded-full bg-[#0094FF] shadow-[0_0_18px_rgba(0,148,255,0.9)]" />

                  <Radio className="relative z-10 text-[#C5D1DD]" size={72} />

                  <p className="absolute bottom-8 text-xs font-black uppercase tracking-[0.22em] text-[#7D8896]">
                    Trail Tag
                  </p>
                </div>
              </div>

              <h2 className="mt-10 text-3xl font-black tracking-tight">
                Connected dive tracking.
              </h2>

              <p className="mt-3 text-sm leading-6 text-[#9CA8B8]">
                Trail Tag is designed as a rugged BlueTrail hardware companion
                for future automatic dive duration, depth, water temperature and
                Bluetooth sync.
              </p>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <MiniSpec label="Waterproof" value="100m / 10 ATM" />
                <MiniSpec label="Battery" value="Up to 30 dives" />
                <MiniSpec label="Sync" value="Bluetooth" />
                <MiniSpec label="Mode" value="Auto detect" />
              </div>

              <div className="mt-6 rounded-2xl border border-[#0094FF]/30 bg-[#0094FF]/10 p-4">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#7CC6FF]">
                  Coming Soon
                </p>
                <p className="mt-2 text-sm leading-6 text-[#9CA8B8]">
                  Store checkout, waitlist and pre-order options will be added
                  when Trail Tag moves closer to launch.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-5 grid grid-cols-2 gap-3">
          <Feature
            icon={<Gauge />}
            title="Depth"
            text="Future depth profile tracking."
          />
          <Feature
            icon={<Timer />}
            title="Duration"
            text="Automatic session timing."
          />
          <Feature
            icon={<Droplets />}
            title="Water Temp"
            text="Temperature data per dive."
          />
          <Feature
            icon={<Bluetooth />}
            title="Bluetooth"
            text="Sync after surfacing."
          />
          <Feature
            icon={<BatteryCharging />}
            title="Battery"
            text="Device battery status."
          />
          <Feature
            icon={<Signal />}
            title="Auto Mode"
            text="Detect dive activity."
          />
        </section>

        <GlassCard className="mt-5">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#1A2330] bg-[#10161E]">
              <Smartphone className="text-[#0094FF]" size={24} />
            </div>

            <div>
              <p className="text-xl font-black">Built for the app</p>
              <p className="mt-2 text-sm leading-6 text-[#9CA8B8]">
                Trail Tag will connect directly to BlueTrail profiles, dive
                logs, achievements and future ocean intelligence tools.
              </p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="mt-5">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-[#0094FF]">
            Product Roadmap
          </p>

          <div className="mt-4 grid gap-3">
            <RoadmapItem
              icon={<Activity />}
              title="Manual tracking"
              text="Available now inside BlueTrail."
              active
            />
            <RoadmapItem
              icon={<Radio />}
              title="Trail Tag prototype"
              text="Hardware concept and MVP feature set."
            />
            <RoadmapItem
              icon={<Waves />}
              title="Automatic dive sync"
              text="Depth, temperature, duration and profiles."
            />
            <RoadmapItem
              icon={<ShieldCheck />}
              title="Launch ready"
              text="Waitlist, pre-orders and production planning."
            />
          </div>
        </GlassCard>

        <Link
          href="/track"
          className="mt-6 flex items-center justify-center gap-2 rounded-xl border border-[#0094FF]/40 bg-[#0094FF] px-5 py-4 text-sm font-black uppercase tracking-[0.14em] text-white"
        >
          Try manual tracking now
          <ChevronRight size={18} />
        </Link>
      </AppScreen>
    </AuthGuard>
  );
}

function MiniSpec({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[#1A2330] bg-[#05070A] p-4">
      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#7D8896]">
        {label}
      </p>
      <p className="mt-2 text-sm font-black text-white">{value}</p>
    </div>
  );
}

function Feature({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <GlassCard className="min-h-[145px]">
      <div className="text-[#0094FF]">{icon}</div>
      <p className="mt-4 text-lg font-black">{title}</p>
      <p className="mt-1 text-xs leading-5 text-[#9CA8B8]">{text}</p>
    </GlassCard>
  );
}

function RoadmapItem({
  icon,
  title,
  text,
  active = false,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
  active?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-4 ${
        active
          ? "border-[#0094FF]/40 bg-[#0094FF]/10"
          : "border-[#1A2330] bg-[#05070A]"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={active ? "text-[#0094FF]" : "text-[#7D8896]"}>
          {icon}
        </div>

        <div>
          <p className="font-black">{title}</p>
          <p className="mt-1 text-sm leading-6 text-[#9CA8B8]">{text}</p>
        </div>
      </div>
    </div>
  );
}