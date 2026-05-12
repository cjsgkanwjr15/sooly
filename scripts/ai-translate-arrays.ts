/**
 * Sooly · AI 한/영 번역 — products.ingredients + pairing_suggestions
 *
 * 5-08 i18n 풀세트 후 남은 마지막 한국어 잔재. UI 라벨은 dictionary 로 풀었지만
 * DB 의 가변 array 텍스트(재료·페어링 음식)는 데이터 i18n 칼럼 분리 필요.
 *
 * 0009 마이그레이션: products.ingredients_en, products.pairing_suggestions_en 추가.
 *
 * Usage (scripts/ 디렉토리에서):
 *   npm run translate-arrays:sample   # 5개 dry-run, 톤 검증
 *   npm run translate-arrays:dry      # 전체 dry-run
 *   npm run translate-arrays          # 실전
 *
 * Flags:
 *   --sample N    처음 N 개 row 만
 *   --dry-run     DB write 안 함
 *   --force       이미 _en 채워진 row 도 재번역
 *
 * Resume: ingredients_en + pairing_suggestions_en 둘 다 채워진 row 자동 skip.
 *         (한쪽만 비어있으면 다시 처리 — Gemini 가 빈 쪽도 같이 채울 수 있음.)
 *
 * 톤 정책 (5-08 결정 + 카테고리·6축 영문 매핑과 일관):
 *   - 한국 고유 재료/음식 → Revised Romanization + 짧은 부연
 *     예: "누룩" → "Nuruk (traditional Korean fermentation starter)"
 *         "떡볶이" → "Tteokbokki (spicy rice cakes)"
 *   - 보편 재료/음식 → 영어
 *     예: "정제수" → "Purified water", "쌀" → "Rice", "치즈" → "Cheese"
 *   - 매 row 가 독립 → 매번 부연 (외국인 접근성 우선)
 */

import { existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { config as dotenvConfig } from "dotenv";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { GoogleGenAI, Type } from "@google/genai";

// ---------- env ----------
const __dirname = dirname(fileURLToPath(import.meta.url));
const webEnvPath = resolve(__dirname, "../web/.env.local");
const localEnvPath = resolve(__dirname, ".env");
if (existsSync(webEnvPath)) dotenvConfig({ path: webEnvPath });
if (existsSync(localEnvPath)) dotenvConfig({ path: localEnvPath, override: true });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY;
const GEMINI_KEY = process.env.GEMINI_API_KEY;

// ---------- args ----------
const argv = process.argv.slice(2);
const DRY_RUN = argv.includes("--dry-run");
const FORCE = argv.includes("--force");
const sampleIdx = argv.indexOf("--sample");
const SAMPLE_N =
  sampleIdx >= 0 && argv[sampleIdx + 1] ? Number(argv[sampleIdx + 1]) : null;

// ---------- types ----------
type ProductRow = {
  id: string;
  name_ko: string;
  name_en: string | null;
  category: string | null;
  ingredients: string[] | null;
  ingredients_en: string[] | null;
  pairing_suggestions: string[] | null;
  pairing_suggestions_en: string[] | null;
};

interface TranslationOut {
  ingredients_en: string[];
  pairing_suggestions_en: string[];
}

// ---------- prompt ----------
const SYSTEM_INSTRUCTION = `You are a bilingual editor for Sooly, a Korean alcohol catalog (think Vivino/Untappd, but for makgeolli, cheongju, soju, traditional spirits).

Your job — translate two Korean arrays for a single product into English: ingredients and food pairings.

Tone rules (consistent with site-wide convention):
1. Korean-specific ingredients/foods → Revised Romanization + a short parenthetical gloss.
   - "누룩" → "Nuruk (traditional Korean fermentation starter)"
   - "감초" → "Licorice root"
   - "떡볶이" → "Tteokbokki (spicy rice cakes)"
   - "삼겹살" → "Samgyeopsal (grilled pork belly)"
   - "전골" → "Jeongol (Korean-style hot pot)"
   - "회" → "Hoe (Korean-style sashimi)"
   - "파전" → "Pajeon (scallion pancake)"
2. Universal ingredients/foods → plain English.
   - "정제수" → "Water"  (do NOT translate as "Purified water" — keep it short)
   - "쌀" → "Rice"
   - "보리" → "Barley"
   - "치즈" → "Cheese"
   - "과일" → "Fruit"
3. Each entry stands alone — assume the reader has not seen prior entries. Repeat the parenthetical gloss every time it would help an international reader.
4. HARD CONSTRAINT: Preserve the exact count and order of entries — output array length MUST equal input array length. Translate each entry independently, position-by-position. Even if two or more entries appear duplicate or near-duplicate, output a translation for EACH — do NOT merge, dedupe, collapse, or skip. If you genuinely cannot tell two duplicates apart, repeat the same translation rather than drop one.

   Example of the trap to avoid:
     Input:  ["쌀(국내산)", "쌀(국내산이상)"]    (length 2 — two near-dup entries)
     RIGHT:  ["Rice (domestic)", "Rice (domestic, premium grade)"]    (length 2 ✓)
     WRONG:  ["Rice (domestic)"]                                       (length 1 — REJECTED)

5. If an input array is empty or null, output an empty array.
6. Do NOT invent entries not present in the input.
7. Translate parentheticals/footnotes when present (e.g., "쌀(국내산)" → "Rice (domestic)"). When a parenthetical distinguishes two near-duplicate entries, preserve that distinction in English — never drop information that makes two entries different.
8. Capitalize the first letter of each entry consistently.

Return JSON only, matching the response schema exactly.`;

function buildPrompt(p: ProductRow): string {
  return [
    `Product context (for disambiguation only, do not translate):`,
    `  Name: ${p.name_ko}${p.name_en ? ` / ${p.name_en}` : ""}`,
    `  Category: ${p.category ?? "(unknown)"}`,
    ``,
    `Ingredients (KO array): ${JSON.stringify(p.ingredients ?? [])}`,
    `Pairings (KO array): ${JSON.stringify(p.pairing_suggestions ?? [])}`,
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
  p: ProductRow,
  model: string,
  extraNudge?: string,
): Promise<TranslationOut> {
  const prompt = extraNudge
    ? `${buildPrompt(p)}\n\n${extraNudge}`
    : buildPrompt(p);
  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          ingredients_en: { type: Type.ARRAY, items: { type: Type.STRING } },
          pairing_suggestions_en: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
        },
        required: ["ingredients_en", "pairing_suggestions_en"],
      },
    },
  });
  const text = response.text;
  if (!text) throw new Error("empty response from Gemini");
  return JSON.parse(text) as TranslationOut;
}

