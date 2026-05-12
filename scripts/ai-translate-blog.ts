/**
 * Sooly · AI 한/영 번역 — 블로그 글 ({slug}.ko.md → {slug}.en.md)
 *
 * 5-01 의 fallback 배너 ("이 글은 영어로만 작성") 자연 해소용 인프라.
 * 양조장 방문기 시리즈 시작 전 도입. Kim 이 한국어 글 한 편 쓰면 자동으로
 * 영문판 생성 → 외국인도 동시에 읽을 수 있음.
 *
 * Usage (scripts/ 디렉토리에서):
 *   npm run translate-blog                       # 모든 .ko.md 중 .en.md 없는 것
 *   npm run translate-blog -- --slug welcome     # 특정 slug 한 편만
 *   npm run translate-blog -- --dry-run          # 콘솔 출력만, 파일 write 안 함
 *   npm run translate-blog -- --force            # 이미 있는 .en.md 덮어쓰기
 *
 * 톤 정책 (사이트 i18n 정책과 일관):
 *   - 한국 고유 어휘 → Revised Romanization + 첫 등장 시 짧은 부연
 *     예: 막걸리 → "makgeolli (a milky, lightly fizzy rice wine)" → "makgeolli"
 *   - 보편 개념은 영어. URL·코드·이미지 path 그대로 보존.
 *   - title 은 자연스러운 의역 OK (literal 번역 X).
 *   - tags 는 slug 스타일 (lowercase, hyphen).
 *
 * Resume: {slug}.en.md 존재 시 skip (--force 로 덮어쓰기).
 */

import { readFile, readdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { config as dotenvConfig } from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import matter from "gray-matter";

// ---------- env ----------
const __dirname = dirname(fileURLToPath(import.meta.url));
const webEnvPath = resolve(__dirname, "../web/.env.local");
const localEnvPath = resolve(__dirname, ".env");
if (existsSync(webEnvPath)) dotenvConfig({ path: webEnvPath });
if (existsSync(localEnvPath)) dotenvConfig({ path: localEnvPath, override: true });

const GEMINI_KEY = process.env.GEMINI_API_KEY;
const CONTENT_DIR = resolve(__dirname, "../content/blog");

// ---------- args ----------
const argv = process.argv.slice(2);
const DRY_RUN = argv.includes("--dry-run");
const FORCE = argv.includes("--force");
const slugIdx = argv.indexOf("--slug");
const ONLY_SLUG = slugIdx >= 0 && argv[slugIdx + 1] ? argv[slugIdx + 1] : null;

// ---------- types ----------
type KoFrontmatter = {
  title: string;
  date?: string;
  excerpt?: string;
  tags?: string[];
  cover?: string | null;
  author?: string;
  draft?: boolean;
};

interface TranslationOut {
  title: string;
  excerpt: string;
  tags: string[];
  body: string;
}

// ---------- prompt ----------
const SYSTEM_INSTRUCTION = `You are a professional translator for Sooly, a Korean alcohol catalog (similar to Vivino for wine, Untappd for beer).

Translate Korean blog content to English while keeping it natural, editorial, and warm. Like Vivino's content team.

== Markdown structure rules ==
1. Preserve markdown structure EXACTLY: headers (## / ###), bold (**), italic (*), links ([text](url)), lists (- or 1.), blockquotes (>), horizontal rules (---), inline code (\`).
2. URLs unchanged — translate only the link text inside [...].
3. Preserve line breaks and paragraph spacing.
4. If the source has line wrapping (paragraphs broken by manual line breaks for readability), the output may use natural English wrapping — readability comes first.
5. Do not add or remove sections.

== Korean-specific term policy ==
First mention: Revised Romanization + a short parenthetical gloss.
After first mention: just the romanized term.

  - 막걸리 → "makgeolli (a milky, lightly fizzy rice wine)" → "makgeolli"
  - 청주 → "cheongju (clear filtered rice wine)" → "cheongju"
  - 약주 → "yakju (refined rice wine)"
  - 소주 → "soju"
  - 증류식 소주 → "distilled soju"
  - 과실주 → "fruit wine"
  - 전통주 → "jeontongju (traditional Korean alcohol)" → "jeontongju"
  - 누룩 → "nuruk (traditional Korean fermentation starter)" → "nuruk"
  - 양조장 → "brewery" (use plain English in most contexts)

For Korean food/places without standard romanization: use Revised Romanization + a short gloss.
For universal concepts: plain English.

== Frontmatter ==
- title: natural rephrasing OK — capture the meaning, not literal word-for-word. Editorial hook tone.
- excerpt: 1-2 sentences. Hook the reader. Conveys the same idea as the Korean excerpt.
- tags: slug style (lowercase, hyphen-separated, no spaces). Translate Korean tags to English equivalents. Examples: "전통주" → "korean-alcohol", "소개" → "introduction", "막걸리" → "makgeolli". Brand names ("sooly") stay as-is.

Return JSON only, matching the response schema exactly. The body must be the entire translated markdown body (no frontmatter).`;

function buildPrompt(fm: KoFrontmatter, body: string): string {
  return [
    `== Frontmatter (KO, to translate) ==`,
    `title: ${fm.title}`,
    `excerpt: ${fm.excerpt ?? ""}`,
    `tags: ${JSON.stringify(fm.tags ?? [])}`,
    ``,
    `== Body (KO markdown, to translate while preserving structure) ==`,
    body,
  ].join("\n");
}

// ---------- gemini ----------
const MODELS = [
  process.env.GEMINI_MODEL ?? "gemini-2.5-flash",
  "gemini-2.5-flash-lite",
  "gemini-1.5-flash",
];

async function translateOne(
  ai: GoogleGenAI,
  fm: KoFrontmatter,
  body: string,
  model: string,
): Promise<TranslationOut> {
  const response = await ai.models.generateContent({
    model,
    contents: buildPrompt(fm, body),
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          excerpt: { type: Type.STRING },
          tags: { type: Type.ARRAY, items: { type: Type.STRING } },
          body: { type: Type.STRING },
        },
        required: ["title", "excerpt", "tags", "body"],
      },
    },
  });
  const text = response.text;
  if (!text) throw new Error("empty response from Gemini");
  return JSON.parse(text) as TranslationOut;
}

