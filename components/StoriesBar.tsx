"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Plus, X } from "lucide-react";
import { supabase } from "../lib/supabase";
import StoryEditorModal from "./StoryEditorModal";

type Story = {
  id: number;
  user_id: string;
  media_url: string;
  media_type: string;
  created_at: string;
  expires_at: string;
  profile?: {
    username: string | null;
    display_name: string | null;
    full_name: string | null;
    avatar_url: string | null;
  };
};

export default function StoriesBar({
  stories,
  onStoryAdded,
}: {
  stories: Story[];
  onStoryAdded: () => void;
}) {
  const fileRef = useRef<HTMLInputElement | null>(null);

  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [selectedStoryFile, setSelectedStoryFile] = useState<File | null>(null);

  const activeStory =
    activeIndex !== null && stories[activeIndex] ? stories[activeIndex] : null;

  useEffect(() => {
    if (activeIndex === null) return;

    const timer = setTimeout(() => {
      nextStory();
    }, 6500);

    return () => clearTimeout(timer);
  }, [activeIndex, stories.length]);

  function handleStoryFile(file: File) {
    setSelectedStoryFile(file);
    setEditorOpen(true);
  }

  async function uploadStory(file: File) {
    setUploading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setUploading(false);
      return;
    }

    const mediaType = file.type.startsWith("video") ? "video" : "image";
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const path = `${user.id}/${Date.now()}-${safeName}`;

    const { error: uploadError } = await supabase.storage
      .from("stories")
      .upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      alert(uploadError.message);
      setUploading(false);
      return;
    }

    const { data: publicData } = supabase.storage
      .from("stories")
      .getPublicUrl(path);

    const { error } = await supabase.from("stories").insert({
      user_id: user.id,
      media_url: publicData.publicUrl,
      media_type: mediaType,
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    });

    if (error) {
      alert(error.message);
      setUploading(false);
      return;
    }

    setUploading(false);
    setEditorOpen(false);
    setSelectedStoryFile(null);
    onStoryAdded();
  }

  function displayName(story: Story) {
    return (
      story.profile?.display_name ||
      story.profile?.full_name ||
      story.profile?.username ||
      "User"
    );
  }

  function closeViewer() {
    setActiveIndex(null);
  }

  function nextStory() {
    setActiveIndex((current) => {
      if (current === null) return null;
      if (current >= stories.length - 1) return null;
      return current + 1;
    });
  }

  function previousStory() {
    setActiveIndex((current) => {
      if (current === null) return null;
      if (current <= 0) return 0;
      return current - 1;
    });
  }

  return (
    <>
      <div className="mt-6 overflow-x-auto pb-2">
        <div className="flex gap-3">
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="flex min-w-[86px] flex-col items-center gap-2"
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-[#0094FF]/40 bg-[#0094FF]/15">
              <Plus className="text-[#0094FF]" size={28} />
            </div>

            <span className="text-xs font-black text-white">
              {uploading ? "Adding..." : "Your Story"}
            </span>
          </button>

          {stories.map((story, index) => (
            <button
              key={story.id}
              onClick={() => setActiveIndex(index)}
              className="flex min-w-[86px] flex-col items-center gap-2"
            >
              <div className="rounded-3xl bg-gradient-to-br from-[#0094FF] to-cyan-300 p-[2px]">
                {story.profile?.avatar_url ? (
                  <img
                    src={story.profile.avatar_url}
                    alt={displayName(story)}
                    className="h-20 w-20 rounded-[22px] border-4 border-[#05070A] object-cover"
                  />
                ) : story.media_type === "video" ? (
                  <video
                    src={story.media_url}
                    className="h-20 w-20 rounded-[22px] border-4 border-[#05070A] object-cover"
                  />
                ) : (
                  <img
                    src={story.media_url}
                    alt={displayName(story)}
                    className="h-20 w-20 rounded-[22px] border-4 border-[#05070A] object-cover"
                  />
                )}
              </div>

              <span className="max-w-[82px] truncate text-xs font-black text-white">
                {displayName(story)}
              </span>
            </button>
          ))}
        </div>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*,video/*"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) handleStoryFile(file);
        }}
      />

      <StoryEditorModal
        file={selectedStoryFile}
        open={editorOpen}
        onClose={() => {
          setEditorOpen(false);
          setSelectedStoryFile(null);
        }}
        onSave={uploadStory}
      />

      {activeStory && (
        <div className="fixed inset-0 z-[9999] bg-black">
          <div className="absolute left-4 right-4 top-4 z-20 flex gap-1">
            {stories.map((_, index) => (
              <div
                key={index}
                className={`h-1 flex-1 rounded-full ${
                  index <= (activeIndex || 0) ? "bg-white" : "bg-white/25"
                }`}
              />
            ))}
          </div>

          <button
            onClick={closeViewer}
            className="absolute right-5 top-10 z-30 rounded-full bg-black/60 p-3 text-white backdrop-blur-xl"
          >
            <X size={24} />
          </button>

          <div className="absolute left-5 top-12 z-30">
            <p className="font-black text-white">{displayName(activeStory)}</p>
            <p className="text-xs text-white/60">
              {new Date(activeStory.created_at).toLocaleString("en-GB")}
            </p>
          </div>

          {activeStory.media_type === "video" ? (
            <video
              src={activeStory.media_url}
              controls
              autoPlay
              className="h-full w-full object-contain"
            />
          ) : (
            <img
              src={activeStory.media_url}
              alt="Story"
              className="h-full w-full object-contain"
            />
          )}

          <button
            onClick={previousStory}
            className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/40 p-3 text-white backdrop-blur-xl"
          >
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={nextStory}
            className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/40 p-3 text-white backdrop-blur-xl"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      )}
    </>
  );
}