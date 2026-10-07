// Site-wide values for metadata and structured data.
const LIVE = "https://www.getsteadieapp.com";
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_ENV === "production" ? LIVE : "http://localhost:3000")).replace(/\/$/, "");
export const SITE_NAME = "Steadie";
export const ORG_NAME = "[YOUR COMPANY NAME]";
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
