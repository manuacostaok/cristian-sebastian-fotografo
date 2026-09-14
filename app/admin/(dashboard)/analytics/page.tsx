import { PageHeader, Card } from "@/components/admin/Page";
import { prisma } from "@/lib/prisma";
import { safeQuery } from "@/lib/safe-query";

const SOURCE_LABELS: Record<string, string> = {
  INSTAGRAM: "Instagram",
  GOOGLE: "Google",
  WHATSAPP: "WhatsApp",
  WEB: "Web",
  DIRECT: "Directo",
};

const FUNNEL_STEPS: { type: string; label: string }[] = [
  { type: "portfolio_view", label: "Vieron el portfolio" },
  { type: "whatsapp_click", label: "Clicks en WhatsApp" },
  { type: "quote_started", label: "Empezaron el presupuesto" },
  { type: "quote_completed", label: "Completaron el presupuesto" },
  { type: "lead_created", label: "Consultas generadas" },
];

export default async function AnalyticsPage() {
  const [leadsBySource, totalLeads, quotesSent, confirmedLeads, totalClients, eventCounts, funnelRows] =
    await Promise.all([
      safeQuery(
        () => prisma.lead.groupBy({ by: ["source"], _count: { _all: true } }),
        [] as { source: string; _count: { _all: number } }[],
      ),
      safeQuery(() => prisma.lead.count(), 0),
      safeQuery(() => prisma.quote.count(), 0),
      safeQuery(() => prisma.lead.count({ where: { status: "CONFIRMED" } }), 0),
      safeQuery(() => prisma.client.count(), 0),
      safeQuery(() => prisma.event.count({ where: { status: { in: ["UPCOMING", "DONE"] } } }), 0),
      safeQuery(
        () => prisma.analyticsEvent.groupBy({ by: ["type"], _count: { _all: true } }),
        [] as { type: string; _count: { _all: number } }[],
      ),
    ]);

  const conversionRate = totalLeads > 0 ? Math.round((confirmedLeads / totalLeads) * 100) : 0;
  const funnelCounts = Object.fromEntries(funnelRows.map((r) => [r.type, r._count._all]));
  const funnelMax = Math.max(1, ...FUNNEL_STEPS.map((s) => funnelCounts[s.type] ?? 0));

  return (
    <div>
      <PageHeader title="Analytics" description="Funnel comercial: de la visita a la reserva confirmada." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <p className="font-display text-4xl">{totalLeads}</p>
          <p className="mt-2 text-[11px] uppercase tracking-[0.12em] text-paper-muted">Consultas totales</p>
        </Card>
        <Card>
          <p className="font-display text-4xl">{quotesSent}</p>
          <p className="mt-2 text-[11px] uppercase tracking-[0.12em] text-paper-muted">Presupuestos generados</p>
        </Card>
        <Card>
          <p className="font-display text-4xl">{eventCounts}</p>
          <p className="mt-2 text-[11px] uppercase tracking-[0.12em] text-paper-muted">Reservas confirmadas</p>
        </Card>
        <Card>
          <p className="font-display text-4xl">{conversionRate}%</p>
          <p className="mt-2 text-[11px] uppercase tracking-[0.12em] text-paper-muted">Conversión lead → cliente</p>
        </Card>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="mb-4 font-display text-xl">Funnel de conversión</h2>
          <Card>
            {funnelRows.length === 0 ? (
              <p className="text-sm text-paper-muted">
                Todavía no hay datos suficientes — se van a ir sumando a medida que haya visitas.
              </p>
            ) : (
              <div className="flex flex-col gap-4">
                {FUNNEL_STEPS.map((step) => {
                  const count = funnelCounts[step.type] ?? 0;
                  const pct = Math.round((count / funnelMax) * 100);
                  return (
                    <div key={step.type}>
                      <div className="flex justify-between text-sm">
                        <span>{step.label}</span>
                        <span className="text-paper-muted">{count}</span>
                      </div>
                      <div className="mt-1 h-1.5 w-full bg-paper-dim">
                        <div className="h-1.5 bg-ink" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>

        <div>
          <h2 className="mb-4 font-display text-xl">Consultas por origen</h2>
          <Card>
            {leadsBySource.length === 0 ? (
              <p className="text-sm text-paper-muted">Todavía no hay datos suficientes.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {leadsBySource.map((row) => {
                  const pct = totalLeads > 0 ? Math.round((row._count._all / totalLeads) * 100) : 0;
                  return (
                    <div key={row.source}>
                      <div className="flex justify-between text-sm">
                        <span>{SOURCE_LABELS[row.source] ?? row.source}</span>
                        <span className="text-paper-muted">{row._count._all}</span>
                      </div>
                      <div className="mt-1 h-1.5 w-full bg-paper-dim">
                        <div className="h-1.5 bg-gold" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>
      </div>

      <p className="mt-6 text-xs text-paper-muted">
        Clientes totales: {totalClients}. Las métricas de origen usan el último UTM guardado por
        cada visitante — pueden faltar si llegó sin parámetros de campaña.
      </p>
    </div>
  );
}
