import { ImageResponse } from "next/og";
import { liveGuide, liveGuides } from "@/content/guides";
import { GuideArt } from "../art";

// A share image for each guide: its illustration (../art.tsx) with the title on a cream panel.
export const alt = "A Steadie guide";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export const revalidate = 3600;
export function generateStaticParams() {
  return liveGuides().map((g) => ({ slug: g.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const g = liveGuide((await params).slug);
  const title = g?.title ?? "Guides for life after weight-loss jabs";
  // The guide's illustration fills the image, with its motif on the right; the title sits on a cream panel on the left.
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#F5EFE6", position: "relative" }}>
        {g ? GuideArt({ guide: g, motifRight: true, style: { position: "absolute", left: 0, top: 0, width: 1200, height: 630 } }) : null}
        <div style={{ position: "absolute", top: 56, bottom: 56, left: 56, width: 600, display: "flex", flexDirection: "column", justifyContent: "space-between",
          background: "rgba(251, 241, 228, 0.94)", borderRadius: 36, padding: "44px 48px" }}>
          <div style={{ display: "flex", fontSize: 24, color: "#B4532C", fontWeight: 700, letterSpacing: 2 }}>{(g?.category ?? "Guides").toUpperCase()} · STEADIE GUIDES</div>
          <div style={{ display: "flex", fontSize: title.length > 70 ? 46 : title.length > 50 ? 52 : 58, lineHeight: 1.1, color: "#2A2530", fontWeight: 700 }}>{title}</div>
        </div>
      </div>
    ),
    size,
  );
}
