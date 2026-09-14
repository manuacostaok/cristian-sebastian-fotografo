"use client";

import { MessageCircle } from "lucide-react";
import { buildWhatsAppLink, generalMessage } from "@/lib/whatsapp";
import { track } from "@/lib/track";

/** Persistent floating WhatsApp entry point — present across the whole public site. */
export function WhatsAppButton({ message, phoneNumber }: { message?: string; phoneNumber?: string }) {
  const href = buildWhatsAppLink(message ?? generalMessage(), phoneNumber);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Consultar por WhatsApp"
      onClick={() => track("whatsapp_click", { context: "floating-button" })}
      className="group fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-ink text-paper shadow-[0_8px_30px_rgba(0,0,0,0.35)] transition-transform duration-300 ease-[var(--ease-editorial)] hover:scale-105 hover:bg-gold hover:text-ink sm:h-16 sm:w-16"
    >
      <MessageCircle className="h-6 w-6" strokeWidth={1.75} />
    </a>
  );
}
