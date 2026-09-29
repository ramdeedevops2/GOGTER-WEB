"use client";

import { useEffect, useRef, useState } from "react";

/*
 * The opening — the app's own splash, on the web.
 *
 * The phone opens on the logo animation over cream, so the site does too:
 * same film, same ground, so arriving at gogter.com feels like the thing
 * already on your home screen rather than its marketing.
 *
 * Three rules it follows, because intro screens are usually a tax on the
 * visitor rather than a gift:
 *
 *   1. Once. A flag in sessionStorage means it plays when somebody arrives,
 *      not every time they click back into the tab or open /terms.
 *   2. Short, and skippable by doing anything at all — scroll, tap, a key.
 *   3. Never a blocker. If the video cannot play, the timer still runs and
 *      the overlay still leaves.
 */

const SEEN = "gogter:intro";
const MAX_MS = 2600;
const MEDIA_BUCKET = process.env.NEXT_PUBLIC_SITE_MEDIA_BUCKET ?? "gogter-site-media";
const INTRO_MEDIA_CACHE = "gogter:intro-video:v1";

type IntroManifest = {
  assets?: { path: string; kind: "image" | "video" }[];
  slots?: Record<string, string | undefined>;
};

function cachedIntroSource() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  if (typeof window === "undefined" || !supabaseUrl) return "/logo-animation.mp4";

  try {
    const path = window.localStorage.getItem(INTRO_MEDIA_CACHE);
    if (path && /^assets\/[a-z0-9_-]+\.(mp4|webm)$/i.test(path)) {
      return `${supabaseUrl}/storage/v1/object/public/${MEDIA_BUCKET}/${path}`;
    }
  } catch {
    // Storage can be disabled in private browsing; the public file remains a fallback.
  }

  return "/logo-animation.mp4";
}

export function Intro() {
  const [showing, setShowing] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [introSrc, setIntroSrc] = useState(cachedIntroSource);
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
    if (!supabaseUrl) return;

    let alive = true;
    void fetch(`${supabaseUrl}/storage/v1/object/public/${MEDIA_BUCKET}/site-media.json`, {
      cache: "no-store",
    })
      .then((response) => (response.ok ? response.json() as Promise<IntroManifest> : null))
      .then((manifest) => {
        const path = manifest?.slots?.logo_intro_video;
        if (!alive) return;
        const assignedVideo =
          path &&
          /^assets\/[a-z0-9_-]+\.(mp4|webm)$/i.test(path) &&
          manifest?.assets?.some((asset) => asset.path === path && asset.kind === "video");

        if (!assignedVideo) {
          try {
            window.localStorage.removeItem(INTRO_MEDIA_CACHE);
          } catch {
            /* The uncached public file remains available. */
          }
          setIntroSrc("/logo-animation.mp4");
          return;
        }

        const publicPath = path.split("/").map(encodeURIComponent).join("/");
        try {
          window.localStorage.setItem(INTRO_MEDIA_CACHE, path);
        } catch {
          /* The browser's HTTP media cache still keeps the video locally. */
        }
        setIntroSrc(`${supabaseUrl}/storage/v1/object/public/${MEDIA_BUCKET}/${publicPath}`);
      })
      .catch(() => undefined);

    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    let seen = true;
    try {
      seen = sessionStorage.getItem(SEEN) === "1";
    } catch {
      // Private mode, blocked storage: treat it as seen and skip the intro
      // rather than risk showing it on every page.
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (seen || reduced) return;

    try {
      sessionStorage.setItem(SEEN, "1");
    } catch {
      /* nothing to do */
    }

    setShowing(true);
    document.documentElement.style.overflow = "hidden";

    const leave = () => {
      setLeaving(true);
      document.documentElement.style.overflow = "";
      // Matches the fade in CSS; the node is removed once it is invisible.
      window.setTimeout(() => setShowing(false), 620);
    };

    const backstop = window.setTimeout(leave, MAX_MS);

    const skip = () => {
      window.clearTimeout(backstop);
      leave();
    };

    window.addEventListener("wheel", skip, { once: true, passive: true });
    window.addEventListener("touchstart", skip, { once: true, passive: true });
    window.addEventListener("keydown", skip, { once: true });
    window.addEventListener("pointerdown", skip, { once: true });

    return () => {
      window.clearTimeout(backstop);
      document.documentElement.style.overflow = "";
      window.removeEventListener("wheel", skip);
      window.removeEventListener("touchstart", skip);
      window.removeEventListener("keydown", skip);
      window.removeEventListener("pointerdown", skip);
    };
  }, []);

  useEffect(() => {
    if (!showing) return;
    // Autoplay is only allowed muted; a refusal is not worth handling
    // beyond letting the timer carry on.
    video.current?.play().catch(() => undefined);
  }, [introSrc, showing]);

  if (!showing) return null;

  return (
    <div className={`intro${leaving ? " out" : ""}`} aria-hidden="true">
      <video
        ref={video}
        className="intro-film"
        src={introSrc}
        muted
        playsInline
        preload="auto"
      />
    </div>
  );
}
