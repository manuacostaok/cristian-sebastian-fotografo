import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { PhotoFrame } from "@/components/ui/PhotoFrame";
import { ImmersiveGallery } from "@/components/portfolio/ImmersiveGallery";
import { WhatsAppCtaLink } from "@/components/marketing/WhatsAppCtaLink";
import { TrackPageView } from "@/components/analytics/TrackPageView";
import { formatDateLong } from "@/lib/utils";
import { portfolioMessage, buildWhatsAppLink } from "@/lib/whatsapp";
import { getProjectBySlug, getCategories } from "@/lib/data/content";
import { getWhatsAppNumber } from "@/lib/data/settings";

type Params = { slug: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.description,
    openGraph: project.coverUrl
      ? { title: project.title, description: project.description, images: [project.coverUrl] }
      : undefined,
  };
}

export default async function StoryPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const [project, categories, phoneNumber] = await Promise.all([
    getProjectBySlug(slug),
    getCategories(),
    getWhatsAppNumber(),
  ]);
  if (!project) notFound();

  const categoryName = categories.find((c) => c.id === project.categoryId)?.name ?? "";
  const whatsappHref = buildWhatsAppLink(portfolioMessage(project.title), phoneNumber);

  return (
    <article>
      <TrackPageView type="project_view" meta={{ slug: project.slug }} />
      <section className="relative flex h-[85svh] min-h-[520px] w-full items-end bg-ink text-paper">
        <PhotoFrame
          seed={project.coverSeed}
          url={project.coverUrl}
          alt={project.title}
          priority
          sizes="100vw"
          className="absolute inset-0 h-full w-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-ink/0" />
        <Container wide className="relative z-10 pb-16">
          <p className="text-[11px] uppercase tracking-[0.2em] text-gold-bright">
            {categoryName}
          </p>
          <h1 className="mt-4 max-w-2xl font-display text-4xl sm:text-6xl">{project.title}</h1>
          <p className="mt-4 text-sm text-paper/70">
            {formatDateLong(new Date(project.date))} — {project.location}
          </p>
        </Container>
      </section>

      <Container className="py-16 sm:py-24">
        <div className="grid gap-10 lg:grid-cols-[2fr_1fr]">
          <p className="max-w-xl text-lg leading-relaxed text-paper-muted">
            {project.description}
          </p>
          <div className="flex flex-col items-start gap-4 lg:items-end">
            <WhatsAppCtaLink href={whatsappHref} variant="solid" context={`historia:${project.slug}`}>
              Quiero algo así
            </WhatsAppCtaLink>
            {project.credits && (
              <p className="text-xs text-paper-muted lg:text-right">{project.credits}</p>
            )}
          </div>
        </div>
      </Container>

      <Container wide className="pb-24 sm:pb-32">
        <ImmersiveGallery photos={project.photos} />
      </Container>
    </article>
  );
}
