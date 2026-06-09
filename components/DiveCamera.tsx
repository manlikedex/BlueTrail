"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Camera,
  Download,
  ImagePlus,
  RefreshCw,
  RotateCcw,
  Settings,
  Sparkles,
  Video,
  Zap,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import GlassCard from "./ui/GlassCard";

type CameraMode = "photo" | "video" | "portrait" | "panorama" | "burst";

export default function DiveCamera({ sessionId }: { sessionId: number }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const [cameraOpen, setCameraOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  const [mode, setMode] = useState<CameraMode>("photo");
  const [preview, setPreview] = useState<string | null>(null);
  const [species, setSpecies] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [underwaterMode, setUnderwaterMode] = useState(false);

  useEffect(() => {
    return () => stopCamera();
  }, [stream]);

  async function openCamera(selectedMode: CameraMode = mode) {
    try {
      stopCamera();

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: selectedMode === "video",
      });

      setMode(selectedMode);
      setStream(mediaStream);
      setCameraOpen(true);

      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play().catch(() => {});
        }
      }, 100);
    } catch {
      alert("Camera could not be opened. Try upload instead.");
    }
  }

  function stopCamera() {
    stream?.getTracks().forEach((track) => track.stop());
  }

  function closeCamera() {
    if (recording) stopVideoRecording();
    stopCamera();
    setStream(null);
    setCameraOpen(false);
    setSettingsOpen(false);
  }

  async function switchCamera() {
    const nextMode = facingMode === "environment" ? "user" : "environment";
    setFacingMode(nextMode);
    await openCamera(mode);
  }

  async function capturePhoto(cameraMode: CameraMode = mode) {
    if (!videoRef.current || uploading || recording) return;

    const video = videoRef.current;
    const width = video.videoWidth || 1280;
    const height = video.videoHeight || 720;

    const canvas = document.createElement("canvas");

    if (cameraMode === "panorama") {
      canvas.width = width;
      canvas.height = Math.floor(height * 0.55);
    } else {
      canvas.width = width;
      canvas.height = height;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (cameraMode === "panorama") {
      const cropHeight = height * 0.55;
      const cropY = (height - cropHeight) / 2;
      ctx.drawImage(video, 0, cropY, width, cropHeight, 0, 0, canvas.width, canvas.height);
    } else {
      ctx.drawImage(video, 0, 0, width, height);
    }

    if (underwaterMode) {
      applyUnderwaterEnhancement(ctx, canvas.width, canvas.height);
    }

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", 0.92)
    );

    if (!blob) return;

    const file = new File([blob], `bluetrail-${cameraMode}-${Date.now()}.jpg`, {
      type: "image/jpeg",
    });

    closeCamera();
    await handleMedia(file, "photo", cameraMode);
  }

  async function captureBurst() {
    if (!videoRef.current) return;

    setUploading(true);

    for (let i = 0; i < 5; i++) {
      await capturePhoto("burst");
      await new Promise((resolve) => setTimeout(resolve, 350));
    }

    setUploading(false);
  }

  function startVideoRecording() {
    if (!stream || recording) return;

    const chunks: Blob[] = [];

    const recorder = new MediaRecorder(stream, {
      mimeType: MediaRecorder.isTypeSupported("video/webm") ? "video/webm" : undefined,
    });

    mediaRecorderRef.current = recorder;

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) chunks.push(event.data);
    };

    recorder.onstop = async () => {
      const blob = new Blob(chunks, { type: "video/webm" });
      const file = new File([blob], `bluetrail-video-${Date.now()}.webm`, {
        type: "video/webm",
      });

      closeCamera();
      await handleMedia(file, "video", "video");
    };

    recorder.start();
    setRecording(true);
  }

  function stopVideoRecording() {
    if (!mediaRecorderRef.current || !recording) return;
    mediaRecorderRef.current.stop();
    setRecording(false);
  }

  async function handleMedia(
    file: File,
    mediaType: "photo" | "video",
    cameraMode: CameraMode
  ) {
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

    let identifyData: any = {
      common_name: mediaType === "video" ? "Video clip" : "Unknown marine species",
      scientific_name: null,
      confidence: 0,
      notes: mediaType === "video" ? "Video saved to this dive session." : "",
    };

    if (mediaType === "photo") {
      const base64 = await fileToBase64(file);

      const identifyRes = await fetch("/api/identify-species", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: base64 }),
      });

      identifyData = await identifyRes.json();
    }

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
      edited_image_url: underwaterMode ? publicData.publicUrl : null,
      media_type: mediaType,
      camera_mode: cameraMode,
      is_underwater_enhanced: underwaterMode,
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
    link.download = mode === "video" ? "bluetrail-dive-video.webm" : "bluetrail-dive-photo.jpg";
    link.click();
  }

  return (
    <>
      <GlassCard className="mt-5">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-[#0094FF]">
          Dive Camera
        </p>

        <p className="mt-2 text-sm leading-6 text-[#9CA8B8]">
          Capture photos, burst shots, videos and underwater-enhanced media.
        </p>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            onClick={() => openCamera("photo")}
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

        <input
          ref={fileRef}
          type="file"
          accept="image/*,video/*"
          capture="environment"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (!file) return;
            handleMedia(file, file.type.startsWith("video") ? "video" : "photo", "photo");
          }}
        />

        {uploading && (
          <p className="mt-4 flex items-center gap-2 text-sm text-[#9CA8B8]">
            <RefreshCw size={16} className="animate-spin text-[#0094FF]" />
            Saving media...
          </p>
        )}

        {preview && mode === "video" ? (
          <video src={preview} controls className="mt-5 max-h-[320px] w-full rounded-2xl object-cover" />
        ) : preview ? (
          <img src={preview} alt="Captured media" className="mt-5 max-h-[320px] w-full rounded-2xl object-cover" />
        ) : null}

        {species && (
          <div className="mt-5 rounded-2xl border border-[#1A2330] bg-[#05070A] p-4">
            <p className="text-sm text-[#9CA8B8]">Result</p>
            <p className="mt-2 text-2xl font-black">{species.common_name || "Unknown marine species"}</p>

            {species.scientific_name && (
              <p className="mt-1 text-sm italic text-[#9CA8B8]">
                {species.scientific_name}
              </p>
            )}

            <p className="mt-2 text-sm text-[#9CA8B8]">
              Confidence: {species.confidence || 0}%
            </p>

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

      {cameraOpen && (
        <div className="fixed inset-0 z-[9999] bg-black">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`h-full w-full object-cover ${
              underwaterMode ? "contrast-125 saturate-150 brightness-110" : ""
            }`}
          />

          <div className="absolute left-0 right-0 top-0 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent p-5">
            <button
              onClick={closeCamera}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-xl"
            >
              <ArrowLeft size={24} />
            </button>

            <p className="rounded-full bg-black/50 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-white backdrop-blur-xl">
              {mode}
            </p>

            <button
              onClick={() => setSettingsOpen((value) => !value)}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-xl"
            >
              <Settings size={22} />
            </button>
          </div>

          {settingsOpen && (
            <div className="absolute right-5 top-20 w-[240px] rounded-3xl border border-white/10 bg-black/80 p-4 text-white backdrop-blur-2xl">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-white/60">
                Camera Settings
              </p>

              <div className="mt-4 grid gap-2">
                {(["photo", "video", "portrait", "panorama", "burst"] as CameraMode[]).map((item) => (
                  <button
                    key={item}
                    onClick={() => {
                      setMode(item);
                      setSettingsOpen(false);
                    }}
                    className={`rounded-xl px-4 py-3 text-left text-sm font-black uppercase tracking-[0.12em] ${
                      mode === item ? "bg-[#0094FF] text-white" : "bg-white/10 text-white/80"
                    }`}
                  >
                    {item}
                  </button>
                ))}

                <button
                  onClick={() => setUnderwaterMode((value) => !value)}
                  className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-black uppercase tracking-[0.12em] ${
                    underwaterMode ? "bg-cyan-500 text-white" : "bg-white/10 text-white/80"
                  }`}
                >
                  <Sparkles size={18} />
                  Underwater
                </button>

                <button
                  onClick={switchCamera}
                  className="flex items-center justify-center gap-2 rounded-xl bg-white/10 px-4 py-3 text-sm font-black uppercase tracking-[0.12em]"
                >
                  <RotateCcw size={18} />
                  Flip Camera
                </button>
              </div>
            </div>
          )}

          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent px-6 pb-10 pt-20">
            <div className="mx-auto flex max-w-sm items-center justify-center">
              {mode === "video" ? (
                <button
                  onClick={recording ? stopVideoRecording : startVideoRecording}
                  className={`flex h-24 w-24 items-center justify-center rounded-full border-4 border-white ${
                    recording ? "bg-red-500" : "bg-white/20"
                  }`}
                >
                  <Video size={34} className="text-white" />
                </button>
              ) : mode === "burst" ? (
                <button
                  onClick={captureBurst}
                  className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-yellow-400/30"
                >
                  <Zap size={34} className="text-white" />
                </button>
              ) : (
                <button
                  onClick={() => capturePhoto(mode)}
                  className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-white/20"
                >
                  <span className="h-16 w-16 rounded-full bg-white" />
                </button>
              )}
            </div>

            <p className="mt-5 text-center text-xs font-bold text-white/70">
              {mode === "video"
                ? recording
                  ? "Recording... tap again to stop."
                  : "Tap to start recording."
                : mode === "burst"
                ? "Burst mode captures 5 quick photos."
                : underwaterMode
                ? "Underwater enhancement enabled."
                : "Tap shutter to capture."}
            </p>
          </div>
        </div>
      )}
    </>
  );
}

function applyUnderwaterEnhancement(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
) {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    data[i] = Math.min(255, data[i] * 1.16);
    data[i + 1] = Math.min(255, data[i + 1] * 1.08);
    data[i + 2] = Math.min(255, data[i + 2] * 0.92);
  }

  ctx.putImageData(imageData, 0, 0);
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}