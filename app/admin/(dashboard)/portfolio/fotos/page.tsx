import Image from "next/image";
import { PageHeader, EmptyState } from "@/components/admin/Page";
import { PhotoUploader } from "@/components/admin/PhotoUploader";
import { prisma } from "@/lib/prisma";
import { safeQuery } from "@/lib/safe-query";
import { updatePhoto, deletePhoto } from "./actions";

export default async function FotosPage() {
  const [photos, categories] = await Promise.all([
    safeQuery(() => prisma.photo.findMany({ orderBy: { createdAt: "desc" } }), []),
    safeQuery(() => prisma.category.findMany({ orderBy: { order: "asc" } }), []),
  ]);

  return (
    <div>
      <PageHeader
        title="Fotos"
        description="Subí fotos y asignalas a una categoría. Después se pueden agrupar en un proyecto/historia."
        action={<PhotoUploader />}
      />

      {photos.length === 0 ? (
        <EmptyState message="Todavía no hay fotos subidas." />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {photos.map((photo) => (
            <form key={photo.id} action={updatePhoto} className="flex flex-col gap-2">
              <input type="hidden" name="id" value={photo.id} />
              <div className="relative aspect-square overflow-hidden bg-paper-dim">
                <Image src={photo.url} alt={photo.alt} fill className="object-cover" sizes="25vw" />
              </div>
              <select name="categoryId" defaultValue={photo.categoryId ?? ""} className="field text-xs">
                <option value="">Sin categoría</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <input name="alt" defaultValue={photo.alt} placeholder="Texto alternativo" className="field text-xs" />
              <label className="flex items-center gap-2 text-xs">
                <input type="checkbox" name="featured" defaultChecked={photo.featured} />
                Destacada
              </label>
              <div className="flex items-center justify-between">
                <button type="submit" className="text-xs uppercase tracking-[0.08em] hover:underline">
                  Guardar
                </button>
                <button
                  type="submit"
                  formAction={deletePhoto}
                  className="text-xs text-ember hover:underline"
                >
                  Eliminar
                </button>
              </div>
            </form>
          ))}
        </div>
      )}
    </div>
  );
}
