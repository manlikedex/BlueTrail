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
      .maybeSingle();

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
    <div className="fixed inset-0 z-[9999] flex items-end justify-center bg-black/75 p-3 backdrop-blur-xl sm:items-center sm:p-6">
      <div className="flex max-h-[88vh] w-full max-w-lg flex-col overflow-hidden rounded-3xl border border-[#1A2330] bg-[#05070A] text-white shadow-2xl">
        <div className="shrink-0 border-b border-[#1A2330] bg-[#05070A] p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-[#0094FF]">
                BlueTrail Update
              </p>

              <h2 className="mt-3 text-2xl font-black leading-tight sm:text-3xl">
                {update.title}
              </h2>

              <p className="mt-1 text-sm text-[#7D8896]">
                Version {update.version}
              </p>
            </div>

            <button
              onClick={closePopup}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#10161E] text-white"
              aria-label="Close update popup"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
          <p className="whitespace-pre-line text-sm leading-7 text-[#9CA8B8]">
            {update.content}
          </p>
        </div>

        <div className="shrink-0 border-t border-[#1A2330] bg-[#05070A] p-5">
          <button
            onClick={closePopup}
            className="w-full rounded-xl bg-[#0094FF] px-5 py-4 text-sm font-black uppercase tracking-[0.14em] text-white"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}