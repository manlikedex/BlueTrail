"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function BeachReportForm({
  beachId,
}: {
  beachId: number;
}) {
  const [visibility, setVisibility] = useState("");
  const [seaTemp, setSeaTemp] = useState("");
  const [species, setSpecies] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  async function submitReport() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Please login.");
      setLoading(false);
      return;
    }

    const { error } = await supabase
      .from("beach_reports")
      .insert({
        beach_id: beachId,
        user_id: user.id,
        visibility_m: Number(visibility || 0),
        sea_temp: Number(seaTemp || 0),
        species_seen: species,
        notes,
      });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Report submitted!");

    setVisibility("");
    setSeaTemp("");
    setSpecies("");
    setNotes("");
  }

  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-5">
      <h2 className="text-xl font-black">Submit Dive Report</h2>

      <input
        className="mt-4 w-full rounded-2xl bg-[#020B14] p-3"
        placeholder="Visibility (m)"
        value={visibility}
        onChange={(e) => setVisibility(e.target.value)}
      />

      <input
        className="mt-3 w-full rounded-2xl bg-[#020B14] p-3"
        placeholder="Sea Temperature °C"
        value={seaTemp}
        onChange={(e) => setSeaTemp(e.target.value)}
      />

      <input
        className="mt-3 w-full rounded-2xl bg-[#020B14] p-3"
        placeholder="Species Seen"
        value={species}
        onChange={(e) => setSpecies(e.target.value)}
      />

      <textarea
        className="mt-3 w-full rounded-2xl bg-[#020B14] p-3"
        placeholder="Notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />

      <button
        onClick={submitReport}
        className="mt-4 w-full rounded-3xl bg-[#00D4C8] py-4 font-black text-[#031B2E]"
      >
        {loading ? "Submitting..." : "Submit Report"}
      </button>
    </div>
  );
}