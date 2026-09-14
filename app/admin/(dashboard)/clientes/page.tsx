import { PageHeader, Card, EmptyState } from "@/components/admin/Page";
import { prisma } from "@/lib/prisma";
import { safeQuery } from "@/lib/safe-query";
import { createClient, updateClient, deleteClient } from "./actions";

export default async function ClientesPage() {
  const clients = await safeQuery(
    () => prisma.client.findMany({ orderBy: { createdAt: "desc" }, include: { events: true } }),
    [],
  );

  return (
    <div>
      <PageHeader title="Clientes" description="Historial de clientes confirmados." />

      {clients.length === 0 ? (
        <EmptyState message="Todavía no hay clientes cargados." />
      ) : (
        <div className="flex flex-col gap-3">
          {clients.map((client) => (
            <Card key={client.id}>
              <form action={updateClient} className="flex flex-col gap-3">
                <input type="hidden" name="id" value={client.id} />
                <div className="flex flex-wrap gap-4">
                  <input name="name" defaultValue={client.name} className="field flex-1 min-w-[160px]" />
                  <input name="phone" defaultValue={client.phone} className="field w-40" />
                  <input name="email" defaultValue={client.email ?? ""} className="field flex-1 min-w-[160px]" />
                  <select name="status" defaultValue={client.status} className="field w-36">
                    <option value="ACTIVE">Activo</option>
                    <option value="INACTIVE">Inactivo</option>
                  </select>
                </div>
                <textarea name="notes" defaultValue={client.notes ?? ""} rows={2} className="field" placeholder="Notas" />
                <div className="flex items-center justify-between">
                  <p className="text-xs text-paper-muted">{client.events.length} evento(s)</p>
                  <button type="submit" className="border border-ink px-4 py-2 text-xs uppercase tracking-[0.1em] hover:bg-ink hover:text-paper">
                    Guardar
                  </button>
                </div>
              </form>
              <form action={deleteClient} className="mt-2">
                <input type="hidden" name="id" value={client.id} />
                <button type="submit" className="text-xs text-ember hover:underline">Eliminar</button>
              </form>
            </Card>
          ))}
        </div>
      )}

      <div className="mt-10">
        <h2 className="mb-3 font-display text-xl">Nuevo cliente</h2>
        <Card>
          <form action={createClient} className="flex flex-wrap items-end gap-4">
            <input name="name" required className="field flex-1 min-w-[160px]" placeholder="Nombre" />
            <input name="phone" required className="field w-40" placeholder="Teléfono" />
            <input name="email" className="field flex-1 min-w-[160px]" placeholder="Email" />
            <button type="submit" className="border border-ink bg-ink px-4 py-2 text-xs uppercase tracking-[0.1em] text-paper hover:bg-gold hover:text-ink">
              Crear cliente
            </button>
          </form>
        </Card>
      </div>
    </div>
  );
}
