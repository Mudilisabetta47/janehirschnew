import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { services } from "@/content/services";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const page = (path: string, priority: number, changeFrequency: "monthly" | "yearly" = "monthly") => ({
    url: `${site.url}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  });
  return [
    page("", 1),
    page("/coaching", 0.9),
    ...services.map((s) => page(`/coaching/${s.slug}`, 0.8)),
    page("/ueber-mich", 0.7),
    page("/kontakt", 0.7),
  ];
}
