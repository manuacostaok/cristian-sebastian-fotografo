import Link from "next/link";
import { cn } from "@/lib/utils";
import type { PortfolioCategory } from "@/lib/types";

export function CategoryNav({
  categories,
  activeSlug,
}: {
  categories: PortfolioCategory[];
  activeSlug?: string;
}) {
  return (
    <nav className="flex flex-wrap gap-x-6 gap-y-3 border-b border-paper-line pb-8">
      <Link
        href="/portfolio"
        className={cn(
          "text-[11px] uppercase tracking-[0.16em] transition-opacity hover:opacity-60",
          !activeSlug ? "text-ink" : "text-paper-muted",
        )}
      >
        Todo
      </Link>
      {categories.map((cat) => (
        <Link
          key={cat.id}
          href={`/portfolio/${cat.slug}`}
          className={cn(
            "text-[11px] uppercase tracking-[0.16em] transition-opacity hover:opacity-60",
            activeSlug === cat.slug ? "text-ink" : "text-paper-muted",
          )}
        >
          {cat.name}
        </Link>
      ))}
    </nav>
  );
}
