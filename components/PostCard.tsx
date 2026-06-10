"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  MapPin,
  MessageCircle,
  Send,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import GlassCard from "./ui/GlassCard";
import PostRouteMap from "./PostRouteMap";

type MediaItem = {
  id: number;
  media_url: string;
  media_type: string;
  sort_order: number;
};

type Profile = {
  id?: string;
  username: string | null;
  display_name: string | null;
  full_name: string | null;
  avatar_url: string | null;
};

type Comment = {
  id: number;
  post_id: number;
  user_id: string;
  comment: string;
  created_at: string;
  profile?: Profile;
};

type Post = {
  id: number;
  user_id: string;
  content: string | null;
  location_name: string | null;
  created_at: string;
  post_type?: string | null;
  dive_session_id?: number | null;
  profile?: Profile;
  media?: MediaItem[];
  like_count?: number;
  comment_count?: number;
  liked_by_me?: boolean;
  comments?: Comment[];
};

export default function PostCard({
  post,
  onChanged,
}: {
  post: Post;
  onChanged?: () => void;
}) {
  const [currentMedia, setCurrentMedia] = useState(0);
  const [commentOpen, setCommentOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [liking, setLiking] = useState(false);

  const media = useMemo(() => {
    return [...(post.media || [])].sort((a, b) => a.sort_order - b.sort_order);
  }, [post.media]);

  const profileName =
    post.profile?.display_name ||
    post.profile?.full_name ||
    post.profile?.username ||
    "BlueTrail User";

  const profileHref = post.profile?.username
    ? `/u/${post.profile.username}`
    : null;

  const current = media[currentMedia];

  async function sendPush(userId: string, title: string, body: string) {
    await fetch("/api/push/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        title,
        body,
        url: "/notifications",
      }),
    });
  }

  async function toggleLike() {
    if (liking) return;

    setLiking(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLiking(false);
      return;
    }

    if (post.liked_by_me) {
      await supabase
        .from("social_likes")
        .delete()
        .eq("post_id", post.id)
        .eq("user_id", user.id);
    } else {
      await supabase.from("social_likes").upsert({
        post_id: post.id,
        user_id: user.id,
      });

      if (post.user_id !== user.id) {
        await supabase.from("notifications").insert({
          user_id: post.user_id,
          actor_id: user.id,
          type: "like",
          title: "New Like",
          body: "Someone liked your BlueTrail post.",
          reference_id: post.id,
        });

        await sendPush(
          post.user_id,
          "New Like",
          "Someone liked your BlueTrail post."
        );
      }
    }

    setLiking(false);
    onChanged?.();
  }

  async function addComment() {
    if (!commentText.trim()) return;

    setSubmittingComment(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setSubmittingComment(false);
      return;
    }

    const text = commentText.trim();

    const { error } = await supabase.from("social_comments").insert({
      post_id: post.id,
      user_id: user.id,
      comment: text,
    });

    if (!error) {
      if (post.user_id !== user.id) {
        await supabase.from("notifications").insert({
          user_id: post.user_id,
          actor_id: user.id,
          type: "comment",
          title: "New Comment",
          body: text,
          reference_id: post.id,
        });

        await sendPush(post.user_id, "New Comment", text);
      }

      setCommentText("");
      onChanged?.();
    } else {
      alert(error.message);
    }

    setSubmittingComment(false);
  }

  function commentName(comment: Comment) {
    return (
      comment.profile?.display_name ||
      comment.profile?.full_name ||
      comment.profile?.username ||
      "BlueTrail User"
    );
  }

  function commentHref(comment: Comment) {
    return comment.profile?.username ? `/u/${comment.profile.username}` : null;
  }

  function ProfileAvatar() {
    const avatar = post.profile?.avatar_url ? (
      <img
        src={post.profile.avatar_url}
        alt={profileName}
        className="h-12 w-12 rounded-full border border-[#1A2330] object-cover"
      />
    ) : (
      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#1A2330] bg-[#10161E] text-lg font-black">
        {profileName.charAt(0).toUpperCase()}
      </div>
    );

    if (!profileHref) return avatar;

    return <Link href={profileHref}>{avatar}</Link>;
  }

  function ProfileText() {
    const text = (
      <>
        <p className="truncate font-black">{profileName}</p>

        {post.profile?.username && (
          <p className="text-xs text-[#0094FF]">@{post.profile.username}</p>
        )}
      </>
    );

    if (!profileHref) return text;

    return (
      <Link href={profileHref} className="block transition hover:opacity-80">
        {text}
      </Link>
    );
  }

  return (
    <GlassCard>
      {post.post_type === "dive_log" && (
        <div className="mb-4 inline-flex rounded-full border border-[#0094FF]/40 bg-[#0094FF]/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-[#7CC6FF]">
          Shared Dive Log
        </div>
      )}

      <div className="flex items-start gap-3">
        <ProfileAvatar />

        <div className="min-w-0 flex-1">
          <ProfileText />

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

      {post.post_type === "dive_log" && post.dive_session_id && (
        <PostRouteMap diveSessionId={post.dive_session_id} />
      )}

      {media.length > 0 && (
        <div className="relative mt-4 overflow-hidden rounded-2xl border border-[#1A2330] bg-[#10161E]">
          {current?.media_type === "video" ? (
            <video
              controls
              src={current.media_url}
              className="block max-h-[500px] w-full object-cover"
            />
          ) : (
            <img
              src={current?.media_url}
              alt="Post media"
              className="block max-h-[500px] w-full object-cover"
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
                      currentMedia === index ? "bg-[#0094FF]" : "bg-[#3B4653]"
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
          onClick={toggleLike}
          disabled={liking}
          className={`flex items-center gap-2 transition ${
            post.liked_by_me ? "text-red-400" : "text-[#9CA8B8]"
          }`}
        >
          <Heart size={20} fill={post.liked_by_me ? "currentColor" : "none"} />
          <span className="text-sm font-black">{post.like_count || 0}</span>
        </button>

        <button
          onClick={() => setCommentOpen((value) => !value)}
          className="flex items-center gap-2 text-[#9CA8B8] transition hover:text-[#0094FF]"
        >
          <MessageCircle size={20} />
          <span className="text-sm font-black">{post.comment_count || 0}</span>
        </button>
      </div>

      {commentOpen && (
        <div className="mt-5 rounded-2xl border border-[#1A2330] bg-[#05070A] p-4">
          <div className="grid gap-3">
            {(post.comments || []).length === 0 ? (
              <p className="text-sm text-[#6F7A89]">No comments yet.</p>
            ) : (
              (post.comments || []).map((comment) => {
                const href = commentHref(comment);

                return (
                  <div key={comment.id} className="rounded-xl bg-[#10161E] p-3">
                    {href ? (
                      <Link
                        href={href}
                        className="text-sm font-black transition hover:text-[#0094FF]"
                      >
                        {commentName(comment)}
                      </Link>
                    ) : (
                      <p className="text-sm font-black">
                        {commentName(comment)}
                      </p>
                    )}

                    <p className="mt-1 text-sm leading-6 text-[#DDE7F0]">
                      {comment.comment}
                    </p>

                    <p className="mt-2 text-[11px] text-[#6F7A89]">
                      {new Date(comment.created_at).toLocaleString("en-GB")}
                    </p>
                  </div>
                );
              })
            )}
          </div>

          <div className="mt-4 flex gap-2">
            <input
              value={commentText}
              onChange={(event) => setCommentText(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") addComment();
              }}
              placeholder="Write a comment..."
              className="min-w-0 flex-1 rounded-xl border border-[#1A2330] bg-[#0B0F14] px-4 py-3 text-white outline-none placeholder:text-[#6F7A89]"
            />

            <button
              onClick={addComment}
              disabled={submittingComment}
              className="rounded-xl bg-[#0094FF] px-4 py-3 text-white"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </GlassCard>
  );
}