async function translateWithFallback(
  ai: GoogleGenAI,
  fm: KoFrontmatter,
  body: string,
): Promise<TranslationOut> {
  let lastErr: unknown;
  for (let i = 0; i < MODELS.length; i++) {
    const model = MODELS[i];
    try {
      const result = await translateOne(ai, fm, body, model);
      if (i > 0) console.log(`  ✓ via fallback model: ${model}`);
      return result;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      const transient =
        /503|UNAVAILABLE|overloaded|high demand|429|RESOURCE_EXHAUSTED|quota/i.test(
          msg,
        );
      if (!transient) throw err;
      lastErr = err;
      if (i < MODELS.length - 1) await sleep(800);
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error("all models exhausted");
}

// ---------- file IO ----------
function parseFilename(filename: string): { slug: string; locale: "ko" | "en" } | null {
  const match = filename.match(/^(.+)\.(ko|en)\.(md|mdx)$/);
  if (!match) return null;
  return { slug: match[1], locale: match[2] as "ko" | "en" };
}

async function listKoSlugs(): Promise<string[]> {
  const files = await readdir(CONTENT_DIR);
  const slugs = new Set<string>();
  for (const f of files) {
    const parsed = parseFilename(f);
    if (parsed?.locale === "ko") slugs.add(parsed.slug);
  }
  return Array.from(slugs).sort();
}

function buildEnFile(
  fm: KoFrontmatter,
  out: TranslationOut,
): string {
  // 새 frontmatter 구성 — locale 만 en 으로, 나머지 메타는 ko 와 동일.
  // (date·cover·author 는 언어 독립적 메타데이터)
  const newFm = {
    title: out.title,
    date: fm.date,
    excerpt: out.excerpt,
    tags: out.tags,
    locale: "en",
    author: fm.author ?? "Sooly",
    cover: fm.cover ?? null,
    ...(fm.draft != null ? { draft: fm.draft } : {}),
  };
  return matter.stringify(out.body, newFm);
}

// ---------- main ----------
function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function processSlug(
  ai: GoogleGenAI,
  slug: string,
): Promise<"success" | "skipped" | "failed"> {
  const koPath = join(CONTENT_DIR, `${slug}.ko.md`);
  const enPath = join(CONTENT_DIR, `${slug}.en.md`);

  if (existsSync(enPath) && !FORCE) {
    console.log(`[${slug}] skip (en exists; use --force to overwrite)`);
    return "skipped";
  }

  const raw = await readFile(koPath, "utf-8");
  const { data, content } = matter(raw);
  const fm = data as KoFrontmatter;

  console.log(`[${slug}] translating (${content.length} chars body)...`);

  try {
    const out = await translateWithFallback(ai, fm, content);

    if (DRY_RUN) {
      console.log(`\n--- [${slug}.en.md] preview ---`);
      console.log(buildEnFile(fm, out));
      console.log(`--- end preview ---\n`);
    } else {
      const fileText = buildEnFile(fm, out);
      await writeFile(enPath, fileText, "utf-8");
      console.log(`[${slug}] ✓ wrote ${enPath}`);
    }
    return "success";
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[${slug}] fail: ${msg}`);
    return "failed";
  }
}

async function main() {
  if (!GEMINI_KEY) {
    throw new Error(
      "missing GEMINI_API_KEY (scripts/.env). 발급: https://aistudio.google.com/apikey",
    );
  }

  console.log(
    `mode: ${DRY_RUN ? "DRY-RUN" : "REAL"} | force: ${FORCE} | slug: ${ONLY_SLUG ?? "all"} | models: ${MODELS.join(" → ")}`,
  );

  const ai = new GoogleGenAI({ apiKey: GEMINI_KEY });

  const allSlugs = await listKoSlugs();
  const slugs = ONLY_SLUG ? allSlugs.filter((s) => s === ONLY_SLUG) : allSlugs;

  if (ONLY_SLUG && slugs.length === 0) {
    throw new Error(
      `no .ko.md found for slug '${ONLY_SLUG}'. available: ${allSlugs.join(", ") || "(none)"}`,
    );
  }

  console.log(`found ${allSlugs.length} ko slug(s) → processing ${slugs.length}`);

  let success = 0;
  let skipped = 0;
  let failed = 0;
  const start = Date.now();

  for (const slug of slugs) {
    const result = await processSlug(ai, slug);
    if (result === "success") success++;
    else if (result === "skipped") skipped++;
    else failed++;
    await sleep(200);
  }

  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  console.log(
    `\nDone in ${elapsed}s. success=${success} skipped=${skipped} failed=${failed}`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
