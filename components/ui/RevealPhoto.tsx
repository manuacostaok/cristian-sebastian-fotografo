"use client";

import { useEffect, useRef } from "react";
import { animate } from "animejs";
import { PhotoFrame } from "@/components/ui/PhotoFrame";
import { cn } from "@/lib/utils";

/**
 * Cinematic photo reveal: an SVG curtain wipes away (anime.js) as the photo
 * settles in from a slight zoom, triggered once when it scrolls into view.
 * Used everywhere a photo appears in a grid/story so the site's motion
 * language stays consistent — never on the Hero (that one loads instantly).
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
  const containerRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const rectRef = useRef<SVGRectElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const photo = photoRef.current;
    const rect = rectRef.current;
    if (!container || !photo || !rect) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      rect.style.display = "none";
      photo.style.opacity = "1";
      return;
    }

    let animated = false;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting || animated) continue;
          animated = true;

          animate(rect, {
            scaleX: [1, 0],
            duration: 900,
            ease: "inOutQuart",
          });
          animate(photo, {
            scale: [1.08, 1],
            opacity: [0, 1],
            duration: 1100,
            delay: 120,
            ease: "outQuart",
          });
          observer.unobserve(container);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className={cn("relative overflow-hidden", className)}>
      <div ref={photoRef} className="absolute inset-0 h-full w-full opacity-0">
        <PhotoFrame seed={seed} url={url} alt={alt} label={label} sizes={sizes} className="h-full w-full" />
      </div>
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <rect
          ref={rectRef}
          x="0"
          y="0"
          width="100"
          height="100"
          className="fill-ink"
          style={{ transformBox: "fill-box", transformOrigin: "100% 50%" }}
        />
      </svg>
    </div>
  );
}
