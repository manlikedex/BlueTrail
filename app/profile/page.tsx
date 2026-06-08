"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Activity,
  Clock,
  Compass,
  LogOut,
  Mail,
  MapPin,
  Shield,
  User,
  Waves,
} from "lucide-react";
import AppScreen from "../../components/AppScreen";
import AuthGuard from "../../components/AuthGuard";
import GlassCard from "../../components/ui/GlassCard";
import PrimaryButton from "../../components/ui/PrimaryButton";
import { supabase } from "../../lib/supabase";

type Profile = {
  id: string;
  full_name: string | null;
  username: string | null;
  created_at?: string | null;
};

type DiveSession = {
  id: number;
  title: string | null;
  location_name: string | null;
  started_at: string | null;
  ended_at: string | null;
  duration_seconds: number | null;
  max_depth: number | null;
  water_temp: number | null;
  visibility: number | null;
  status: string | null;
};

export default function ProfilePage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [sessions, setSessions] = useState<DiveSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    setLoading(true);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      router.push("/login");
      return;
    }

    setEmail(user.email || "");
    setUserId(user.id);

    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    setProfile(profileData || null);

    const { data: sessionData } = await supabase
      .from("dive_sessions")
      .select(
        "id,title,location_name,started_at,ended_at,duration_seconds,max_depth,water_temp,visibility,status"
      )
      .eq("user_id", user.id)
      .order("started_at", { ascending: false })
      .limit(10);

    setSessions((sessionData as DiveSession[]) || []);
    setLoading(false);
  }

  async function logout() {
    setLoggingOut(true);
    await supabase.auth.signOut();
    setLoggingOut(false);
    router.push("/login");
  }

  const displayName =
    profile?.full_name || profile?.username || email.split("@")[0] || "Explorer";

  const completedSessions = sessions.filter(
    (session) => session.status === "completed"
  );

  const totalSeconds = completedSessions.reduce(
    (total, session) => total + (session.duration_seconds || 0),
    0
  );

  const deepestDive = completedSessions.reduce((deepest, session) => {
    const depth = Number(session.max_depth || 0);
    return depth > deepest ? depth : deepest;
  }, 0);

  const averageVisibility = useMemo(() => {
    const values = completedSessions
      .map((session) => session.visibility)
      .filter((value): value is number => typeof value === "number");

    if (values.length === 0) return null;

    return Math.round(
      values.reduce((total, value) => total + value, 0) / values.length
    );
  }, [completedSessions]);

  function formatDuration(seconds: number | null) {
    if (!seconds) return "00:00";

    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);

    if (hrs > 0) return `${hrs}h ${mins}m`;
    return `${mins}m`;
  }

  function formatDate(date: string | null) {
    if (!date) return "Unknown date";

    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  if (loading) {
    return (
      <AuthGuard>
        <AppScreen>
          <GlassCard>
            <p className="text-[#9CA8B8]">Loading profile...</p>
          </GlassCard>
        </AppScreen>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <AppScreen>
        <header className="rounded-3xl border border-[#1A2330] bg-[#0B0F14] p-5">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-[#1A2330] bg-[#10161E]">
              <User className="text-[#0094FF]" size={32} />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-black uppercase tracking-[0.3em] text-[#0094FF]">
                Profile
              </p>

              <h1 className="mt-3 truncate text-4xl font-black tracking-tight">
                {displayName}
              </h1>

              <p className="mt-2 flex items-center gap-2 text-sm text-[#9CA8B8]">
                <Mail size={15} className="text-[#0094FF]" />
                {email}
              </p>
            </div>
          </div>
        </header>

        <section className="mt-4 grid grid-cols-2 gap-3">
          <StatCard
            icon={<Activity size={18} className="text-[#0094FF]" />}
            label="Total Dives"
            value={String(completedSessions.length)}
          />

          <StatCard
            icon={<Clock size={18} className="text-[#0094FF]" />}
            label="Dive Time"
            value={formatDuration(totalSeconds)}
          />

          <StatCard
            icon={<Waves size={18} className="text-[#0094FF]" />}
            label="Deepest"
            value={deepestDive ? `${deepestDive}m` : "--"}
          />

          <StatCard
            icon={<Compass size={18} className="text-[#0094FF]" />}
            label="Avg Vis"
            value={averageVisibility ? `${averageVisibility}m` : "--"}
          />
        </section>

        <GlassCard className="mt-5">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#1A2330] bg-[#10161E]">
              <Shield className="text-[#0094FF]" size={22} />
            </div>

            <div>
              <p className="text-xl font-black">BlueTrail Account</p>
              <p className="mt-2 text-sm leading-6 text-[#9CA8B8]">
                Your profile is connected to your Supabase login. Dive sessions,
                saved locations and future Trail Tag data will be linked to this
                account.
              </p>
            </div>
          </div>
        </GlassCard>

        <section className="mt-6">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-[#0094FF]">
              Recent Dive Logs
            </p>

            <Link
              href="/track"
              className="text-xs font-black uppercase tracking-[0.14em] text-[#0094FF]"
            >
              Track →
            </Link>
          </div>

          {sessions.length === 0 ? (
            <GlassCard>
              <p className="font-black">No dives logged yet</p>
              <p className="mt-2 text-sm leading-6 text-[#9CA8B8]">
                Start your first manual dive session from the Track page.
              </p>

              <Link
                href="/track"
                className="mt-5 block rounded-xl border border-[#0094FF]/40 bg-[#0094FF] px-5 py-4 text-center text-sm font-black uppercase tracking-[0.14em] text-white"
              >
                Start Tracking
              </Link>
            </GlassCard>
          ) : (
            <div className="grid gap-3">
              {sessions.map((session) => (
                <Link key={session.id} href={`/session/${session.id}`}>
                  <GlassCard>
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#1A2330] bg-[#10161E]">
                        <Activity className="text-[#0094FF]" size={22} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate font-black">
                              {session.title || "Untitled Dive"}
                            </p>

                            <p className="mt-1 flex items-center gap-1 text-sm text-[#9CA8B8]">
                              <MapPin size={14} className="text-[#0094FF]" />
                              {session.location_name || "Manual Location"}
                            </p>
                          </div>

                          <span
                            className={`shrink-0 rounded-full px-3 py-1 text-[10px] font-black uppercase ${
                              session.status === "completed"
                                ? "bg-[#0094FF]/20 text-[#7CC6FF]"
                                : "bg-yellow-400/20 text-[#F4D35E]"
                            }`}
                          >
                            {session.status || "active"}
                          </span>
                        </div>

                        <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-[#9CA8B8]">
                          <p>{formatDate(session.started_at)}</p>
                          <p>{formatDuration(session.duration_seconds)}</p>
                          <p>
                            {session.max_depth ? `${session.max_depth}m` : "--"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </Link>
              ))}
            </div>
          )}
        </section>

        <button
          onClick={logout}
          disabled={loggingOut}
          className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl border border-red-400/30 bg-red-500/10 px-5 py-4 text-sm font-black uppercase tracking-[0.14em] text-red-300"
        >
          <LogOut size={18} />
          {loggingOut ? "Logging out..." : "Log out"}
        </button>

        <p className="mt-5 break-all text-center text-[10px] uppercase tracking-[0.16em] text-[#4F5A66]">
          User ID: {userId}
        </p>
      </AppScreen>
    </AuthGuard>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <GlassCard>
      <div className="flex items-center gap-2">
        {icon}
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#7D8896]">
          {label}
        </p>
      </div>

      <p className="mt-3 text-2xl font-black">{value}</p>
    </GlassCard>
  );
}