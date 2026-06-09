"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Search, UserPlus, Users, X } from "lucide-react";
import AppScreen from "../../components/AppScreen";
import AuthGuard from "../../components/AuthGuard";
import GlassCard from "../../components/ui/GlassCard";
import { supabase } from "../../lib/supabase";

type Profile = {
  id: string;
  username: string | null;
  full_name: string | null;
  display_name?: string | null;
  avatar_url?: string | null;
};

type Friendship = {
  id: number;
  requester_id: string;
  receiver_id: string;
  status: string;
  created_at: string;
};

export default function FriendsPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [friendships, setFriendships] = useState<Friendship[]>([]);
  const [profileMap, setProfileMap] = useState<Record<string, Profile>>({});
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    setUserId(user.id);

    const { data: friendshipData } = await supabase
      .from("friendships")
      .select("*")
      .or(`requester_id.eq.${user.id},receiver_id.eq.${user.id}`)
      .order("created_at", { ascending: false });

    const rows = (friendshipData as Friendship[]) || [];
    setFriendships(rows);

    const ids = Array.from(
      new Set(rows.flatMap((item) => [item.requester_id, item.receiver_id]))
    );

    if (ids.length > 0) {
      const { data: profileData } = await supabase
        .from("profiles")
        .select("id, username, full_name, display_name, avatar_url")
        .in("id", ids);

      const map: Record<string, Profile> = {};

      ((profileData as Profile[]) || []).forEach((profile) => {
        map[profile.id] = profile;
      });

      setProfileMap(map);
    }
  }

  async function searchUsers() {
    if (!query.trim() || !userId) return;

    setSearching(true);

    const search = query.trim();

    const { data } = await supabase
      .from("profiles")
      .select("id, username, full_name, display_name, avatar_url")
      .or(
        `username.ilike.%${search}%,full_name.ilike.%${search}%,display_name.ilike.%${search}%`
      )
      .neq("id", userId)
      .limit(30);

    setProfiles((data as Profile[]) || []);
    setSearching(false);
  }

  async function sendRequest(receiverId: string) {
    if (!userId || receiverId === userId) return;

    const exists = friendships.some(
      (item) =>
        (item.requester_id === userId && item.receiver_id === receiverId) ||
        (item.requester_id === receiverId && item.receiver_id === userId)
    );

    if (exists) {
      alert("You already have a request or friendship with this user.");
      return;
    }

    const { error } = await supabase.from("friendships").insert({
      requester_id: userId,
      receiver_id: receiverId,
      status: "pending",
    });

    if (error) {
      alert(error.message);
      return;
    }

    await supabase.from("notifications").insert({
      user_id: receiverId,
      title: "New friend request",
      body: "Someone sent you a friend request on BlueTrail.",
      type: "friend_request",
    });

    await loadData();
  }

  async function acceptRequest(request: Friendship) {
    const { error } = await supabase
      .from("friendships")
      .update({ status: "accepted" })
      .eq("id", request.id);

    if (error) {
      alert(error.message);
      return;
    }

    await supabase.from("notifications").insert({
      user_id: request.requester_id,
      title: "Friend request accepted",
      body: "Your BlueTrail friend request was accepted.",
      type: "friend_accepted",
    });

    await loadData();
  }

  async function declineRequest(id: number) {
    const { error } = await supabase.from("friendships").delete().eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    await loadData();
  }

  function displayName(profile?: Profile) {
    if (!profile) return "BlueTrail user";
    return (
      profile.display_name ||
      profile.full_name ||
      profile.username ||
      "BlueTrail user"
    );
  }

  function username(profile?: Profile) {
    if (!profile?.username) return "No username";
    return `@${profile.username}`;
  }

  const incoming = friendships.filter(
    (item) => item.receiver_id === userId && item.status === "pending"
  );

  const outgoing = friendships.filter(
    (item) => item.requester_id === userId && item.status === "pending"
  );

  const friends = friendships.filter((item) => item.status === "accepted");

  const existingUserIds = useMemo(() => {
    return new Set(
      friendships.flatMap((item) => [item.requester_id, item.receiver_id])
    );
  }, [friendships]);

  return (
    <AuthGuard>
      <AppScreen>
        <header>
          <p className="text-xs font-black uppercase tracking-[0.3em] text-[#0094FF]">
            Friends
          </p>

          <h1 className="mt-3 text-5xl font-black tracking-tight">
            Find ocean friends.
          </h1>

          <p className="mt-3 text-sm leading-6 text-[#9CA8B8]">
            Search BlueTrail users, send friend requests and build your ocean
            network.
          </p>
        </header>

        <GlassCard className="mt-6">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6F7A89]"
              />

              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") searchUsers();
                }}
                placeholder="Search username or name..."
                className="w-full rounded-xl border border-[#1A2330] bg-[#05070A] py-4 pl-12 pr-4 text-white outline-none placeholder:text-[#6F7A89]"
              />
            </div>

            <button
              onClick={searchUsers}
              disabled={searching}
              className="rounded-xl bg-[#0094FF] px-5 py-4 text-sm font-black uppercase tracking-[0.14em] text-white"
            >
              {searching ? "..." : "Search"}
            </button>
          </div>
        </GlassCard>

        {profiles.length > 0 && (
          <section className="mt-6 grid gap-3">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-[#0094FF]">
              Search Results
            </p>

            {profiles.map((profile) => {
              const alreadyConnected = existingUserIds.has(profile.id);

              return (
                <GlassCard key={profile.id}>
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="truncate font-black">
                        {displayName(profile)}
                      </p>
                      <p className="mt-1 text-sm text-[#9CA8B8]">
                        {username(profile)}
                      </p>
                    </div>

                    <button
                      onClick={() => sendRequest(profile.id)}
                      disabled={alreadyConnected}
                      className={`flex items-center gap-2 rounded-xl px-4 py-3 text-xs font-black uppercase tracking-[0.12em] ${
                        alreadyConnected
                          ? "bg-[#10161E] text-[#6F7A89]"
                          : "bg-[#0094FF] text-white"
                      }`}
                    >
                      <UserPlus size={15} />
                      {alreadyConnected ? "Added" : "Add"}
                    </button>
                  </div>
                </GlassCard>
              );
            })}
          </section>
        )}

        <section className="mt-6 grid gap-3">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-[#0094FF]">
            Friend Requests
          </p>

          {incoming.length === 0 ? (
            <GlassCard>
              <p className="text-[#9CA8B8]">No pending friend requests.</p>
            </GlassCard>
          ) : (
            incoming.map((request) => {
              const requester = profileMap[request.requester_id];

              return (
                <GlassCard key={request.id}>
                  <p className="font-black">{displayName(requester)}</p>
                  <p className="mt-1 text-sm text-[#9CA8B8]">
                    {username(requester)}
                  </p>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <button
                      onClick={() => acceptRequest(request)}
                      className="flex items-center justify-center gap-2 rounded-xl bg-[#0094FF] px-4 py-3 text-xs font-black uppercase tracking-[0.12em] text-white"
                    >
                      <Check size={15} />
                      Accept
                    </button>

                    <button
                      onClick={() => declineRequest(request.id)}
                      className="flex items-center justify-center gap-2 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-xs font-black uppercase tracking-[0.12em] text-red-300"
                    >
                      <X size={15} />
                      Decline
                    </button>
                  </div>
                </GlassCard>
              );
            })
          )}
        </section>

        <section className="mt-6 grid gap-3">
          <div className="flex items-center gap-2">
            <Users className="text-[#0094FF]" size={20} />
            <p className="text-xs font-black uppercase tracking-[0.25em] text-[#0094FF]">
              Friends
            </p>
          </div>

          {friends.length === 0 ? (
            <GlassCard>
              <p className="text-[#9CA8B8]">No friends yet.</p>
            </GlassCard>
          ) : (
            friends.map((friend) => {
              const otherId =
                friend.requester_id === userId
                  ? friend.receiver_id
                  : friend.requester_id;

              const otherProfile = profileMap[otherId];

              return (
                <GlassCard key={friend.id}>
                  <p className="font-black">{displayName(otherProfile)}</p>
                  <p className="mt-1 text-sm text-[#9CA8B8]">
                    {username(otherProfile)}
                  </p>
                  <p className="mt-3 text-xs font-black uppercase tracking-[0.14em] text-green-400">
                    Connected
                  </p>
                </GlassCard>
              );
            })
          )}
        </section>

        {outgoing.length > 0 && (
          <section className="mt-6 grid gap-3">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-[#0094FF]">
              Sent Requests
            </p>

            {outgoing.map((request) => {
              const receiver = profileMap[request.receiver_id];

              return (
                <GlassCard key={request.id}>
                  <p className="font-black">{displayName(receiver)}</p>
                  <p className="mt-1 text-sm text-[#9CA8B8]">
                    {username(receiver)}
                  </p>
                  <p className="mt-3 text-xs font-black uppercase tracking-[0.14em] text-yellow-400">
                    Pending
                  </p>
                </GlassCard>
              );
            })}
          </section>
        )}
      </AppScreen>
    </AuthGuard>
  );
}