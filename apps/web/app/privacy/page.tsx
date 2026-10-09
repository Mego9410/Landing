import { SITE_PRIVACY } from "@landing/content/legal";
import { LegalPage } from "../legal-doc";
import { pageMetadata } from "../site";

export const metadata = pageMetadata("Website privacy notice", "How the Steadie website handles your information: no cookies or trackers, short-lived server logs, the pre-launch waitlist and your rights.", "/privacy");

export default function Privacy() {
  return <LegalPage doc={SITE_PRIVACY} />;
}
