import type { MetadataRoute } from "next";
import { chapters } from "@/data/docs";

const SITE = "https://useskelly.dev";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE}/docs`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE}/changelog`, changeFrequency: "weekly", priority: 0.6 },
    ...chapters.map(chapter => ({
      url: `${SITE}/docs/${chapter.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.7
    }))
  ];
}
