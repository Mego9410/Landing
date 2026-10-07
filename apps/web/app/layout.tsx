import type { Metadata, Viewport } from "next";
import { Fredoka, Nunito } from "next/font/google";
import "@landing/design-system/tokens.css";
import "./globals.css";

const fredoka = Fredoka({ subsets: ["latin"], weight: ["300", "400", "500", "600"], variable: "--font-fredoka", display: "swap" });
const nunito = Nunito({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], variable: "--font-nunito", display: "swap" });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const description = "A 12-month plan for the year after you stop a GLP-1 weight-loss jab: protein, short strength sessions, easy meals and steady habits to keep the weight off. Coming to iPhone.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Steadie: keep weight off after weight-loss jabs", template: "%s · Steadie" },
  applicationName: "Steadie",
  keywords: ["coming off weight loss injections", "life after GLP-1", "keep weight off after stopping weight loss jab", "weight maintenance after GLP-1", "protein and strength after weight loss injections"],
  category: "health",
  description,
  openGraph: { title: "Steadie: keep what you've worked for", description, url: "/", siteName: "Steadie", locale: "en_GB", type: "website", images: ["/og.png"] },
  twitter: { card: "summary_large_image", title: "Steadie: keep what you've worked for", description, images: ["/og.png"] },
  alternates: { canonical: "/", types: { "application/rss+xml": "/guides/feed.xml" } },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FBF8F4" },
    { media: "(prefers-color-scheme: dark)", color: "#1F1C23" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-GB" className={`${fredoka.variable} ${nunito.variable}`}>
      <body>{children}</body>
    </html>
  );
}
