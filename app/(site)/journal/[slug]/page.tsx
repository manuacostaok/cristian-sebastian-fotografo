import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { PhotoFrame } from "@/components/ui/PhotoFrame";
import { formatDateLong } from "@/lib/utils";
import { getJournalPostBySlug } from "@/lib/data/content";

type Params = { slug: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getJournalPostBySlug(slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
}

export default async function JournalPostPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const post = await getJournalPostBySlug(slug);
  if (!post) notFound();

  return (
    <article className="pt-32 pb-24 sm:pt-40">
      <Container className="max-w-2xl">
        <p className="text-[11px] uppercase tracking-[0.2em] text-paper-muted">
          {formatDateLong(new Date(post.publishedAt))}
        </p>
        <h1 className="mt-3 font-display text-4xl sm:text-5xl">{post.title}</h1>

        <PhotoFrame seed={post.coverSeed} url={post.coverUrl} alt={post.title} className="mt-10 aspect-[16/9] w-full" />

        <div className="mt-10 max-w-xl text-lg leading-relaxed text-paper-muted">
          <p>{post.content}</p>
        </div>

        <div className="mt-10 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="border border-paper-line px-3 py-1 text-[11px] uppercase tracking-[0.1em] text-paper-muted"
            >
              {tag}
            </span>
          ))}
        </div>
      </Container>
    </article>
  );
}
