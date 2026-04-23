import Link from "next/link";
import type { Metadata } from "next";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Journal",
  description: "한국술을 더 깊게 즐기기 위한 읽을거리. 양조장 방문기, 페어링 가이드, 전통주의 역사.",
};

export const revalidate = 3600;

export default async function BlogIndexPage() {
  const posts = await getAllPosts();

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <header className="mb-14">
        <p className="text-xs uppercase tracking-[0.3em] text-primary/70">
          Journal
        </p>
        <h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight sm:text-5xl">
          마시는 즐거움, 읽는 깊이
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          양조장 방문기, 페어링 가이드, 전통주의 역사. 한국술을 더 풍성하게 즐기기 위한 읽을거리.
        </p>
      </header>

      {posts.length === 0 ? (
        <p className="py-16 text-center text-muted-foreground">
          아직 게시글이 없습니다. 곧 첫 이야기가 올라옵니다.
        </p>
      ) : (
        <ul className="divide-y divide-border/60">
          {posts.map((p) => (
            <li key={p.slug} className="py-8">
              <Link href={`/blog/${p.slug}`} className="group block">
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <time dateTime={p.date}>{formatDate(p.date)}</time>
                  <span>·</span>
                  <span>{p.readingMinutes}분 읽기</span>
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
          ))}
        </ul>
      )}
    </main>
  );
}

function formatDate(iso: string): string {
  // "2026-04-24" → "2026년 4월 24일"
  const [y, m, d] = iso.split("-");
  return `${y}년 ${Number(m)}월 ${Number(d)}일`;
}
