import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { ImmersiveGallery } from "@/components/portfolio/ImmersiveGallery";
import { prisma } from "@/lib/prisma";
import { mapPhoto } from "@/lib/data/mappers";

export const metadata: Metadata = {
  title: "Galería privada",
  robots: { index: false, follow: false },
};

export default async function PrivateGalleryPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  const gallery = await prisma.privateGallery.findUnique({
    where: { token },
    include: { photos: { orderBy: { order: "asc" } } },
  });
  if (!gallery) notFound();

  return (
    <div className="min-h-screen bg-ink text-paper">
      <header className="border-b border-ink-line px-6 py-6 sm:px-10">
        <Link href="/" className="font-display text-lg">
          Christian Sebastián
        </Link>
      </header>

      <Container wide className="py-16 sm:py-24">
        <p className="text-[11px] uppercase tracking-[0.2em] text-gold-bright">Galería privada</p>
        <h1 className="mt-3 font-display text-4xl sm:text-5xl">{gallery.title}</h1>
        <p className="mt-4 text-sm text-paper/70">
          {gallery.photos.length} foto{gallery.photos.length === 1 ? "" : "s"}
          {gallery.downloadEnabled ? " — mantené presionada o hacé clic derecho para guardar." : ""}
        </p>

        <div className="mt-14">
          {gallery.photos.length === 0 ? (
            <p className="text-paper/70">Todavía no hay fotos en esta galería.</p>
          ) : (
            <ImmersiveGallery photos={gallery.photos.map(mapPhoto)} />
          )}
        </div>
      </Container>
    </div>
  );
}
