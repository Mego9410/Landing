// Site-wide values for metadata and structured data.
const LIVE = "https://www.getsteadieapp.com";
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_ENV === "production" ? LIVE : "http://localhost:3000")).replace(/\/$/, "");
export const SITE_NAME = "Steadie";
export const ORG_NAME = "Oliver Acton, trading as Steadie";
export const CONTACT_EMAIL = "hello@getsteadieapp.com";
/** The app on the App Store (App Store Connect app ID 6820083153). */
export const APP_STORE_ID = "6820083153";
export const APP_STORE_URL = `https://apps.apple.com/gb/app/steadie/id${APP_STORE_ID}`;
/** The launch switch: NEXT_PUBLIC_APP_LIVE=true once the app is on the App Store. Until then every download button
 *  reads "Coming soon" and no App Store link is shown. Read at build time, so flip it in Vercel and redeploy. */
export const APP_LIVE = process.env.NEXT_PUBLIC_APP_LIVE === "true";
/** An App Store link that tells App Store Connect's App Analytics which page sent the download (Apple campaign links:
 *  pt = provider token from NEXT_PUBLIC_APPLE_PROVIDER_TOKEN, ct = campaign of 40 characters or fewer, mt = 8). */
export function appStoreLink(campaign: string) {
  const pt = process.env.NEXT_PUBLIC_APPLE_PROVIDER_TOKEN;
  if (!pt) return APP_STORE_URL;
  const ct = campaign.toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || "site";
  return `${APP_STORE_URL}?pt=${encodeURIComponent(pt)}&ct=${ct}&mt=8`;
}
export const abs = (path: string) => `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;

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
