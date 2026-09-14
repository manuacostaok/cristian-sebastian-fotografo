import Link from "next/link";
import { PageHeader, Card } from "@/components/admin/Page";
import { prisma } from "@/lib/prisma";
import { safeQuery, isDatabaseConfigured } from "@/lib/safe-query";
import { formatDateLong, formatDateShort } from "@/lib/utils";

export default async function AdminDashboardPage() {
  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);
  const weekAhead = new Date();
  weekAhead.setDate(weekAhead.getDate() + 7);

  const [
    newLeads,
    upcomingEvents,
    quotesSent,
    clients,
    followUpsToday,
    expiringQuotes,
    unpaidEvents,
    pendingTestimonials,
    doneEventsWithoutGallery,
  ] = await Promise.all([
    safeQuery(() => prisma.lead.count({ where: { status: "NEW" } }), 0),
    safeQuery(
      () => prisma.event.findMany({ where: { date: { gte: new Date() } }, orderBy: { date: "asc" }, take: 5 }),
      [],
    ),
    safeQuery(() => prisma.quote.count({ where: { status: "SENT" } }), 0),
    safeQuery(() => prisma.client.count(), 0),
    safeQuery(
      () =>
        prisma.lead.findMany({
          where: { nextActionAt: { lte: endOfToday } },
          orderBy: { nextActionAt: "asc" },
        }),
      [],
    ),
    safeQuery(
      () =>
        prisma.quote.findMany({
          where: { status: "SENT", validUntil: { lte: weekAhead, gte: new Date() } },
          include: { lead: true, client: true },
          orderBy: { validUntil: "asc" },
        }),
      [],
    ),
    safeQuery(
      () =>
        prisma.event.findMany({
          where: { balanceStatus: { in: ["PENDING", "PARTIAL", "OVERDUE"] }, status: { not: "CANCELLED" } },
          include: { client: true },
          orderBy: { date: "asc" },
        }),
      [],
    ),
    safeQuery(() => prisma.testimonial.count({ where: { published: false } }), 0),
    safeQuery(
      () => prisma.event.count({ where: { status: "DONE", privateGallery: null } }),
      0,
    ),
  ]);

  const dbConnected = isDatabaseConfigured();

  return (
    <div>
      <PageHeader title="Dashboard" description="Centro de operaciones — lo que necesita tu atención hoy." />

      {!dbConnected && (
        <Card className="mb-8 border-gold/40 bg-gold/10">
          <p className="text-sm">
            La base de datos todavía no está conectada — configurá <code>DATABASE_URL</code> en{" "}
            <code>.env</code> para que el panel muestre datos reales.
          </p>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Consultas nuevas" value={newLeads} href="/admin/leads" />
        <StatCard label="Presupuestos enviados" value={quotesSent} href="/admin/presupuestos" />
        <StatCard label="Clientes" value={clients} href="/admin/clientes" />
        <StatCard label="Próximos eventos" value={upcomingEvents.length} href="/admin/eventos" />
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <Widget title="Seguimientos de hoy" emptyText="No tenés seguimientos pendientes.">
          {followUpsToday.map((lead) => (
            <Link key={lead.id} href={`/admin/leads/${lead.id}`} className="flex items-center justify-between py-3 text-sm hover:opacity-70">
              <span>{lead.name}</span>
              <span className="text-paper-muted">{lead.nextActionNote || "—"}</span>
            </Link>
          ))}
        </Widget>

        <Widget title="Presupuestos por vencer (7 días)" emptyText="Ningún presupuesto vence pronto.">
          {expiringQuotes.map((q) => (
            <div key={q.id} className="flex items-center justify-between py-3 text-sm">
              <span>{q.lead?.name ?? q.client?.name ?? "—"}</span>
              <span className="text-paper-muted">{q.validUntil && formatDateShort(q.validUntil)}</span>
            </div>
          ))}
        </Widget>

        <Widget title="Saldos pendientes" emptyText="No hay saldos pendientes.">
          {unpaidEvents.map((e) => (
            <div key={e.id} className="flex items-center justify-between py-3 text-sm">
              <span>{e.name}</span>
              <span className="text-paper-muted">{formatDateShort(e.date)}</span>
            </div>
          ))}
        </Widget>

        <Widget title="Pendientes varios" emptyText="Todo al día.">
          {pendingTestimonials > 0 && (
            <Link href="/admin/testimonios" className="flex items-center justify-between py-3 text-sm hover:opacity-70">
              <span>Testimonios sin publicar</span>
              <span className="text-paper-muted">{pendingTestimonials}</span>
            </Link>
          )}
          {doneEventsWithoutGallery > 0 && (
            <div className="flex items-center justify-between py-3 text-sm">
              <span>Eventos realizados sin galería</span>
              <span className="text-paper-muted">{doneEventsWithoutGallery}</span>
            </div>
          )}
        </Widget>
      </div>

      <div className="mt-10">
        <h2 className="mb-4 font-display text-xl">Próximos eventos</h2>
        <Card>
          {upcomingEvents.length === 0 ? (
            <p className="text-sm text-paper-muted">No hay eventos próximos cargados.</p>
          ) : (
            <ul className="divide-y divide-paper-line">
              {upcomingEvents.map((e) => (
                <li key={e.id} className="flex items-center justify-between py-3 text-sm">
                  <span>{e.name}</span>
                  <span className="text-paper-muted">{formatDateLong(e.date)}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}

function StatCard({ label, value, href }: { label: string; value: number; href: string }) {
  return (
    <Link href={href} className="block border border-paper-line p-6 transition-colors hover:border-ink/40">
      <p className="font-display text-4xl">{value}</p>
      <p className="mt-2 text-[11px] uppercase tracking-[0.12em] text-paper-muted">{label}</p>
    </Link>
  );
}

function Widget({
  title,
  emptyText,
  children,
}: {
  title: string;
  emptyText: string;
  children: React.ReactNode;
}) {
  const hasContent = Array.isArray(children) ? children.some(Boolean) : Boolean(children);
  return (
    <div>
      <h2 className="mb-3 font-display text-lg">{title}</h2>
      <Card>
        {hasContent ? (
          <div className="divide-y divide-paper-line">{children}</div>
        ) : (
          <p className="text-sm text-paper-muted">{emptyText}</p>
        )}
      </Card>
    </div>
  );
}
