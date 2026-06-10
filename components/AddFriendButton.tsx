"use client";

import { useEffect, useState } from "react";
import { Check, Clock3, UserPlus } from "lucide-react";
import { supabase } from "../lib/supabase";

export default function AddFriendButton({
  targetUserId,
}: {
  targetUserId: string;
}) {
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<
    "none" | "pending" | "friends" | "self"
  >("none");

  useEffect(() => {
    loadStatus();
  }, [targetUserId]);

  async function loadStatus() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    if (user.id === targetUserId) {
      setStatus("self");
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from("friendships")
      .select("*")
      .or(
        `and(sender_id.eq.${user.id},receiver_id.eq.${targetUserId}),and(sender_id.eq.${targetUserId},receiver_id.eq.${user.id})`
      )
      .limit(1)
      .maybeSingle();

    if (data) {
      if (data.status === "accepted") {
        setStatus("friends");
      } else {
        setStatus("pending");
      }
    } else {
      setStatus("none");
    }

    setLoading(false);
  }

  async function sendRequest() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    setLoading(true);

    const { error } = await supabase.from("friendships").insert({
      sender_id: user.id,
      receiver_id: targetUserId,
      status: "pending",
    });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    await supabase.from("notifications").insert({
      user_id: targetUserId,
      actor_id: user.id,
      type: "friend_request",
      title: "Friend Request",
      body: "You received a new friend request.",
    });

    try {
      await fetch("/api/push/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: targetUserId,
          title: "Friend Request",
          body: "You received a new friend request.",
          url: "/friends",
        }),
      });
    } catch {}

    setStatus("pending");
    setLoading(false);
  }

  if (status === "self") return null;

  if (loading) {
    return (
      <button
        disabled
        className="w-full rounded-xl border border-[#1A2330] bg-[#10161E] px-5 py-4 text-sm font-black uppercase tracking-[0.14em] text-[#6F7A89]"
      >
        Loading...
      </button>
    );
  }

  if (status === "friends") {
    return (
      <button
        disabled
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-green-500/30 bg-green-500/10 px-5 py-4 text-sm font-black uppercase tracking-[0.14em] text-green-300"
      >
        <Check size={18} />
        Friends
      </button>
    );
  }

  if (status === "pending") {
    return (
      <button
        disabled
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-yellow-500/30 bg-yellow-500/10 px-5 py-4 text-sm font-black uppercase tracking-[0.14em] text-yellow-300"
      >
        <Clock3 size={18} />
        Request Sent
      </button>
    );
  }

  return (
    <button
      onClick={sendRequest}
      className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#0094FF]/40 bg-[#0094FF] px-5 py-4 text-sm font-black uppercase tracking-[0.14em] text-white"
    >
      <UserPlus size={18} />
      Add Friend
    </button>
  );
}