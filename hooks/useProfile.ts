"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export type Profile = {
  id: string;
  username: string | null;
  display_name: string | null;
  activities: string[] | null;
  experience_level: string | null;
  home_region: string | null;
  avatar_url: string | null;
};

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    setProfile(data);
    setLoading(false);
  }

  return { profile, loading };
}