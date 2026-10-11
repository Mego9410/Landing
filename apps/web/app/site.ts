// Site-wide values for metadata and structured data.
import type { Metadata } from "next";

const LIVE = "https://www.getsteadieapp.com";
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_ENV === "production" ? LIVE : "http://localhost:3000")).replace(/\/$/, "");
export const SITE_NAME = "Steadie";
export const ORG_NAME = "Oliver Acton, trading as Steadie";
export const CONTACT_EMAIL = "hello@getsteadieapp.com";
/** The app on the App Store (App Store Connect app ID 6820083153). */
export const APP_STORE_ID = "6820083153";
export const APP_STORE_URL = `https://apps.apple.com/gb/app/steadie/id${APP_STORE_ID}`;
/** The launch switch, automatic: the site goes live by itself once Apple's public lookup lists the app on the UK App
 *  Store (checked at most every 15 minutes; pages refresh on the same schedule). Until then every download button
 *  reads "Coming soon", no App Store link is shown and there's no Safari app banner. NEXT_PUBLIC_APP_LIVE=true forces
 *  it on; any other value, or none, leaves it automatic. If the lookup can't be reached, it counts as not live. */
export async function appLive(): Promise<boolean> {
  if ((process.env.NEXT_PUBLIC_APP_LIVE ?? "").trim().toLowerCase() === "true") return true;
  try {
    const res = await fetch(`https://itunes.apple.com/lookup?id=${APP_STORE_ID}&country=gb`, { next: { revalidate: 900 } });
    if (!res.ok) return false;
    const body = (await res.json()) as { resultCount?: number; results?: { trackId?: number }[] };
    return (body.results ?? []).some((r) => String(r.trackId) === APP_STORE_ID);
  } catch {
    return false;
  }
}
/** An App Store link that tells App Store Connect's App Analytics which page sent the download (Apple campaign links:
 *  pt = provider token from NEXT_PUBLIC_APPLE_PROVIDER_TOKEN, ct = campaign of 40 characters or fewer, mt = 8). */
export function appStoreLink(campaign: string, page?: ProductPage) {
  const pt = process.env.NEXT_PUBLIC_APPLE_PROVIDER_TOKEN;
  const ppid = page ? productPageId(page) : undefined;
  const q = new URLSearchParams();
  if (pt) {
    q.set("pt", pt);
    q.set("ct", campaign.toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || "site");
    q.set("mt", "8");
  }
  if (ppid) q.set("ppid", ppid);
  const qs = q.toString();
  return qs ? `${APP_STORE_URL}?${qs}` : APP_STORE_URL;
}
/** App Store Custom Product Pages (growth playbook): "after" for the after-the-jab guides and tools, "taper" for the
 *  tapering pages. Each is on only once its ID (from App Store Connect › Custom Product Pages) is set:
 *  NEXT_PUBLIC_CPP_AFTER and NEXT_PUBLIC_CPP_TAPER. Unset, links go to the default product page. */
export type ProductPage = "after" | "taper";
function productPageId(page: ProductPage) {
  const id = (page === "taper" ? process.env.NEXT_PUBLIC_CPP_TAPER : process.env.NEXT_PUBLIC_CPP_AFTER)?.trim();
  return id && /^[0-9a-f-]{36}$/i.test(id) ? id.toLowerCase() : undefined;
}
/** A campaign name of `prefix-slug` that fits Apple's 40 characters by dropping whole words off the end of the slug
 *  (so "guide-end-questions-to-ask-before-stopping" rather than a word cut in half). */
export function campaign(prefix: string, slug: string) {
  const words = slug.split("-");
  while (words.length > 1 && `${prefix}-${words.join("-")}`.length > 40) words.pop();
  return `${prefix}-${words.join("-")}`;
}
/** Pricing from the paywall design (App Store Connect). Confirm before launch. ≈ £1.35 a week on the yearly plan. */
export const PRICE = { yearly: "£69.99", weekly: "£1.35", monthly: "£12.99" };
export const PRICE_GBP = { yearly: "69.99", monthly: "12.99" };
export const abs = (path: string) => `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;

/** Metadata for a plain page: its own <title>, description, canonical and share card. Next replaces nested fields
 *  (openGraph, twitter, alternates) whole rather than merging them, so a page that leaves them out would share the home
 *  page's canonical and card. */
export const pageMetadata = (title: string, description: string, path: string): Metadata => ({
  title: { absolute: `${title} · ${SITE_NAME}` },
  description,
  alternates: { canonical: path },
  openGraph: { type: "website", url: path, title, description, siteName: SITE_NAME, locale: "en_GB", images: ["/og.png"] },
  twitter: { card: "summary_large_image", title, description, images: ["/og.png"] },
});

/** JSON-LD as a script tag's HTML, with "<" escaped so text can't close the tag. */
export const ldJson = (data: unknown) => ({ __html: JSON.stringify(data).replace(/</g, "\\u003c") });

export const ORGANIZATION = {
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: SITE_NAME,
  url: SITE_URL,
  logo: abs("/steadie-logo.png"),
  description: "Steadie is a general wellness app with a 12-month plan for the year after stopping a GLP-1 weight-loss medicine.",
};
