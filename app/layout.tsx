import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BlueTrail",
  description: "Track dives, discover species and help protect the ocean.",
  applicationName: "BlueTrail",
  appleWebApp: {
    capable: true,
    title: "BlueTrail",
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  themeColor: "#031B2E",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#031B2E] text-white">{children}</body>
    </html>
  );
}