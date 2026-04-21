/**
 * Sooly · ETL skeleton — sool_products_all.xlsx → Supabase
 *
 * Usage:
 *   # 1) install deps (first time only)
 *   cd scripts && npm install
 *
 *   # 2) set env (reads from ../web/.env.local by default, or scripts/.env)
 *   #    NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 *
 *   # 3) dry-run first — prints mapping sample, writes nothing
 *   npm run import:products:dry
 *
 *   # 4) real import (service_role key, bypasses RLS)
 *   npm run import:products
 *
 * Design notes:
 * - breweries 는 양조장명 기준으로 먼저 업서트 → id 확보 후 products 연결.
 * - tasting_notes_ko 는 이 단계에서 *비움*. AI 리라이팅 단계에서 채움
 *   (더술닷컴 텍스트 저작권 회피, CLAUDE.md §8).
 * - image_url 도 비움. @vercel/og 플레이스홀더 fallback 사용.
 * - 수상내역 raw 텍스트는 일단 별도 표로 파싱하지 않고 주석으로만 보존.
 *   awards 테이블 정규화는 2번째 ETL 패스로 분리.
 */

import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { config as dotenvConfig } from "dotenv";
import { read, utils as xlsxUtils } from "xlsx";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// ---------- env loading ----------
const __dirname = dirname(fileURLToPath(import.meta.url));
const webEnvPath = resolve(__dirname, "../web/.env.local");
const localEnvPath = resolve(__dirname, ".env");
if (existsSync(webEnvPath)) dotenvConfig({ path: webEnvPath });
if (existsSync(localEnvPath)) dotenvConfig({ path: localEnvPath, override: true });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY;
const XLSX_PATH = resolve(__dirname, "data/sool_products_all.xlsx");

const DRY_RUN = process.argv.includes("--dry-run");

// ---------- types ----------
interface RawRow {
  productId?: string;
  제품명?: string;
  종류?: string;
  원재료?: string;
  알콜도수?: string;
  용량?: string;
  수상내역?: string;
  기타?: string;
  태그?: string;
  제품소개?: string;
  어울리는음식?: string;
  양조장명?: string;
  주소?: string;
  홈페이지?: string;
  문의?: string;
  이미지URL?: string;
  상세페이지URL?: string;
  parse_error?: string;
}

// ---------- parsers ----------
function parseAbv(raw?: string): number | null {
  if (!raw) return null;
  const match = raw.match(/([\d.]+)\s*%?/);
  return match ? Number(match[1]) : null;
}

function parseVolumeMl(raw?: string): number | null {
  if (!raw) return null;
  const t = raw.toLowerCase().replace(/\s/g, "");
  const lMatch = t.match(/([\d.]+)\s*l(?!$|b|[^a-z])/i);
  if (lMatch) return Math.round(Number(lMatch[1]) * 1000);
  const mlMatch = t.match(/([\d.]+)\s*ml/);
  if (mlMatch) return Math.round(Number(mlMatch[1]));
  return null;
}

