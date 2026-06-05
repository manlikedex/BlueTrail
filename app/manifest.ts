import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "BlueTrail",
    short_name: "BlueTrail",
    description: "Track dives, discover species and help protect the ocean.",
    start_url: "/",
    display: "standalone",
    background_color: "#031B2E",
    theme_color: "#00D4C8",
    orientation: "portrait",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}