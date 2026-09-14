import Image from "next/image";
import { cn } from "@/lib/utils";
import { PhotoPlaceholder } from "@/components/ui/PhotoPlaceholder";

/**
 * Renders a real uploaded photo (Cloudinary URL) when available, otherwise
 * falls back to the on-brand gradient placeholder. Every gallery/hero/card
 * image in the app should go through this so swapping in real photos via
 * /admin never requires touching page code.
 */
export function PhotoFrame({
  url,
  seed,
  alt = "",
  label,
  className,
  sizes,
  priority,
}: {
  url?: string;
  seed: string;
  alt?: string;
  label?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  if (!url) {
    return <PhotoPlaceholder seed={seed} label={label} className={className} />;
  }

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <Image
        src={url}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes ?? "(max-width: 768px) 100vw, 50vw"}
        className="object-cover"
      />
    </div>
  );
}
