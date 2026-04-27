/**
 * Sooly · AI 한/영 번역 + 한글 리라이팅 (Gemini)
 *
 * 더술닷컴 raw "제품소개" 텍스트를 input 으로 Gemini 가:
 *   1. 정제된 한글 tasting_notes_ko (저작권 회피 — CLAUDE.md §8)
 *   2. 영문 tasting_notes_en (mid-formal, Vivino/Untappd 톤)
 *   3. 영문 product name (음역 + 카테고리 hint, 예: "Hwarang Cheongju")
 *   4. 영문 brewery name (음역)
 *
 * Usage:
 *   cd scripts && npm install
 *   npm run translate:sample    # 5개 dry-run 으로 톤 검증
 *   npm run translate:dry       # 전체 dry-run (DB write 없음)
 *   npm run translate           # 실전 (DB write)
 *
 * Flags:
 *   --sample N    처음 N 개 row 만 처리
 *   --dry-run     DB write 안 함, 콘솔 출력만
 *   --force       이미 _en 채워진 row 도 재번역 (default: skip)
 *
 * Resume: 이미 name_en + tasting_notes_en 다 채워진 product 는 자동 skip.
 *         중간에 끊겨도 다시 실행하면 남은 것부터 이어감 (--force 없을 때).
 */

import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { config as dotenvConfig } from "dotenv";
import { read, utils as xlsxUtils } from "xlsx";
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
const XLSX_PATH = resolve(__dirname, "data/sool_products_all.xlsx");

// ---------- args ----------
const argv = process.argv.slice(2);
const DRY_RUN = argv.includes("--dry-run");
const FORCE = argv.includes("--force");
const sampleIdx = argv.indexOf("--sample");
const SAMPLE_N =
  sampleIdx >= 0 && argv[sampleIdx + 1] ? Number(argv[sampleIdx + 1]) : null;

// ---------- types ----------
interface RawRow {
  제품명?: string;
  종류?: string;
  원재료?: string;
  알콜도수?: string;
  용량?: string;
  제품소개?: string;
  어울리는음식?: string;
  양조장명?: string;
  주소?: string;
  상세페이지URL?: string;
}

interface TranslationOut {
  name_en: string;
  brewery_name_en: string;
  tasting_notes_ko: string;
  tasting_notes_en: string;
}

// ---------- prompt ----------
const SYSTEM_INSTRUCTION = `You are a bilingual editor for Sooly, a Korean alcohol catalog (think Vivino/Untappd, but for makgeolli, cheongju, soju, traditional spirits).

Your job — given a product's metadata and a raw Korean description from a public catalog, produce:
1. A clean Korean tasting note (tasting_notes_ko) — 2-3 sentences, naturally rewritten so it does NOT copy the original phrasing. Pull facts (ingredients, ABV, brewing style, flavor) but rewrite. Editorial tone. No marketing fluff.
2. An English translation of that note (tasting_notes_en) — 2-3 sentences, mid-formal, the same content but for an international reader who may not know Korean alcohol categories. Briefly hint at category (e.g., "an unfiltered rice wine") if it helps.
3. English product name (name_en) — Revised Romanization of Korean transliteration with a category hint when natural. Examples: "Hwarang Cheongju", "Hae 10 Plus Makgeolli", "Hwayo X.Premium Soju". Capitalize properly. Do NOT translate proper nouns into English meanings.
4. English brewery name (brewery_name_en) — Revised Romanization. Examples: "Hwayo Brewery", "Boksoondoga", "Haechang".

Constraints:
- Never invent facts not present in the input.
- If the raw description is empty or generic, write a minimal but honest note from the metadata (category, ABV, brewery name).
- Keep tasting_notes_ko under 250 chars, tasting_notes_en under 350 chars.
- For unfamiliar Korean ingredients (예: 누룩, 감초), use the romanized term + brief gloss. e.g., "nuruk (a traditional Korean fermentation starter)".`;

function buildPrompt(row: RawRow): string {
  return [
    `Product name (KO): ${row.제품명 ?? ""}`,
    `Brewery (KO): ${row.양조장명 ?? ""}`,
    `Category: ${row.종류 ?? ""}`,
    `ABV: ${row.알콜도수 ?? ""}`,
    `Volume: ${row.용량 ?? ""}`,
    `Ingredients (KO): ${row.원재료 ?? ""}`,
    `Pairing (KO): ${row.어울리는음식 ?? ""}`,
    `Raw description (KO, from public catalog — do NOT copy verbatim):`,
    row.제품소개?.trim() || "(no description provided)",
  ].join("\n");
}

// ---------- gemini ----------
// Primary 가 503 (capacity spike) 던지면 다음 모델로 자동 fallback.
// 톤·품질은 셋 다 비슷 (한국어 → 영어 번역 수준 충분).
const MODELS = [
  process.env.GEMINI_MODEL ?? "gemini-2.5-flash",
  "gemini-2.5-flash-lite",
  "gemini-2.0-flash",
];

async function translateOne(
  ai: GoogleGenAI,
  row: RawRow,
  model: string,
): Promise<TranslationOut> {
  const response = await ai.models.generateContent({
    model,
    contents: buildPrompt(row),
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name_en: { type: Type.STRING },
          brewery_name_en: { type: Type.STRING },
          tasting_notes_ko: { type: Type.STRING },
          tasting_notes_en: { type: Type.STRING },
        },
        required: [
          "name_en",
          "brewery_name_en",
          "tasting_notes_ko",
          "tasting_notes_en",
        ],
      },
    },
  });
  const text = response.text;
  if (!text) throw new Error("empty response from Gemini");
  return JSON.parse(text) as TranslationOut;
}

