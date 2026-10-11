import type { NextConfig } from "next";
import path from "path";
const nativeBuild = process.env.CAPACITOR_BUILD === "1";

const nextConfig: NextConfig = {
  ...(nativeBuild ? { output: "export" as const, trailingSlash: true, images: { unoptimized: true } } : {}),
  ...(!nativeBuild ? { headers: async () => [
    { source: "/sw.js", headers: [{ key: "Cache-Control", value: "no-cache, no-store, must-revalidate" }] },
    { source: "/(.*)", headers: [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Permissions-Policy", value: "camera=(self), geolocation=(), microphone=()" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "Content-Security-Policy", value: "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self'; worker-src 'self' blob:; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'" },
    ] },
  ] } : {}),
  allowedDevOrigins: ["192.168.0.19", "localhost", "127.0.0.1"],
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
