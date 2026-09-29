"use client";

import { useEffect, useRef } from "react";

type Slide = { image: string; title: string };

export function Runway({ id, slides }: { id: string; slides: Slide[] }) {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = section.current;
    const rail = track.current;
    if (!root || !rail) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let distance = 0;

    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (motion.matches || window.innerWidth <= 760) return;
        const bounds = root.getBoundingClientRect();
        const progress = Math.max(
          0,
          Math.min(1, -bounds.top / (root.offsetHeight - window.innerHeight || 1)),
        );
        rail.style.transform = `translate3d(${-distance * progress}px, 0, 0)`;
      });
    };

    const measure = () => {
      distance = Math.max(0, rail.scrollWidth - window.innerWidth);
      root.style.height = `${window.innerHeight + distance}px`;
      update();
    };

    const changeMotion = () => {
      if (motion.matches || window.innerWidth <= 760) {
        root.style.height = "auto";
        rail.style.transform = "none";
      } else {
        measure();
      }
    };

    changeMotion();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", changeMotion, { passive: true });
    motion.addEventListener("change", changeMotion);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", changeMotion);
      motion.removeEventListener("change", changeMotion);
    };
  }, []);

  return (
    <section className="runway" id={id} ref={section} aria-label="Gogter connections">
      <div className="runway-pin">
        <div className="runway-track" ref={track}>
          {slides.map((slide) => (
            <article className="runway-slide" key={slide.title}>
              <img className="runway-image" src={slide.image} alt="" />
              <div className="slide-shade" />
              <div className="slide-copy">
                <h2>{slide.title}</h2>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
