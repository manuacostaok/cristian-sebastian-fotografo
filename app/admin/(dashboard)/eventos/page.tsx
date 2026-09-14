import { PageHeader, Card, EmptyState } from "@/components/admin/Page";
import { prisma } from "@/lib/prisma";
import { safeQuery } from "@/lib/safe-query";
import { formatDateShort } from "@/lib/utils";
import { createEvent, updateEvent, deleteEvent } from "./actions";

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pendiente",
  UPCOMING: "Próximo",
  DONE: "Realizado",
  CANCELLED: "Cancelado",
};

const BALANCE_LABELS: Record<string, string> = {
  PENDING: "Sin pagar",
  PARTIAL: "Seña pagada",
  PAID: "Pagado",
  OVERDUE: "Vencido",
};

export default async function EventosPage() {
  const [events, clients, categories] = await Promise.all([
    safeQuery(
      () => prisma.event.findMany({ orderBy: { date: "desc" }, include: { client: true, category: true } }),
      [],
    ),
    safeQuery(() => prisma.client.findMany({ orderBy: { name: "asc" } }), []),
    safeQuery(() => prisma.category.findMany({ orderBy: { order: "asc" } }), []),
  ]);

  return (
    <div>
      <PageHeader title="Eventos" description="Eventos futuros, realizados, pendientes y cancelados." />

      {events.length === 0 ? (
        <EmptyState message="Todavía no hay eventos cargados." />
      ) : (
        <div className="flex flex-col gap-3">
          {events.map((event) => (
            <Card key={event.id}>
              <form action={updateEvent} className="flex flex-col gap-3">
                <input type="hidden" name="id" value={event.id} />
                <div className="flex flex-wrap gap-4">
                  <input name="name" defaultValue={event.name} className="field flex-1 min-w-[160px]" />
                  <input
                    name="date"
                    type="date"
                    defaultValue={event.date.toISOString().slice(0, 10)}
                    className="field w-40"
                  />
                  <input name="time" defaultValue={event.time ?? ""} className="field w-28" placeholder="Hora" />
                  <input name="location" defaultValue={event.location ?? ""} className="field flex-1 min-w-[160px]" placeholder="Ubicación" />
                </div>
                <div className="flex flex-wrap gap-4">
                  <select name="clientId" defaultValue={event.clientId ?? ""} className="field w-48">
                    <option value="">Sin cliente</option>
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                  <select name="categoryId" defaultValue={event.categoryId ?? ""} className="field w-48">
                    <option value="">Sin categoría</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                  <select name="status" defaultValue={event.status} className="field w-40">
                    {Object.entries(STATUS_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                  <select name="visibility" defaultValue={event.visibility} className="field w-36">
                    <option value="PRIVATE">🔒 Privado</option>
                    <option value="PUBLIC">🌐 Público</option>
                  </select>
                </div>
                <div className="flex flex-wrap items-end gap-4 border-t border-paper-line pt-3">
                  <label className="flex flex-col gap-1">
                    <span className="text-[11px] uppercase tracking-[0.1em] text-paper-muted">Precio total</span>
                    <input name="totalPrice" type="number" defaultValue={event.totalPrice ? Number(event.totalPrice) : ""} className="field w-32" />
                  </label>
                  <label className="flex flex-col gap-1">
                    <span className="text-[11px] uppercase tracking-[0.1em] text-paper-muted">Seña</span>
                    <input name="depositAmount" type="number" defaultValue={event.depositAmount ? Number(event.depositAmount) : ""} className="field w-32" />
                  </label>
                  <label className="flex items-center gap-2 pb-2.5 text-sm">
                    <input type="checkbox" name="depositPaid" defaultChecked={event.depositPaid} /> Seña pagada
                  </label>
                  <label className="flex flex-col gap-1">
                    <span className="text-[11px] uppercase tracking-[0.1em] text-paper-muted">Saldo</span>
                    <select name="balanceStatus" defaultValue={event.balanceStatus} className="field w-36">
                      {Object.entries(BALANCE_LABELS).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </label>
                </div>
                <textarea name="notes" defaultValue={event.notes ?? ""} rows={2} className="field" placeholder="Notas internas" />
                <button type="submit" className="ml-auto border border-ink px-4 py-2 text-xs uppercase tracking-[0.1em] hover:bg-ink hover:text-paper">
                  Guardar
                </button>
              </form>
              <form action={deleteEvent} className="mt-2">
                <input type="hidden" name="id" value={event.id} />
                <button type="submit" className="text-xs text-ember hover:underline">Eliminar</button>
              </form>
            </Card>
          ))}
        </div>
      )}

      <div className="mt-10">
        <h2 className="mb-3 font-display text-xl">Nuevo evento</h2>
        <Card>
          <form action={createEvent} className="flex flex-col gap-3">
            <div className="flex flex-wrap gap-4">
              <input name="name" required className="field flex-1 min-w-[160px]" placeholder="Nombre del evento" />
              <input name="date" type="date" required className="field w-40" />
              <input name="time" className="field w-28" placeholder="Hora" />
              <input name="location" className="field flex-1 min-w-[160px]" placeholder="Ubicación" />
            </div>
            <div className="flex flex-wrap gap-4">
              <select name="clientId" defaultValue="" className="field w-48">
                <option value="">Sin cliente</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <select name="categoryId" defaultValue="" className="field w-48">
                <option value="">Sin categoría</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <select name="visibility" defaultValue="PRIVATE" className="field w-36">
                <option value="PRIVATE">🔒 Privado</option>
                <option value="PUBLIC">🌐 Público</option>
              </select>
              <button type="submit" className="ml-auto border border-ink bg-ink px-4 py-2 text-xs uppercase tracking-[0.1em] text-paper hover:bg-gold hover:text-ink">
                Crear evento
              </button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
