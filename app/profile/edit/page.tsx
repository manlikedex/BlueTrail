"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Save, User } from "lucide-react";
import AppScreen from "../../../components/AppScreen";
import AuthGuard from "../../../components/AuthGuard";
import GlassCard from "../../../components/ui/GlassCard";
import PrimaryButton from "../../../components/ui/PrimaryButton";
import { supabase } from "../../../lib/supabase";

export default function EditProfilePage() {
  const router = useRouter();

  const [userId, setUserId] = useState("");
  const [fullName, setFullName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    setUserId(user.id);

    const { data } = await supabase
      .from("profiles")
      .select("full_name,display_name,username,bio,location,avatar_url")
      .eq("id", user.id)
      .maybeSingle();

    setFullName(data?.full_name || "");
    setDisplayName(data?.display_name || "");
    setUsername(data?.username || "");
    setLocation(data?.location || "");
    setBio(data?.bio || "");
    setAvatarUrl(data?.avatar_url || "");

    setLoading(false);
  }

  async function saveProfile() {
    setSaving(true);

    const cleanUsername = username
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "_")
      .replace(/[^a-z0-9_]/g, "");

    const { error } = await supabase.from("profiles").upsert({
      id: userId,
      full_name: fullName.trim() || null,
      display_name: displayName.trim() || null,
      username: cleanUsername || null,
      location: location.trim() || null,
      bio: bio.trim() || null,
      avatar_url: avatarUrl.trim() || null,
      updated_at: new Date().toISOString(),
    });

    setSaving(false);

    if (error) {
      alert(error.message);
      return;
    }

    router.push("/profile");
  }

  if (loading) {
    return (
      <AuthGuard>
        <AppScreen>
          <GlassCard>
            <p className="text-[#9CA8B8]">Loading profile editor...</p>
          </GlassCard>
        </AppScreen>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <AppScreen>
        <header>
          <p className="text-xs font-black uppercase tracking-[0.3em] text-[#0094FF]">
            Edit Profile
          </p>

          <h1 className="mt-3 text-5xl font-black tracking-tight">
            Update identity.
          </h1>

          <p className="mt-3 text-sm leading-6 text-[#9CA8B8]">
            This information is used for your BlueTrail profile, friend search,
            dive logs and future Trail Tag account features.
          </p>
        </header>

        <GlassCard className="mt-6">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="Profile avatar"
              className="h-20 w-20 rounded-2xl border border-[#1A2330] object-cover"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#1A2330] bg-[#10161E]">
              <User className="text-[#0094FF]" size={30} />
            </div>
          )}

          <div className="mt-6 grid gap-3">
            <InputBlock
              label="Full Name"
              value={fullName}
              setValue={setFullName}
              placeholder="Your full name"
            />

            <InputBlock
              label="Display Name"
              value={displayName}
              setValue={setDisplayName}
              placeholder="Jordan"
            />

            <InputBlock
              label="Username"
              value={username}
              setValue={setUsername}
              placeholder="jordyt"
            />

            <InputBlock
              label="Location"
              value={location}
              setValue={setLocation}
              placeholder="Cornwall, UK"
            />

            <InputBlock
              label="Avatar URL"
              value={avatarUrl}
              setValue={setAvatarUrl}
              placeholder="https://..."
            />

            <div>
              <p className="mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#7D8896]">
                Bio
              </p>

              <textarea
                className="min-h-[120px] w-full rounded-xl border border-[#1A2330] bg-[#05070A] px-4 py-4 text-white outline-none placeholder:text-[#6F7A89]"
                value={bio}
                placeholder="Diver, ocean explorer, marine life spotter..."
                onChange={(e) => setBio(e.target.value)}
              />
            </div>
          </div>

          <PrimaryButton
            onClick={saveProfile}
            disabled={saving}
            className="mt-6 flex w-full items-center justify-center gap-2"
          >
            <Save size={17} />
            {saving ? "Saving..." : "Save Profile"}
          </PrimaryButton>
        </GlassCard>
      </AppScreen>
    </AuthGuard>
  );
}

function InputBlock({
  label,
  value,
  setValue,
  placeholder,
}: {
  label: string;
  value: string;
  setValue: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div>
      <p className="mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#7D8896]">
        {label}
      </p>

      <input
        className="w-full rounded-xl border border-[#1A2330] bg-[#05070A] px-4 py-4 text-white outline-none placeholder:text-[#6F7A89]"
        value={value}
        placeholder={placeholder}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
}