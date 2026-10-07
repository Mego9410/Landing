import type { Metadata } from "next";
import { TERMS } from "@landing/content/legal";
import { LegalPage } from "../legal-doc";

export const metadata: Metadata = { title: "Terms of use", description: "The terms for using the Steadie app." };

export default function Terms() {
  return <LegalPage doc={TERMS} />;
}
