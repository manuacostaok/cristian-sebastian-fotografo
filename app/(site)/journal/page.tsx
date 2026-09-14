import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { RevealPhoto } from "@/components/ui/RevealPhoto";
import { formatDateLong } from "@/lib/utils";
import { getJournalPosts } from "@/lib/data/content";

export const metadata: Metadata = {
  title: "Journal",
  description: "Historias, consejos y detrás de cámara de Christian Sebastián.",
};

export default async function JournalPage() {
  const posts = await getJournalPosts();

  return (
    <div className="pt-32 pb-24 sm:pt-40">
      <Container className="max-w-4xl">
        <header className="mb-16">
          <p className="text-[11px] uppercase tracking-[0.2em] text-paper-muted">Journal</p>
          <h1 className="mt-3 font-display text-4xl sm:text-5xl">Historias y detrás de cámara</h1>
        </header>

        <div className="flex flex-col divide-y divide-paper-line">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/journal/${post.slug}`}
              className="group grid gap-6 py-10 sm:grid-cols-[200px_1fr] sm:items-center"
            >
              <RevealPhoto seed={post.coverSeed} url={post.coverUrl} alt={post.title} className="aspect-[4/3] w-full" />
              <div>
                <p className="text-[11px] uppercase tracking-[0.14em] text-paper-muted">
                  {formatDateLong(new Date(post.publishedAt))}
                </p>
                <h2 className="mt-2 font-display text-2xl transition-opacity group-hover:opacity-60">
                  {post.title}
                </h2>
                <p className="mt-2 max-w-lg text-paper-muted">{post.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </div>
  );
}
