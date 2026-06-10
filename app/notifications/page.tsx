"use client";

import { useEffect, useState } from "react";
import { Bell, CheckCheck, Heart, MessageCircle, UserPlus } from "lucide-react";
import AppScreen from "../../components/AppScreen";
import AuthGuard from "../../components/AuthGuard";
import GlassCard from "../../components/ui/GlassCard";
import PushNotificationToggle from "../../components/PushNotificationToggle";
import { supabase } from "../../lib/supabase";

type NotificationItem = {
  id: number;
  user_id: string;
  actor_id: string | null;
  type: string;
  title: string;
  body: string | null;
  reference_id: number | null;
  read: boolean;
  created_at: string;
};

export default function NotificationsPage() {
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  async function loadNotifications() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(100);

    setItems((data as NotificationItem[]) || []);
    setLoading(false);
  }

  async function markAllRead() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    await supabase
      .from("notifications")
      .update({ read: true })
      .eq("user_id", user.id);

    loadNotifications();
  }

  function iconFor(type: string) {
    if (type === "like") return <Heart size={20} className="text-red-400" />;
    if (type === "comment")
      return <MessageCircle size={20} className="text-[#0094FF]" />;
    if (type === "friend_request")
      return <UserPlus size={20} className="text-green-400" />;

    return <Bell size={20} className="text-[#0094FF]" />;
  }

  return (
    <AuthGuard>
      <AppScreen>
        <header>
          <p className="text-xs font-black uppercase tracking-[0.3em] text-[#0094FF]">
            Notifications
          </p>

          <h1 className="mt-3 text-5xl font-black tracking-tight">
            Activity
          </h1>

          <p className="mt-3 text-sm leading-6 text-[#9CA8B8]">
            Likes, comments, friend requests and BlueTrail updates.
          </p>
        </header>

        <div className="mt-6">
          <PushNotificationToggle />
        </div>

        <button
          onClick={markAllRead}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-[#1A2330] bg-[#10161E] px-5 py-4 text-sm font-black uppercase tracking-[0.14em] text-[#9CA8B8]"
        >
          <CheckCheck size={18} />
          Mark All Read
        </button>

        <section className="mt-6 grid gap-3">
          {loading ? (
            <GlassCard>
              <p className="text-[#9CA8B8]">Loading notifications...</p>
            </GlassCard>
          ) : items.length === 0 ? (
            <GlassCard>
              <p className="font-black">No notifications yet</p>
              <p className="mt-2 text-sm text-[#9CA8B8]">
                Likes, comments and friend activity will appear here.
              </p>
            </GlassCard>
          ) : (
            items.map((item) => (
              <GlassCard key={item.id}>
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#1A2330] bg-[#10161E]">
                    {iconFor(item.type)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-black">{item.title}</p>

                      {!item.read && (
                        <span className="rounded-full bg-[#0094FF] px-2 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-white">
                          New
                        </span>
                      )}
                    </div>

                    {item.body && (
                      <p className="mt-2 text-sm leading-6 text-[#9CA8B8]">
                        {item.body}
                      </p>
                    )}

                    <p className="mt-3 text-xs text-[#6F7A89]">
                      {new Date(item.created_at).toLocaleString("en-GB")}
                    </p>
                  </div>
                </div>
              </GlassCard>
            ))
          )}
        </section>
      </AppScreen>
    </AuthGuard>
  );
}