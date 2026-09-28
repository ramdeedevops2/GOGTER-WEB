"use client";

import { useEffect, useRef } from "react";

/*
 * The cursor, and the right-click.
 *
 * ── The cursor ────────────────────────────────────────────────
 *
 * One black dot, exactly under the pointer, swelling over anything you can
 * click. Nothing else: no trailing ring, no blend modes, no text inside it —
 * those read as a portfolio trick rather than as a product.
 *
 * It does not lag. A dot that eases towards the pointer looks smooth in a
 * demo and feels broken in use, because the thing you are aiming with is no
 * longer where you put it. The position is written on the next animation
 * frame after the move, which is as soon as the screen can show it.
 *
 * It only exists where there is a real pointer. On a phone there is nothing
 * to draw and `cursor: none` would be a bug, so the whole thing is skipped
 * and the browser's own behaviour stands. Same for anyone who has asked for
 * less motion.
 *
 * ── The right-click ───────────────────────────────────────────
 *
 * Suppressed, as asked. Worth knowing what that does and does not do: it
 * stops the menu on this page, which discourages a casual save-image or
 * view-source. It is not protection — the pictures are still requests in the
 * network tab, and the keyboard shortcuts still work.
 */

export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Right-click first: this part applies to every device.
    const blockMenu = (event: MouseEvent) => event.preventDefault();
    document.addEventListener("contextmenu", blockMenu);

    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!fine || reduced) {
      return () => document.removeEventListener("contextmenu", blockMenu);
    }

    const node = dot.current;
    if (!node) return () => document.removeEventListener("contextmenu", blockMenu);

    document.documentElement.classList.add("has-cursor");

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let frame = 0;
    let queued = false;
    let shown = false;

    /*
     * One write per frame, on the frame.
     *
     * A pointer can fire far more often than the screen refreshes, and
     * writing a transform on every one of those events is work nobody sees.
     * Coalescing to the next frame keeps it exact and cheap at once.
     */
    const draw = () => {
      queued = false;
      node.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
    };

    const onMove = (event: PointerEvent) => {
      x = event.clientX;
      y = event.clientY;

      if (!queued) {
        queued = true;
        frame = requestAnimationFrame(draw);
      }

      if (!shown) {
        shown = true;
        node.classList.add("on");
      }

      const target = event.target as HTMLElement | null;

      // Anything with its own affordance makes the dot swell.
      node.classList.toggle(
        "over",
        Boolean(target?.closest("a, button, [role='button'], input, figure"))
      );

      /*
       * On the dark bands the dot flips to cream.
       *
       * Done by asking which section the pointer is over rather than with a
       * difference blend: a blend mode inverts against everything it crosses,
       * including photographs, which turns the cursor into a different colour
       * every few pixels. Sections opt in, so a new dark band only has to say
       * so with data-dark.
       */
      node.classList.toggle("invert", Boolean(target?.closest(".banner, .marquee, [data-dark]")));
    };

    const onLeave = () => {
      shown = false;
      node.classList.remove("on");
    };

    const onDown = () => node.classList.add("down");
    const onUp = () => node.classList.remove("down");

    draw();
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("contextmenu", blockMenu);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointerleave", onLeave);
      document.documentElement.classList.remove("has-cursor");
    };
  }, []);

  return <div ref={dot} className="cursor" aria-hidden="true" />;
}
