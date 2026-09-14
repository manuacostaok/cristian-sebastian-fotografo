"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { BookOpen, ChevronLeft, ChevronRight, X } from "lucide-react";
import { PhotoFrame } from "@/components/ui/PhotoFrame";
import { cn } from "@/lib/utils";
import { formatDateLong } from "@/lib/utils";
import type { PortfolioPhoto } from "@/lib/types";

const MAX_PAGES = 10;
const TURN_DELAY_MS = 20;
const TURN_DURATION_MS = 650;

type BookProject = {
  title: string;
  date: string;
  location: string;
  description: string;
  credits?: string;
  photos: PortfolioPhoto[];
};

type Page = { type: "intro" } | { type: "photo"; photo: PortfolioPhoto; number: number };

/**
 * Full-screen digital-book viewer: one intro page (event context) followed by
 * up to MAX_PAGES photo pages, advanced with a click-triggered page-turn.
 * The turn is driven by a mount-scoped setTimeout + inline transform (the
 * same pattern RevealPhoto settled on) rather than an IntersectionObserver
 * or rAF loop, so it can't get stuck mid-flip in a backgrounded tab or an
 * automated test pane.
 */
export function BookViewer({ project, triggerLabel = "Ver como libro" }: { project: BookProject; triggerLabel?: string }) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [flip, setFlip] = useState<{ dir: "next" | "prev"; from: number; to: number } | null>(null);
  const touchStartX = useRef<number | null>(null);

  const photos = project.photos.slice(0, MAX_PAGES);
  const pages: Page[] = [
    { type: "intro" },
    ...photos.map((photo, i) => ({ type: "photo" as const, photo, number: i + 1 })),
  ];

  const goTo = useCallback(
    (target: number) => {
      if (flip) return;
      if (target < 0 || target > pages.length - 1 || target === index) return;
      setFlip({ dir: target > index ? "next" : "prev", from: index, to: target });
    },
    [flip, index, pages.length],
  );
  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  const close = useCallback(() => {
    setOpen(false);
    setFlip(null);
    setIndex(0);
  }, []);

  useEffect(() => {
    if (!open) return;
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
  }, [open, close, next, prev]);

  if (photos.length === 0) return null;

  const settledIndex = flip ? flip.to : index;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 border border-gold/40 px-5 py-3 text-[11px] uppercase tracking-[0.2em] text-gold-bright transition-colors hover:border-gold hover:bg-gold/10"
      >
        <BookOpen size={15} strokeWidth={1.5} />
        {triggerLabel}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[70] flex flex-col items-center justify-center bg-black/92 p-4 sm:p-10"
          role="dialog"
          aria-modal="true"
          aria-label={`${project.title} — libro digital`}
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
            aria-label="Cerrar libro"
            className="absolute right-5 top-5 z-10 text-paper/70 hover:text-paper"
          >
            <X size={26} strokeWidth={1.5} />
          </button>

          <div className="relative aspect-[3/4] w-full max-w-md [perspective:1800px] sm:max-h-[86vh] sm:max-w-lg">
            <div className="absolute inset-0 overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.6)]">
              <PageContent page={pages[settledIndex]} project={project} total={photos.length} />
            </div>

            {flip && (
              <FlipLeaf key={`${flip.from}-${flip.dir}`} dir={flip.dir} onDone={() => { setIndex(flip.to); setFlip(null); }}>
                <PageContent page={pages[flip.from]} project={project} total={photos.length} />
              </FlipLeaf>
            )}

            {settledIndex > 0 && (
              <button
                onClick={prev}
                aria-label="Página anterior"
                className="absolute -left-4 top-1/2 z-20 -translate-y-1/2 text-paper/60 hover:text-paper sm:-left-14"
              >
                <ChevronLeft size={30} strokeWidth={1.5} />
              </button>
            )}
            {settledIndex < pages.length - 1 && (
              <button
                onClick={next}
                aria-label="Página siguiente"
                className="absolute -right-4 top-1/2 z-20 -translate-y-1/2 text-paper/60 hover:text-paper sm:-right-14"
              >
                <ChevronRight size={30} strokeWidth={1.5} />
              </button>
            )}
          </div>

          <p className="mt-6 text-[11px] uppercase tracking-[0.2em] text-paper/40">
            {settledIndex === 0 ? "Portada" : `${settledIndex} / ${photos.length}`}
          </p>
        </div>
      )}
    </>
  );
}

function FlipLeaf({
  dir,
  onDone,
  children,
}: {
  dir: "next" | "prev";
  onDone: () => void;
  children: React.ReactNode;
}) {
  const [turned, setTurned] = useState(false);

  useEffect(() => {
    const trigger = setTimeout(() => setTurned(true), TURN_DELAY_MS);
    const commit = setTimeout(onDone, TURN_DELAY_MS + TURN_DURATION_MS);
    return () => {
      clearTimeout(trigger);
      clearTimeout(commit);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const angle = dir === "next" ? -150 : 150;

  return (
    <div
      className="absolute inset-0 overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.6)] transition-transform ease-[var(--ease-editorial)]"
      style={{
        transform: turned ? `rotateY(${angle}deg)` : "rotateY(0deg)",
        transformOrigin: dir === "next" ? "left center" : "right center",
        transitionDuration: `${TURN_DURATION_MS}ms`,
      }}
    >
      {children}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-black transition-opacity ease-[var(--ease-editorial)]"
        style={{ opacity: turned ? 0.35 : 0, transitionDuration: `${TURN_DURATION_MS}ms` }}
      />
    </div>
  );
}

function PageContent({ page, project, total }: { page: Page; project: BookProject; total: number }) {
  if (page.type === "intro") {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center bg-ink px-8 text-center text-paper sm:px-14">
        <p className="text-[11px] uppercase tracking-[0.3em] text-gold-bright">Historia</p>
        <h2 className="mt-6 font-display text-2xl leading-tight sm:text-4xl">{project.title}</h2>
        <p className="mt-5 text-xs text-paper/60 sm:text-sm">
          {formatDateLong(new Date(project.date))} — {project.location}
        </p>
        <p className="mt-7 max-w-sm text-sm leading-relaxed text-paper/70">{project.description}</p>
        {project.credits && <p className="mt-6 text-xs text-paper/40">{project.credits}</p>}
        <p className="mt-10 flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-gold">
          Abrir el libro
          <ChevronRight size={14} strokeWidth={1.5} />
        </p>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full bg-ink">
      <PhotoFrame
        url={page.photo.url}
        seed={page.photo.seed}
        alt={page.photo.alt}
        sizes="(max-width: 640px) 100vw, 520px"
        className="h-full w-full"
      />
      <div className={cn("absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink via-ink/70 to-transparent px-6 pb-7 pt-16")}>
        <p className="font-display text-base text-paper sm:text-lg">{page.photo.alt}</p>
        <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-paper/50">
          Página {page.number} / {total}
        </p>
      </div>
    </div>
  );
}
