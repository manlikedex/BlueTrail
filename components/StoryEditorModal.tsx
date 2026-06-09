"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Move, Type, X } from "lucide-react";

type FilterMode = "none" | "ocean" | "bright" | "mono" | "warm";

export default function StoryEditorModal({
  file,
  open,
  onClose,
  onSave,
}: {
  file: File | null;
  open: boolean;
  onClose: () => void;
  onSave: (file: File) => void;
}) {
  const imageRef = useRef<HTMLImageElement | null>(null);

  const [preview, setPreview] = useState("");
  const [text, setText] = useState("");
  const [filter, setFilter] = useState<FilterMode>("none");
  const [textSize, setTextSize] = useState(34);
  const [textX, setTextX] = useState(50);
  const [textY, setTextY] = useState(50);

  useEffect(() => {
    if (!file || !open) return;

    setPreview(URL.createObjectURL(file));
    setText("");
    setFilter("none");
    setTextSize(34);
    setTextX(50);
    setTextY(50);
  }, [file, open]);

if (!open || !file || !preview) return null;

  function filterClass() {
    if (filter === "ocean") return "contrast-125 saturate-150 brightness-110";
    if (filter === "bright") return "brightness-125 contrast-110";
    if (filter === "mono") return "grayscale contrast-125";
    if (filter === "warm") return "sepia brightness-110 contrast-105";
    return "";
  }

  function applyFilterToCanvas(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
  ) {
    if (filter === "none") return;

    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      let r = data[i];
      let g = data[i + 1];
      let b = data[i + 2];

      if (filter === "ocean") {
        r *= 1.08;
        g *= 1.12;
        b *= 0.92;
      }

      if (filter === "bright") {
        r *= 1.18;
        g *= 1.18;
        b *= 1.18;
      }

      if (filter === "mono") {
        const avg = (r + g + b) / 3;
        r = avg * 1.1;
        g = avg * 1.1;
        b = avg * 1.1;
      }

      if (filter === "warm") {
        r *= 1.18;
        g *= 1.08;
        b *= 0.92;
      }

      data[i] = Math.min(255, r);
      data[i + 1] = Math.min(255, g);
      data[i + 2] = Math.min(255, b);
    }

    ctx.putImageData(imageData, 0, 0);
  }

  async function saveEditedStory() {
    if (file.type.startsWith("video")) {
      onSave(file);
      return;
    }

    const image = imageRef.current;
    if (!image) return;

    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1920;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const imageRatio = image.naturalWidth / image.naturalHeight;
    const canvasRatio = canvas.width / canvas.height;

    let drawWidth = canvas.width;
    let drawHeight = canvas.height;
    let drawX = 0;
    let drawY = 0;

    if (imageRatio > canvasRatio) {
      drawHeight = canvas.height;
      drawWidth = drawHeight * imageRatio;
      drawX = (canvas.width - drawWidth) / 2;
    } else {
      drawWidth = canvas.width;
      drawHeight = drawWidth / imageRatio;
      drawY = (canvas.height - drawHeight) / 2;
    }

    ctx.drawImage(image, drawX, drawY, drawWidth, drawHeight);
    applyFilterToCanvas(ctx, canvas.width, canvas.height);

    if (text.trim()) {
      ctx.font = `900 ${textSize * 2}px Arial`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.lineWidth = 8;
      ctx.strokeStyle = "rgba(0,0,0,0.55)";
      ctx.fillStyle = "white";

      const x = (textX / 100) * canvas.width;
      const y = (textY / 100) * canvas.height;

      ctx.strokeText(text, x, y);
      ctx.fillText(text, x, y);
    }

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", 0.92)
    );

    if (!blob) return;

    const editedFile = new File([blob], `story-${Date.now()}.jpg`, {
      type: "image/jpeg",
    });

    onSave(editedFile);
  }

  return (
    <div className="fixed inset-0 z-[10000] bg-black text-white">
      <div className="absolute left-0 right-0 top-0 z-20 flex items-center justify-between bg-gradient-to-b from-black/90 to-transparent p-5">
        <button
          onClick={onClose}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-black/60"
        >
          <X size={22} />
        </button>

        <p className="rounded-full bg-black/50 px-4 py-2 text-xs font-black uppercase tracking-[0.18em]">
          Edit Story
        </p>

        <button
          onClick={saveEditedStory}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0094FF]"
        >
          <Check size={22} />
        </button>
      </div>

      <div className="relative h-full w-full">
        {file.type.startsWith("video") ? (
          <video
            src={preview}
            controls
            autoPlay
            className="h-full w-full object-contain"
          />
        ) : (
          <>
            <img
              ref={imageRef}
              src={preview}
              alt="Story preview"
              className={`h-full w-full object-cover ${filterClass()}`}
            />

            {text && (
              <div
                className="absolute -translate-x-1/2 -translate-y-1/2 select-none text-center font-black text-white drop-shadow-[0_3px_10px_rgba(0,0,0,0.9)]"
                style={{
                  left: `${textX}%`,
                  top: `${textY}%`,
                  fontSize: `${textSize}px`,
                }}
              >
                {text}
              </div>
            )}
          </>
        )}
      </div>

      {!file.type.startsWith("video") && (
        <div className="absolute bottom-0 left-0 right-0 z-20 rounded-t-3xl bg-black/80 p-4 backdrop-blur-2xl">
          <div className="flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-3">
            <Type size={18} className="text-[#0094FF]" />
            <input
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="Add text..."
              className="w-full bg-transparent text-white outline-none placeholder:text-white/50"
            />
          </div>

          <div className="mt-3 grid grid-cols-5 gap-2">
            {(["none", "ocean", "bright", "mono", "warm"] as FilterMode[]).map(
              (item) => (
                <button
                  key={item}
                  onClick={() => setFilter(item)}
                  className={`rounded-xl px-2 py-3 text-xs font-black uppercase ${
                    filter === item
                      ? "bg-[#0094FF] text-white"
                      : "bg-white/10 text-white/70"
                  }`}
                >
                  {item}
                </button>
              )
            )}
          </div>

          <div className="mt-3 grid gap-3">
            <label className="text-xs font-black uppercase tracking-[0.16em] text-white/60">
              Text Size
            </label>
            <input
              type="range"
              min="22"
              max="72"
              value={textSize}
              onChange={(event) => setTextSize(Number(event.target.value))}
            />

            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-white/60">
                  <Move size={14} /> X
                </p>
                <input
                  type="range"
                  min="10"
                  max="90"
                  value={textX}
                  onChange={(event) => setTextX(Number(event.target.value))}
                />
              </div>

              <div>
                <p className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-white/60">
                  <Move size={14} /> Y
                </p>
                <input
                  type="range"
                  min="15"
                  max="85"
                  value={textY}
                  onChange={(event) => setTextY(Number(event.target.value))}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}