import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import webpush from "web-push";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const adminSupabase = createClient(supabaseUrl, serviceRoleKey);

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT || "mailto:hello@bluetrail.app",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export async function POST(req: Request) {
  try {
    const { userId, title, body, url } = await req.json();

    if (!userId || !title) {
      return NextResponse.json(
        { error: "Missing userId or title." },
        { status: 400 }
      );
    }

    const { data: subscriptions, error } = await adminSupabase
      .from("push_subscriptions")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const payload = JSON.stringify({
      title,
      body: body || "You have a new BlueTrail notification.",
      url: url || "/notifications",
    });

    await Promise.all(
      (subscriptions || []).map(async (sub) => {
        try {
          await webpush.sendNotification(
            {
              endpoint: sub.endpoint,
              keys: {
                p256dh: sub.p256dh,
                auth: sub.auth,
              },
            },
            payload
          );
        } catch {
          await adminSupabase
            .from("push_subscriptions")
            .delete()
            .eq("id", sub.id);
        }
      })
    );

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Push send failed." },
      { status: 500 }
    );
  }
}