import Link from "next/link";
import { PageHeader, Card, EmptyState } from "@/components/admin/Page";
import { prisma } from "@/lib/prisma";
import { safeQuery } from "@/lib/safe-query";
import { formatDateShort } from "@/lib/utils";
import { createProject } from "./actions";

export default async function ProyectosPage() {
  const [projects, categories] = await Promise.all([
    safeQuery(
      () => prisma.project.findMany({ orderBy: { createdAt: "desc" }, include: { category: true, photos: true } }),
      [],
    ),
    safeQuery(() => prisma.category.findMany({ orderBy: { order: "asc" } }), []),
  ]);

  return (
    <div>
      <PageHeader title="Proyectos" description="Historias que aparecen en /historias. Cada uno agrupa sus fotos." />

      {projects.length === 0 ? (
        <EmptyState message="Todavía no hay proyectos." />
      ) : (
        <div className="flex flex-col gap-2">
          {projects.map((p) => (
            <Link
              key={p.id}
              href={`/admin/proyectos/${p.id}`}
              className="flex items-center justify-between border border-paper-line px-5 py-4 transition-colors hover:border-ink/40"
            >
              <div>
                <p className="font-medium">{p.title}</p>
                <p className="text-xs text-paper-muted">
                  {p.category.name} · {p.photos.length} foto(s) · {p.date ? formatDateShort(p.date) : "sin fecha"}
                </p>
              </div>
              <div className="flex gap-2 text-[10px] uppercase tracking-[0.1em]">
                {p.featured && <span className="border border-gold px-2 py-1 text-gold">Destacado</span>}
                <span className={p.published ? "border border-ink px-2 py-1" : "border border-paper-muted px-2 py-1 text-paper-muted"}>
                  {p.published ? "Publicado" : "Borrador"}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-10">
        <h2 className="mb-3 font-display text-xl">Nuevo proyecto</h2>
        <Card>
          <form action={createProject} className="flex flex-wrap items-end gap-4">
            <input name="title" required className="field flex-1 min-w-[200px]" placeholder="Título" />
            <select name="categoryId" required className="field w-48" defaultValue="">
              <option value="" disabled>Categoría</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <input name="date" type="date" className="field w-40" />
            <input name="location" className="field w-40" placeholder="Ubicación" />
            <button type="submit" className="border border-ink bg-ink px-4 py-2 text-xs uppercase tracking-[0.1em] text-paper hover:bg-gold hover:text-ink">
              Crear proyecto
            </button>
          </form>
        </Card>
      </div>
    </div>
  );
}
