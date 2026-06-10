"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { supabase } from "../lib/supabase";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

export default function PushNotificationToggle() {
  const [supported, setSupported] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const isSupported =
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      "PushManager" in window &&
      "Notification" in window;

    setSupported(isSupported);
    setEnabled(Notification.permission === "granted");
  }, []);

  async function enablePush() {
    if (!supported) {
      alert("Push notifications are not supported on this device/browser.");
      return;
    }

    setLoading(true);

    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      alert("Notifications permission was not granted.");
      setLoading(false);
      return;
    }

    const registration = await navigator.serviceWorker.register("/sw.js");

    const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

    if (!vapidPublicKey) {
      alert("Missing NEXT_PUBLIC_VAPID_PUBLIC_KEY.");
      setLoading(false);
      return;
    }

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("You must be logged in.");
      setLoading(false);
      return;
    }

    const subJson = subscription.toJSON();

    const { error } = await supabase.from("push_subscriptions").upsert({
      user_id: user.id,
      endpoint: subJson.endpoint,
      p256dh: subJson.keys?.p256dh,
      auth: subJson.keys?.auth,
    });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    setEnabled(true);
    setLoading(false);
  }

  if (!supported) return null;

  return (
    <button
      onClick={enablePush}
      disabled={loading || enabled}
      className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#0094FF]/40 bg-[#0094FF] px-5 py-4 text-sm font-black uppercase tracking-[0.14em] text-white disabled:bg-[#10161E] disabled:text-[#6F7A89]"
    >
      <Bell size={18} />
      {loading
        ? "Enabling..."
        : enabled
        ? "Push Notifications Enabled"
        : "Enable Push Notifications"}
    </button>
  );
}