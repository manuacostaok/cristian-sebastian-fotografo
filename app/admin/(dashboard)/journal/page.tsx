import { PageHeader, Card, EmptyState } from "@/components/admin/Page";
import { prisma } from "@/lib/prisma";
import { safeQuery } from "@/lib/safe-query";
import { createPost, updatePost, deletePost } from "./actions";

export default async function JournalAdminPage() {
  const posts = await safeQuery(() => prisma.journalPost.findMany({ orderBy: { createdAt: "desc" } }), []);

  return (
    <div>
      <PageHeader title="Journal" description="Artículos e historias para SEO y contenido." />

      {posts.length === 0 ? (
        <EmptyState message="Todavía no hay publicaciones." />
      ) : (
        <div className="flex flex-col gap-3">
          {posts.map((post) => (
            <Card key={post.id}>
              <form action={updatePost} className="flex flex-col gap-3">
                <input type="hidden" name="id" value={post.id} />
                <input name="title" defaultValue={post.title} className="field" />
                <textarea name="content" defaultValue={post.content} rows={4} className="field" />
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" name="published" defaultChecked={post.published} /> Publicado
                  </label>
                  <p className="text-xs text-paper-muted">/journal/{post.slug}</p>
                  <button type="submit" className="ml-auto border border-ink px-4 py-2 text-xs uppercase tracking-[0.1em] hover:bg-ink hover:text-paper">
                    Guardar
                  </button>
                </div>
              </form>
              <form action={deletePost} className="mt-2">
                <input type="hidden" name="id" value={post.id} />
                <button type="submit" className="text-xs text-ember hover:underline">Eliminar</button>
              </form>
            </Card>
          ))}
        </div>
      )}

      <div className="mt-10">
        <h2 className="mb-3 font-display text-xl">Nueva publicación</h2>
        <Card>
          <form action={createPost} className="flex flex-col gap-3">
            <input name="title" required className="field" placeholder="Título" />
            <textarea name="content" required rows={4} className="field" placeholder="Contenido" />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="published" /> Publicar ahora
            </label>
            <button type="submit" className="ml-auto border border-ink bg-ink px-4 py-2 text-xs uppercase tracking-[0.1em] text-paper hover:bg-gold hover:text-ink">
              Crear publicación
            </button>
          </form>
        </Card>
      </div>
    </div>
  );
}
