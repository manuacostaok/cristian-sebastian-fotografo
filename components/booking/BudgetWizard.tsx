"use client";

import { useMemo, useState } from "react";
import { Check } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { cn, formatCurrencyARS, formatDateLong } from "@/lib/utils";
import { computeQuote } from "@/lib/pricing";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import type { ServiceOption, ExtraOption } from "@/lib/types";

const EVENT_TYPES = ["15 años", "Cumpleaños 18", "Cumpleaños", "Boda", "Evento", "Sesión / Exteriores"];
const HOURS_OPTIONS = ["2", "3", "4", "5", "6+"];
const STEPS = ["Evento", "Fecha y lugar", "Duración", "Extras", "Contacto", "Resumen"];

type FormState = {
  eventType: string;
  eventDate: string;
  location: string;
  hours: string;
  serviceId: string;
  extraIds: string[];
  name: string;
  email: string;
  phone: string;
};

const INITIAL: FormState = {
  eventType: "",
  eventDate: "",
  location: "",
  hours: "",
  serviceId: "",
  extraIds: [],
  name: "",
  email: "",
  phone: "",
};

export function BudgetWizard({
  services,
  extras,
  phoneNumber,
}: {
  services: ServiceOption[];
  extras: ExtraOption[];
  phoneNumber?: string;
}) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(INITIAL);
  const [submitted, setSubmitted] = useState(false);

  const matchingServices = useMemo(
    () => services.filter((s) => !form.eventType || s.categoryTag === slugForEventType(form.eventType)),
    [services, form.eventType],
  );

  const selectedService = services.find((s) => s.id === form.serviceId);
  const selectedExtras = extras.filter((e) => form.extraIds.includes(e.id));
  const quote = selectedService
    ? computeQuote(selectedService, selectedExtras)
    : null;

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function toggleExtra(id: string) {
    setForm((f) => ({
      ...f,
      extraIds: f.extraIds.includes(id) ? f.extraIds.filter((e) => e !== id) : [...f.extraIds, id],
    }));
  }

  const canAdvance = [
    !!form.eventType,
    !!form.eventDate && !!form.location,
    !!form.hours && !!form.serviceId,
    true,
    !!form.name && !!form.phone,
  ];

  async function handleSubmit() {
    setSubmitted(true);
    await fetch("/api/quotes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        phone: form.phone,
        eventType: form.eventType,
        eventDate: form.eventDate,
        location: form.location,
        requiresCustomQuote: quote?.requiresCustomQuote ?? true,
        items: quote?.items ?? [],
        total: quote?.total ?? 0,
      }),
    }).catch(() => {});
  }

  if (submitted) {
    const whatsappHref = buildWhatsAppLink(
      quote && !quote.requiresCustomQuote
        ? `Hola Christian! Arme un presupuesto en tu web para mi ${form.eventType} del ${formatDateLong(
            new Date(form.eventDate),
          )}: ${quote.items.map((i) => i.name).join(", ")} — total estimado ${formatCurrencyARS(
            quote.total,
          )}. ¿Charlamos?`
        : `Hola Christian! Quiero pedirte un presupuesto personalizado para mi ${form.eventType} del ${
            form.eventDate ? formatDateLong(new Date(form.eventDate)) : ""
          }.`,
      phoneNumber,
    );

    return (
      <div className="rounded-sm border border-paper-line bg-paper-dim p-10 text-center">
        <p className="font-display text-3xl">¡Listo, {form.name}!</p>
        <p className="mx-auto mt-3 max-w-sm text-paper-muted">
          Guardamos tu consulta. Confirmá los detalles por WhatsApp para que Christian te responda
          más rápido.
        </p>
        <div className="mt-8">
          <ButtonLink href={whatsappHref} external variant="solid">
            Confirmar por WhatsApp
          </ButtonLink>
        </div>
      </div>
    );
  }

  return (
    <div>
      <ol className="mb-12 flex flex-wrap gap-x-6 gap-y-2">
        {STEPS.map((label, i) => (
          <li
            key={label}
            className={cn(
              "flex items-center gap-2 text-[11px] uppercase tracking-[0.12em]",
              i === step ? "text-ink" : "text-paper-muted",
            )}
          >
            <span
              className={cn(
                "flex h-5 w-5 items-center justify-center rounded-full border text-[10px]",
                i < step ? "border-ink bg-ink text-paper" : "border-current",
              )}
            >
              {i < step ? <Check size={11} /> : i + 1}
            </span>
            {label}
          </li>
        ))}
      </ol>

      {step === 0 && (
        <StepBlock title="¿Qué tipo de evento estás planeando?">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {EVENT_TYPES.map((type) => (
              <OptionCard
                key={type}
                selected={form.eventType === type}
                onClick={() => update("eventType", type)}
              >
                {type}
              </OptionCard>
            ))}
          </div>
        </StepBlock>
      )}

      {step === 1 && (
        <StepBlock title="¿Cuándo y dónde?">
          <div className="grid gap-6 sm:grid-cols-2">
            <label className="flex flex-col gap-2">
              <span className="text-[11px] uppercase tracking-[0.14em] text-paper-muted">Fecha</span>
              <input
                type="date"
                className="field"
                value={form.eventDate}
                onChange={(e) => update("eventDate", e.target.value)}
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-[11px] uppercase tracking-[0.14em] text-paper-muted">Localidad</span>
              <input
                className="field"
                value={form.location}
                onChange={(e) => update("location", e.target.value)}
              />
            </label>
          </div>
        </StepBlock>
      )}

      {step === 2 && (
        <StepBlock title="¿Cuántas horas de cobertura necesitás?">
          <div className="mb-8 flex flex-wrap gap-3">
            {HOURS_OPTIONS.map((h) => (
              <OptionCard key={h} selected={form.hours === h} onClick={() => update("hours", h)} compact>
                {h} hs
              </OptionCard>
            ))}
          </div>

          <p className="mb-4 text-[11px] uppercase tracking-[0.14em] text-paper-muted">
            Cobertura
          </p>
          <div className="grid gap-3">
            {matchingServices.map((s) => (
              <OptionCard
                key={s.id}
                selected={form.serviceId === s.id}
                onClick={() => update("serviceId", s.id)}
              >
                <div className="flex w-full items-center justify-between gap-4">
                  <div>
                    <p>{s.name}</p>
                    <p className="mt-1 text-xs text-paper-muted">{s.description}</p>
                  </div>
                  <p className="whitespace-nowrap font-display">
                    {s.requiresCustomQuote ? "A medida" : formatCurrencyARS(s.basePrice)}
                  </p>
                </div>
              </OptionCard>
            ))}
          </div>
        </StepBlock>
      )}

      {step === 3 && (
        <StepBlock title="¿Sumamos algún extra?">
          <div className="grid gap-3">
            {extras.map((extra) => (
              <OptionCard
                key={extra.id}
                selected={form.extraIds.includes(extra.id)}
                onClick={() => toggleExtra(extra.id)}
              >
                <div className="flex w-full items-center justify-between gap-4">
                  <div>
                    <p>{extra.name}</p>
                    <p className="mt-1 text-xs text-paper-muted">{extra.description}</p>
                  </div>
                  <p className="whitespace-nowrap font-display">{formatCurrencyARS(extra.price)}</p>
                </div>
              </OptionCard>
            ))}
          </div>
        </StepBlock>
      )}

      {step === 4 && (
        <StepBlock title="¿Cómo te contactamos?">
          <div className="grid gap-6 sm:grid-cols-2">
            <label className="flex flex-col gap-2">
              <span className="text-[11px] uppercase tracking-[0.14em] text-paper-muted">Nombre</span>
              <input className="field" value={form.name} onChange={(e) => update("name", e.target.value)} />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-[11px] uppercase tracking-[0.14em] text-paper-muted">Teléfono</span>
              <input className="field" value={form.phone} onChange={(e) => update("phone", e.target.value)} />
            </label>
            <label className="flex flex-col gap-2 sm:col-span-2">
              <span className="text-[11px] uppercase tracking-[0.14em] text-paper-muted">
                Email (opcional)
              </span>
              <input className="field" value={form.email} onChange={(e) => update("email", e.target.value)} />
            </label>
          </div>
        </StepBlock>
      )}

      {step === 5 && quote && (
        <StepBlock title={quote.requiresCustomQuote ? "Tu cobertura requiere un presupuesto personalizado" : "Tu estimación"}>
          {quote.requiresCustomQuote ? (
            <p className="max-w-md text-paper-muted">
              Cada {form.eventType.toLowerCase()} es distinta — Christian arma la propuesta
              a medida según tus necesidades. Enviá la consulta y te responde con un presupuesto
              personalizado.
            </p>
          ) : (
            <div className="max-w-md divide-y divide-paper-line">
              {quote.items.map((item) => (
                <div key={item.id} className="flex justify-between py-3 text-sm">
                  <span>{item.name}</span>
                  <span>{formatCurrencyARS(item.price)}</span>
                </div>
              ))}
              <div className="flex justify-between py-3 font-display text-xl">
                <span>Total estimado</span>
                <span>{formatCurrencyARS(quote.total)}</span>
              </div>
              <p className="pt-3 text-xs text-paper-muted">
                Estimación orientativa. El presupuesto final se confirma por WhatsApp.
              </p>
            </div>
          )}
        </StepBlock>
      )}

      <div className="mt-12 flex items-center justify-between border-t border-paper-line pt-8">
        <Button
          variant="text"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          className={step === 0 ? "invisible" : ""}
        >
          Atrás
        </Button>

        {step < STEPS.length - 1 ? (
          <Button
            variant="solid"
            onClick={() => setStep((s) => s + 1)}
            className={!canAdvance[step] ? "opacity-40 pointer-events-none" : ""}
          >
            Continuar
          </Button>
        ) : (
          <Button variant="solid" onClick={handleSubmit}>
            {quote?.requiresCustomQuote ? "Solicitar presupuesto" : "Confirmar estimación"}
          </Button>
        )}
      </div>
    </div>
  );
}

function slugForEventType(eventType: string) {
  const map: Record<string, string> = {
    "15 años": "15-anos",
    "Cumpleaños 18": "cumpleanos-18",
    Cumpleaños: "eventos",
    Boda: "bodas",
    Evento: "eventos",
    "Sesión / Exteriores": "exteriores",
  };
  return map[eventType] ?? "";
}

function StepBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="mb-8 font-display text-2xl sm:text-3xl">{title}</h2>
      {children}
    </div>
  );
}

function OptionCard({
  selected,
  onClick,
  children,
  compact,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
  compact?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full border text-left transition-colors",
        compact ? "px-5 py-2.5 text-sm" : "px-5 py-4",
        selected
          ? "border-ink bg-ink text-paper"
          : "border-paper-line hover:border-ink/40",
      )}
    >
      {children}
    </button>
  );
}
