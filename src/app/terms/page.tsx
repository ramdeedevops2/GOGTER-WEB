import type { Metadata } from "next";
import { LegalArticle, loadLegalPage } from "@/lib/legalPage";

/*
 * /terms — the Terms of Use, public and signed out.
 *
 * The URL is promised to App Store Connect and must not move after
 * submission. The text comes from the admin panel.
 */

export const metadata: Metadata = {
  title: "Terms of Use — Gogter",
  description: "The terms that apply to using Gogter.",
};

/*
 * Read the current published document on every request so admin and SQL
 * updates appear without waiting for a cached copy to expire.
 */
export const dynamic = "force-dynamic";

export default async function TermsPage() {
  const content = await loadLegalPage("terms");
  return <LegalArticle content={content} slug="terms" />;
}
