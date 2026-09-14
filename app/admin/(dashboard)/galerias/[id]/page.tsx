import Image from "next/image";
import { notFound } from "next/navigation";
import { PageHeader, Card } from "@/components/admin/Page";
import { prisma } from "@/lib/prisma";
import { updateGallery, deleteGallery, assignPhotoToGallery, removePhotoFromGallery } from "../actions";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://christiansebastian.com";

export default async function GaleriaDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const gallery = await prisma.privateGallery.findUnique({
    where: { id },
    include: { photos: true, event: { include: { client: true } } },
  });
  if (!gallery) notFound();

  const unassignedPhotos = await prisma.photo.findMany({
    where: { privateGalleryId: null },
    orderBy: { createdAt: "desc" },
    take: 60,
  });

  const publicUrl = `${SITE_URL}/galeria/${gallery.token}`;

  return (
    <div>
      <PageHeader title={gallery.title} description={publicUrl} />

      <Card className="max-w-xl">
        <form action={updateGallery} className="flex flex-col gap-4">
          <input type="hidden" name="id" value={gallery.id} />
          <input name="title" defaultValue={gallery.title} className="field" />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="downloadEnabled" defaultChecked={gallery.downloadEnabled} />
            Permitir descarga de fotos
          </label>
          <div className="flex items-center gap-4">
            <button type="submit" className="border border-ink px-4 py-2 text-xs uppercase tracking-[0.1em] hover:bg-ink hover:text-paper">
              Guardar
            </button>
          </div>
        </form>
        <form action={deleteGallery} className="mt-3">
          <input type="hidden" name="id" value={gallery.id} />
          <button type="submit" className="text-xs text-ember hover:underline">Eliminar galería</button>
        </form>
      </Card>

      <div className="mt-10">
        <h2 className="mb-3 font-display text-xl">Fotos de la galería ({gallery.photos.length})</h2>
        {gallery.photos.length === 0 ? (
          <p className="text-sm text-paper-muted">Todavía no hay fotos asignadas.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {gallery.photos.map((photo) => (
              <div key={photo.id} className="flex flex-col gap-2">
                <div className="relative aspect-square overflow-hidden bg-paper-dim">
                  <Image src={photo.url} alt={photo.alt} fill className="object-cover" sizes="25vw" />
                </div>
                <form action={removePhotoFromGallery}>
                  <input type="hidden" name="photoId" value={photo.id} />
                  <input type="hidden" name="galleryId" value={gallery.id} />
                  <button type="submit" className="text-xs text-ember hover:underline">Quitar</button>
                </form>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-10">
        <h2 className="mb-3 font-display text-xl">Fotos disponibles ({unassignedPhotos.length})</h2>
        {unassignedPhotos.length === 0 ? (
          <p className="text-sm text-paper-muted">
            No hay fotos sin asignar. Subí más desde <a href="/admin/portfolio/fotos" className="underline">Fotos</a>.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {unassignedPhotos.map((photo) => (
              <div key={photo.id} className="flex flex-col gap-2">
                <div className="relative aspect-square overflow-hidden bg-paper-dim">
                  <Image src={photo.url} alt={photo.alt} fill className="object-cover" sizes="25vw" />
                </div>
                <form action={assignPhotoToGallery}>
                  <input type="hidden" name="photoId" value={photo.id} />
                  <input type="hidden" name="galleryId" value={gallery.id} />
                  <button type="submit" className="text-xs uppercase tracking-[0.08em] hover:underline">
                    Agregar
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
