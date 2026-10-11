import type { Metadata, Viewport } from "next";
import { Bebas_Neue, DM_Sans, DM_Mono } from "next/font/google";
import "./globals.css";
import ServiceWorker from "@/components/ServiceWorker";

const bebasNeue = Bebas_Neue({ weight: "400", variable: "--font-bebas", subsets: ["latin"] });
const dmSans = DM_Sans({ variable: "--font-dm-sans", subsets: ["latin"] });
const dmMono = DM_Mono({ weight: ["300", "400", "500"], variable: "--font-dm-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Credits",
  description: "The complete local-first calorie, macro, hydration and progress tracker.",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "Credits", statusBarStyle: "black-translucent" },
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#C6FF00",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${bebasNeue.variable} ${dmSans.variable} ${dmMono.variable} h-full`}>
      <body className="h-full"><noscript><div style={{ background: "#C6FF00", color: "#0B0B0B", padding: 16, fontWeight: 800, textAlign: "center" }}>Credits needs JavaScript enabled to run.</div></noscript><ServiceWorker />{children}</body>
    </html>
  );
}
