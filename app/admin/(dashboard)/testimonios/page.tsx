import { PageHeader, Card, EmptyState } from "@/components/admin/Page";
import { prisma } from "@/lib/prisma";
import { safeQuery } from "@/lib/safe-query";
import { createTestimonial, updateTestimonial, deleteTestimonial } from "./actions";

export default async function TestimoniosPage() {
  const testimonials = await safeQuery(
    () => prisma.testimonial.findMany({ orderBy: { createdAt: "desc" } }),
    [],
  );

  return (
    <div>
      <PageHeader title="Testimonios" description="Se muestran en la Home los que estén publicados y destacados." />

      {testimonials.length === 0 ? (
        <EmptyState message="Todavía no hay testimonios cargados." />
      ) : (
        <div className="flex flex-col gap-3">
          {testimonials.map((t) => (
            <Card key={t.id}>
              <form action={updateTestimonial} className="flex flex-col gap-3">
                <input type="hidden" name="id" value={t.id} />
                <div className="flex flex-wrap gap-4">
                  <input name="name" defaultValue={t.name} className="field flex-1 min-w-[160px]" placeholder="Nombre" />
                  <input name="eventLabel" defaultValue={t.eventLabel ?? ""} className="field flex-1 min-w-[160px]" placeholder="Evento" />
                </div>
                <textarea name="text" defaultValue={t.text} rows={2} className="field" />
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" name="featured" defaultChecked={t.featured} /> Destacado
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" name="published" defaultChecked={t.published} /> Publicado
                  </label>
                  <button type="submit" className="ml-auto border border-ink px-4 py-2 text-xs uppercase tracking-[0.1em] hover:bg-ink hover:text-paper">
                    Guardar
                  </button>
                </div>
              </form>
              <form action={deleteTestimonial} className="mt-2">
                <input type="hidden" name="id" value={t.id} />
                <button type="submit" className="text-xs text-ember hover:underline">
                  Eliminar
                </button>
              </form>
            </Card>
          ))}
        </div>
      )}

      <div className="mt-10">
        <h2 className="mb-3 font-display text-xl">Nuevo testimonio</h2>
        <Card>
          <form action={createTestimonial} className="flex flex-col gap-3">
            <div className="flex flex-wrap gap-4">
              <input name="name" required className="field flex-1 min-w-[160px]" placeholder="Nombre" />
              <input name="eventLabel" className="field flex-1 min-w-[160px]" placeholder="Evento (ej: 15 años de Dana)" />
            </div>
            <textarea name="text" required rows={2} className="field" placeholder="Texto del testimonio" />
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="featured" /> Destacado
              </label>
              <button type="submit" className="ml-auto border border-ink bg-ink px-4 py-2 text-xs uppercase tracking-[0.1em] text-paper hover:bg-gold hover:text-ink">
                Crear testimonio
              </button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
