import { GUIDES } from "@/content/guides";
import { abs, SITE_NAME } from "../../site";

// An RSS feed of the guides, so readers and search engines hear about new and updated ones.
export const dynamic = "force-static";

const esc = (s: string) => s.replace(/[<>&'"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[c]!);

export function GET() {
  const items = [...GUIDES]
    .sort((a, b) => (a.updated < b.updated ? 1 : -1))
    .map((g) => `    <item>
      <title>${esc(g.title)}</title>
      <link>${abs(`/guides/${g.slug}`)}</link>
      <guid isPermaLink="true">${abs(`/guides/${g.slug}`)}</guid>
      <category>${esc(g.category)}</category>
      <pubDate>${new Date(g.published + "T09:00:00Z").toUTCString()}</pubDate>
      <description>${esc(g.description)}</description>
    </item>`).join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${SITE_NAME} guides</title>
    <link>${abs("/guides")}</link>
    <atom:link href="${abs("/guides/feed.xml")}" rel="self" type="application/rss+xml" />
    <description>Guides for life after GLP-1 weight-loss injections.</description>
    <language>en-gb</language>
${items}
  </channel>
</rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
