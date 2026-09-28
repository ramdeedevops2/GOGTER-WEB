"use client";

import { useEffect } from "react";

/*
 * The page's motion, in one place.
 *
 * Two jobs, both cheap:
 *
 *   1. Mark the document as scripted. Every reveal style is written under
 *      `.js`, so with the script blocked or still loading the page renders
 *      fully visible rather than as a blank cream sheet — the failure mode
 *      of every scroll-animation library.
 *
 *   2. Reveal elements as they arrive, then stop watching them. An observer
 *      that keeps firing on a long page is the difference between a smooth
 *      scroll and a stuttering one, and nothing here needs to animate twice.
 *
 * Elements opt in with `className="reveal"` and stagger with
 * `style={{ "--delay": "80ms" }}`.
 */
export function Reveal() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("js");

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const targets = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));

    if (reduced) {
      targets.forEach((el) => el.classList.add("in"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("in");
          observer.unobserve(entry.target);
        }
      },
      // A little before the edge, so things are already settling by the
      // time they are properly in view.
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 }
    );

    targets.forEach((el) => observer.observe(el));

    /*
     * The collage drifts against the scroll.
     *
     * Read once per frame and written as a transform, so this stays on the
     * compositor and never triggers layout. rAF rather than a scroll handler
     * for the same reason.
     */
    const parallax = Array.from(document.querySelectorAll<HTMLElement>("[data-parallax]"));
    let ticking = false;

    const onScroll = () => {
      if (ticking || parallax.length === 0) return;
      ticking = true;

      requestAnimationFrame(() => {
        const y = window.scrollY;
        for (const el of parallax) {
          const depth = Number(el.dataset.parallax) || 0;
          el.style.setProperty("--shift", `${(y * depth).toFixed(1)}px`);
        }
        ticking = false;
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return null;
}
