import type { Metadata } from "next";
import { LegalArticle, loadLegalPage } from "@/lib/legalPage";

/*
 * /privacy — the Privacy Policy, public and signed out.
 *
 * Same contract as /terms: the URL is fixed, the text is the admin's.
 */

export const metadata: Metadata = {
  title: "Privacy Policy — Gogter",
  description: "What Gogter collects, why, and what it never does with it.",
};

export const revalidate = 3600;

export default async function PrivacyPage() {
  const content = await loadLegalPage("privacy");
  return <LegalArticle content={content} slug="privacy" />;
}
