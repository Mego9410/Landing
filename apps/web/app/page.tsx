import type { Metadata } from "next";
import { HomePage } from "./home";

// New guides go live on their date (see content/guides), so the home page refreshes hourly to show the latest.
export const revalidate = 3600;

// The rest of the home page's metadata comes from app/layout.tsx. This adds hreflang: / is for the UK (and anywhere
// else), /us for the US, so Google shows each country its own page.
export const metadata: Metadata = {
  alternates: {
    canonical: "/",
    languages: { "en-GB": "/", "en-US": "/us", "x-default": "/" },
    types: { "application/rss+xml": "/guides/feed.xml" },
  },
};

export default function Home() {
  return <HomePage region="uk" />;
}