function validateLengths(p: ProductRow, t: TranslationOut): string | null {
  const ingIn = p.ingredients?.length ?? 0;
  const pairIn = p.pairing_suggestions?.length ?? 0;
  if (t.ingredients_en.length !== ingIn) {
    return `ingredients length mismatch: ${ingIn} → ${t.ingredients_en.length}`;
  }
  if (t.pairing_suggestions_en.length !== pairIn) {
    return `pairings length mismatch: ${pairIn} → ${t.pairing_suggestions_en.length}`;
  }
  return null;
}

function lengthNudge(p: ProductRow): string {
  const ingN = p.ingredients?.length ?? 0;
  const pairN = p.pairing_suggestions?.length ?? 0;
  return [
    `IMPORTANT: Previous attempt collapsed duplicate entries. Output MUST contain:`,
    `  - ingredients_en: EXACTLY ${ingN} entries (one per input entry, in order)`,
    `  - pairing_suggestions_en: EXACTLY ${pairN} entries (one per input entry, in order)`,
    `If two input entries are identical or near-identical, output the same translation twice — do not merge.`,
    `Count your output array entries before responding.`,
  ].join("\n");
}

async function translateWithFallback(
  ai: GoogleGenAI,
  p: ProductRow,
): Promise<TranslationOut> {
  let lastErr: unknown;
  for (let i = 0; i < MODELS.length; i++) {
    const model = MODELS[i];
    try {
      // first attempt — no nudge
      let result = await translateOne(ai, p, model);
      let lenErr = validateLengths(p, result);

      // length-mismatch retry (1 attempt, same model, stronger nudge)
      if (lenErr) {
        await sleep(300);
        result = await translateOne(ai, p, model, lengthNudge(p));
        lenErr = validateLengths(p, result);
        if (lenErr) throw new Error(lenErr);
        if (i === 0) console.log(`  ✓ via length-mismatch retry`);
      }

      if (i > 0) console.log(`  ✓ via fallback model: ${model}`);
      return result;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      const transient =
        /503|UNAVAILABLE|overloaded|high demand|429|RESOURCE_EXHAUSTED|quota|fetch failed|ECONNRESET|ETIMEDOUT/i.test(
          msg,
        );
      const lengthErr = /length mismatch/i.test(msg);
      // length errors: retry next model (different model, different result)
      // transient: retry next model
      // other (parse, schema): bail out
      if (!transient && !lengthErr) throw err;
      lastErr = err;
      if (i < MODELS.length - 1) await sleep(800);
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error("all models exhausted");
}

// ---------- DB ----------
async function fetchProducts(sb: SupabaseClient): Promise<ProductRow[]> {
  // pagination 으로 전부 가져옴 (Supabase JS 기본 limit 1000 이지만 명시).
  const all: ProductRow[] = [];
  const PAGE = 1000;
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await sb
      .from("products")
      .select(
        "id, name_ko, name_en, category, ingredients, ingredients_en, pairing_suggestions, pairing_suggestions_en",
      )
      .order("id", { ascending: true })
      .range(from, from + PAGE - 1);
    if (error) throw new Error(`fetch products: ${error.message}`);
    if (!data || data.length === 0) break;
    all.push(...(data as ProductRow[]));
    if (data.length < PAGE) break;
  }
  return all;
}

async function updateProduct(
  sb: SupabaseClient,
  id: string,
  t: TranslationOut,
): Promise<void> {
  const { error } = await sb
    .from("products")
    .update({
      ingredients_en: t.ingredients_en,
      pairing_suggestions_en: t.pairing_suggestions_en,
    })
    .eq("id", id);
  if (error) throw new Error(`update failed: ${error.message}`);
}

// ---------- main ----------
function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function isEmpty(arr: string[] | null | undefined): boolean {
  return !arr || arr.length === 0;
}

function shouldSkip(p: ProductRow): boolean {
  if (FORCE) return false;
  // 양쪽 input 다 비었으면 번역할 게 없음 → skip
  if (isEmpty(p.ingredients) && isEmpty(p.pairing_suggestions)) return true;
  // ko 가 채워진 쪽이 모두 _en 으로 채워졌으면 skip
  const ingDone = isEmpty(p.ingredients) || !isEmpty(p.ingredients_en);
  const pairDone =
    isEmpty(p.pairing_suggestions) || !isEmpty(p.pairing_suggestions_en);
  return ingDone && pairDone;
}

async function main() {
  if (!SUPABASE_URL || !SERVICE_ROLE) {
    throw new Error(
      "missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY (web/.env.local 또는 scripts/.env)",
    );
  }
  if (!GEMINI_KEY) {
    throw new Error(
      "missing GEMINI_API_KEY (scripts/.env). 발급: https://aistudio.google.com/apikey",
    );
  }

  console.log(
    `mode: ${DRY_RUN ? "DRY-RUN (no DB write)" : "REAL"} | force: ${FORCE} | sample: ${SAMPLE_N ?? "all"} | models: ${MODELS.join(" → ")}`,
  );

  const sb = createClient(SUPABASE_URL, SERVICE_ROLE);
  const ai = new GoogleGenAI({ apiKey: GEMINI_KEY });

  const all = await fetchProducts(sb);
  const todo = all.filter((p) => !shouldSkip(p));
  const rows = SAMPLE_N != null ? todo.slice(0, SAMPLE_N) : todo;

  console.log(
    `db: ${all.length} products total, ${todo.length} need translation → processing ${rows.length}`,
  );

  let success = 0;
  let failed = 0;
  const start = Date.now();

  for (let i = 0; i < rows.length; i++) {
    const p = rows[i];
    const tag = `[${i + 1}/${rows.length}] ${p.name_ko}`;

    try {
      const t = await translateWithFallback(ai, p);

      const ingIn = p.ingredients?.length ?? 0;
      const pairIn = p.pairing_suggestions?.length ?? 0;

      if (DRY_RUN) {
        console.log(`${tag}`);
        if (ingIn > 0) {
          console.log(`  ingredients ko: ${JSON.stringify(p.ingredients)}`);
          console.log(`  ingredients en: ${JSON.stringify(t.ingredients_en)}`);
        }
        if (pairIn > 0) {
          console.log(`  pairings ko:    ${JSON.stringify(p.pairing_suggestions)}`);
          console.log(`  pairings en:    ${JSON.stringify(t.pairing_suggestions_en)}`);
        }
        console.log("");
      } else {
        await updateProduct(sb, p.id, t);
        if ((i + 1) % 25 === 0) {
          console.log(`${tag} — ✓ (${i + 1} done)`);
        }
      }
      success++;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`${tag} — fail: ${msg}`);
      failed++;
    }

    await sleep(150);
  }

  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  console.log(`\nDone in ${elapsed}s. success=${success} failed=${failed}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
