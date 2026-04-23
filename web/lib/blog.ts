import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";
import readingTime from "reading-time";

/**
 * 블로그 포스트 메타데이터 (frontmatter).
 * 파일: content/blog/*.md, 최상단 `---` 블록으로 선언.
 */
export type PostMeta = {
  slug: string;
  title: string;
  date: string; // ISO YYYY-MM-DD
  excerpt: string;
  cover?: string | null;
  tags?: string[];
  locale?: "ko" | "en"; // 미지정 시 ko
  author?: string;
  draft?: boolean;
  readingMinutes: number;
};

export type Post = PostMeta & {
  html: string;
};

// content/ 는 모노레포 루트에, Next.js 는 web/ 에서 실행 → 한 단계 위.
const CONTENT_DIR = join(process.cwd(), "..", "content", "blog");

/**
 * content/blog 안의 모든 .md 파일을 읽어 메타 + 본문 반환.
 * draft: true 는 프로덕션에서 제외.
 */
async function readAllRawPosts(): Promise<Array<Post>> {
  let files: string[] = [];
  try {
    files = await readdir(CONTENT_DIR);
  } catch {
    // 디렉터리 없으면 빈 리스트 (첫 배포 전 대비)
    return [];
  }

  const posts = await Promise.all(
    files
      .filter((f) => f.endsWith(".md") || f.endsWith(".mdx"))
      .map(async (f) => {
        const slug = f.replace(/\.(md|mdx)$/, "");
        const raw = await readFile(join(CONTENT_DIR, f), "utf-8");
        const { data, content } = matter(raw);

        const processed = await remark()
          .use(remarkGfm)
          .use(remarkHtml, { sanitize: false })
          .process(content);

        const stats = readingTime(content);

        return {
          slug,
          title: String(data.title ?? "(제목 없음)"),
          date: String(data.date ?? new Date().toISOString().slice(0, 10)),
          excerpt: String(data.excerpt ?? ""),
          cover: data.cover ?? null,
          tags: Array.isArray(data.tags) ? data.tags : [],
          locale: (data.locale as "ko" | "en") ?? "ko",
          author: data.author ?? "Sooly",
          draft: Boolean(data.draft),
          readingMinutes: Math.max(1, Math.round(stats.minutes)),
          html: String(processed),
        } satisfies Post;
      }),
  );

  const isProd = process.env.NODE_ENV === "production";
  return posts
    .filter((p) => !isProd || !p.draft)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export async function getAllPosts(): Promise<PostMeta[]> {
  const posts = await readAllRawPosts();
  // 리스트에선 html 빼고 메타만
  return posts.map(({ html: _html, ...meta }) => meta);
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const posts = await readAllRawPosts();
  return posts.find((p) => p.slug === slug) ?? null;
}
