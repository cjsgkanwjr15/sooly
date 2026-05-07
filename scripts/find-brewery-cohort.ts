/**
 * Sooly · 양조장 cohort 추출 (Kim 직접 방문 후보 리스트)
 *
 * 첫 1~10번째 cohort 는 본인 발품 콘텐츠 자산. 이 스크립트는 점수화로
 * "방문 ROI 높은" 양조장을 위로 올림.
 *
 * 점수:
 *   + 10  찾아가는 양조장 (브랜드가 방문객 받을 준비 됨)
 *   + 5   인스타그램 있음 (사전 조사 가능 + 메시지 채널)
 *   + 3   웹사이트 있음
 *   + 3   스토리 50자 이상 (정보 충실)
 *   * 1   제품 수 (다양성)
 *
 * 다른 지역 cohort 는 REGION_PATTERNS 수정 후 재실행.
 *
 * 실행:
 *   cd scripts && tsx find-brewery-cohort.ts
 *
 * Read-only. DB write 없음.
 */

import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { existsSync } from "node:fs";
import { config as dotenvConfig } from "dotenv";
import { createClient } from "@supabase/supabase-js";

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

const sb = createClient(SUPABASE_URL, SERVICE_ROLE);

// 수도권 = 서울·경기·인천. region 칼럼이 "서울특별시", "경기도" 같은 풀네임일 수도 있어 ilike 로.
const REGION_PATTERNS = ["%서울%", "%경기%", "%인천%"];

interface Brewery {
  id: string;
  name_ko: string;
  region: string | null;
  address: string | null;
  website: string | null;
  instagram: string | null;
  story_ko: string | null;
  is_visiting_brewery: boolean;
}

async function main() {
  // 1) region ilike 로 수도권 양조장 다 가져옴
  const orFilter = REGION_PATTERNS.map((p) => `region.ilike.${p}`).join(",");
  const { data: bs, error } = await sb
    .from("breweries")
    .select(
      "id, name_ko, region, address, website, instagram, story_ko, is_visiting_brewery",
    )
    .or(orFilter);
  if (error) throw error;
  if (!bs || bs.length === 0) {
    console.log("수도권 양조장 0건. region 분포 확인 중...");
    const { data: all } = await sb.from("breweries").select("region");
    const map = new Map<string, number>();
    for (const r of all ?? []) {
      const k = r.region ?? "(null)";
      map.set(k, (map.get(k) ?? 0) + 1);
    }
    for (const [k, v] of [...map.entries()].sort((a, b) => b[1] - a[1])) {
      console.log(`  ${k}: ${v}`);
    }
    return;
  }

  // 2) 양조장별 제품 수 (한 번의 .in 쿼리로 N+1 회피)
  const ids = bs.map((b) => b.id);
  const { data: ps, error: pErr } = await sb
    .from("products")
    .select("brewery_id")
    .in("brewery_id", ids);
  if (pErr) throw pErr;
  const counts = new Map<string, number>();
  for (const p of ps ?? []) {
    counts.set(p.brewery_id, (counts.get(p.brewery_id) ?? 0) + 1);
  }

  // 3) 점수화
  const scored = bs.map((b: Brewery) => {
    const products = counts.get(b.id) ?? 0;
    const storyOk = !!(b.story_ko && b.story_ko.trim().length > 50);
    const score =
      (b.is_visiting_brewery ? 10 : 0) +
      (b.instagram ? 5 : 0) +
      (b.website ? 3 : 0) +
      (storyOk ? 3 : 0) +
      products;
    return { ...b, products, storyOk, score };
  });
  scored.sort((a, b) => b.score - a.score);

  // 4) 출력
  const visiting = scored.filter((s) => s.is_visiting_brewery).length;
  console.log("");
  console.log(
    `수도권 양조장 총 ${scored.length}곳 (찾아가는 양조장 ${visiting}곳 포함)`,
  );
  console.log("점수: visiting +10 / IG +5 / Web +3 / Story +3 / 제품수 +1each");
  console.log("=".repeat(80));
  console.log("");

  // 상위 20곳만 자세히
  const TOP = Math.min(20, scored.length);
  for (let i = 0; i < TOP; i++) {
    const b = scored[i];
    const tags = [
      b.is_visiting_brewery ? "🚌찾아가는" : "      ",
      b.instagram ? "📷IG" : "    ",
      b.website ? "🌐WEB" : "     ",
      b.storyOk ? "📖STORY" : "       ",
    ].join(" ");
    console.log(
      `[${String(i + 1).padStart(2, " ")}] ${String(b.score).padStart(3, " ")}점 · 제품 ${String(b.products).padStart(2, " ")}개 · ${b.region ?? "?"}`,
    );
    console.log(`     ${b.name_ko}  ${tags}`);
    if (b.address) console.log(`     📍 ${b.address}`);
    if (b.instagram) console.log(`     📷 ${b.instagram}`);
    if (b.website) console.log(`     🌐 ${b.website}`);
    console.log("");
  }

  if (scored.length > TOP) {
    console.log(`... (그 외 ${scored.length - TOP}곳 생략)`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
