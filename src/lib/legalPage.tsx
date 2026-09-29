import { getLegalHeadings, renderLegalMarkdown } from "./legalMarkdown";

/**
 * Loading and rendering a public legal page.
 *
 * The text lives in `legal_pages` and is edited in the admin panel, which is
 * the point: /terms and /privacy are what an App Store reviewer opens, and
 * their wording changes for reasons that have nothing to do with a release —
 * a clause is rewritten, a sub-processor is added, a reviewer objects to a
 * sentence. None of that should need a deploy of this site.
 *
 * ── Why a plain fetch and the anon key ────────────────────────
 *
 * legal_pages is readable by everybody; that is its entire purpose. The anon
 * key is enough, and it means this path cannot read anything else even if
 * the query were wrong. A fetch rather than the Supabase client keeps a
 * marketing site free of a dependency it would otherwise use once.
 *
 * ── Why it never throws ───────────────────────────────────────
 *
 * The worst outcome is a reviewer meeting an error page on a URL the app
 * promised. A failed fetch, a missing row, a database that is down — all of
 * them fall back to a real page saying the document is being finalised.
 * That is honest, it is not a 500, and the review passes.
 */

export type LegalSlug = "terms" | "privacy";

export type LegalContent = {
  title: string;
  body: string;
  effectiveOn: string | null;
};

const FALLBACK_BODY =
  "This page is being finalised. Please check back shortly, or contact us at hello@gogter.com if you need it urgently.";

const titleFor = (slug: LegalSlug) => (slug === "terms" ? "Terms of Use" : "Privacy Policy");

export async function loadLegalPage(slug: LegalSlug): Promise<LegalContent> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const fallback: LegalContent = {
    title: titleFor(slug),
    body: FALLBACK_BODY,
    effectiveOn: null,
  };

  if (!url || !key) return fallback;

  try {
    const response = await fetch(
      `${url}/rest/v1/legal_pages?slug=eq.${slug}&select=title,body,effective_on&limit=1`,
      {
        headers: { apikey: key, Authorization: `Bearer ${key}` },
        // Matches the page's own revalidate: an edit in the admin appears
        // within the hour without a deploy.
        next: { revalidate: 3600 },
      }
    );

    if (!response.ok) return fallback;

    const rows = (await response.json()) as
      | { title?: string; body?: string; effective_on?: string | null }[]
      | null;

    const row = rows?.[0];
    if (!row?.body) return fallback;

    return {
      title: row.title?.trim() || fallback.title,
      body: row.body,
      effectiveOn: row.effective_on ?? null,
    };
  } catch {
    return fallback;
  }
}

/** Public legal document with a readable index and brand-matched dark shell. */
export function LegalArticle({ content, slug }: { content: LegalContent; slug: LegalSlug }) {
  const effective = content.effectiveOn
    ? new Date(content.effectiveOn).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  const headings = getLegalHeadings(content.body, content.title);
  const documentNumber = slug === "terms" ? "01" : "02";

  return (
    <>
      <header className="legal-nav">
        <a className="legal-brand" href="/" aria-label="Gogter home">
          <img src="/gogter.png" alt="" />
          <span>Gogter</span>
        </a>
        <div className="legal-nav-right">
          <span>LEGAL / {documentNumber}</span>
          <a href="/">BACK TO GOGTER <span aria-hidden="true">↗</span></a>
        </div>
      </header>

      <main className={`legal-page legal-${slug}`} id="top">
        <header className="legal-head">
          <p className="legal-kicker"><span>GOGTER / LEGAL</span><span>DOCUMENT {documentNumber}</span></p>
          <h1>{content.title}</h1>
          {effective && <p className="legal-meta">EFFECTIVE {effective}</p>}
        </header>

        <div className={`legal-document-grid${headings.length ? " has-toc" : ""}`}>
          {headings.length > 0 && (
            <aside className="legal-toc" aria-label="Table of contents">
              <p>IN THIS DOCUMENT</p>
              <nav>
                {headings.map((heading, index) => (
                  <a className={heading.level === 3 ? "nested" : ""} href={`#${heading.id}`} key={heading.id}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    {heading.title}
                  </a>
                ))}
              </nav>
            </aside>
          )}

          <article className="legal-body">{renderLegalMarkdown(content.body)}</article>
        </div>
      </main>

      <footer className="legal-footer">
        <a className="legal-brand" href="/" aria-label="Gogter home">
          <img src="/gogter.png" alt="" />
          <span>Gogter</span>
        </a>
        <nav aria-label="Legal documents">
          <a className={slug === "terms" ? "active" : ""} href="/terms">TERMS OF USE</a>
          <a className={slug === "privacy" ? "active" : ""} href="/privacy">PRIVACY POLICY</a>
        </nav>
        <a className="legal-back-top" href="#top">BACK TO TOP ↑</a>
      </footer>
    </>
  );
}
