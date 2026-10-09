import { TERMS } from "@landing/content/legal";
import { LegalPage } from "../legal-doc";
import { pageMetadata } from "../site";

export const metadata = pageMetadata("Terms of use", "The terms for using the Steadie app: who it's for, what it is and isn't, subscriptions and the 7-day free trial, and your rights as a consumer.", "/terms");

export default function Terms() {
  return <LegalPage doc={TERMS} />;
}
