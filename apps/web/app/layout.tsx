import type { Metadata, Viewport } from "next";
import { Fredoka, Nunito } from "next/font/google";
import "@landing/design-system/tokens.css";
import "./globals.css";

const fredoka = Fredoka({ subsets: ["latin"], weight: ["300", "400", "500", "600"], variable: "--font-fredoka", display: "swap" });
const nunito = Nunito({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], variable: "--font-nunito", display: "swap" });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const description = "A 12-month habit plan for the year after you stop a weight-loss jab. Protein, strength and steady routines, at your pace.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Landing: keep what you've worked for", template: "%s · Landing" },
  description,
  openGraph: { title: "Landing: keep what you've worked for", description, url: "/", siteName: "Landing", locale: "en_GB", type: "website", images: ["/og.png"] },
  twitter: { card: "summary_large_image", title: "Landing: keep what you've worked for", description, images: ["/og.png"] },
  alternates: { canonical: "/" },
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
