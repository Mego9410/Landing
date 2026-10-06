import type { MetadataRoute } from "next";
import { GUIDES } from "@/content/guides";
import { abs } from "./site";

export default function sitemap(): MetadataRoute.Sitemap {
  const latest = GUIDES.map((g) => g.updated).sort().at(-1);
  return [
    { url: abs("/"), changeFrequency: "monthly", priority: 1 },
    { url: abs("/guides"), lastModified: latest, changeFrequency: "weekly", priority: 0.9 },
    ...GUIDES.map((g) => ({ url: abs(`/guides/${g.slug}`), lastModified: g.updated, changeFrequency: "monthly" as const, priority: g.pillar ? 0.8 : 0.7 })),
    { url: abs("/about"), changeFrequency: "yearly", priority: 0.4 },
    { url: abs("/editorial-policy"), changeFrequency: "yearly", priority: 0.3 },
    { url: abs("/privacy"), changeFrequency: "yearly", priority: 0.2 },
    { url: abs("/app-privacy"), changeFrequency: "yearly", priority: 0.2 },
    { url: abs("/terms"), changeFrequency: "yearly", priority: 0.2 },
  ];
}
