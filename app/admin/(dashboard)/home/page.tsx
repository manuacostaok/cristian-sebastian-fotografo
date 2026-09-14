import { PageHeader, Card } from "@/components/admin/Page";
import { prisma } from "@/lib/prisma";
import { safeQuery } from "@/lib/safe-query";
import { updateHomeConfig } from "./actions";

export default async function HomeAdminPage() {
  const [config, projects, events, photos] = await Promise.all([
    safeQuery(() => prisma.homeConfig.findUnique({ where: { id: "home" } }), null),
    safeQuery(() => prisma.project.findMany({ where: { published: true }, orderBy: { date: "desc" } }), []),
    safeQuery(() => prisma.event.findMany({ orderBy: { date: "desc" } }), []),
    safeQuery(() => prisma.photo.findMany({ orderBy: { createdAt: "desc" }, take: 100 }), []),
  ]);

  return (
    <div>
      <PageHeader title="Home" description="Contenido editable de la página principal." />

      <Card>
        <form action={updateHomeConfig} className="flex flex-col gap-8 max-w-2xl">
          <fieldset className="flex flex-col gap-4">
            <legend className="mb-2 text-[11px] uppercase tracking-[0.14em] text-paper-muted">Hero</legend>
            <input name="heroTitle" defaultValue={config?.heroTitle} className="field" placeholder="Título" />
            <input name="heroSubtitle" defaultValue={config?.heroSubtitle} className="field" placeholder="Subtítulo" />
            <div className="flex gap-4">
              <input name="heroCtaPrimary" defaultValue={config?.heroCtaPrimary} className="field flex-1" placeholder="CTA principal" />
              <input name="heroCtaSecondary" defaultValue={config?.heroCtaSecondary} className="field flex-1" placeholder="CTA secundario" />
            </div>
            <select name="heroPhotoId" defaultValue={config?.heroPhotoId ?? ""} className="field">
              <option value="">Sin foto (gradiente de marca)</option>
              {photos.map((p) => (
                <option key={p.id} value={p.id}>{p.alt || p.id}</option>
              ))}
            </select>
          </fieldset>

          <fieldset className="flex flex-col gap-4">
            <legend className="mb-2 text-[11px] uppercase tracking-[0.14em] text-paper-muted">Estadísticas</legend>
            <div className="flex gap-4">
              <input name="statsYears" type="number" defaultValue={config?.statsYears ?? 15} className="field w-28" placeholder="Años" />
              <input name="statsEvents" type="number" defaultValue={config?.statsEvents ?? 300} className="field w-28" placeholder="Eventos" />
              <input name="statsLocation" defaultValue={config?.statsLocation} className="field flex-1" placeholder="Ubicación" />
            </div>
            <input name="statsSpecialty" defaultValue={config?.statsSpecialty} className="field" placeholder="Especialidad (ej: 15 Años · Cumpleaños · Eventos)" />
          </fieldset>

          <fieldset className="flex flex-col gap-3">
            <legend className="mb-2 text-[11px] uppercase tracking-[0.14em] text-paper-muted">Destacados</legend>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="showFeatured" defaultChecked={config?.showFeatured ?? true} />
              Mostrar sección de destacados en el Home
            </label>
            {projects.length === 0 ? (
              <p className="text-sm text-paper-muted">No hay proyectos publicados todavía.</p>
            ) : (
              projects.map((p) => (
                <label key={p.id} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    name="featuredProjectIds"
                    value={p.id}
                    defaultChecked={config?.featuredProjectIds.includes(p.id)}
                  />
                  {p.title}
                </label>
              ))
            )}
          </fieldset>

          <fieldset className="flex flex-col gap-3">
            <legend className="mb-2 text-[11px] uppercase tracking-[0.14em] text-paper-muted">Próximo evento</legend>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="showUpcoming" defaultChecked={config?.showUpcoming ?? true} />
              Mostrar sección "Próximamente" en el Home
            </label>
            <select name="upcomingEventId" defaultValue={config?.upcomingEventId ?? ""} className="field">
              <option value="">Ninguno</option>
              {events.map((e) => (
                <option key={e.id} value={e.id}>{e.name}</option>
              ))}
            </select>
            <p className="text-xs text-paper-muted">
              Solo un evento marcado como "Público" en /admin/eventos va a mostrarse acá aunque lo
              selecciones — nunca se expone un evento privado.
            </p>
          </fieldset>

          <fieldset className="flex flex-col gap-3">
            <legend className="mb-2 text-[11px] uppercase tracking-[0.14em] text-paper-muted">Testimonios</legend>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="showTestimonials" defaultChecked={config?.showTestimonials ?? true} />
              Mostrar sección de testimonios en el Home
            </label>
          </fieldset>

          <fieldset className="flex flex-col gap-4">
            <legend className="mb-2 text-[11px] uppercase tracking-[0.14em] text-paper-muted">CTA final</legend>
            <input name="ctaFinalTitle" defaultValue={config?.ctaFinalTitle} className="field" placeholder="Título" />
            <textarea name="ctaFinalText" defaultValue={config?.ctaFinalText} rows={2} className="field" placeholder="Texto" />
          </fieldset>

          <button type="submit" className="self-start border border-ink bg-ink px-6 py-3 text-xs uppercase tracking-[0.1em] text-paper hover:bg-gold hover:text-ink">
            Guardar cambios
          </button>
        </form>
      </Card>
    </div>
  );
}
