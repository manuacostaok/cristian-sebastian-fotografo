"use client";

import { ButtonLink } from "@/components/ui/Button";
import { track } from "@/lib/track";

/** Thin client wrapper so Server Component pages can track a WhatsApp CTA click. */
export function WhatsAppCtaLink({
  href,
  children,
  variant,
  context,
}: {
  href: string;
  children: React.ReactNode;
  variant?: "solid" | "outline" | "text";
  context: string;
}) {
  return (
    <ButtonLink href={href} external variant={variant} onClick={() => track("whatsapp_click", { context })}>
      {children}
    </ButtonLink>
  );
}
