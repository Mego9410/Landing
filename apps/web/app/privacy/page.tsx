import type { Metadata } from "next";
import { SITE_PRIVACY } from "@landing/content/legal";
import { LegalPage } from "../legal-doc";

export const metadata: Metadata = { title: "Privacy notice", description: "How the Steadie website handles your information.", alternates: { canonical: "/privacy" } };

export default function Privacy() {
  return <LegalPage doc={SITE_PRIVACY} />;
}