function parseList(raw?: string): string[] {
  if (!raw) return [];
  return raw
    .split(/[,·\/、，]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function extractRegion(address?: string): string | null {
  if (!address) return null;
  // "서울특별시 …", "경기도 …", "전라남도 …" 등의 시도 단위 추출
  const match = address.match(
    /^(서울특별시|부산광역시|대구광역시|인천광역시|광주광역시|대전광역시|울산광역시|세종특별자치시|경기도|강원도|강원특별자치도|충청북도|충청남도|전라북도|전북특별자치도|전라남도|경상북도|경상남도|제주특별자치도)/,
  );
  return match ? match[1] : null;
}

function normalizeCategory(raw?: string): string | null {
  if (!raw) return null;
  // 더술닷컴 카테고리를 우리 스키마로 통일
  const t = raw.trim();
  if (/탁주|막걸리/.test(t)) return "탁주";
  if (/약주/.test(t)) return "약주";
  if (/청주/.test(t)) return "청주";
  if (/증류/.test(t) || /소주/.test(t)) return "증류주";
  if (/과실/.test(t) || /와인/.test(t)) return "과실주";
  if (/리큐|리큐르|기타주류/.test(t)) return "리큐르";
  return t; // 몰라도 일단 원문 보존
}

// ---------- transform ----------
interface BreweryUpsert {
  name_ko: string;
  region: string | null;
  address: string | null;
  website: string | null;
}

interface ProductUpsert {
  brewery_name: string | null; // FK 해석용 임시 필드
  name_ko: string;
  category: string | null;
  abv: number | null;
  volume_ml: number | null;
  ingredients: string[];
  pairing_suggestions: string[];
  source_url: string | null;
  // tasting_notes_ko: 의도적으로 비움 (저작권 — AI 리라이팅 단계에서 채움)
  // image_url: 의도적으로 비움 (플레이스홀더 사용)
}

function transformRow(row: RawRow): { brewery: BreweryUpsert | null; product: ProductUpsert | null } {
  if (!row.제품명) return { brewery: null, product: null };

  const breweryName = row.양조장명?.trim() || null;
  const brewery: BreweryUpsert | null = breweryName
    ? {
        name_ko: breweryName,
        region: extractRegion(row.주소),
        address: row.주소?.trim() || null,
        website: row.홈페이지?.trim() || null,
      }
    : null;

  const product: ProductUpsert = {
    brewery_name: breweryName,
    name_ko: row.제품명.trim(),
    category: normalizeCategory(row.종류),
    abv: parseAbv(row.알콜도수),
    volume_ml: parseVolumeMl(row.용량),
    ingredients: parseList(row.원재료),
    pairing_suggestions: parseList(row.어울리는음식),
    source_url: row.상세페이지URL?.trim() || null,
  };

  return { brewery, product };
}

// ---------- load ----------
function readXlsxRows(path: string): RawRow[] {
  const buf = readFileSync(path);
  const wb = read(buf, { type: "buffer" });
  const sheet = wb.Sheets[wb.SheetNames[0]];
  return xlsxUtils.sheet_to_json<RawRow>(sheet, { defval: "" });
}

// ---------- upsert (batched) ----------
async function upsertBreweries(
  sb: SupabaseClient,
  breweries: BreweryUpsert[],
): Promise<Map<string, string>> {
  // name_ko 기준으로 dedupe
  const byName = new Map<string, BreweryUpsert>();
  for (const b of breweries) {
    if (!byName.has(b.name_ko)) byName.set(b.name_ko, b);
  }
  const unique = [...byName.values()];
  console.log(`breweries: ${breweries.length} rows → ${unique.length} unique`);

  if (DRY_RUN) {
    console.log("  [dry-run] sample:", unique.slice(0, 3));
    return new Map();
  }

  const { data, error } = await sb
    .from("breweries")
    .upsert(unique, { onConflict: "name_ko", ignoreDuplicates: false })
    .select("id, name_ko");

  if (error) throw new Error(`breweries upsert failed: ${error.message}`);
  const idMap = new Map<string, string>();
  for (const row of data ?? []) idMap.set(row.name_ko, row.id);
  return idMap;
}

async function upsertProducts(
  sb: SupabaseClient,
  products: ProductUpsert[],
  breweryIdByName: Map<string, string>,
): Promise<void> {
  const payload = products.map((p) => ({
    name_ko: p.name_ko,
    category: p.category,
    abv: p.abv,
    volume_ml: p.volume_ml,
    ingredients: p.ingredients,
    pairing_suggestions: p.pairing_suggestions,
    source_url: p.source_url,
    brewery_id: p.brewery_name ? breweryIdByName.get(p.brewery_name) ?? null : null,
  }));

  console.log(`products: ${payload.length} rows`);

  if (DRY_RUN) {
    console.log("  [dry-run] sample:", payload.slice(0, 3));
    return;
  }

  // 충돌 키가 없으니(제품은 아직 unique 제약 없음) upsert 대신 insert.
  // 반복 import 필요해지면 스키마에 (brewery_id, name_ko) unique 추가.
  const chunkSize = 500;
  for (let i = 0; i < payload.length; i += chunkSize) {
    const chunk = payload.slice(i, i + chunkSize);
    const { error } = await sb.from("products").insert(chunk);
    if (error) throw new Error(`products insert failed at chunk ${i}: ${error.message}`);
    console.log(`  inserted ${Math.min(i + chunkSize, payload.length)} / ${payload.length}`);
  }
}

// ---------- main ----------
async function main() {
  console.log(`mode: ${DRY_RUN ? "DRY-RUN (no writes)" : "LIVE"}`);
  console.log(`xlsx: ${XLSX_PATH}`);

  if (!existsSync(XLSX_PATH)) {
    throw new Error(`xlsx not found: ${XLSX_PATH}`);
  }

  if (!DRY_RUN) {
    if (!SUPABASE_URL || !SERVICE_ROLE) {
      throw new Error(
        "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. " +
          "Set them in web/.env.local or scripts/.env",
      );
    }
  }

  const rows = readXlsxRows(XLSX_PATH);
  console.log(`read ${rows.length} rows from xlsx`);

  const breweries: BreweryUpsert[] = [];
  const products: ProductUpsert[] = [];
  let skipped = 0;

  for (const row of rows) {
    const { brewery, product } = transformRow(row);
    if (!product) {
      skipped++;
      continue;
    }
    if (brewery) breweries.push(brewery);
    products.push(product);
  }
  console.log(`transformed: ${products.length} products, skipped ${skipped}`);

  const sb =
    DRY_RUN
      ? (null as unknown as SupabaseClient)
      : createClient(SUPABASE_URL!, SERVICE_ROLE!, {
          auth: { persistSession: false, autoRefreshToken: false },
        });

  const breweryIdByName = await upsertBreweries(sb, breweries);
  await upsertProducts(sb, products, breweryIdByName);

  console.log(DRY_RUN ? "✓ dry-run complete — nothing written" : "✓ import complete");
}

main().catch((err) => {
  console.error("✗ import failed:", err);
  process.exit(1);
});
