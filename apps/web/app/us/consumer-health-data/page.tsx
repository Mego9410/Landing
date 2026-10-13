import { US_HEALTH_PRIVACY } from "@landing/content/legal";
import { LegalPage } from "../../legal-doc";
import { pageMetadata } from "../../site";

export const metadata = pageMetadata("US consumer health data notice", "The consumer health data privacy policy for people in the US: what health information the Steadie app collects, why, who handles it and how to use your rights.", "/us/consumer-health-data");

// Washington's My Health My Data Act asks for this policy to be linked prominently from the home page: it's in the
// footer of both home pages (app/site-chrome.tsx).
export default function UsHealthPrivacy() {
  return <LegalPage doc={US_HEALTH_PRIVACY} />;
}
