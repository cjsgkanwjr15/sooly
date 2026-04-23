import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllPosts, getPostBySlug } from "@/lib/blog";

export const revalidate = 3600;

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "글 없음" };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      authors: post.author ? [post.author] : undefined,
      tags: post.tags,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <nav className="mb-10 text-sm text-muted-foreground">
        <Link href="/blog" className="hover:text-foreground">
          ← Journal
        </Link>
      </nav>

      <header className="mb-10">
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span>·</span>
          <span>{post.readingMinutes}분 읽기</span>
          {post.author && (
            <>
              <span>·</span>
              <span>by {post.author}</span>
            </>
          )}
        </div>
        <h1 className="mt-4 font-serif text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-[2.75rem]">
          {post.title}
        </h1>
        {post.excerpt && (
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            {post.excerpt}
          </p>
        )}
      </header>

      <article
        className="prose prose-sooly max-w-none"
        dangerouslySetInnerHTML={{ __html: post.html }}
      />

      {post.tags && post.tags.length > 0 && (
        <footer className="mt-16 flex flex-wrap gap-2 border-t pt-8">
          {post.tags.map((t) => (
            <span
              key={t}
              className="rounded-full border border-border/60 px-3 py-1 text-xs text-muted-foreground"
            >
              #{t}
            </span>
          ))}
        </footer>
      )}

      {/* Schema.org Article 구조화 데이터 — 구글 검색 결과 리치 스니펫 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.title,
            description: post.excerpt,
            datePublished: post.date,
            author: { "@type": "Person", name: post.author ?? "Sooly" },
            publisher: {
              "@type": "Organization",
              name: "Sooly",
            },
          }),
        }}
      />
    </main>
  );
}

function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${y}년 ${Number(m)}월 ${Number(d)}일`;
}
