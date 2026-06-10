"use client";

import { useState } from "react";
import { Share2 } from "lucide-react";
import { supabase } from "../lib/supabase";

type DiveSession = {
  id: number;
  title: string | null;
  location_name: string | null;
  duration_seconds: number | null;
  max_depth: number | null;
  visibility: number | null;
  notes: string | null;
};

type DivePhoto = {
  id: number;
  image_url: string;
  media_type?: string | null;
  species_name: string | null;
  scientific_name: string | null;
};

export default function ShareDiveToFeedButton({
  session,
  photos,
  routePointCount,
  onShared,
}: {
  session: DiveSession;
  photos: DivePhoto[];
  routePointCount: number;
  onShared?: () => void;
}) {
  const [sharing, setSharing] = useState(false);

  function formatDuration(seconds: number | null) {
    if (!seconds) return "Unknown duration";

    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${mins}m ${secs}s`;
  }

  async function shareDive() {
    setSharing(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("You must be logged in.");
      setSharing(false);
      return;
    }

    const species = Array.from(
      new Set(
        photos
          .map((photo) => photo.species_name)
          .filter(
            (name): name is string =>
              Boolean(name) && name !== "Unknown marine species"
          )
      )
    );

    const content = [
      `Just logged a dive on BlueTrail 🌊`,
      session.title ? `Dive: ${session.title}` : null,
      session.location_name ? `Location: ${session.location_name}` : null,
      `Duration: ${formatDuration(session.duration_seconds)}`,
      session.max_depth ? `Max depth: ${session.max_depth}m` : null,
      session.visibility ? `Visibility: ${session.visibility}m` : null,
      routePointCount > 0 ? `GPS route points: ${routePointCount}` : null,
      species.length > 0 ? `Species seen: ${species.join(", ")}` : null,
      session.notes ? `Notes: ${session.notes}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    const { data: post, error: postError } = await supabase
      .from("social_posts")
      .insert({
        user_id: user.id,
        content,
        location_name: session.location_name || null,
        post_type: "dive_log",
        dive_session_id: session.id,
        species_tags: species,
        visibility: "public",
      })
      .select("id")
      .single();

    if (postError || !post) {
      alert(postError?.message || "Could not share dive.");
      setSharing(false);
      return;
    }

    const mediaRows = photos
      .filter((photo) => photo.image_url)
      .slice(0, 10)
      .map((photo, index) => ({
        post_id: post.id,
        media_url: photo.image_url,
        media_type: photo.media_type === "video" ? "video" : "image",
        sort_order: index,
      }));

    if (mediaRows.length > 0) {
      const { error: mediaError } = await supabase
        .from("social_post_media")
        .insert(mediaRows);

      if (mediaError) {
        alert(mediaError.message);
      }
    }

    setSharing(false);
    onShared?.();
    alert("Dive shared to your feed.");
  }

  return (
    <button
      onClick={shareDive}
      disabled={sharing}
      className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-[#0094FF]/40 bg-[#0094FF] px-5 py-4 text-sm font-black uppercase tracking-[0.14em] text-white"
    >
      <Share2 size={17} />
      {sharing ? "Sharing..." : "Share Dive To Feed"}
    </button>
  );
}