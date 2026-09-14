import Image from "next/image";
import { notFound } from "next/navigation";
import { PageHeader, Card } from "@/components/admin/Page";
import { prisma } from "@/lib/prisma";
import { updateProject, deleteProject, assignPhotoToProject, removePhotoFromProject } from "../actions";

export default async function ProyectoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [project, categories] = await Promise.all([
    prisma.project.findUnique({ where: { id }, include: { photos: true, category: true } }),
    prisma.category.findMany({ orderBy: { order: "asc" } }),
  ]);

  if (!project) notFound();

  const unassignedPhotos = await prisma.photo.findMany({
    where: { projectId: null, categoryId: project.categoryId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <PageHeader title={project.title} description={`/historias/${project.slug}`} />

      <Card className="max-w-2xl">
        <form action={updateProject} className="flex flex-col gap-4">
          <input type="hidden" name="id" value={project.id} />
          <input name="title" defaultValue={project.title} className="field" placeholder="Título" />
          <div className="flex flex-wrap gap-4">
            <select name="categoryId" defaultValue={project.categoryId} className="field flex-1">
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <input
              name="date"
              type="date"
              defaultValue={project.date ? project.date.toISOString().slice(0, 10) : ""}
              className="field w-40"
            />
            <input name="location" defaultValue={project.location ?? ""} className="field flex-1" placeholder="Ubicación" />
          </div>
          <textarea name="description" defaultValue={project.description ?? ""} rows={3} className="field" placeholder="Descripción" />
          <input name="credits" defaultValue={project.credits ?? ""} className="field" placeholder="Créditos (opcional)" />

          <select name="coverPhotoId" defaultValue={project.coverPhotoId ?? ""} className="field">
            <option value="">Sin portada</option>
            {project.photos.map((p) => (
              <option key={p.id} value={p.id}>{p.alt || p.id}</option>
            ))}
          </select>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="featured" defaultChecked={project.featured} /> Destacado
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="published" defaultChecked={project.published} /> Publicado
            </label>
            <button type="submit" className="ml-auto border border-ink px-4 py-2 text-xs uppercase tracking-[0.1em] hover:bg-ink hover:text-paper">
              Guardar
            </button>
          </div>
        </form>
        <form action={deleteProject} className="mt-3">
          <input type="hidden" name="id" value={project.id} />
          <button type="submit" className="text-xs text-ember hover:underline">Eliminar proyecto</button>
        </form>
      </Card>

      <div className="mt-10">
        <h2 className="mb-3 font-display text-xl">Fotos del proyecto ({project.photos.length})</h2>
        {project.photos.length === 0 ? (
          <p className="text-sm text-paper-muted">Todavía no hay fotos asignadas.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {project.photos.map((photo) => (
              <div key={photo.id} className="flex flex-col gap-2">
                <div className="relative aspect-square overflow-hidden bg-paper-dim">
                  <Image src={photo.url} alt={photo.alt} fill className="object-cover" sizes="25vw" />
                </div>
                <form action={removePhotoFromProject}>
                  <input type="hidden" name="photoId" value={photo.id} />
                  <input type="hidden" name="projectId" value={project.id} />
                  <button type="submit" className="text-xs text-ember hover:underline">Quitar del proyecto</button>
                </form>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-10">
        <h2 className="mb-3 font-display text-xl">
          Fotos disponibles en "{project.category.name}" ({unassignedPhotos.length})
        </h2>
        {unassignedPhotos.length === 0 ? (
          <p className="text-sm text-paper-muted">
            No hay fotos sin asignar en esta categoría. Subí más desde{" "}
            <a href="/admin/portfolio/fotos" className="underline">Fotos</a>.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {unassignedPhotos.map((photo) => (
              <div key={photo.id} className="flex flex-col gap-2">
                <div className="relative aspect-square overflow-hidden bg-paper-dim">
                  <Image src={photo.url} alt={photo.alt} fill className="object-cover" sizes="25vw" />
                </div>
                <form action={assignPhotoToProject}>
                  <input type="hidden" name="photoId" value={photo.id} />
                  <input type="hidden" name="projectId" value={project.id} />
                  <input type="hidden" name="categoryId" value={project.categoryId} />
                  <button type="submit" className="text-xs uppercase tracking-[0.08em] hover:underline">
                    Agregar al proyecto
                  </button>
                </form>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
