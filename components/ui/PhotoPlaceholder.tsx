import { cn } from "@/lib/utils";
import { placeholderGradient } from "@/lib/placeholder";

/**
 * Stand-in for a real photograph while the admin hasn't uploaded one yet.
 * Deliberately styled (brand gradient + label), never a stock photo —
 * it should read as "content coming soon", not as a broken image.
 */
export function PhotoPlaceholder({
  seed,
  label,
  className,
}: {
  seed: string;
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={cn("relative flex items-end overflow-hidden", className)}
      style={{ background: placeholderGradient(seed) }}
    >
      {label && (
        <span className="relative z-10 p-4 text-[10px] uppercase tracking-[0.18em] text-paper/70">
          {label}
        </span>
      )}
    </div>
  );
}
