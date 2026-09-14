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

export default async function AnalyticsPage() {
  const [leadsBySource, totalLeads, quotesSent, confirmedLeads, totalClients] = await Promise.all([
    safeQuery(
      () => prisma.lead.groupBy({ by: ["source"], _count: { _all: true } }),
      [] as { source: string; _count: { _all: number } }[],
    ),
    safeQuery(() => prisma.lead.count(), 0),
    safeQuery(() => prisma.quote.count(), 0),
    safeQuery(() => prisma.lead.count({ where: { status: "CONFIRMED" } }), 0),
    safeQuery(() => prisma.client.count(), 0),
  ]);

  const conversionRate = totalLeads > 0 ? Math.round((confirmedLeads / totalLeads) * 100) : 0;

  return (
    <div>
      <PageHeader title="Analytics" description="Origen de las consultas y conversión a clientes." />

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
          <p className="font-display text-4xl">{totalClients}</p>
          <p className="mt-2 text-[11px] uppercase tracking-[0.12em] text-paper-muted">Clientes confirmados</p>
        </Card>
        <Card>
          <p className="font-display text-4xl">{conversionRate}%</p>
          <p className="mt-2 text-[11px] uppercase tracking-[0.12em] text-paper-muted">Conversión lead → cliente</p>
        </Card>
      </div>

      <div className="mt-10">
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
  );
}