/**
 * Primary 모델 → fallback 모델 순으로 시도. 각 모델당 transient 에러면 backoff 후
 * 다음 모델. 모든 모델 다 transient 면 마지막 에러 throw.
 *
 * 503 ("high demand") 는 Gemini 글로벌 capacity 문제 — 같은 모델 retry 보다
 * 다른 모델로 바로 넘어가는 게 통과율 높음. Lite·2.0 은 capacity 더 안정적.
 */
async function translateWithFallback(
  ai: GoogleGenAI,
  row: RawRow,
): Promise<TranslationOut> {
  let lastErr: unknown;
  for (let i = 0; i < MODELS.length; i++) {
    const model = MODELS[i];
    try {
      const result = await translateOne(ai, row, model);
      if (i > 0) {
        console.log(`  ✓ via fallback model: ${model}`);
      }
      return result;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      const transient =
        /503|UNAVAILABLE|overloaded|high demand|429|RESOURCE_EXHAUSTED|quota/i.test(
          msg,
        );
      if (!transient) throw err;
      lastErr = err;
      // 다음 모델 가기 전 짧은 대기 (capacity 회복 시간)
      if (i < MODELS.length - 1) {
        await sleep(800);
      }
    }
  }
  throw lastErr instanceof Error
    ? lastErr
    : new Error("all models exhausted");
}

// ---------- xlsx ----------
function readXlsxRows(path: string): RawRow[] {
  const buf = readFileSync(path);
  const wb = read(buf, { type: "buffer" });
  const sheet = wb.Sheets[wb.SheetNames[0]];
  return xlsxUtils.sheet_to_json<RawRow>(sheet, { defval: "" });
}

// ---------- DB ----------
type ProductRow = {
  id: string;
  name_en: string | null;
  tasting_notes_en: string | null;
};

async function findProduct(
  sb: SupabaseClient,
  sourceUrl: string,
): Promise<ProductRow | null> {
  const { data, error } = await sb
    .from("products")
    .select("id, name_en, tasting_notes_en")
    .eq("source_url", sourceUrl)
    .maybeSingle();
  if (error) {
    console.warn(`[db] findProduct error for ${sourceUrl}: ${error.message}`);
    return null;
  }
  return data;
}

async function updateProduct(
  sb: SupabaseClient,
  id: string,
  t: TranslationOut,
): Promise<void> {
  const { error } = await sb
    .from("products")
    .update({
      name_en: t.name_en,
      tasting_notes_ko: t.tasting_notes_ko,
      tasting_notes_en: t.tasting_notes_en,
    })
    .eq("id", id);
  if (error) throw new Error(`product update failed: ${error.message}`);
}

async function updateBreweryName(
  sb: SupabaseClient,
  nameKo: string,
  nameEn: string,
): Promise<void> {
  // 이미 name_en 채워져 있으면 skip (FORCE 일 때만 overwrite)
  const { data } = await sb
    .from("breweries")
    .select("id, name_en")
    .eq("name_ko", nameKo)
    .maybeSingle();
  if (!data) return;
  if (!FORCE && data.name_en) return;
  const { error } = await sb
    .from("breweries")
    .update({ name_en: nameEn })
    .eq("id", data.id);
  if (error) {
    console.warn(`[db] brewery update failed for ${nameKo}: ${error.message}`);
  }
}

// ---------- main ----------
function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
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

  const allRows = readXlsxRows(XLSX_PATH).filter((r) => r.제품명?.trim());
  const rows = SAMPLE_N != null ? allRows.slice(0, SAMPLE_N) : allRows;

  console.log(`xlsx: ${allRows.length} rows total → processing ${rows.length}`);

  let success = 0;
  let skipped = 0;
  let failed = 0;
  const start = Date.now();

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const tag = `[${i + 1}/${rows.length}] ${row.제품명}`;
    const sourceUrl = row.상세페이지URL?.trim();
    if (!sourceUrl) {
      console.log(`${tag} — skip (no source_url)`);
      skipped++;
      continue;
    }

    // 기존 DB row 확인 (resume / skip 판단)
    const existing = await findProduct(sb, sourceUrl);
    if (!existing) {
      console.log(`${tag} — skip (DB 에 해당 row 없음)`);
      skipped++;
      continue;
    }
    if (!FORCE && existing.name_en && existing.tasting_notes_en) {
      skipped++;
      continue;
    }

    try {
      const t = await translateWithFallback(ai, row);

      if (DRY_RUN) {
        console.log(`${tag}`);
        console.log(`  name_en:  ${t.name_en}`);
        console.log(`  brewery:  ${t.brewery_name_en}`);
        console.log(`  ko:       ${t.tasting_notes_ko}`);
        console.log(`  en:       ${t.tasting_notes_en}`);
        console.log("");
      } else {
        await updateProduct(sb, existing.id, t);
        if (row.양조장명?.trim() && t.brewery_name_en) {
          await updateBreweryName(sb, row.양조장명.trim(), t.brewery_name_en);
        }
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

    // rate limit guard — Gemini Flash 의 RPM 한도 안에서 안전
    await sleep(150);
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
