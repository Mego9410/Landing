import { ImageResponse } from "next/og";
import { GUIDES, guideBySlug } from "@/content/guides";

// A share image for each guide: the title on oat, with the brand's sun resting on a sage horizon.
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
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#FBF8F4", padding: 72, position: "relative" }}>
        <div style={{ position: "absolute", right: 120, bottom: 150, width: 170, height: 170, borderRadius: 85, background: "#F8C8AC", display: "flex" }} />
        <div style={{ position: "absolute", left: -40, right: -40, bottom: 0, height: 150, borderRadius: 75, background: "#CDE3D2", display: "flex" }} />
        <div style={{ display: "flex", fontSize: 30, color: "#9E4A20", fontWeight: 700, letterSpacing: 2 }}>{(g?.category ?? "Guides").toUpperCase()} · STEADIE GUIDES</div>
        <div style={{ display: "flex", fontSize: title.length > 60 ? 58 : 68, lineHeight: 1.1, color: "#2E2A33", fontWeight: 700, maxWidth: 860, marginBottom: 150 }}>{title}</div>
      </div>
    ),
    size,
  );
}
