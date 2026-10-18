import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { noindex } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  if (noindex) return { rules: [{ userAgent: "*", disallow: "/" }] };
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", "/admin"] }],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
