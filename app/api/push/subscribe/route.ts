import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const adminSupabase = createClient(supabaseUrl, serviceRoleKey);

export async function POST(req: Request) {
  try {
    const { userId, subscription } = await req.json();

    if (!userId || !subscription?.endpoint) {
      return NextResponse.json(
        { error: "Missing userId or subscription." },
        { status: 400 }
      );
    }

    const { error } = await adminSupabase.from("push_subscriptions").upsert({
      user_id: userId,
      endpoint: subscription.endpoint,
      p256dh: subscription.keys?.p256dh,
      auth: subscription.keys?.auth,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Subscribe failed." },
      { status: 500 }
    );
  }
}