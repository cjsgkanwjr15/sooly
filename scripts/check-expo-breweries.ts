/**
 * Sooly · 막걸리 엑스포 2026 글의 5양조장 DB 등재 확인 (read-only)
 *
 * 글에 내부 링크 (/breweries/{id}, /products/{id}) 박을 수 있나 확인용.
 *
 * 실행:
 *   cd scripts && npx tsx check-expo-breweries.ts
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

const BREWERY_NAMES = [
  "민주술도가",
  "배구양조장",
  "봄내양조장",
  "장안양조장",
  "중원당",
];

const PRODUCT_HINTS: Record<string, string[]> = {
  "민주술도가": ["콘체르토", "독립군"],
  "배구양조장": ["배씨"],
  "봄내양조장": ["열수", "한강", "유자"],
  "장안양조장": ["장안누룩", "장안"],
  "중원당": ["청명주"],
};

async function main() {
  for (const n of BREWERY_NAMES) {
    console.log(`\n[${n}]`);

    const { data: bs, error: bErr } = await sb
      .from("breweries")
      .select("id, name_ko, name_en, region, address, website, instagram, story_ko, is_visiting_brewery")
      .ilike("name_ko", `%${n}%`);

    if (bErr) {
      console.log(`  ! error: ${bErr.message}`);
      continue;
    }

    if (!bs || bs.length === 0) {
      console.log("  → DB 등재 없음");
    } else {
      for (const b of bs) {
        console.log(`  ✓ ${b.name_ko} (${b.region ?? "-"})  id=${b.id}`);
        if (b.name_en) console.log(`    name_en: ${b.name_en}`);
        if (b.website) console.log(`    website: ${b.website}`);
        if (b.instagram) console.log(`    instagram: ${b.instagram}`);
        if (b.is_visiting_brewery) console.log(`    찾아가는 양조장 ✓`);
        if (b.story_ko) console.log(`    story_ko: ${b.story_ko.slice(0, 100)}...`);

        const { data: ps } = await sb
          .from("products")
          .select("id, name_ko, name_en, category, abv, volume_ml")
          .eq("brewery_id", b.id);
        if (ps && ps.length > 0) {
          for (const p of ps) {
            const flag = (PRODUCT_HINTS[n] ?? []).some((h) => p.name_ko.includes(h)) ? " ★" : "";
            console.log(`    - ${p.name_ko} (${p.category ?? "-"}, ${p.abv ?? "-"}°, ${p.volume_ml ?? "-"}ml) id=${p.id}${flag}`);
          }
        } else {
          console.log("    (no products in DB)");
        }
      }
    }

    // 양조장명으로 못 잡혔어도 제품 힌트로 한 번 더
    const hints = PRODUCT_HINTS[n] ?? [];
    for (const h of hints) {
      const { data: ps2 } = await sb
        .from("products")
        .select("id, name_ko, brewery_id, abv, category")
        .ilike("name_ko", `%${h}%`)
        .limit(5);
      if (ps2 && ps2.length > 0) {
        const matchedNew = ps2.filter((p) => !(bs ?? []).some((b) => b.id === p.brewery_id));
        if (matchedNew.length > 0) {
          console.log(`  · 제품명 "${h}" 힌트로 추가 매칭:`);
          for (const p of matchedNew) {
            console.log(`    - ${p.name_ko} (${p.category ?? "-"}, ${p.abv ?? "-"}°) brewery_id=${p.brewery_id}`);
          }
        }
      }
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
