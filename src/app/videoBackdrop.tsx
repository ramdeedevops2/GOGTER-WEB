"use client";

import { useEffect, useRef } from "react";

type VideoBackdropProps = {
  src: string;
  poster: string;
  className?: string;
};

export function VideoBackdrop({ src, poster, className = "" }: VideoBackdropProps) {
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const element = video.current;
    if (!element) return;

    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let isVisible = false;

    const syncPlayback = () => {
      if (document.hidden || !isVisible || motionPreference.matches) {
        element.pause();
        return;
      }

      void element.play().catch(() => {});
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting && entry.intersectionRatio >= 0.35;
        syncPlayback();
      },
      { threshold: [0, 0.35] },
    );

    observer.observe(element);
    motionPreference.addEventListener("change", syncPlayback);
    document.addEventListener("visibilitychange", syncPlayback);

    return () => {
      observer.disconnect();
      motionPreference.removeEventListener("change", syncPlayback);
      document.removeEventListener("visibilitychange", syncPlayback);
      element.pause();
    };
  }, [src]);

  return (
    <video
      ref={video}
      className={`video-backdrop ${className}`.trim()}
      muted
      loop
      playsInline
      preload="none"
      poster={poster}
      aria-hidden="true"
      tabIndex={-1}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
