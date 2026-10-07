import type { Metadata } from "next";
import { APP_PRIVACY } from "@landing/content/legal";
import { LegalPage } from "../legal-doc";

export const metadata: Metadata = { title: "App privacy policy", description: "How the Steadie app handles your information." };

// The URL for the App Store listing's privacy policy. The waitlist keeps its own notice at /privacy.
export default function AppPrivacy() {
  return <LegalPage doc={APP_PRIVACY} />;
}
