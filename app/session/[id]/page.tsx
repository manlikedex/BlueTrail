"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Activity,
  CheckCircle,
  Clock,
  Eye,
  MapPin,
  Thermometer,
  Waves,
} from "lucide-react";
import AppScreen from "../../../components/AppScreen";
import AuthGuard from "../../../components/AuthGuard";
import GlassCard from "../../../components/ui/GlassCard";
import PrimaryButton from "../../../components/ui/PrimaryButton";
import { supabase } from "../../../lib/supabase";

type DiveSession = {
  id: number;
  title: string | null;
  location_name: string | null;
  started_at: string;
  ended_at: string | null;
  duration_seconds: number | null;
  max_depth: number | null;
  water_temp: number | null;
  visibility: number | null;
  notes: string | null;
  status: string | null;
};

export default function SessionPage() {
  const { id } = useParams();
  const router = useRouter();

  const [session, setSession] = useState<DiveSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [ending, setEnding] = useState(false);

  const [maxDepth, setMaxDepth] = useState("");
  const [waterTemp, setWaterTemp] = useState("");
  const [visibility, setVisibility] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    loadSession();
  }, [id]);

  async function loadSession() {
    setLoading(true);

    const { data, error } = await supabase
      .from("dive_sessions")
      .select("*")
      .eq("id", id)
      .single();

    setLoading(false);

    if (error || !data) {
      alert("Dive session not found.");
      return;
    }

    setSession(data);
    setMaxDepth(data.max_depth?.toString() || "");
    setWaterTemp(data.water_temp?.toString() || "");
    setVisibility(data.visibility?.toString() || "");
    setNotes(data.notes || "");
  }

  function getLiveDuration() {
    if (!session?.started_at) return "00:00:00";

    const start = new Date(session.started_at).getTime();
    const end = session.ended_at
      ? new Date(session.ended_at).getTime()
      : Date.now();

    const seconds = Math.max(0, Math.floor((end - start) / 1000));

    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(
      2,
      "0"
    )}:${String(secs).padStart(2, "0")}`;
  }

  async function endSession() {
    if (!session) return;

    setEnding(true);

    const startedAt = new Date(session.started_at).getTime();
    const endedAt = new Date();
    const durationSeconds = Math.max(
      0,
      Math.floor((endedAt.getTime() - startedAt) / 1000)
    );

    const { error } = await supabase
      .from("dive_sessions")
      .update({
        ended_at: endedAt.toISOString(),
        duration_seconds: durationSeconds,
        max_depth: maxDepth ? Number(maxDepth) : null,
        water_temp: waterTemp ? Number(waterTemp) : null,
        visibility: visibility ? Number(visibility) : null,
        notes: notes || null,
        status: "completed",
      })
      .eq("id", session.id);

    setEnding(false);

    if (error) {
      alert(error.message);
      return;
    }

    router.push("/profile");
  }

  if (loading) {
    return (
      <AuthGuard>
        <AppScreen>
          <GlassCard>
            <p className="text-[#9CA8B8]">Loading dive session...</p>
          </GlassCard>
        </AppScreen>
      </AuthGuard>
    );
  }

  if (!session) {
    return (
      <AuthGuard>
        <AppScreen>
          <GlassCard>
            <h1 className="text-3xl font-black">Session not found</h1>
          </GlassCard>
        </AppScreen>
      </AuthGuard>
    );
  }

  const isCompleted = session.status === "completed";

  return (
    <AuthGuard>
      <AppScreen>
        <header>
          <p className="text-xs font-black uppercase tracking-[0.3em] text-[#0094FF]">
            Dive Session
          </p>

          <h1 className="mt-3 text-5xl font-black tracking-tight">
            {session.title || "Untitled Dive"}
          </h1>

          <p className="mt-3 flex items-center gap-2 text-sm text-[#9CA8B8]">
            <MapPin size={16} className="text-[#0094FF]" />
            {session.location_name || "Location not set"}
          </p>
        </header>

        <GlassCard className="mt-6">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.25em] text-[#0094FF]">
                Session Timer
              </p>

              <p className="mt-4 text-5xl font-black tracking-tight">
                {getLiveDuration()}
              </p>

              <p className="mt-2 text-sm text-[#9CA8B8]">
                {isCompleted ? "Completed session" : "Active manual tracking"}
              </p>
            </div>

            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#1A2330] bg-[#10161E]">
              {isCompleted ? (
                <CheckCircle className="text-[#0094FF]" size={32} />
              ) : (
                <Activity className="text-[#0094FF]" size={32} />
              )}
            </div>
          </div>
        </GlassCard>

        <section className="mt-4 grid grid-cols-2 gap-3">
          <MetricInput
            icon={<Waves size={18} className="text-[#0094FF]" />}
            label="Max Depth"
            value={maxDepth}
            setValue={setMaxDepth}
            placeholder="0"
            suffix="m"
            disabled={isCompleted}
          />

          <MetricInput
            icon={<Thermometer size={18} className="text-[#0094FF]" />}
            label="Water Temp"
            value={waterTemp}
            setValue={setWaterTemp}
            placeholder="0"
            suffix="°C"
            disabled={isCompleted}
          />

          <MetricInput
            icon={<Eye size={18} className="text-[#0094FF]" />}
            label="Visibility"
            value={visibility}
            setValue={setVisibility}
            placeholder="0"
            suffix="m"
            disabled={isCompleted}
          />

          <GlassCard>
            <div className="flex items-center gap-2">
              <Clock size={18} className="text-[#0094FF]" />
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#7D8896]">
                Status
              </p>
            </div>

            <p className="mt-3 text-xl font-black">
              {isCompleted ? "Saved" : "Live"}
            </p>
          </GlassCard>
        </section>

        <GlassCard className="mt-4">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-[#0094FF]">
            Dive Notes
          </p>

          <textarea
            className="mt-4 min-h-[140px] w-full rounded-xl border border-[#1A2330] bg-[#05070A] p-4 text-white outline-none placeholder:text-[#6F7A89]"
            placeholder="Visibility, marine life, conditions, entry/exit notes..."
            value={notes}
            disabled={isCompleted}
            onChange={(e) => setNotes(e.target.value)}
          />
        </GlassCard>

        {!isCompleted && (
          <div className="mt-6">
            <PrimaryButton
              onClick={endSession}
              disabled={ending}
              className="w-full border-red-400/40 bg-red-500 text-white shadow-[0_0_30px_rgba(239,68,68,0.25)]"
            >
              {ending ? "Saving Session..." : "End Session"}
            </PrimaryButton>
          </div>
        )}

        {isCompleted && (
          <GlassCard className="mt-6">
            <p className="font-black text-[#0094FF]">Session saved</p>
            <p className="mt-2 text-sm leading-6 text-[#9CA8B8]">
              This dive has been logged. Future Trail Tag integration will sync
              depth, temperature and route data automatically.
            </p>
          </GlassCard>
        )}
      </AppScreen>
    </AuthGuard>
  );
}

function MetricInput({
  icon,
  label,
  value,
  setValue,
  placeholder,
  suffix,
  disabled,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  setValue: (value: string) => void;
  placeholder: string;
  suffix: string;
  disabled: boolean;
}) {
  return (
    <GlassCard>
      <div className="flex items-center gap-2">
        {icon}
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#7D8896]">
          {label}
        </p>
      </div>

      <div className="mt-3 flex items-end gap-1">
        <input
          className="w-full bg-transparent text-3xl font-black text-white outline-none placeholder:text-[#6F7A89]"
          value={value}
          disabled={disabled}
          placeholder={placeholder}
          inputMode="decimal"
          onChange={(e) => setValue(e.target.value)}
        />
        <p className="mb-1 text-sm font-black text-[#9CA8B8]">{suffix}</p>
      </div>
    </GlassCard>
  );
}