"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="mb-5 inline-flex items-center gap-2 rounded-xl border border-[#1A2330] bg-[#10161E] px-4 py-3 text-sm font-black text-[#9CA8B8]"
    >
      <ArrowLeft size={18} />
      Back
    </button>
  );
}