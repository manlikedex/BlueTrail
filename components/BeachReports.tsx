"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function BeachReports({
  beachId,
}: {
  beachId: number;
}) {
  const [reports, setReports] = useState<any[]>([]);

  useEffect(() => {
    loadReports();
  }, []);

  async function loadReports() {
    const { data } = await supabase
      .from("beach_reports")
      .select("*")
      .eq("beach_id", beachId)
      .order("created_at", { ascending: false })
      .limit(20);

    setReports(data || []);
  }

  return (
    <div className="mt-6">
      <h2 className="text-xl font-black">Recent Reports</h2>

      <div className="mt-4 grid gap-3">
        {reports.map((report) => (
          <div
            key={report.id}
            className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-4"
          >
            <p className="font-black">
              Visibility {report.visibility_m}m
            </p>

            <p className="text-sm text-cyan-200">
              Sea Temp {report.sea_temp}°C
            </p>

            {report.species_seen && (
              <p className="mt-2 text-sm">
                🐟 {report.species_seen}
              </p>
            )}

            <p className="mt-3 text-sm text-[#A9C7D8]">
              {report.notes}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}