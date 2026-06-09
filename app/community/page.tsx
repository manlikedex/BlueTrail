"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Plus, UserPlus } from "lucide-react";
import AppScreen from "../../components/AppScreen";
import AuthGuard from "../../components/AuthGuard";
import GlassCard from "../../components/ui/GlassCard";
import CreatePostModal from "../../components/CreatePostModal";
import PostCard from "../../components/PostCard";
import StoriesBar from "../../components/StoriesBar";
import { supabase } from "../../lib/supabase";

type Profile = {
  id: string;
  username: string | null;
  display_name: string | null;
  full_name: string | null;
  avatar_url: string | null;
};

type MediaItem = {
  id: number;
  post_id: number;
  media_url: string;
  media_type: string;
  sort_order: number;
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
  profile?: Profile;
  media?: MediaItem[];
  like_count?: number;
  comment_count?: number;
  liked_by_me?: boolean;
  comments?: Comment[];
};

type Story = {
  id: number;
  user_id: string;
  media_url: string;
  media_type: string;
  created_at: string;
  expires_at: string;
  profile?: Profile;
};

type Like = {
  id: number;
  post_id: number;
  user_id: string;
};

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [postModalOpen, setPostModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCommunity();
  }, []);

  async function loadCommunity() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const currentUserId = user?.id;

    const { data: postData } = await supabase
      .from("social_posts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    const postsBase = (postData as Post[]) || [];

    if (postsBase.length === 0) {
      setPosts([]);
      await loadStories();
      setLoading(false);
      return;
    }

    const postIds = postsBase.map((post) => post.id);
    const postUserIds = postsBase.map((post) => post.user_id);

    const { data: mediaData } = await supabase
      .from("social_post_media")
      .select("*")
      .in("post_id", postIds)
      .order("sort_order", { ascending: true });

    const { data: likesData } = await supabase
      .from("social_likes")
      .select("*")
      .in("post_id", postIds);

    const { data: commentsData } = await supabase
      .from("social_comments")
      .select("*")
      .in("post_id", postIds)
      .order("created_at", { ascending: true });

    const commentUserIds = ((commentsData as Comment[]) || []).map(
      (comment) => comment.user_id
    );

    const allUserIds = Array.from(new Set([...postUserIds, ...commentUserIds]));

    const { data: profileData } =
      allUserIds.length > 0
        ? await supabase
            .from("profiles")
            .select("id,username,display_name,full_name,avatar_url")
            .in("id", allUserIds)
        : { data: [] };

    const profileMap: Record<string, Profile> = {};
    const mediaMap: Record<number, MediaItem[]> = {};
    const likesMap: Record<number, Like[]> = {};
    const commentsMap: Record<number, Comment[]> = {};

    ((profileData as Profile[]) || []).forEach((profile) => {
      profileMap[profile.id] = profile;
    });

    ((mediaData as MediaItem[]) || []).forEach((media) => {
      if (!mediaMap[media.post_id]) {
        mediaMap[media.post_id] = [];
      }

      mediaMap[media.post_id].push(media);
    });

    ((likesData as Like[]) || []).forEach((like) => {
      if (!likesMap[like.post_id]) {
        likesMap[like.post_id] = [];
      }

      likesMap[like.post_id].push(like);
    });

    ((commentsData as Comment[]) || []).forEach((comment) => {
      if (!commentsMap[comment.post_id]) {
        commentsMap[comment.post_id] = [];
      }

      commentsMap[comment.post_id].push({
        ...comment,
        profile: profileMap[comment.user_id],
      });
    });

    const finalPosts = postsBase.map((post) => {
      const likes = likesMap[post.id] || [];
      const comments = commentsMap[post.id] || [];

      return {
        ...post,
        profile: profileMap[post.user_id],
        media: mediaMap[post.id] || [],
        comments,
        like_count: likes.length,
        comment_count: comments.length,
        liked_by_me: likes.some((like) => like.user_id === currentUserId),
      };
    });

    setPosts(finalPosts);

    await loadStories();
    setLoading(false);
  }

  async function loadStories() {
    const now = new Date().toISOString();

    const { data: storyData } = await supabase
      .from("stories")
      .select("*")
      .gt("expires_at", now)
      .order("created_at", { ascending: false });

    const storiesBase = (storyData as Story[]) || [];
    const userIds = Array.from(
      new Set(storiesBase.map((story) => story.user_id))
    );

    const { data: profileData } =
      userIds.length > 0
        ? await supabase
            .from("profiles")
            .select("id,username,display_name,full_name,avatar_url")
            .in("id", userIds)
        : { data: [] };

    const profileMap: Record<string, Profile> = {};

    ((profileData as Profile[]) || []).forEach((profile) => {
      profileMap[profile.id] = profile;
    });

    setStories(
      storiesBase.map((story) => ({
        ...story,
        profile: profileMap[story.user_id],
      }))
    );
  }

  const hasPosts = useMemo(() => posts.length > 0, [posts]);

  return (
    <AuthGuard>
      <AppScreen>
        <header>
          <p className="text-xs font-black uppercase tracking-[0.3em] text-[#0094FF]">
            Community
          </p>

          <h1 className="mt-3 text-5xl font-black tracking-tight">
            BlueTrail Social
          </h1>

          <p className="mt-3 text-sm leading-6 text-[#9CA8B8]">
            Share dive updates, marine life photos, videos, sightings and ocean
            stories with other explorers.
          </p>
        </header>

        <StoriesBar stories={stories} onStoryAdded={loadStories} />

        <section className="mt-6 grid grid-cols-2 gap-3">
          <button
            onClick={() => setPostModalOpen(true)}
            className="flex items-center justify-center gap-2 rounded-2xl border border-[#0094FF]/40 bg-[#0094FF] px-5 py-4 text-sm font-black uppercase tracking-[0.14em] text-white"
          >
            <Plus size={18} />
            Create Post
          </button>

          <Link
            href="/friends"
            className="flex items-center justify-center gap-2 rounded-2xl border border-[#1A2330] bg-[#10161E] px-5 py-4 text-sm font-black uppercase tracking-[0.14em] text-[#9CA8B8]"
          >
            <UserPlus size={18} />
            Add Friends
          </Link>
        </section>

        {loading ? (
          <GlassCard className="mt-6">
            <p className="text-[#9CA8B8]">Loading community feed...</p>
          </GlassCard>
        ) : !hasPosts ? (
          <GlassCard className="mt-6">
            <p className="font-black">No posts yet</p>
            <p className="mt-2 text-sm leading-6 text-[#9CA8B8]">
              Be the first to share a dive, species photo, story or ocean
              update.
            </p>
          </GlassCard>
        ) : (
          <section className="mt-6 grid gap-5">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onChanged={loadCommunity}
              />
            ))}
          </section>
        )}

        <CreatePostModal
          open={postModalOpen}
          onClose={() => setPostModalOpen(false)}
          onPosted={loadCommunity}
        />
      </AppScreen>
    </AuthGuard>
  );
}