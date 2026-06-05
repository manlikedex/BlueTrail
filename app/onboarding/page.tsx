"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";

const activities = ["Freediving", "Snorkelling", "Spearfishing", "Scuba"];
const levels = ["Beginner", "Intermediate", "Advanced", "Instructor"];

export default function OnboardingPage() {
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [level, setLevel] = useState("");
  const [region, setRegion] = useState("");
  const [loading, setLoading] = useState(false);

  function toggleActivity(activity: string) {
    setSelectedActivities((current) =>
      current.includes(activity)
        ? current.filter((item) => item !== activity)
        : [...current, activity]
    );
  }

  async function finish() {
    setLoading(true);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      alert("You need to be logged in first.");
      window.location.href = "/login";
      return;
    }

    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      username: username.toLowerCase().replace(/\s/g, ""),
      display_name: displayName,
      activities: selectedActivities,
      experience_level: level,
      home_region: region,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    window.location.href = "/app";
  }

  return (
    <main className="min-h-screen bg-[#031B2E] px-5 py-8 text-white">
      <section className="mx-auto max-w-md pb-10">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#00D4C8]">
          Setup
        </p>

        <h1 className="mt-4 text-4xl font-black">Personalise BlueTrail</h1>

        <p className="mt-3 text-[#A9C7D8]">
          This helps show better species, safety info, laws and dive spots.
        </p>

        <h2 className="mt-8 text-xl font-black">Profile</h2>

        <input
          className="mt-4 w-full rounded-2xl border border-white/10 bg-[#082C46] p-4 outline-none"
          placeholder="Display name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />

        <input
          className="mt-3 w-full rounded-2xl border border-white/10 bg-[#082C46] p-4 outline-none"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <h2 className="mt-8 text-xl font-black">What do you do?</h2>

        <div className="mt-4 grid grid-cols-2 gap-3">
          {activities.map((activity) => {
            const active = selectedActivities.includes(activity);

            return (
              <button
                key={activity}
                onClick={() => toggleActivity(activity)}
                className={`rounded-3xl border p-4 font-bold ${
                  active
                    ? "border-[#00D4C8] bg-[#00D4C8] text-[#031B2E]"
                    : "border-white/10 bg-[#082C46] text-white"
                }`}
              >
                {activity}
              </button>
            );
          })}
        </div>

        <h2 className="mt-8 text-xl font-black">Experience level</h2>

        <div className="mt-4 grid gap-3">
          {levels.map((item) => (
            <button
              key={item}
              onClick={() => setLevel(item)}
              className={`rounded-3xl border p-4 text-left font-bold ${
                level === item
                  ? "border-[#00D4C8] bg-[#00D4C8] text-[#031B2E]"
                  : "border-white/10 bg-[#082C46] text-white"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <h2 className="mt-8 text-xl font-black">Home region</h2>

        <input
          className="mt-4 w-full rounded-2xl border border-white/10 bg-[#082C46] p-4 outline-none"
          placeholder="Example: Cornwall, United Kingdom"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
        />

        <button
          onClick={finish}
          disabled={loading}
          className="mt-8 w-full rounded-3xl bg-[#00D4C8] py-4 font-black text-[#031B2E] disabled:opacity-50"
        >
          {loading ? "Saving..." : "Finish Setup"}
        </button>
      </section>
    </main>
  );
}