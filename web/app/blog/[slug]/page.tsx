import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllSlugs, getPostBySlug } from "@/lib/blog";
import { getLocale, type Locale } from "@/lib/locale";
import { t } from "@/lib/i18n";

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
  if (!post) return { title: t(locale, "blog.notFoundTitle") };
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

  const fallback = post.locale !== locale;
  const fallbackKey =
    locale === "en" ? "blog.fallbackToKo" : "blog.fallbackToEn";

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <nav className="mb-10 text-sm text-muted-foreground">
        <Link href="/blog" className="hover:text-foreground">
          {t(locale, "blog.backLink")}
        </Link>
      </nav>

      {fallback && (
        <div className="mb-8 rounded-lg border border-primary/30 bg-primary/[0.04] px-4 py-3 text-sm">
          {t(locale, fallbackKey)}
        </div>
      )}

      <header className="mb-10">
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <time dateTime={post.date}>{formatDate(post.date, locale)}</time>
          {post.author && (
            <>
              <span>·</span>
              <span>{t(locale, "blog.byAuthor", { author: post.author })}</span>
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
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-border/60 px-3 py-1 text-xs text-muted-foreground"
            >
              #{tag}
            </span>
          ))}
        </footer>
      )}

      {/* 다른 언어판 안내 — availableLocales 에 두 개 다 있을 때만. */}
      {post.availableLocales.length > 1 && (
        <p className="mt-10 text-xs text-muted-foreground">
          {t(locale, "blog.bothAvailable")}
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

function formatDate(iso: string, locale: Locale): string {
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
