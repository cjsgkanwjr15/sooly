import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllSlugs, getPostBySlug } from "@/lib/blog";
import { getLocale } from "@/lib/locale";

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const post = await getPostBySlug(slug, locale);
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
      locale: post.locale,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const locale = await getLocale();
  const post = await getPostBySlug(slug, locale);
  if (!post) notFound();

  const isEn = locale === "en";
  const fallback = post.locale !== locale;

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <nav className="mb-10 text-sm text-muted-foreground">
        <Link href="/blog" className="hover:text-foreground">
          ← Journal
        </Link>
      </nav>

      {fallback && (
        <div className="mb-8 rounded-lg border border-primary/30 bg-primary/[0.04] px-4 py-3 text-sm">
          {isEn ? (
            <>
              This post is only available in <strong>Korean</strong>. An English
              version is on the way.
            </>
          ) : (
            <>
              이 글은 <strong>영어</strong> 로만 작성되어 있어요. 한국어 버전을
              준비 중이에요.
            </>
          )}
        </div>
      )}

      <header className="mb-10">
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <time dateTime={post.date}>{formatDate(post.date, locale)}</time>
          <span>·</span>
          <span>
            {isEn
              ? `${post.readingMinutes} min read`
              : `${post.readingMinutes}분 읽기`}
          </span>
          {post.author && (
            <>
              <span>·</span>
              <span>by {post.author}</span>
            </>
          )}
          <span>·</span>
          <span className="rounded-md bg-foreground/[0.06] px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider">
            {post.locale}
          </span>
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

      {/* 다른 언어판 안내 — availableLocales 에 두 개 다 있을 때만. */}
      {post.availableLocales.length > 1 && (
        <p className="mt-10 text-xs text-muted-foreground">
          {isEn
            ? "Also available in Korean — switch using the KO toggle in the header."
            : "영어 버전도 있어요 — 헤더의 EN 토글로 변경할 수 있어요."}
        </p>
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
            inLanguage: post.locale === "ko" ? "ko-KR" : "en-US",
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

function formatDate(iso: string, locale: "ko" | "en"): string {
  const [y, m, d] = iso.split("-");
  if (locale === "en") {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return `${months[Number(m) - 1]} ${Number(d)}, ${y}`;
  }
  return `${y}년 ${Number(m)}월 ${Number(d)}일`;
}
