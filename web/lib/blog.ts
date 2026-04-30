import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";
import readingTime from "reading-time";
import type { Locale } from "@/lib/locale";

/**
 * 블로그 포스트 메타데이터 (frontmatter).
 *
 * 파일 명명 규칙: `{slug}.{locale}.md` (strict)
 *   ✓ welcome.ko.md
 *   ✓ welcome.en.md
 *   ✗ welcome.md          (locale suffix 필수)
 *   ✗ welcome.ko.en.md    (slug 안에 점 X)
 *
 * 같은 slug + 다른 locale = 같은 글의 다른 언어판.
 */
export type PostMeta = {
  slug: string;
  title: string;
  date: string; // ISO YYYY-MM-DD
  excerpt: string;
  cover?: string | null;
  tags?: string[];
  locale: Locale; // 파일명에서 도출
  author?: string;
  draft?: boolean;
  readingMinutes: number;
  /** 이 slug 의 글이 작성된 모든 언어 (ko / en / 둘 다). UI 에서 fallback 안내·toggle 용. */
  availableLocales: Locale[];
};

export type Post = PostMeta & {
  html: string;
};

const CONTENT_DIR = join(process.cwd(), "..", "content", "blog");

/** 파일명 `{slug}.{locale}.md` 파싱. 형식 안 맞으면 null. */
function parseFilename(filename: string): { slug: string; locale: Locale } | null {
  const match = filename.match(/^(.+)\.(ko|en)\.(md|mdx)$/);
  if (!match) return null;
  return { slug: match[1], locale: match[2] as Locale };
}

type RawPost = Omit<Post, "availableLocales">;

/**
 * content/blog 의 모든 .md 파일을 읽어 slug 별·locale 별로 그룹.
 * 같은 slug 의 ko·en 두 버전이 묶임.
 */
async function readAllPostsBySlug(): Promise<Map<string, Map<Locale, RawPost>>> {
  let files: string[] = [];
  try {
    files = await readdir(CONTENT_DIR);
  } catch {
    return new Map();
  }

  const grouped = new Map<string, Map<Locale, RawPost>>();
  const isProd = process.env.NODE_ENV === "production";

  await Promise.all(
    files.map(async (f) => {
      const parsed = parseFilename(f);
      if (!parsed) return;

      const raw = await readFile(join(CONTENT_DIR, f), "utf-8");
      const { data, content } = matter(raw);

      // draft 는 prod 에서 제외.
      if (isProd && data.draft) return;

      const processed = await remark()
        .use(remarkGfm)
        .use(remarkHtml, { sanitize: false })
        .process(content);

      const stats = readingTime(content);

      const post: RawPost = {
        slug: parsed.slug,
        locale: parsed.locale,
        title: String(data.title ?? "(제목 없음)"),
        date: String(data.date ?? new Date().toISOString().slice(0, 10)),
        excerpt: String(data.excerpt ?? ""),
        cover: data.cover ?? null,
        tags: Array.isArray(data.tags) ? data.tags : [],
        author: data.author ?? "Sooly",
        draft: Boolean(data.draft),
        readingMinutes: Math.max(1, Math.round(stats.minutes)),
        html: String(processed),
      };

      const byLocale = grouped.get(parsed.slug) ?? new Map<Locale, RawPost>();
      byLocale.set(parsed.locale, post);
      grouped.set(parsed.slug, byLocale);
    }),
  );

  return grouped;
}

/** locale 의 반대값. */
function otherLocale(l: Locale): Locale {
  return l === "ko" ? "en" : "ko";
}

/** RawPost + 사용 가능 locales → 최종 Post. */
function withAvailable(post: RawPost, byLocale: Map<Locale, RawPost>): Post {
  return {
    ...post,
    availableLocales: Array.from(byLocale.keys()).sort() as Locale[],
  };
}

/**
 * 모든 글 목록.
 * - currentLocale 버전이 있으면 그걸, 없으면 다른 언어 버전을 fallback 으로 표시 (`locale` 필드로 어떤 언어인지 알 수 있음).
 * - `availableLocales` 로 어느 언어들로 작성됐는지 노출 → UI 에서 "한국어만 있음" 같은 배지에 활용.
 */
export async function getAllPosts(currentLocale: Locale): Promise<PostMeta[]> {
  const grouped = await readAllPostsBySlug();
  const list: PostMeta[] = [];

  for (const byLocale of grouped.values()) {
    const post = byLocale.get(currentLocale) ?? byLocale.get(otherLocale(currentLocale));
    if (!post) continue;
    const { html: _html, ...meta } = withAvailable(post, byLocale);
    list.push(meta);
  }

  return list.sort((a, b) => b.date.localeCompare(a.date));
}

/**
 * slug + locale 로 글 조회.
 * - currentLocale 버전이 있으면 반환 (`locale === currentLocale`)
 * - 없고 다른 언어만 있으면 그걸 반환 (`locale !== currentLocale` → UI 에서 "{other} 로만 작성됨" 안내)
 * - 어느 언어도 없으면 null
 */
export async function getPostBySlug(
  slug: string,
  currentLocale: Locale,
): Promise<Post | null> {
  const grouped = await readAllPostsBySlug();
  const byLocale = grouped.get(slug);
  if (!byLocale) return null;

  const post = byLocale.get(currentLocale) ?? byLocale.get(otherLocale(currentLocale));
  if (!post) return null;

  return withAvailable(post, byLocale);
}

/**
 * generateStaticParams 용. 모든 slug 반환 (locale 무관, 중복 제거).
 */
export async function getAllSlugs(): Promise<string[]> {
  const grouped = await readAllPostsBySlug();
  return Array.from(grouped.keys());
}
