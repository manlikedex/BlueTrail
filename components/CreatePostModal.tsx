"use client";

import { useRef, useState } from "react";
import { ImagePlus, MapPin, Send, Video, X } from "lucide-react";
import { supabase } from "../lib/supabase";
import GlassCard from "./ui/GlassCard";

type SelectedMedia = {
  file: File;
  preview: string;
  media_type: "image" | "video";
};

export default function CreatePostModal({
  open,
  onClose,
  onPosted,
}: {
  open: boolean;
  onClose: () => void;
  onPosted: () => void;
}) {
  const fileRef = useRef<HTMLInputElement | null>(null);

  const [content, setContent] = useState("");
  const [locationName, setLocationName] = useState("");
  const [media, setMedia] = useState<SelectedMedia[]>([]);
  const [posting, setPosting] = useState(false);

  if (!open) return null;

  function handleFiles(files: FileList | null) {
    if (!files) return;

    const selected = Array.from(files).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      media_type: file.type.startsWith("video") ? "video" : "image",
    })) as SelectedMedia[];

    setMedia((current) => [...current, ...selected]);
  }

  function removeMedia(index: number) {
    setMedia((current) => current.filter((_, itemIndex) => itemIndex !== index));
  }

  async function createPost() {
    if (!content.trim() && media.length === 0) return;

    setPosting(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("You must be logged in.");
      setPosting(false);
      return;
    }

    const { data: post, error: postError } = await supabase
      .from("social_posts")
      .insert({
        user_id: user.id,
        content: content.trim() || null,
        location_name: locationName.trim() || null,
        visibility: "public",
      })
      .select("id")
      .single();

    if (postError || !post) {
      alert(postError?.message || "Could not create post.");
      setPosting(false);
      return;
    }

    for (let i = 0; i < media.length; i++) {
      const item = media[i];
      const path = `${user.id}/${post.id}/${Date.now()}-${i}-${item.file.name}`;

      const { error: uploadError } = await supabase.storage
        .from("social-posts")
        .upload(path, item.file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        alert(uploadError.message);
        continue;
      }

      const { data: publicData } = supabase.storage
        .from("social-posts")
        .getPublicUrl(path);

      await supabase.from("social_post_media").insert({
        post_id: post.id,
        media_url: publicData.publicUrl,
        media_type: item.media_type,
        sort_order: i,
      });
    }

    setContent("");
    setLocationName("");
    setMedia([]);
    setPosting(false);
    onPosted();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-end bg-black/70 backdrop-blur-xl sm:items-center sm:justify-center">
      <div className="w-full max-w-2xl rounded-t-3xl border border-[#1A2330] bg-[#05070A] p-5 text-white sm:rounded-3xl">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.25em] text-[#0094FF]">
              Create Post
            </p>
            <h2 className="mt-2 text-3xl font-black">Share an ocean moment</h2>
          </div>

          <button
            onClick={onClose}
            className="rounded-full bg-[#10161E] p-3 text-white"
          >
            <X size={20} />
          </button>
        </div>

        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="What did you discover today?"
          className="mt-5 min-h-[120px] w-full rounded-2xl border border-[#1A2330] bg-[#0B0F14] px-4 py-4 text-white outline-none placeholder:text-[#6F7A89]"
        />

        <div className="mt-3 flex items-center gap-3 rounded-2xl border border-[#1A2330] bg-[#0B0F14] px-4 py-3">
          <MapPin size={18} className="text-[#0094FF]" />
          <input
            value={locationName}
            onChange={(event) => setLocationName(event.target.value)}
            placeholder="Add location"
            className="w-full bg-transparent text-white outline-none placeholder:text-[#6F7A89]"
          />
        </div>

        <input
          ref={fileRef}
          type="file"
          accept="image/*,video/*"
          multiple
          className="hidden"
          onChange={(event) => handleFiles(event.target.files)}
        />

        <div className="mt-4 grid grid-cols-2 gap-3">
          <button
            onClick={() => fileRef.current?.click()}
            className="flex items-center justify-center gap-2 rounded-xl border border-[#1A2330] bg-[#10161E] px-4 py-4 text-sm font-black uppercase tracking-[0.12em] text-white"
          >
            <ImagePlus size={18} />
            Images
          </button>

          <button
            onClick={() => fileRef.current?.click()}
            className="flex items-center justify-center gap-2 rounded-xl border border-[#1A2330] bg-[#10161E] px-4 py-4 text-sm font-black uppercase tracking-[0.12em] text-white"
          >
            <Video size={18} />
            Video
          </button>
        </div>

        {media.length > 0 && (
          <div className="mt-4 grid grid-cols-3 gap-2">
            {media.map((item, index) => (
              <div
                key={`${item.preview}-${index}`}
                className="relative overflow-hidden rounded-2xl border border-[#1A2330] bg-[#10161E]"
              >
                {item.media_type === "video" ? (
                  <video
                    src={item.preview}
                    className="h-28 w-full object-cover"
                  />
                ) : (
                  <img
                    src={item.preview}
                    alt="Selected media"
                    className="h-28 w-full object-cover"
                  />
                )}

                <button
                  onClick={() => removeMedia(index)}
                  className="absolute right-2 top-2 rounded-full bg-black/70 p-2 text-white"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={createPost}
          disabled={posting}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0094FF] px-5 py-4 text-sm font-black uppercase tracking-[0.14em] text-white"
        >
          <Send size={17} />
          {posting ? "Posting..." : "Post"}
        </button>
      </div>
    </div>
  );
}