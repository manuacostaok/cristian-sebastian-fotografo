"use client";

import { useEffect, useState } from "react";
import { PhotoFrame } from "@/components/ui/PhotoFrame";
import { cn } from "@/lib/utils";

/**
 * Cinematic photo reveal: a curtain wipes away as the photo settles in from
 * a slight zoom. Plays automatically shortly after mount via a plain CSS
 * transition — no IntersectionObserver, no requestAnimationFrame-driven JS
 * animation library. Both of those turned out to be fragile: a photo is the
 * whole point of this site, and a scroll-triggered or rAF-driven reveal can
 * stay stuck mid-animation in some browser/tab states (backgrounded tabs,
 * automated test panes) since neither IntersectionObserver callbacks nor
 * rAF ticks are guaranteed to fire promptly. A bare setTimeout always does.
 *
 * Uses inline styles (not Tailwind's scale utility classes) for the
 * transform itself — Tailwind v4's transform utilities compose through CSS
 * custom properties that didn't reliably resolve to an actual `scale` here;
 * an inline style leaves nothing to that ambiguity.
 */
export function RevealPhoto({
  seed,
  url,
  alt,
  label,
  className,
  sizes,
}: {
  seed: string;
  url?: string;
  alt?: string;
  label?: string;
  className?: string;
  sizes?: string;
}) {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    // A short delay lets the browser paint the initial (covered) state at
    // least once before switching classes — otherwise the two states can
    // get coalesced into a single paint and the transition never shows.
    const timer = setTimeout(() => setRevealed(true), 80);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <div
        className="absolute inset-0 h-full w-full transition-[transform,opacity] duration-1000 ease-[var(--ease-editorial)] motion-reduce:transition-none motion-reduce:opacity-100! motion-reduce:scale-100!"
        style={{ transform: revealed ? "scale(1)" : "scale(1.08)", opacity: revealed ? 1 : 0 }}
      >
        <PhotoFrame seed={seed} url={url} alt={alt} label={label} sizes={sizes} className="h-full w-full" />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full bg-ink transition-transform duration-700 ease-[var(--ease-editorial)] motion-reduce:hidden"
        style={{ transform: revealed ? "scaleX(0)" : "scaleX(1)", transformOrigin: "right center" }}
      />
    </div>
  );
}
