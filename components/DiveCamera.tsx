"use client";

import { useRef, useState } from "react";
import { Camera, Download, ImagePlus, RefreshCw, X } from "lucide-react";
import { supabase } from "../lib/supabase";
import GlassCard from "./ui/GlassCard";

export default function DiveCamera({ sessionId }: { sessionId: number }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const [cameraOpen, setCameraOpen] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [species, setSpecies] = useState<any>(null);
  const [uploading, setUploading] = useState(false);

  async function openCamera() {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });

      setStream(mediaStream);
      setCameraOpen(true);

      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      }, 100);
    } catch {
      alert("Camera could not be opened. Try upload instead.");
    }
  }

  function closeCamera() {
    stream?.getTracks().forEach((track) => track.stop());
    setStream(null);
    setCameraOpen(false);
  }

  async function capturePhoto() {
    if (!videoRef.current) return;

    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(videoRef.current, 0, 0);

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", 0.9)
    );

    if (!blob) return;

    const file = new File([blob], `dive-photo-${Date.now()}.jpg`, {
      type: "image/jpeg",
    });

    closeCamera();
    await handlePhoto(file);
  }

  async function handlePhoto(file: File) {
    setUploading(true);
    setSpecies(null);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("You must be logged in.");
      setUploading(false);
      return;
    }

    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);

    const base64 = await fileToBase64(file);

    const identifyRes = await fetch("/api/identify-species", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageBase64: base64 }),
    });

    const identifyData = await identifyRes.json();
    setSpecies(identifyData);

    const filePath = `${user.id}/${sessionId}/${Date.now()}-${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from("dive-photos")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      alert(`Upload failed: ${uploadError.message}`);
      setUploading(false);
      return;
    }

    const { data: publicData } = supabase.storage
      .from("dive-photos")
      .getPublicUrl(filePath);

    await supabase.from("dive_photos").insert({
      session_id: sessionId,
      user_id: user.id,
      image_url: publicData.publicUrl,
      species_name: identifyData.common_name || "Unknown marine species",
      scientific_name: identifyData.scientific_name || null,
      confidence: identifyData.confidence || 0,
    });

    setUploading(false);
  }

  function saveToCameraRoll() {
    if (!preview) return;

    const link = document.createElement("a");
    link.href = preview;
    link.download = "bluetrail-dive-photo.jpg";
    link.click();
  }

  return (
    <GlassCard className="mt-5">
      <p className="text-xs font-black uppercase tracking-[0.25em] text-[#0094FF]">
        Dive Camera
      </p>

      <p className="mt-2 text-sm leading-6 text-[#9CA8B8]">
        Open your camera, capture marine life, identify it and save it to this
        dive session.
      </p>

      {!cameraOpen && (
        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            onClick={openCamera}
            disabled={uploading}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#0094FF] px-4 py-4 text-sm font-black uppercase tracking-[0.12em] text-white"
          >
            <Camera size={18} />
            Camera
          </button>

          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="flex items-center justify-center gap-2 rounded-xl border border-[#1A2330] bg-[#10161E] px-4 py-4 text-sm font-black uppercase tracking-[0.12em] text-white"
          >
            <ImagePlus size={18} />
            Upload
          </button>
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) handlePhoto(file);
        }}
      />

      {cameraOpen && (
        <div className="mt-5 overflow-hidden rounded-2xl border border-[#1A2330] bg-black">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="h-[360px] w-full object-cover"
          />

          <div className="grid grid-cols-2 gap-3 p-3">
            <button
              onClick={capturePhoto}
              className="flex items-center justify-center gap-2 rounded-xl bg-[#0094FF] px-4 py-4 text-sm font-black text-white"
            >
              <Camera size={18} />
              Take Photo
            </button>

            <button
              onClick={closeCamera}
              className="flex items-center justify-center gap-2 rounded-xl bg-red-500 px-4 py-4 text-sm font-black text-white"
            >
              <X size={18} />
              Close
            </button>
          </div>
        </div>
      )}

      {uploading && (
        <p className="mt-4 flex items-center gap-2 text-sm text-[#9CA8B8]">
          <RefreshCw size={16} className="animate-spin text-[#0094FF]" />
          Identifying and saving photo...
        </p>
      )}

      {preview && (
        <img
          src={preview}
          alt="Captured marine life"
          className="mt-5 max-h-[320px] w-full rounded-2xl object-cover"
        />
      )}

      {species && (
        <div className="mt-5 rounded-2xl border border-[#1A2330] bg-[#05070A] p-4">
          <p className="text-sm text-[#9CA8B8]">Detected species</p>

          <p className="mt-2 text-2xl font-black">
            {species.common_name || "Unknown marine species"}
          </p>

          {species.scientific_name && (
            <p className="mt-1 text-sm italic text-[#9CA8B8]">
              {species.scientific_name}
            </p>
          )}

          <p className="mt-2 text-sm text-[#9CA8B8]">
            Confidence: {species.confidence || 0}%
          </p>

          {species.notes && (
            <p className="mt-2 text-sm leading-6 text-[#9CA8B8]">
              {species.notes}
            </p>
          )}

          <button
            onClick={saveToCameraRoll}
            className="mt-4 flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-[#0094FF]"
          >
            <Download size={15} />
            Save to camera roll
          </button>
        </div>
      )}
    </GlassCard>
  );
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}