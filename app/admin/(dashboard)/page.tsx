import Link from "next/link";
import { PageHeader, Card } from "@/components/admin/Page";
import { prisma } from "@/lib/prisma";
import { safeQuery } from "@/lib/safe-query";
import { formatDateLong } from "@/lib/utils";

export default async function AdminDashboardPage() {
  const [newLeads, upcomingEvents, quotesSent, clients] = await Promise.all([
    safeQuery(() => prisma.lead.count({ where: { status: "NEW" } }), 0),
    safeQuery(
      () => prisma.event.findMany({ where: { date: { gte: new Date() } }, orderBy: { date: "asc" }, take: 5 }),
      [],
    ),
    safeQuery(() => prisma.quote.count({ where: { status: "SENT" } }), 0),
    safeQuery(() => prisma.client.count(), 0),
  ]);

  const dbConnected = process.env.DATABASE_URL && !process.env.DATABASE_URL.includes("user:password");

  return (
    <div>
      <PageHeader title="Dashboard" description="Resumen de la actividad reciente." />

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

      <div className="mt-12">
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
