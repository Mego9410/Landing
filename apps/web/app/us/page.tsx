import type { Metadata } from "next";
import { HomePage } from "../home";
import { appLive } from "../site";

// The US home page: the same page as /, with US wording ("shot", doctor, Zepbound) and US App Store prices.
// proxy.ts sends visitors in the US here; the footer switcher lets anyone choose.
export const revalidate = 3600;

const TITLE = "Steadie: keep weight off after your GLP-1 shot";
const describe = (live: boolean) => live
  ? "A 12-month plan for the year after you stop a GLP-1 weight-loss shot. Protein, short strength sessions, easy meals and steady habits. Free for 7 days on iPhone, and coming soon to Android."
  : "A 12-month plan for the year after you stop a GLP-1 weight-loss shot: protein, short strength sessions, easy meals and steady habits to keep the weight off. Coming soon to iPhone and Android.";

export async function generateMetadata(): Promise<Metadata> {
  const description = describe(await appLive());
  return {
    title: { absolute: TITLE },
    description,
    keywords: ["stopping semaglutide", "stopping tirzepatide", "life after GLP-1", "keep weight off after GLP-1 shot", "GLP-1 maintenance"],
    alternates: { canonical: "/us", languages: { "en-GB": "/", "en-US": "/us", "x-default": "/" } },
    openGraph: { title: "Steadie: keep what you've worked for", description, url: "/us", siteName: "Steadie", locale: "en_US", type: "website", images: ["/og.png"] },
    twitter: { card: "summary_large_image", title: "Steadie: keep what you've worked for", description, images: ["/og.png"] },
  };
}

export default function UsHome() {
  return <HomePage region="us" />;
}
