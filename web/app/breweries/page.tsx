import Link from "next/link";
import type { Metadata } from "next";
import { supabaseServer } from "@/lib/supabase/server";
import { BreweriesFilter } from "@/components/breweries-filter";
import { Pagination } from "@/components/pagination";

export const metadata: Metadata = {
  title: "양조장",
  description: "한국 전통주 양조장 431곳을 지역별로 둘러보세요.",
};

type SearchParams = { region?: string; q?: string; page?: string };

type BreweryListItem = {
  id: string;
  name_ko: string;
  region: string | null;
  address: string | null;
  is_visiting_brewery: boolean | null;
};

const PAGE_SIZE = 60;

export default async function BreweriesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const { region, q } = sp;
  const page = Math.max(1, Number(sp.page ?? 1) || 1);
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const sb = await supabaseServer();

  // 전체 region 목록 (필터 옵션용)
  const { data: regionRows } = await sb
    .from("breweries")
    .select("region")
    .not("region", "is", null);
  const regions = [...new Set((regionRows ?? []).map((r) => r.region as string))].sort();

  let query = sb
    .from("breweries")
    .select("id, name_ko, region, address, is_visiting_brewery", { count: "exact" })
    .order("name_ko", { ascending: true })
    .range(from, to);

  if (region) query = query.eq("region", region);
  if (q) query = query.ilike("name_ko", `%${q}%`);

  const { data: breweries, error, count } = await query.returns<BreweryListItem[]>();

  // 각 양조장의 제품 수 (집계) — 별도 쿼리. 현재 페이지 양조장 ID 에 한정.
  const idsOnPage = (breweries ?? []).map((b) => b.id);
  const countMap = new Map<string, number>();
  if (idsOnPage.length > 0) {
    const { data: productsByBrewery } = await sb
      .from("products")
      .select("brewery_id")
      .in("brewery_id", idsOnPage);
    for (const row of productsByBrewery ?? []) {
      if (!row.brewery_id) continue;
      countMap.set(row.brewery_id, (countMap.get(row.brewery_id) ?? 0) + 1);
    }
  }

  const list = breweries ?? [];
  const total = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  function hrefForPage(p: number): string {
    const next = new URLSearchParams();
    if (q) next.set("q", q);
    if (region) next.set("region", region);
    if (p > 1) next.set("page", String(p));
    const qs = next.toString();
    return qs ? `/breweries?${qs}` : "/breweries";
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <header className="mb-6">
        <h1 className="font-serif text-3xl font-semibold tracking-tight">
          양조장
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {q || region ? (
            <>
              결과 <strong className="text-foreground">{total}</strong>곳
              {q && <> · "{q}"</>}
              {region && <> · {region}</>}
            </>
          ) : (
            <>총 <strong className="text-foreground">{total}</strong>개 양조장</>
          )}
          {totalPages > 1 && (
            <span> · {page}/{totalPages} 페이지</span>
          )}
        </p>
      </header>

      <BreweriesFilter regions={regions} />

      {error && <p className="mt-6 text-red-600">DB 조회 실패: {error.message}</p>}

      {list.length === 0 && !error && (
        <p className="mt-16 text-center text-muted-foreground">
          조건에 맞는 양조장이 없습니다.
        </p>
      )}

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((b) => {
          const productCount = countMap.get(b.id) ?? 0;
          return (
            <Link
              key={b.id}
              href={`/breweries/${b.id}`}
              className="group flex flex-col rounded-lg border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-serif text-lg font-medium leading-tight group-hover:underline">
                  {b.name_ko}
                </h3>
                {b.is_visiting_brewery && (
                  <span className="shrink-0 rounded-full border border-primary/30 bg-primary/5 px-2 py-0.5 text-[10px] text-primary">
                    찾아가는
                  </span>
                )}
              </div>
              {b.region && (
                <div className="mt-1 text-sm text-muted-foreground">{b.region}</div>
              )}
              <div className="mt-auto pt-3 text-xs text-muted-foreground">
                제품 <span className="text-foreground">{productCount}</span>개
              </div>
            </Link>
          );
        })}
      </div>

      <Pagination page={page} totalPages={totalPages} hrefForPage={hrefForPage} />
    </main>
  );
}
