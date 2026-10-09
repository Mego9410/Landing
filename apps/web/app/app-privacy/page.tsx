import { APP_PRIVACY } from "@landing/content/legal";
import { LegalPage } from "../legal-doc";
import { pageMetadata } from "../site";

export const metadata = pageMetadata("App privacy policy", "How the Steadie app handles your information: what stays on your phone, the encrypted UK backup if you sign in, and how to export or delete it.", "/app-privacy");

// The URL for the App Store listing's privacy policy. The website has its own notice at /privacy.
export default function AppPrivacy() {
  return <LegalPage doc={APP_PRIVACY} />;
}
