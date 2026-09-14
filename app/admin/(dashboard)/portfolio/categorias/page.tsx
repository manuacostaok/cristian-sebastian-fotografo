import { PageHeader, Card, EmptyState } from "@/components/admin/Page";
import { prisma } from "@/lib/prisma";
import { safeQuery } from "@/lib/safe-query";
import { createCategory, updateCategory, deleteCategory } from "./actions";

export default async function CategoriasPage() {
  const categories = await safeQuery(
    () => prisma.category.findMany({ orderBy: { order: "asc" } }),
    [],
  );

  return (
    <div>
      <PageHeader
        title="Categorías"
        description="Estructura del portfolio público. El orden define cómo aparecen en el menú."
      />

      {categories.length === 0 ? (
        <EmptyState message="Todavía no hay categorías. Creá la primera abajo." />
      ) : (
        <div className="flex flex-col gap-3">
          {categories.map((cat) => (
            <Card key={cat.id}>
              <form action={updateCategory} className="flex flex-wrap items-end gap-4">
                <input type="hidden" name="id" value={cat.id} />
                <label className="flex flex-col gap-1">
                  <span className="text-[11px] uppercase tracking-[0.1em] text-paper-muted">Nombre</span>
                  <input name="name" defaultValue={cat.name} className="field w-48" />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-[11px] uppercase tracking-[0.1em] text-paper-muted">Orden</span>
                  <input name="order" type="number" defaultValue={cat.order} className="field w-20" />
                </label>
                <label className="flex items-center gap-2 pb-2.5">
                  <input type="checkbox" name="active" defaultChecked={cat.active} />
                  <span className="text-sm">Activa</span>
                </label>
                <p className="pb-2.5 text-xs text-paper-muted">/{cat.slug}</p>
                <button type="submit" className="ml-auto border border-ink px-4 py-2 text-xs uppercase tracking-[0.1em] hover:bg-ink hover:text-paper">
                  Guardar
                </button>
              </form>
              <form action={deleteCategory} className="mt-2">
                <input type="hidden" name="id" value={cat.id} />
                <button type="submit" className="text-xs text-ember hover:underline">
                  Eliminar categoría
                </button>
              </form>
            </Card>
          ))}
        </div>
      )}

      <div className="mt-10">
        <h2 className="mb-3 font-display text-xl">Nueva categoría</h2>
        <Card>
          <form action={createCategory} className="flex flex-wrap items-end gap-4">
            <label className="flex flex-col gap-1">
              <span className="text-[11px] uppercase tracking-[0.1em] text-paper-muted">Nombre</span>
              <input name="name" required className="field w-56" placeholder="Ej: Sesiones de embarazo" />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-[11px] uppercase tracking-[0.1em] text-paper-muted">Orden</span>
              <input name="order" type="number" defaultValue={0} className="field w-20" />
            </label>
            <button type="submit" className="border border-ink bg-ink px-4 py-2 text-xs uppercase tracking-[0.1em] text-paper hover:bg-gold hover:text-ink">
              Crear categoría
            </button>
          </form>
        </Card>
      </div>
    </div>
  );
}
