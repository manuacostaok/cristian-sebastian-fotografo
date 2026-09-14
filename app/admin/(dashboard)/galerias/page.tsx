import Link from "next/link";
import { PageHeader, Card, EmptyState } from "@/components/admin/Page";
import { prisma } from "@/lib/prisma";
import { safeQuery } from "@/lib/safe-query";
import { createGallery } from "./actions";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://christiansebastian.com";

export default async function GaleriasPage() {
  const [galleries, doneEvents] = await Promise.all([
    safeQuery(
      () =>
        prisma.privateGallery.findMany({
          orderBy: { createdAt: "desc" },
          include: { event: { include: { client: true } }, photos: true },
        }),
      [],
    ),
    safeQuery(
      () => prisma.event.findMany({ where: { status: "DONE" }, orderBy: { date: "desc" }, include: { client: true } }),
      [],
    ),
  ]);

  return (
    <div>
      <PageHeader
        title="Galerías privadas"
        description="Link único por evento para que el cliente vea y descargue sus fotos, sin login."
      />

      {galleries.length === 0 ? (
        <EmptyState message="Todavía no hay galerías privadas creadas." />
      ) : (
        <div className="flex flex-col gap-3">
          {galleries.map((g) => (
            <Card key={g.id}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <Link href={`/admin/galerias/${g.id}`} className="font-medium hover:underline">
                    {g.title}
                  </Link>
                  <p className="text-xs text-paper-muted">
                    {g.event?.client?.name ?? "Sin cliente"} · {g.photos.length} foto(s)
                  </p>
                  <p className="mt-1 text-xs text-paper-muted">{SITE_URL}/galeria/{g.token}</p>
                </div>
                <Link
                  href={`/admin/galerias/${g.id}`}
                  className="border border-ink px-4 py-2 text-[11px] uppercase tracking-[0.1em] hover:bg-ink hover:text-paper"
                >
                  Gestionar fotos
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}

      <div className="mt-10">
        <h2 className="mb-3 font-display text-xl">Nueva galería</h2>
        <Card>
          <form action={createGallery} className="flex flex-wrap items-end gap-4">
            <input name="title" required className="field flex-1 min-w-[200px]" placeholder="Título (ej: Sofía — Sus 15)" />
            <select name="eventId" defaultValue="" className="field w-56">
              <option value="">Sin evento vinculado</option>
              {doneEvents.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name} {e.client ? `— ${e.client.name}` : ""}
                </option>
              ))}
            </select>
            <button type="submit" className="border border-ink bg-ink px-4 py-2 text-xs uppercase tracking-[0.1em] text-paper hover:bg-gold hover:text-ink">
              Crear galería
            </button>
          </form>
        </Card>
      </div>
    </div>
  );
}
