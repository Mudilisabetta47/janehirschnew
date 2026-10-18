"use client";

import { usePathname } from "next/navigation";

/** Blendet die öffentliche Kopf-/Fußzeile im Backend (/admin) aus. */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;
  return <>{children}</>;
}
