"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Activity,
  Camera,
  Clock,
  Compass,
  Fish,
  MapPin,
  User,
  Waves,
} from "lucide-react";
import AppScreen from "../../../components/AppScreen";
import AuthGuard from "../../../components/AuthGuard";
import GlassCard from "../../../components/ui/GlassCard";
import AddFriendButton from "../../../components/AddFriendButton";
import PostCard from "../../../components/PostCard";
import { supabase } from "../../../lib/supabase";

type Profile = {
  id: string;
  username: string | null;
  display_name: string | null;
  full_name: string | null;
  bio: string | null;
  location: string | null;
  avatar_url: string | null;
  cover_url: string | null;
};

type DiveSession = {
  id: number;
  title: string | null;
  location_name: string | null;
  duration_seconds: number | null;
  max_depth: number | null;
  visibility: number | null;
  status: string | null;
};

type MediaItem = {
  id: number;
  post_id: number;
  media_url: string;
  media_type: string;
  sort_order: number;
};

type Post = {
  id: number;
  user_id: string;
  content: string | null;
  location_name: string | null;
  created_at: string;
  post_type?: string | null;
  dive_session_id?: number | null;
  profile?: any;
  media?: MediaItem[];
  like_count?: number;
  comment_count?: number;
  liked_by_me?: boolean;
  comments?: any[];
};

