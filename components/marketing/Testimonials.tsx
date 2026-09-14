import { Container } from "@/components/ui/Container";
import type { Testimonial } from "@/lib/types";

export function Testimonials({ items }: { items: Testimonial[] }) {
  if (items.length === 0) return null;

  return (
    <section className="bg-paper-dim py-24 sm:py-32">
      <Container>
        <p className="text-center text-[11px] uppercase tracking-[0.2em] text-paper-muted">
          Lo que dicen
        </p>
        <div className="mt-14 grid gap-10 sm:grid-cols-3 sm:gap-8">
          {items.map((t) => (
            <figure key={t.id} className="flex flex-col">
              <blockquote className="font-display text-xl leading-snug italic">
                “{t.text}”
              </blockquote>
              <figcaption className="mt-5 text-[11px] uppercase tracking-[0.14em] text-paper-muted">
                {t.name} — {t.eventLabel}
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}
