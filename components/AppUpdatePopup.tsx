"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { supabase } from "../lib/supabase";

type AppUpdate = {
  id: number;
  version: string;
  title: string;
  content: string;
};

export default function AppUpdatePopup() {
  const [update, setUpdate] = useState<AppUpdate | null>(null);

  useEffect(() => {
    loadUpdate();
  }, []);

  async function loadUpdate() {
    const { data } = await supabase
      .from("app_updates")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (!data) return;

    const seen = localStorage.getItem("bluetrail_seen_update");

    if (seen !== data.version) {
      setUpdate(data);
    }
  }

  function closePopup() {
    if (update) {
      localStorage.setItem("bluetrail_seen_update", update.version);
    }

    setUpdate(null);
  }

  if (!update) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 px-4 backdrop-blur-xl">
      <div className="w-full max-w-md rounded-3xl border border-[#1A2330] bg-[#05070A] p-6 text-white shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.25em] text-[#0094FF]">
              BlueTrail Update
            </p>

            <h2 className="mt-3 text-3xl font-black">{update.title}</h2>

            <p className="mt-1 text-sm text-[#7D8896]">
              Version {update.version}
            </p>
          </div>

          <button onClick={closePopup} className="rounded-full bg-[#10161E] p-3">
            <X size={18} />
          </button>
        </div>

        <p className="mt-5 whitespace-pre-line text-sm leading-6 text-[#9CA8B8]">
          {update.content}
        </p>

        <button
          onClick={closePopup}
          className="mt-6 w-full rounded-xl bg-[#0094FF] px-5 py-4 text-sm font-black uppercase tracking-[0.14em] text-white"
        >
          Continue
        </button>
      </div>
    </div>
  );
}