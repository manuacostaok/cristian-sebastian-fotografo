const DEFAULT_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";

/** Builds a wa.me deep link with a prefilled, contextual message. */
export function buildWhatsAppLink(message: string, phoneNumber = DEFAULT_NUMBER) {
  const digits = phoneNumber.replace(/[^\d]/g, "");
  const params = new URLSearchParams({ text: message });
  return `https://wa.me/${digits}?${params.toString()}`;
}

export function inquiryMessage(input: {
  eventType?: string;
  eventDate?: string;
  location?: string;
}) {
  const parts = ["Hola Christian! Vi tu web y quisiera consultar disponibilidad"];
  if (input.eventDate) parts.push(`para el ${input.eventDate}`);
  if (input.eventType) parts.push(`(${input.eventType})`);
  if (input.location) parts.push(`en ${input.location}`);
  return `${parts.join(" ")}.`;
}

export function portfolioMessage(projectTitle: string) {
  return `Hola Christian! Vi "${projectTitle}" en tu portfolio y me encantaría hablar sobre mi evento.`;
}

export function generalMessage() {
  return "Hola Christian! Vi tu web y quisiera hacerte una consulta.";
}
