import { ImageResponse } from "next/og";
import { GUIDES, guideBySlug } from "@/content/guides";

// A share image for each guide: the title on oat, with the Steadie mark (the roly-poly) on the right.
export const alt = "A Steadie guide";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const g = guideBySlug((await params).slug);
  const title = g?.title ?? "Guides for life after weight-loss jabs";
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#F5EFE6", padding: 72, position: "relative" }}>
        <svg width="230" height="316" viewBox="22 18 56 76" style={{ position: "absolute", right: 110, bottom: 120 }}>
          <g transform="rotate(-12 50 80)">
            <path d="M50 24 C66 24 74 44 74 59 C74 72 63 80 50 80 C37 80 26 72 26 59 C26 44 34 24 50 24 Z" fill="#DE6F44" />
            <circle cx="50" cy="64" r="7" fill="#F5EFE6" />
          </g>
          <rect x="31" y="85" width="38" height="5" rx="2.5" fill="#DE6F44" opacity="0.5" />
        </svg>
        <div style={{ display: "flex", fontSize: 30, color: "#B4532C", fontWeight: 700, letterSpacing: 2 }}>{(g?.category ?? "Guides").toUpperCase()} · STEADIE GUIDES</div>
        <div style={{ display: "flex", fontSize: title.length > 60 ? 58 : 68, lineHeight: 1.1, color: "#2A2530", fontWeight: 700, maxWidth: 740, marginBottom: 150 }}>{title}</div>
      </div>
    ),
    size,
  );
}
