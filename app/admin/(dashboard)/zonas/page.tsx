import { PageHeader, Card, EmptyState } from "@/components/admin/Page";
import { prisma } from "@/lib/prisma";
import { safeQuery } from "@/lib/safe-query";
import { createWorkZone, updateWorkZone, deleteWorkZone } from "./actions";

export default async function ZonasPage() {
  const zones = await safeQuery(() => prisma.workZone.findMany({ orderBy: { order: "asc" } }), []);

  return (
    <div>
      <PageHeader
        title="Zonas de trabajo"
        description="Dónde trabaja Christian. Se muestran en Sobre mí como zonas de cobertura."
      />

      {zones.length === 0 ? (
        <EmptyState message="Todavía no hay zonas cargadas." />
      ) : (
        <div className="flex flex-col gap-3">
          {zones.map((zone) => (
            <Card key={zone.id}>
              <form action={updateWorkZone} className="flex flex-wrap items-end gap-4">
                <input type="hidden" name="id" value={zone.id} />
                <input name="name" defaultValue={zone.name} className="field w-56" />
                <input name="order" type="number" defaultValue={zone.order} className="field w-20" />
                <label className="flex items-center gap-2 pb-2.5">
                  <input type="checkbox" name="active" defaultChecked={zone.active} />
                  <span className="text-sm">Activa</span>
                </label>
                <button type="submit" className="ml-auto border border-ink px-4 py-2 text-xs uppercase tracking-[0.1em] hover:bg-ink hover:text-paper">
                  Guardar
                </button>
              </form>
              <form action={deleteWorkZone} className="mt-2">
                <input type="hidden" name="id" value={zone.id} />
                <button type="submit" className="text-xs text-ember hover:underline">Eliminar</button>
              </form>
            </Card>
          ))}
        </div>
      )}

      <div className="mt-10">
        <h2 className="mb-3 font-display text-xl">Nueva zona</h2>
        <Card>
          <form action={createWorkZone} className="flex flex-wrap items-end gap-4">
            <input name="name" required className="field w-56" placeholder="Ej: Zona Norte" />
            <input name="order" type="number" defaultValue={0} className="field w-20" />
            <button type="submit" className="border border-ink bg-ink px-4 py-2 text-xs uppercase tracking-[0.1em] text-paper hover:bg-gold hover:text-ink">
              Crear zona
            </button>
          </form>
        </Card>
      </div>
    </div>
  );
}
