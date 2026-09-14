"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { PhotoFrame } from "@/components/ui/PhotoFrame";
import { RevealPhoto } from "@/components/ui/RevealPhoto";
import { cn } from "@/lib/utils";
import type { PortfolioPhoto } from "@/lib/types";

const ASPECT_CLASS: Record<PortfolioPhoto["aspect"], string> = {
  portrait: "aspect-[3/4]",
  landscape: "aspect-[4/3]",
  square: "aspect-square",
  wide: "aspect-[16/9]",
};

export function ImmersiveGallery({ photos }: { photos: PortfolioPhoto[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const touchStartX = useRef<number | null>(null);

  const close = useCallback(() => setActiveIndex(null), []);
  const next = useCallback(
    () => setActiveIndex((i) => (i === null ? null : (i + 1) % photos.length)),
    [photos.length],
  );
  const prev = useCallback(
    () => setActiveIndex((i) => (i === null ? null : (i - 1 + photos.length) % photos.length)),
    [photos.length],
  );

  useEffect(() => {
    if (activeIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [activeIndex, close, next, prev]);

  return (
    <>
      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
        {photos.map((photo, i) => (
          <button
            key={photo.id}
            onClick={() => setActiveIndex(i)}
            className={cn(
              "group mb-4 block w-full overflow-hidden break-inside-avoid",
              ASPECT_CLASS[photo.aspect],
            )}
            aria-label={`Ampliar: ${photo.alt}`}
          >
            <RevealPhoto
              seed={photo.seed}
              url={photo.url}
              alt={photo.alt}
              className="h-full w-full transition-transform duration-500 ease-[var(--ease-editorial)] group-hover:scale-[1.02]"
            />
          </button>
        ))}
      </div>

      {activeIndex !== null && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/97 p-4"
          role="dialog"
          aria-modal="true"
          onTouchStart={(e) => (touchStartX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchStartX.current === null) return;
            const delta = e.changedTouches[0].clientX - touchStartX.current;
            if (delta > 50) prev();
            if (delta < -50) next();
            touchStartX.current = null;
          }}
        >
          <button
            onClick={close}
            aria-label="Cerrar galería"
            className="absolute right-5 top-5 text-paper/70 hover:text-paper"
          >
            <X size={28} strokeWidth={1.5} />
          </button>

          <button
            onClick={prev}
            aria-label="Foto anterior"
            className="absolute left-3 text-paper/70 hover:text-paper sm:left-6"
          >
            <ChevronLeft size={32} strokeWidth={1.5} />
          </button>

          <figure className="max-h-[85vh] w-full max-w-4xl">
            <PhotoFrame
              seed={photos[activeIndex].seed}
              url={photos[activeIndex].url}
              alt={photos[activeIndex].alt}
              label={photos[activeIndex].alt}
              sizes="100vw"
              className="aspect-[4/5] w-full sm:aspect-[3/2]"
            />
          </figure>

          <button
            onClick={next}
            aria-label="Foto siguiente"
            className="absolute right-3 text-paper/70 hover:text-paper sm:right-6"
          >
            <ChevronRight size={32} strokeWidth={1.5} />
          </button>

          <p className="absolute bottom-6 text-xs uppercase tracking-[0.14em] text-paper/50">
            {activeIndex + 1} / {photos.length}
          </p>
        </div>
      )}
    </>
  );
}
