import { PageHeader, Card, EmptyState } from "@/components/admin/Page";
import { prisma } from "@/lib/prisma";
import { safeQuery } from "@/lib/safe-query";
import { createService, updateService, deleteService } from "./actions";

export default async function ServiciosPage() {
  const services = await safeQuery(() => prisma.service.findMany({ orderBy: { order: "asc" } }), []);

  return (
    <div>
      <PageHeader
        title="Servicios"
        description="Coberturas disponibles en el wizard de presupuesto. Marcá 'A medida' para los que no tienen precio fijo (ej: bodas)."
      />

      {services.length === 0 ? (
        <EmptyState message="Todavía no hay servicios cargados." />
      ) : (
        <div className="flex flex-col gap-3">
          {services.map((s) => (
            <Card key={s.id}>
              <form action={updateService} className="flex flex-col gap-3">
                <input type="hidden" name="id" value={s.id} />
                <div className="flex flex-wrap gap-4">
                  <input name="name" defaultValue={s.name} className="field flex-1 min-w-[160px]" />
                  <input
                    name="categoryTag"
                    defaultValue={s.categoryTag ?? ""}
                    className="field w-40"
                    placeholder="Categoría (slug)"
                  />
                  <input
                    name="basePrice"
                    type="number"
                    defaultValue={Number(s.basePrice)}
                    className="field w-36"
                  />
                </div>
                <textarea name="description" defaultValue={s.description ?? ""} rows={2} className="field" />
                <div className="flex flex-wrap items-center gap-6">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" name="requiresCustomQuote" defaultChecked={s.requiresCustomQuote} />
                    Requiere presupuesto a medida
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" name="active" defaultChecked={s.active} /> Activo
                  </label>
                  <button
                    type="submit"
                    className="ml-auto border border-ink px-4 py-2 text-xs uppercase tracking-[0.1em] hover:bg-ink hover:text-paper"
                  >
                    Guardar
                  </button>
                </div>
              </form>
              <form action={deleteService} className="mt-2">
                <input type="hidden" name="id" value={s.id} />
                <button type="submit" className="text-xs text-ember hover:underline">
                  Eliminar
                </button>
              </form>
            </Card>
          ))}
        </div>
      )}

      <div className="mt-10">
        <h2 className="mb-3 font-display text-xl">Nuevo servicio</h2>
        <Card>
          <form action={createService} className="flex flex-col gap-3">
            <div className="flex flex-wrap gap-4">
              <input name="name" required className="field flex-1 min-w-[160px]" placeholder="Nombre" />
              <input name="categoryTag" className="field w-40" placeholder="Categoría (slug)" />
              <input name="basePrice" type="number" defaultValue={0} className="field w-36" />
            </div>
            <textarea name="description" rows={2} className="field" placeholder="Descripción" />
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="requiresCustomQuote" /> Requiere presupuesto a medida
              </label>
              <button
                type="submit"
                className="ml-auto border border-ink bg-ink px-4 py-2 text-xs uppercase tracking-[0.1em] text-paper hover:bg-gold hover:text-ink"
              >
                Crear servicio
              </button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
