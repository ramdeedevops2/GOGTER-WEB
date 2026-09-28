import { renderLegalMarkdown } from "./legalMarkdown";

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

/** The document itself, on the same paper as the rest of the site. */
export function LegalArticle({ content }: { content: LegalContent }) {
  const effective = content.effectiveOn
    ? new Date(content.effectiveOn).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <>
      <header className="nav-shell">
        <nav className="nav" aria-label="Main">
          <a className="brand" href="/" aria-label="Gogter home">
            <span className="brand-mark">
              <img src="/gogter.png" alt="" />
            </span>
            <span className="brand-word">gogter</span>
          </a>
          <a className="btn" href="/">
            <span>Back to the site</span>
          </a>
        </nav>
      </header>

      <main className="legal">
        <div className="legal-head">
          <p className="eyebrow">Gogter</p>
          <h1 className="display-sm" style={{ marginTop: 16 }}>
            {content.title}
          </h1>
          {effective && <p className="legal-meta">In effect from {effective}</p>}
        </div>

        <article className="legal-body">{renderLegalMarkdown(content.body)}</article>
      </main>

      <footer className="footer">
        <div className="wrap footer-inner">
          <nav className="footer-links" aria-label="Legal">
            <a href="/terms">Terms of Use</a>
            <a href="/privacy">Privacy Policy</a>
          </nav>
          <small>© {new Date().getFullYear()} Gogter</small>
        </div>
      </footer>
    </>
  );
}
