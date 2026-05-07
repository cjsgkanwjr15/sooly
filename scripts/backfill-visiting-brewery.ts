/**
 * Sooly · 찾아가는 양조장 (visiting brewery) flag 백필
 *
 * 더술닷컴 visitingBrewery/M000000072/mapList.do 페이지 1~10 (2026-05-08 시점) 에서
 * 수집한 양조장 39곳을 DB 의 `breweries.name_ko` 와 매칭해 `is_visiting_brewery=true`
 * update.
 *
 * Import 시점에 이 flag 가 채워지지 않아 홈 Featured Brewery 가 통째로 사라지던 이슈
 * 해소 + outreach cohort 점수화 정확도 ↑.
 *
 * 매칭 전략 (ambiguous 회피):
 *   1. 정확 일치 (name_ko = ?)
 *   2. 괄호 제거 후 ILIKE
 *   3. 핵심 토큰 (3자 이상) 한 개라도 unique match 면 채택
 *   4. 매칭 안 되거나 multiple match → unmatched 목록에 출력 (수동 확인용)
 *
 * 실행:
 *   cd scripts && tsx backfill-visiting-brewery.ts --dry-run    # 매칭만 출력
 *   cd scripts && tsx backfill-visiting-brewery.ts              # 실전 (DB write)
 *
 * 새 페이지에서 양조장 더 발견하면 VISITING_BREWERIES 배열 추가 후 재실행.
 * `is_visiting_brewery=true` 인 row 는 skip (재실행 안전).
 */

