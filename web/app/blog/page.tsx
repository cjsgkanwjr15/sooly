import Link from "next/link";
import type { Metadata } from "next";
import { getAllPosts } from "@/lib/blog";
import { getLocale } from "@/lib/locale";

export const metadata: Metadata = {
  title: "Journal",
  description:
    "한국술을 더 깊게 즐기기 위한 읽을거리. 양조장 방문기, 페어링 가이드, 전통주의 역사.",
};

export const revalidate = 3600;

export default async function BlogIndexPage() {
  const locale = await getLocale();
  const isEn = locale === "en";
  const posts = await getAllPosts(locale);

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <header className="mb-14">
        <p className="text-xs uppercase tracking-[0.3em] text-primary/70">
          Journal
        </p>
        <h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight sm:text-5xl">
          {isEn
            ? "The pleasure of drinking, the depth of reading"
            : "마시는 즐거움, 읽는 깊이"}
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          {isEn
            ? "Brewery visits, pairing guides, the history of Korean alcohol. Reading material to enjoy Korean alcohol more fully."
            : "양조장 방문기, 페어링 가이드, 전통주의 역사. 한국술을 더 풍성하게 즐기기 위한 읽을거리."}
        </p>
      </header>

      {posts.length === 0 ? (
        <p className="py-16 text-center text-muted-foreground">
          {isEn
            ? "No posts yet. The first story is on the way."
            : "아직 게시글이 없습니다. 곧 첫 이야기가 올라옵니다."}
        </p>
      ) : (
        <ul className="divide-y divide-border/60">
          {posts.map((p) => {
            const fallback = p.locale !== locale;
            return (
              <li key={p.slug} className="py-8">
                <Link href={`/blog/${p.slug}`} className="group block">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <time dateTime={p.date}>
                      {formatDate(p.date, locale)}
                    </time>
                    <span>·</span>
                    <span>
                      {isEn
                        ? `${p.readingMinutes} min read`
                        : `${p.readingMinutes}분 읽기`}
                    </span>
                    {fallback && (
                      <>
                        <span>·</span>
                        <span className="rounded-md bg-foreground/[0.06] px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider">
                          {p.locale}
                        </span>
                      </>
                    )}
                    {p.tags && p.tags.length > 0 && (
                      <>
                        <span>·</span>
                        <span className="truncate">{p.tags.join(", ")}</span>
                      </>
                    )}
                  </div>
                  <h2 className="mt-2 font-serif text-2xl font-medium leading-snug group-hover:underline sm:text-3xl">
                    {p.title}
                  </h2>
                  {p.excerpt && (
                    <p className="mt-3 line-clamp-2 leading-relaxed text-muted-foreground">
                      {p.excerpt}
                    </p>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}

function formatDate(iso: string, locale: "ko" | "en"): string {
  const [y, m, d] = iso.split("-");
  if (locale === "en") {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return `${months[Number(m) - 1]} ${Number(d)}, ${y}`;
  }
  return `${y}년 ${Number(m)}월 ${Number(d)}일`;
}
