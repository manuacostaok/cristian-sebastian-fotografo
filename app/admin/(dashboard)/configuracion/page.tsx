import { PageHeader, Card } from "@/components/admin/Page";
import { prisma } from "@/lib/prisma";
import { safeQuery } from "@/lib/safe-query";
import { updateSettings } from "./actions";

export default async function ConfiguracionPage() {
  const settings = await safeQuery(() => prisma.settings.findUnique({ where: { id: "settings" } }), null);

  return (
    <div>
      <PageHeader title="Configuración" description="Datos de contacto y SEO por defecto del sitio." />

      <Card className="max-w-2xl">
        <form action={updateSettings} className="flex flex-col gap-5">
          <label className="flex flex-col gap-1">
            <span className="text-[11px] uppercase tracking-[0.1em] text-paper-muted">Número de WhatsApp (con código de país, sin +)</span>
            <input name="whatsappNumber" defaultValue={settings?.whatsappNumber} className="field" placeholder="5491122223333" />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-[11px] uppercase tracking-[0.1em] text-paper-muted">Instagram</span>
            <input name="instagramUrl" defaultValue={settings?.instagramUrl} className="field" placeholder="https://instagram.com/..." />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-[11px] uppercase tracking-[0.1em] text-paper-muted">Email de contacto</span>
            <input name="contactEmail" defaultValue={settings?.contactEmail} className="field" />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-[11px] uppercase tracking-[0.1em] text-paper-muted">Título SEO por defecto</span>
            <input name="seoTitle" defaultValue={settings?.seoTitle} className="field" />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-[11px] uppercase tracking-[0.1em] text-paper-muted">Descripción SEO por defecto</span>
            <textarea name="seoDescription" defaultValue={settings?.seoDescription} rows={3} className="field" />
          </label>
          <button type="submit" className="self-start border border-ink bg-ink px-6 py-3 text-xs uppercase tracking-[0.1em] text-paper hover:bg-gold hover:text-ink">
            Guardar configuración
          </button>
        </form>
      </Card>
    </div>
  );
}