import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { existsSync } from "node:fs";
import { config as dotenvConfig } from "dotenv";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const webEnv = resolve(__dirname, "../web/.env.local");
const localEnv = resolve(__dirname, ".env");
if (existsSync(webEnv)) dotenvConfig({ path: webEnv });
if (existsSync(localEnv)) dotenvConfig({ path: localEnv, override: true });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SERVICE_ROLE) {
  throw new Error("missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
}

const DRY_RUN = process.argv.includes("--dry-run");
const sb = createClient(SUPABASE_URL, SERVICE_ROLE);

// 더술닷컴 visitingBrewery 페이지 1~10 (2026-05-08) 에서 수집한 unique 양조장.
// 추가 페이지에서 더 발견되면 여기 추가.
const VISITING_BREWERIES: string[] = [
  "해창주조장",
  "농업회사법인 ㈜한국애플리즈",
  "도란원",
  "우리술",
  "좋은술",
  "컨츄리와이너리",
  "지리산운봉주조영농조합",
  "장희도가",
  "술빚는 전가네",
  "그린영농조합",
  "농업회사법인(주)두레양조",
  "금정산성토산주",
  "명인안동소주",
  "시나브로 와이너리(불휘농장)",
  "(농)(주) 우창(두루미양조장)",
  "울진술도가",
  "농업회사법인(주)청산녹수",
  "산막와이너리",
  "제주샘주",
  "예술주조",
  "금풍양조",
  "양촌와이너리",
  "밀과노닐다",
  "대강양조장",
  "태인합동주조장",
  "농업회사법인 주식회사 지시울",
  "덕유양조",
  "대대로영농조합법인",
  "농업회사법인 (주)신선",
  "신평양조장",
  "인천탁주",
  "이원양조장",
  "맑은내일",
  "연미정 와이너리",
  "수도산와이너리",
  "고도리 와이너리",
  "다도참주가",
  "복순도가",
  "한국와인",
];

interface BreweryRow {
  id: string;
  name_ko: string;
  is_visiting_brewery: boolean | null;
}

/**
 * 단계별로 매칭 시도. 한 단계에서 unique match 면 즉시 반환.
 * Multiple match → null 반환 + ambiguous 로깅.
 */
async function findBrewery(
  client: SupabaseClient,
  rawName: string,
): Promise<{ row: BreweryRow; via: string } | null> {
  // 1. 정확 일치
  const { data: exact } = await client
    .from("breweries")
    .select("id, name_ko, is_visiting_brewery")
    .eq("name_ko", rawName)
    .maybeSingle<BreweryRow>();
  if (exact) return { row: exact, via: "exact" };

  // 2. 괄호 + 영문 약자 제거 후 정확 일치 시도
  const cleaned = rawName
    .replace(/\(.*?\)/g, "")
    .replace(/㈜/g, "")
    .replace(/주식회사|농업회사법인|영농조합법인|영농조합|법인/g, "")
    .replace(/\s+/g, " ")
    .trim();

  if (cleaned && cleaned !== rawName) {
    const { data: cleanedExact } = await client
      .from("breweries")
      .select("id, name_ko, is_visiting_brewery")
      .eq("name_ko", cleaned)
      .maybeSingle<BreweryRow>();
    if (cleanedExact) return { row: cleanedExact, via: `cleaned-exact (${cleaned})` };

    // 3. cleaned 로 ILIKE substring 매칭 (양방향)
    const { data: ilikeMatches } = await client
      .from("breweries")
      .select("id, name_ko, is_visiting_brewery")
      .or(`name_ko.ilike.%${cleaned}%,name_ko.eq.${cleaned}`)
      .limit(5)
      .returns<BreweryRow[]>();
    if (ilikeMatches && ilikeMatches.length === 1) {
      return { row: ilikeMatches[0], via: `ilike (${cleaned})` };
    }
    if (ilikeMatches && ilikeMatches.length > 1) {
      console.log(
        `  ambiguous "${rawName}" → ${ilikeMatches.length} ILIKE matches: ${ilikeMatches.map((m) => m.name_ko).join(", ")}`,
      );
      return null;
    }
  }

  // 4. 핵심 토큰 (3자 이상) 별로 unique match 시도
  const tokens = (cleaned || rawName)
    .split(/\s+/)
    .filter((t) => t.length >= 3 && !/^\d+$/.test(t));
  for (const token of tokens) {
    const { data: tokenMatches } = await client
      .from("breweries")
      .select("id, name_ko, is_visiting_brewery")
      .ilike("name_ko", `%${token}%`)
      .limit(5)
      .returns<BreweryRow[]>();
    if (tokenMatches && tokenMatches.length === 1) {
      return { row: tokenMatches[0], via: `token (${token})` };
    }
    // multiple match 이면 다음 토큰 시도 (ambiguous 출력 X — 다른 토큰이 더 정확할 수도)
  }

  return null;
}

async function main() {
  console.log(
    `mode: ${DRY_RUN ? "DRY-RUN (no DB write)" : "REAL"} | targets: ${VISITING_BREWERIES.length} 양조장`,
  );
  console.log("");

  let updated = 0;
  let alreadyTrue = 0;
  let unmatched: string[] = [];

  for (const name of VISITING_BREWERIES) {
    const found = await findBrewery(sb, name);
    if (!found) {
      console.log(`✗ "${name}" — DB 매칭 실패`);
      unmatched.push(name);
      continue;
    }

    const { row, via } = found;

    if (row.is_visiting_brewery) {
      console.log(`= "${name}" → ${row.name_ko} [${via}] · 이미 true`);
      alreadyTrue++;
      continue;
    }

    if (DRY_RUN) {
      console.log(`→ "${name}" → ${row.name_ko} [${via}] · would set true`);
      updated++;
    } else {
      const { error } = await sb
        .from("breweries")
        .update({ is_visiting_brewery: true })
        .eq("id", row.id);
      if (error) {
        console.log(`✗ "${name}" → ${row.name_ko} · update 실패: ${error.message}`);
        continue;
      }
      console.log(`✓ "${name}" → ${row.name_ko} [${via}]`);
      updated++;
    }
  }

  console.log("");
  console.log(
    `결과: ${updated} ${DRY_RUN ? "would update" : "updated"} / ${alreadyTrue} 이미 true / ${unmatched.length} 매칭 실패`,
  );
  if (unmatched.length > 0) {
    console.log("");
    console.log("매칭 실패 (수동 확인 필요):");
    for (const n of unmatched) console.log(`  - "${n}"`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
