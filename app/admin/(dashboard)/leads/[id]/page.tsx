import { notFound } from "next/navigation";
import { PageHeader, Card } from "@/components/admin/Page";
import { LeadStatusSelect } from "@/components/admin/LeadStatusSelect";
import { ButtonLink } from "@/components/ui/Button";
import { prisma } from "@/lib/prisma";
import { formatCurrencyARS, formatDateLong, formatDateShort } from "@/lib/utils";
import { buildWhatsAppLinkTo, leadFollowUpMessage } from "@/lib/whatsapp";
import {
  addLeadNote,
  setFollowUp,
  updateInternalNotes,
  createQuoteFromLead,
  createEventFromLead,
  convertLeadToClient,
} from "../actions";

const SOURCE_LABELS: Record<string, string> = {
  INSTAGRAM: "Instagram",
  GOOGLE: "Google",
  WHATSAPP: "WhatsApp",
  WEB: "Web",
  DIRECT: "Directo",
};

const ACTIVITY_LABELS: Record<string, string> = {
  created: "Consulta recibida",
  status_changed: "Cambio de estado",
  note: "Nota",
  follow_up: "Seguimiento",
  quote_created: "Presupuesto creado",
  event_created: "Evento creado",
};

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const lead = await prisma.lead.findUnique({
    where: { id },
    include: {
      client: true,
      quotes: { orderBy: { createdAt: "desc" } },
      activities: { orderBy: { createdAt: "desc" } },
    },
  });
  if (!lead) notFound();

  const [services, extras] = await Promise.all([
    prisma.service.findMany({ where: { active: true }, orderBy: { order: "asc" } }),
    prisma.extra.findMany({ where: { active: true }, orderBy: { order: "asc" } }),
  ]);

  const whatsappHref = buildWhatsAppLinkTo(lead.phone, leadFollowUpMessage(lead.name));
  const utm = [lead.utmSource, lead.utmMedium, lead.utmCampaign].filter(Boolean).join(" / ");

  return (
    <div>
      <PageHeader
        title={lead.name}
        description={`${lead.eventType}${lead.eventDate ? ` — ${formatDateLong(lead.eventDate)}` : ""}`}
        action={<LeadStatusSelect id={lead.id} status={lead.status} />}
      />

      <div className="grid gap-8 lg:grid-cols-[1fr_1.3fr]">
        <div className="flex flex-col gap-6">
          <Card>
            <p className="mb-4 text-[11px] uppercase tracking-[0.1em] text-paper-muted">Contacto</p>
            <div className="flex flex-col gap-1 text-sm">
              <p>📱 {lead.phone}</p>
              {lead.email && <p>📧 {lead.email}</p>}
              {lead.location && <p>📍 {lead.location}</p>}
              {lead.guestCount && <p>👥 ~{lead.guestCount} personas</p>}
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <ButtonLink href={whatsappHref} external size="sm" variant="solid">
                WhatsApp
              </ButtonLink>
              {!lead.clientId && (
                <form action={convertLeadToClient.bind(null, lead.id)}>
                  <button
                    type="submit"
                    className="border border-ink px-5 py-2.5 text-[11px] uppercase tracking-[0.14em] hover:bg-ink hover:text-paper"
                  >
                    Convertir a cliente
                  </button>
                </form>
              )}
            </div>
          </Card>

          <Card>
            <p className="mb-3 text-[11px] uppercase tracking-[0.1em] text-paper-muted">Origen</p>
            <p className="text-sm">{SOURCE_LABELS[lead.source] ?? lead.source}</p>
            {utm && <p className="mt-1 text-xs text-paper-muted">{utm}</p>}
            <p className="mt-3 text-xs text-paper-muted">Recibido {formatDateShort(lead.createdAt)}</p>
          </Card>

          {lead.message && (
            <Card>
              <p className="mb-2 text-[11px] uppercase tracking-[0.1em] text-paper-muted">Mensaje</p>
              <p className="text-sm text-paper-muted">{lead.message}</p>
            </Card>
          )}

          <Card>
            <p className="mb-3 text-[11px] uppercase tracking-[0.1em] text-paper-muted">Seguimiento</p>
            <form action={setFollowUp} className="flex flex-col gap-3">
              <input type="hidden" name="leadId" value={lead.id} />
              <input
                name="nextActionAt"
                type="date"
                defaultValue={lead.nextActionAt ? lead.nextActionAt.toISOString().slice(0, 10) : ""}
                className="field text-sm"
              />
              <input
                name="nextActionNote"
                defaultValue={lead.nextActionNote ?? ""}
                placeholder="Próxima acción (ej: llamar, reenviar presupuesto)"
                className="field text-sm"
              />
              <button
                type="submit"
                className="self-start border border-ink px-4 py-2 text-[11px] uppercase tracking-[0.1em] hover:bg-ink hover:text-paper"
              >
                Guardar seguimiento
              </button>
            </form>
          </Card>

          <Card>
            <p className="mb-3 text-[11px] uppercase tracking-[0.1em] text-paper-muted">Notas internas</p>
            <form action={updateInternalNotes} className="flex flex-col gap-3">
              <input type="hidden" name="leadId" value={lead.id} />
              <textarea
                name="internalNotes"
                defaultValue={lead.internalNotes ?? ""}
                rows={3}
                className="field text-sm"
                placeholder="Notas privadas, no visibles para el cliente"
              />
              <button
                type="submit"
                className="self-start border border-ink px-4 py-2 text-[11px] uppercase tracking-[0.1em] hover:bg-ink hover:text-paper"
              >
                Guardar notas
              </button>
            </form>
          </Card>
        </div>

        <div className="flex flex-col gap-6">
          <Card>
            <p className="mb-3 text-[11px] uppercase tracking-[0.1em] text-paper-muted">Acciones</p>
            <div className="grid gap-6 sm:grid-cols-2">
              <form action={createQuoteFromLead} className="flex flex-col gap-3 border-r-0 sm:border-r sm:border-paper-line sm:pr-6">
                <p className="text-xs uppercase tracking-[0.08em] text-paper-muted">Crear presupuesto</p>
                <input type="hidden" name="leadId" value={lead.id} />
                <select name="serviceId" required defaultValue="" className="field text-sm">
                  <option value="" disabled>
                    Elegí un servicio
                  </option>
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
                <div className="flex max-h-28 flex-col gap-1 overflow-y-auto text-sm">
                  {extras.map((e) => (
                    <label key={e.id} className="flex items-center gap-2">
                      <input type="checkbox" name="extraIds" value={e.id} />
                      {e.name}
                    </label>
                  ))}
                </div>
                <button
                  type="submit"
                  className="self-start border border-ink bg-ink px-4 py-2 text-[11px] uppercase tracking-[0.1em] text-paper hover:bg-gold hover:text-ink"
                >
                  Crear presupuesto
                </button>
              </form>

              <form action={createEventFromLead} className="flex flex-col gap-3">
                <p className="text-xs uppercase tracking-[0.08em] text-paper-muted">Crear evento</p>
                <p className="text-xs text-paper-muted">
                  Crea el evento en el calendario interno usando los datos de esta consulta
                  (fecha, ubicación) y confirma al lead como cliente.
                </p>
                <input type="hidden" name="leadId" value={lead.id} />
                <button
                  type="submit"
                  className="self-start border border-ink bg-ink px-4 py-2 text-[11px] uppercase tracking-[0.1em] text-paper hover:bg-gold hover:text-ink"
                >
                  Crear evento
                </button>
              </form>
            </div>
          </Card>

          {lead.quotes.length > 0 && (
            <Card>
              <p className="mb-3 text-[11px] uppercase tracking-[0.1em] text-paper-muted">Presupuestos</p>
              <div className="flex flex-col divide-y divide-paper-line">
                {lead.quotes.map((q) => (
                  <div key={q.id} className="flex items-center justify-between py-3 text-sm">
                    <div>
                      <p>{formatCurrencyARS(Number(q.total))}</p>
                      <p className="text-xs text-paper-muted">
                        {q.status} {q.validUntil && `· vence ${formatDateShort(q.validUntil)}`}
                      </p>
                    </div>
                    <a
                      href={`/api/quotes/${q.id}/pdf`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs uppercase tracking-[0.08em] underline"
                    >
                      Descargar PDF
                    </a>
                  </div>
                ))}
              </div>
            </Card>
          )}

          <Card>
            <p className="mb-4 text-[11px] uppercase tracking-[0.1em] text-paper-muted">Agregar nota</p>
            <form action={addLeadNote} className="flex flex-col gap-3">
              <input type="hidden" name="leadId" value={lead.id} />
              <textarea name="text" rows={2} className="field text-sm" placeholder="Escribí una nota rápida…" />
              <button
                type="submit"
                className="self-start border border-ink px-4 py-2 text-[11px] uppercase tracking-[0.1em] hover:bg-ink hover:text-paper"
              >
                Agregar
              </button>
            </form>
          </Card>

          <Card>
            <p className="mb-4 text-[11px] uppercase tracking-[0.1em] text-paper-muted">Actividad</p>
            {lead.activities.length === 0 ? (
              <p className="text-sm text-paper-muted">Sin actividad todavía.</p>
            ) : (
              <div className="flex flex-col divide-y divide-paper-line">
                {lead.activities.map((a) => (
                  <div key={a.id} className="py-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="uppercase tracking-[0.08em] text-paper-muted">
                        {ACTIVITY_LABELS[a.type] ?? a.type}
                      </span>
                      <span className="text-paper-muted">{formatDateShort(a.createdAt)}</span>
                    </div>
                    {a.text && <p className="mt-1 text-sm">{a.text}</p>}
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