export default function PublicUserProfilePage() {
  const params = useParams();
  const username = String(params.username || "");

  const [profile, setProfile] = useState<Profile | null>(null);
  const [dives, setDives] = useState<DiveSession[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [speciesCount, setSpeciesCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, [username]);

  async function loadProfile() {
    setLoading(true);

    const cleanUsername = username.replace("@", "").toLowerCase();

    const { data: profileData } = await supabase
      .from("profiles")
      .select(
        "id,username,display_name,full_name,bio,location,avatar_url,cover_url"
      )
      .ilike("username", cleanUsername)
      .maybeSingle();

    if (!profileData) {
      setProfile(null);
      setLoading(false);
      return;
    }

    const foundProfile = profileData as Profile;
    setProfile(foundProfile);

    const { data: diveData } = await supabase
      .from("dive_sessions")
      .select(
        "id,title,location_name,duration_seconds,max_depth,visibility,status"
      )
      .eq("user_id", foundProfile.id)
      .eq("status", "completed")
      .order("created_at", { ascending: false })
      .limit(20);

    setDives((diveData as DiveSession[]) || []);

    const { data: speciesData } = await supabase
      .from("dive_photos")
      .select("species_name")
      .eq("user_id", foundProfile.id)
      .not("species_name", "is", null);

    const uniqueSpecies = new Set(
      ((speciesData as { species_name: string | null }[]) || [])
        .map((item) => item.species_name)
        .filter(
          (name): name is string =>
            Boolean(name) && name !== "Unknown marine species"
        )
    );

    setSpeciesCount(uniqueSpecies.size);

    await loadPosts(foundProfile);

    setLoading(false);
  }

  async function loadPosts(foundProfile: Profile) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const currentUserId = user?.id;

    const { data: postData } = await supabase
      .from("social_posts")
      .select("*")
      .eq("user_id", foundProfile.id)
      .order("created_at", { ascending: false })
      .limit(30);

    const postsBase = (postData as Post[]) || [];

    if (postsBase.length === 0) {
      setPosts([]);
      return;
    }

    const postIds = postsBase.map((post) => post.id);

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

    const commentUserIds = Array.from(
      new Set(((commentsData as any[]) || []).map((comment) => comment.user_id))
    );

    const { data: commentProfiles } =
      commentUserIds.length > 0
        ? await supabase
            .from("profiles")
            .select("id,username,display_name,full_name,avatar_url")
            .in("id", commentUserIds)
        : { data: [] };

    const profileMap: Record<string, any> = {
      [foundProfile.id]: foundProfile,
    };

    ((commentProfiles as any[]) || []).forEach((item) => {
      profileMap[item.id] = item;
    });

    const mediaMap: Record<number, MediaItem[]> = {};
    const likesMap: Record<number, any[]> = {};
    const commentsMap: Record<number, any[]> = {};

    ((mediaData as MediaItem[]) || []).forEach((media) => {
      if (!mediaMap[media.post_id]) mediaMap[media.post_id] = [];
      mediaMap[media.post_id].push(media);
    });

    ((likesData as any[]) || []).forEach((like) => {
      if (!likesMap[like.post_id]) likesMap[like.post_id] = [];
      likesMap[like.post_id].push(like);
    });

    ((commentsData as any[]) || []).forEach((comment) => {
      if (!commentsMap[comment.post_id]) commentsMap[comment.post_id] = [];
      commentsMap[comment.post_id].push({
        ...comment,
        profile: profileMap[comment.user_id],
      });
    });

    setPosts(
      postsBase.map((post) => {
        const likes = likesMap[post.id] || [];
        const comments = commentsMap[post.id] || [];

        return {
          ...post,
          profile: foundProfile,
          media: mediaMap[post.id] || [],
          comments,
          like_count: likes.length,
          comment_count: comments.length,
          liked_by_me: likes.some((like) => like.user_id === currentUserId),
        };
      })
    );
  }

  const displayName =
    profile?.display_name ||
    profile?.full_name ||
    profile?.username ||
    "BlueTrail User";

  const totalDiveSeconds = dives.reduce(
    (total, dive) => total + (dive.duration_seconds || 0),
    0
  );

  const deepestDive = dives.reduce((deepest, dive) => {
    const depth = Number(dive.max_depth || 0);
    return depth > deepest ? depth : deepest;
  }, 0);

  const averageVisibility = useMemo(() => {
    const values = dives
      .map((dive) => dive.visibility)
      .filter((value): value is number => typeof value === "number");

    if (values.length === 0) return null;

    return Math.round(
      values.reduce((total, value) => total + value, 0) / values.length
    );
  }, [dives]);

  function formatDuration(seconds: number) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);

    if (hrs > 0) return `${hrs}h ${mins}m`;
    return `${mins}m`;
  }

  if (loading) {
    return (
      <AuthGuard>
        <AppScreen>
          <GlassCard>
            <p className="text-[#9CA8B8]">Loading profile...</p>
          </GlassCard>
        </AppScreen>
      </AuthGuard>
    );
  }

  if (!profile) {
    return (
      <AuthGuard>
        <AppScreen>
          <GlassCard>
            <p className="text-2xl font-black">User not found</p>
            <p className="mt-2 text-sm text-[#9CA8B8]">
              This BlueTrail profile does not exist.
            </p>
          </GlassCard>
        </AppScreen>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <AppScreen>
        <header className="overflow-hidden rounded-3xl border border-[#1A2330] bg-[#0B0F14]">
          <div className="h-40 bg-[#10161E]">
            {profile.cover_url ? (
              <img
                src={profile.cover_url}
                alt={`${displayName} cover`}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_top,#0094FF33,transparent_45%)]">
                <Waves className="text-[#0094FF]" size={42} />
              </div>
            )}
          </div>

          <div className="p-5">
            <div className="-mt-16 flex items-end gap-4">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={displayName}
                  className="h-24 w-24 rounded-3xl border-4 border-[#0B0F14] object-cover"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-3xl border-4 border-[#0B0F14] bg-[#10161E]">
                  <User className="text-[#0094FF]" size={42} />
                </div>
              )}

              <div className="min-w-0 pb-2">
                <h1 className="truncate text-4xl font-black tracking-tight">
                  {displayName}
                </h1>

                {profile.username && (
                  <p className="mt-1 text-sm font-black text-[#0094FF]">
                    @{profile.username}
                  </p>
                )}
              </div>
            </div>

            {profile.location && (
              <p className="mt-4 flex items-center gap-2 text-sm text-[#9CA8B8]">
                <MapPin size={15} className="text-[#0094FF]" />
                {profile.location}
              </p>
            )}

            {profile.bio && (
              <p className="mt-4 text-sm leading-7 text-[#9CA8B8]">
                {profile.bio}
              </p>
            )}

            <div className="mt-5">
              <AddFriendButton targetUserId={profile.id} />
            </div>
          </div>
        </header>

        <section className="mt-5 grid grid-cols-2 gap-3">
          <StatCard
            icon={<Activity size={18} className="text-[#0094FF]" />}
            label="Dives"
            value={String(dives.length)}
          />

          <StatCard
            icon={<Clock size={18} className="text-[#0094FF]" />}
            label="Dive Time"
            value={formatDuration(totalDiveSeconds)}
          />

          <StatCard
            icon={<Waves size={18} className="text-[#0094FF]" />}
            label="Deepest"
            value={deepestDive ? `${deepestDive}m` : "--"}
          />

          <StatCard
            icon={<Compass size={18} className="text-[#0094FF]" />}
            label="Avg Visibility"
            value={averageVisibility ? `${averageVisibility}m` : "--"}
          />

          <StatCard
            icon={<Fish size={18} className="text-[#0094FF]" />}
            label="Species"
            value={String(speciesCount)}
          />

          <StatCard
            icon={<Camera size={18} className="text-[#0094FF]" />}
            label="Posts"
            value={String(posts.length)}
          />
        </section>

        <section className="mt-6">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.25em] text-[#0094FF]">
            Shared Posts
          </p>

          {posts.length === 0 ? (
            <GlassCard>
              <p className="font-black">No shared posts yet</p>
              <p className="mt-2 text-sm text-[#9CA8B8]">
                This user has not shared any BlueTrail posts yet.
              </p>
            </GlassCard>
          ) : (
            <div className="grid gap-5">
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onChanged={() => loadPosts(profile)}
                />
              ))}
            </div>
          )}
        </section>
      </AppScreen>
    </AuthGuard>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <GlassCard>
      <div className="flex items-center gap-2">
        {icon}

        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#7D8896]">
          {label}
        </p>
      </div>

      <p className="mt-3 text-2xl font-black">{value}</p>
    </GlassCard>
  );
}