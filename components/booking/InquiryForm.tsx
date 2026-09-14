"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { inquirySchema, type InquiryInput } from "@/lib/validations";
import { formatDateLong } from "@/lib/utils";
import { buildWhatsAppLink, inquiryMessage } from "@/lib/whatsapp";
import { Button, ButtonLink } from "@/components/ui/Button";

const EVENT_TYPES = ["15 años", "Cumpleaños 18", "Cumpleaños", "Boda", "Evento", "Sesión / Exteriores", "Otro"];

export function InquiryForm({ defaultDate, phoneNumber }: { defaultDate?: string; phoneNumber?: string }) {
  const [sent, setSent] = useState<InquiryInput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<InquiryInput>({
    resolver: zodResolver(inquirySchema),
    defaultValues: { eventDate: defaultDate ?? "" },
  });

  async function onSubmit(data: InquiryInput) {
    setError(null);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      setSent(data);
    } catch {
      setError("No pudimos enviar tu consulta. Probá de nuevo o escribinos directamente por WhatsApp.");
    }
  }

  if (sent) {
    const whatsappHref = buildWhatsAppLink(
      inquiryMessage({
        eventType: sent.eventType,
        eventDate: formatDateLong(new Date(sent.eventDate)),
        location: sent.location,
      }),
      phoneNumber,
    );

    return (
      <div className="rounded-sm border border-paper-line bg-paper-dim p-8 text-center">
        <p className="font-display text-2xl">¡Gracias, {sent.name}!</p>
        <p className="mt-3 text-paper-muted">
          Recibimos tu consulta. Para una respuesta más rápida, escribinos directo por WhatsApp.
        </p>
        <div className="mt-6">
          <ButtonLink href={whatsappHref} external variant="solid">
            Continuar por WhatsApp
          </ButtonLink>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 sm:grid-cols-2">
      <Field label="Nombre" error={errors.name?.message}>
        <input {...register("name")} className="field" />
      </Field>
      <Field label="Teléfono" error={errors.phone?.message}>
        <input {...register("phone")} className="field" placeholder="+54 9 11 ..." />
      </Field>
      <Field label="Email (opcional)" error={errors.email?.message}>
        <input {...register("email")} type="email" className="field" />
      </Field>
      <Field label="Tipo de evento" error={errors.eventType?.message}>
        <select {...register("eventType")} className="field" defaultValue="">
          <option value="" disabled>
            Elegí una opción
          </option>
          {EVENT_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Fecha del evento" error={errors.eventDate?.message}>
        <input {...register("eventDate")} type="date" className="field" />
      </Field>
      <Field label="Localidad" error={errors.location?.message}>
        <input {...register("location")} className="field" />
      </Field>
      <Field label="Cantidad aproximada de personas" error={errors.guestCount?.message}>
        <input {...register("guestCount")} type="text" inputMode="numeric" className="field" />
      </Field>
      <Field label="Mensaje" error={errors.message?.message} full>
        <textarea {...register("message")} rows={4} className="field" />
      </Field>

      {error && <p className="sm:col-span-2 text-sm text-ember">{error}</p>}

      <div className="sm:col-span-2">
        <Button type="submit" variant="solid">
          {isSubmitting ? "Enviando…" : "Enviar consulta"}
        </Button>
      </div>
    </form>
  );
}

function Field({
  label,
  error,
  full,
  children,
}: {
  label: string;
  error?: string;
  full?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className={`flex flex-col gap-2 ${full ? "sm:col-span-2" : ""}`}>
      <span className="text-[11px] uppercase tracking-[0.14em] text-paper-muted">{label}</span>
      {children}
      {error && <span className="text-xs text-ember">{error}</span>}
    </label>
  );
}
