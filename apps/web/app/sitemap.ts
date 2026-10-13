import type { MetadataRoute } from "next";
import { liveGuides } from "@/content/guides";
import { abs } from "./site";
import { TOOLS } from "./tools/list";

export const revalidate = 3600;

export default function sitemap(): MetadataRoute.Sitemap {
  const GUIDES = liveGuides();
  const latest = GUIDES.map((g) => g.updated).sort().at(-1);
  return [
    // The UK and US home pages, each naming the other (hreflang), so Google shows each country its own.
    { url: abs("/"), changeFrequency: "monthly", priority: 1, alternates: { languages: { "en-GB": abs("/"), "en-US": abs("/us") } } },
    { url: abs("/us"), changeFrequency: "monthly", priority: 1, alternates: { languages: { "en-GB": abs("/"), "en-US": abs("/us") } } },
    { url: abs("/us/consumer-health-data"), changeFrequency: "yearly", priority: 0.2 },
    { url: abs("/guides"), lastModified: latest, changeFrequency: "weekly", priority: 0.9 },
    ...GUIDES.map((g) => ({ url: abs(`/guides/${g.slug}`), lastModified: g.updated, changeFrequency: "monthly" as const, priority: g.pillar ? 0.8 : 0.7 })),
    { url: abs("/tools"), changeFrequency: "monthly", priority: 0.8 },
    ...TOOLS.map((t) => ({ url: abs(`/tools/${t.slug}`), lastModified: t.updated, changeFrequency: "monthly" as const, priority: 0.8 })),
    { url: abs("/about"), changeFrequency: "yearly", priority: 0.4 },
    { url: abs("/support"), changeFrequency: "monthly", priority: 0.5 },
    { url: abs("/whats-new"), changeFrequency: "monthly", priority: 0.4 },
    { url: abs("/editorial-policy"), changeFrequency: "yearly", priority: 0.3 },
    { url: abs("/privacy"), changeFrequency: "yearly", priority: 0.2 },
    { url: abs("/app-privacy"), changeFrequency: "yearly", priority: 0.2 },
    { url: abs("/terms"), changeFrequency: "yearly", priority: 0.2 },
  ];
}
