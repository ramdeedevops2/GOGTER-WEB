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

export function Intro() {
  const [showing, setShowing] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const video = useRef<HTMLVideoElement>(null);

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
  }, [showing]);

  if (!showing) return null;

  return (
    <div className={`intro${leaving ? " out" : ""}`} aria-hidden="true">
      <video
        ref={video}
        className="intro-film"
        src="/logo-animation.mp4"
        muted
        playsInline
        preload="auto"
      />
    </div>
  );
}
