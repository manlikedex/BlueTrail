"use client";

import { useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  MapPin,
  MessageCircle,
} from "lucide-react";
import GlassCard from "./ui/GlassCard";

type MediaItem = {
  id: number;
  media_url: string;
  media_type: string;
  sort_order: number;
};

type Profile = {
  username: string | null;
  display_name: string | null;
  full_name: string | null;
  avatar_url: string | null;
};

type Post = {
  id: number;
  content: string | null;
  location_name: string | null;
  created_at: string;
  profile?: Profile;
  media?: MediaItem[];
  like_count?: number;
  comment_count?: number;
};

export default function PostCard({
  post,
  onLike,
}: {
  post: Post;
  onLike?: (postId: number) => void;
}) {
  const [currentMedia, setCurrentMedia] = useState(0);

  const media = useMemo(() => {
    return [...(post.media || [])].sort(
      (a, b) => a.sort_order - b.sort_order
    );
  }, [post.media]);

  const profileName =
    post.profile?.display_name ||
    post.profile?.full_name ||
    post.profile?.username ||
    "BlueTrail User";

  const current = media[currentMedia];

  return (
    <GlassCard>
      <div className="flex items-start gap-3">
        {post.profile?.avatar_url ? (
          <img
            src={post.profile.avatar_url}
            alt={profileName}
            className="h-12 w-12 rounded-full border border-[#1A2330] object-cover"
          />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#1A2330] bg-[#10161E] text-lg font-black">
            {profileName.charAt(0).toUpperCase()}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <p className="truncate font-black">{profileName}</p>

          {post.profile?.username && (
            <p className="text-xs text-[#0094FF]">
              @{post.profile.username}
            </p>
          )}

          <p className="mt-1 text-xs text-[#6F7A89]">
            {new Date(post.created_at).toLocaleString("en-GB")}
          </p>
        </div>
      </div>

      {post.location_name && (
        <div className="mt-4 flex items-center gap-2 text-sm text-[#9CA8B8]">
          <MapPin size={15} className="text-[#0094FF]" />
          {post.location_name}
        </div>
      )}

      {post.content && (
        <p className="mt-4 whitespace-pre-wrap text-sm leading-7">
          {post.content}
        </p>
      )}

      {media.length > 0 && (
        <div className="mt-4 overflow-hidden rounded-2xl border border-[#1A2330] bg-[#10161E]">
          {current?.media_type === "video" ? (
            <video
              controls
              src={current.media_url}
              className="max-h-[500px] w-full object-cover"
            />
          ) : (
            <img
              src={current?.media_url}
              alt="Post media"
              className="max-h-[500px] w-full object-cover"
            />
          )}

          {media.length > 1 && (
            <>
              <button
                onClick={() =>
                  setCurrentMedia((prev) =>
                    prev === 0 ? media.length - 1 : prev - 1
                  )
                }
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-3 text-white backdrop-blur-xl"
              >
                <ChevronLeft size={20} />
              </button>

              <button
                onClick={() =>
                  setCurrentMedia((prev) =>
                    prev === media.length - 1 ? 0 : prev + 1
                  )
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-3 text-white backdrop-blur-xl"
              >
                <ChevronRight size={20} />
              </button>

              <div className="flex items-center justify-center gap-2 py-3">
                {media.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 w-2 rounded-full ${
                      currentMedia === index
                        ? "bg-[#0094FF]"
                        : "bg-[#3B4653]"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      <div className="mt-4 flex items-center gap-5">
        <button
          onClick={() => onLike?.(post.id)}
          className="flex items-center gap-2 text-[#9CA8B8] transition hover:text-red-400"
        >
          <Heart size={20} />
          <span className="text-sm font-black">
            {post.like_count || 0}
          </span>
        </button>

        <button className="flex items-center gap-2 text-[#9CA8B8] transition hover:text-[#0094FF]">
          <MessageCircle size={20} />
          <span className="text-sm font-black">
            {post.comment_count || 0}
          </span>
        </button>
      </div>
    </GlassCard>
  );
}