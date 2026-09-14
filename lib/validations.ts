import { z } from "zod";

const utmFields = {
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
  utmContent: z.string().optional(),
  utmTerm: z.string().optional(),
};

// Honeypot: a hidden field real visitors never fill. Any value means "bot" —
// the request is accepted (200) but silently dropped, so scrapers can't tell.
const honeypot = { website: z.string().optional() };

export const inquirySchema = z.object({
  name: z.string().min(2, "Ingresá tu nombre"),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  phone: z.string().min(6, "Ingresá un teléfono de contacto"),
  eventType: z.string().min(1, "Elegí un tipo de evento"),
  eventDate: z.string().min(1, "Elegí una fecha"),
  location: z.string().optional(),
  // Kept as string on the form (avoids zod-coerce/RHF resolver typing friction);
  // parsed to a number server-side before persisting.
  guestCount: z.string().optional(),
  message: z.string().optional(),
  ...utmFields,
  ...honeypot,
});

export type InquiryInput = z.infer<typeof inquirySchema>;

export const budgetWizardSchema = z.object({
  eventType: z.string().min(1, "Elegí un tipo de evento"),
  eventDate: z.string().min(1, "Elegí una fecha"),
  location: z.string().min(1, "Ingresá la localidad"),
  hours: z.string().min(1, "Elegí la duración"),
  serviceId: z.string().min(1, "Elegí una cobertura"),
  extraIds: z.array(z.string()).default([]),
  name: z.string().min(2, "Ingresá tu nombre"),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  phone: z.string().min(6, "Ingresá un teléfono de contacto"),
  ...utmFields,
  ...honeypot,
});

export type BudgetWizardInput = z.infer<typeof budgetWizardSchema>;

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
