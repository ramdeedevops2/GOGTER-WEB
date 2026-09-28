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
 * Re-rendered at most once an hour. Fully static would mean an edit in the
 * admin needing a deploy to appear, which defeats the point of keeping the
 * text in the database; fully dynamic would put a database call between a
 * reviewer and the page.
 */
export const revalidate = 3600;

export default async function TermsPage() {
  const content = await loadLegalPage("terms");
  return <LegalArticle content={content} />;
}
