import { ButtonLink } from "@/components/ui/Button";
import { PhotoFrame } from "@/components/ui/PhotoFrame";
import type { HomeConfigData } from "@/lib/types";

export function Hero({ config }: { config: HomeConfigData }) {
  return (
    <section className="relative flex h-[100svh] min-h-[640px] w-full items-end overflow-hidden bg-ink text-paper">
      <PhotoFrame
        seed={config.heroSeed}
        url={config.heroUrl}
        alt={config.heroTitle}
        priority
        sizes="100vw"
        className="absolute inset-0 h-full w-full"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-ink/10" />

      <div className="relative z-10 w-full px-6 pb-16 sm:px-10 lg:px-16 lg:pb-24">
        <p className="text-[11px] uppercase tracking-[0.28em] text-gold-bright">
          Fotógrafo — Buenos Aires
        </p>
        <h1 className="mt-5 max-w-3xl font-display text-[13vw] leading-[0.95] tracking-tight sm:text-[9vw] lg:text-[6.5vw]">
          {config.heroTitle}
        </h1>
        <p className="mt-6 max-w-md text-balance font-display text-lg italic text-paper/85 sm:text-xl">
          {config.heroSubtitle}
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <ButtonLink href="/portfolio" variant="solid">
            {config.heroCtaPrimary}
          </ButtonLink>
          <ButtonLink href="/consultar" variant="outline">
            {config.heroCtaSecondary}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
