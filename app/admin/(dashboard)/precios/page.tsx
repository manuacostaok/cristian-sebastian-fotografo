import { PageHeader, Card, EmptyState } from "@/components/admin/Page";
import { prisma } from "@/lib/prisma";
import { safeQuery } from "@/lib/safe-query";
import { createExtra, updateExtra, deleteExtra } from "./actions";

export default async function PreciosPage() {
  const extras = await safeQuery(() => prisma.extra.findMany({ orderBy: { order: "asc" } }), []);

  return (
    <div>
      <PageHeader title="Precios / Extras" description="Adicionales que el cliente puede sumar en el wizard de presupuesto." />

      {extras.length === 0 ? (
        <EmptyState message="Todavía no hay extras cargados." />
      ) : (
        <div className="flex flex-col gap-3">
          {extras.map((extra) => (
            <Card key={extra.id}>
              <form action={updateExtra} className="flex flex-wrap items-end gap-4">
                <input type="hidden" name="id" value={extra.id} />
                <input name="name" defaultValue={extra.name} className="field flex-1 min-w-[160px]" />
                <input name="description" defaultValue={extra.description ?? ""} className="field flex-1 min-w-[200px]" />
                <input name="price" type="number" defaultValue={Number(extra.price)} className="field w-32" />
                <label className="flex items-center gap-2 pb-2.5 text-sm">
                  <input type="checkbox" name="active" defaultChecked={extra.active} /> Activo
                </label>
                <button type="submit" className="border border-ink px-4 py-2 text-xs uppercase tracking-[0.1em] hover:bg-ink hover:text-paper">
                  Guardar
                </button>
              </form>
              <form action={deleteExtra} className="mt-2">
                <input type="hidden" name="id" value={extra.id} />
                <button type="submit" className="text-xs text-ember hover:underline">Eliminar</button>
              </form>
            </Card>
          ))}
        </div>
      )}

      <div className="mt-10">
        <h2 className="mb-3 font-display text-xl">Nuevo extra</h2>
        <Card>
          <form action={createExtra} className="flex flex-wrap items-end gap-4">
            <input name="name" required className="field flex-1 min-w-[160px]" placeholder="Nombre" />
            <input name="description" className="field flex-1 min-w-[200px]" placeholder="Descripción" />
            <input name="price" type="number" defaultValue={0} className="field w-32" />
            <button type="submit" className="border border-ink bg-ink px-4 py-2 text-xs uppercase tracking-[0.1em] text-paper hover:bg-gold hover:text-ink">
              Crear extra
            </button>
          </form>
        </Card>
      </div>
    </div>
  );
}
