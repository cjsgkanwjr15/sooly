import Link from "next/link";
import type { Metadata } from "next";
import { supabaseServer } from "@/lib/supabase/server";
import { BreweriesFilter } from "@/components/breweries-filter";
import { Pagination } from "@/components/pagination";
import { sanitizeSearch } from "@/lib/search";
import { getLocale, pick } from "@/lib/locale";
import { t } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: t(locale, "breweriesList.metaTitle"),
    description: t(locale, "breweriesList.metaDescription"),
  };
}

type SearchParams = { region?: string; q?: string; page?: string };

type BreweryListItem = {
  id: string;
  name_ko: string;
  name_en: string | null;
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

  const locale = await getLocale();
  const sb = await supabaseServer();

  // 전체 region 목록 (필터 옵션용)
  const { data: regionRows } = await sb
    .from("breweries")
    .select("region")
    .not("region", "is", null);
  const regions = [...new Set((regionRows ?? []).map((r) => r.region as string))].sort();

  let query = sb
    .from("breweries")
    .select("id, name_ko, name_en, region, address, is_visiting_brewery", {
      count: "exact",
    })
    .order("name_ko", { ascending: true })
    .range(from, to);

  if (region) query = query.eq("region", region);
  // sanitize 후 ko / en 둘 다 검색 (영문 핸들 입력 케이스 + 안전한 ilike 패턴).
  const cleanQ = sanitizeSearch(q);
  if (cleanQ) {
    const pat = `%${cleanQ}%`;
    query = query.or(`name_ko.ilike.${pat},name_en.ilike.${pat}`);
  }

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
  const isFiltered = Boolean(q || region);

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
          {t(locale, "breweriesList.h1")}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {isFiltered ? (
            <>
              {t(locale, "breweriesList.searchSummaryPre")}
              <strong className="text-foreground">{total}</strong>
              {t(locale, "breweriesList.searchSummarySuffix")}
              {q && <> · "{q}"</>}
              {region && <> · {region}</>}
            </>
          ) : (
            <>
              {t(locale, "breweriesList.totalSummaryPre")}
              <strong className="text-foreground">{total}</strong>
              {t(locale, "breweriesList.totalSummarySuffix")}
            </>
          )}
          {totalPages > 1 && (
            <span>
              {" · "}
              {t(locale, "breweriesList.pageInfo", { page, total: totalPages })}
            </span>
          )}
        </p>
      </header>

      <BreweriesFilter regions={regions} locale={locale} />

      {error && (
        <p className="mt-6 text-red-600">
          {t(locale, "breweriesList.error", { message: error.message })}
        </p>
      )}

      {list.length === 0 && !error && (
        <p className="mt-16 text-center text-muted-foreground">
          {t(locale, "breweriesList.empty")}
        </p>
      )}

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((b) => {
          const productCount = countMap.get(b.id) ?? 0;
          const breweryName = pick(locale, b.name_ko, b.name_en) ?? b.name_ko;
          return (
            <Link
              key={b.id}
              href={`/breweries/${b.id}`}
              className="group flex flex-col rounded-lg border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-serif text-lg font-medium leading-tight group-hover:underline">
                  {breweryName}
                </h3>
                {b.is_visiting_brewery && (
                  <span className="shrink-0 rounded-full border border-primary/30 bg-primary/5 px-2 py-0.5 text-[10px] text-primary">
                    {t(locale, "breweriesList.visitingBadge")}
                  </span>
                )}
              </div>
              {b.region && (
                <div className="mt-1 text-sm text-muted-foreground">{b.region}</div>
              )}
              <div className="mt-auto pt-3 text-xs text-muted-foreground">
                {productCount}
                {t(locale, "breweriesList.productsCountSuffix")}
              </div>
            </Link>
          );
        })}
      </div>

      <Pagination page={page} totalPages={totalPages} hrefForPage={hrefForPage} />
    </main>
  );
}
