import { ImageResponse } from "next/og";
import { liveGuide } from "@/content/guides";
import { GuideArt } from "../../art";

// The guide's illustration on its own, as a PNG, for emails (email apps don't show SVG). 1200 × 630.
export const revalidate = 3600;

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const g = liveGuide((await params).slug);
  if (!g) return new Response("Not found", { status: 404 });
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex" }}>{GuideArt({ guide: g, style: { width: 1200, height: 630 } })}</div>,
    { width: 1200, height: 630 },
  );
}
