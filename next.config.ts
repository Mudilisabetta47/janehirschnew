import type { NextConfig } from "next";
import { redirects } from "./src/content/redirects";

const isDev = process.env.NODE_ENV !== "production";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // Next.js nutzt Inline-Skripte für Hydration; `unsafe-eval` nur im Dev-Modus (React-Debugging).
      `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob:",
      "font-src 'self'",
      "connect-src 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "object-src 'none'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Alte WordPress-URLs enden auf "/". Next würde erst "/x/" → "/x" und dann "/x" → Ziel weiterleiten
  // (zwei Sprünge). Stattdessen: eigene Regeln (redirects.ts) zuerst, am Ende ein generisches Entfernen des "/".
  skipTrailingSlashRedirect: true,
  images: { formats: ["image/avif", "image/webp"] },
  async redirects() {
    return [
      ...redirects.map((r) => ({ source: r.source, destination: r.destination, permanent: true })),
      { source: "/:path+/", destination: "/:path+", permanent: true },
    ];
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      // Backend: nie indexieren, nie cachen
      { source: "/admin/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }, { key: "Cache-Control", value: "no-store" }] },
    ];
  },
};

export default nextConfig;
