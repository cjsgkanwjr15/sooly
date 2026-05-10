import Link from "next/link";
import { supabaseServer } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import type { Metadata } from "next";
import { ProductFilters } from "@/components/product-filters";
import { Stars } from "@/components/rating-display";
import { Pagination } from "@/components/pagination";
import { sanitizeSearch } from "@/lib/search";
import { getLocale, pick } from "@/lib/locale";
import { t, tCategory } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: t(locale, "productsList.metaTitle"),
    description: t(locale, "productsList.metaDescription"),
  };
}

type SearchParams = {
  q?: string;
  category?: string;
  region?: string;
  page?: string;
};

type ProductRow = {
  id: string;
  name_ko: string;
  name_en: string | null;
  category: string | null;
  abv: number | null;
  volume_ml: number | null;
  breweries: { name_ko: string; name_en: string | null; region: string | null } | null;
};

const CATEGORIES = ["탁주", "약주", "청주", "증류주", "과실주", "리큐르"];
const PAGE_SIZE = 48;

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const { q, category, region } = sp;
  const page = Math.max(1, Number(sp.page ?? 1) || 1);
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const locale = await getLocale();
  const sb = await supabaseServer();

  // breweries 전체 unique region — 필터 옵션용
  const { data: regionRows } = await sb
    .from("breweries")
    .select("region")
    .not("region", "is", null);
  const regions = [...new Set((regionRows ?? []).map((r) => r.region as string))].sort();

  let query = sb
    .from("products")
    .select(
      "id, name_ko, name_en, category, abv, volume_ml, breweries!inner(name_ko, name_en, region)",
      { count: "exact" },
    )
    .order("category", { ascending: true })
    .order("name_ko", { ascending: true })
    .range(from, to);

  if (category) query = query.eq("category", category);
  if (region) query = query.eq("breweries.region", region);
  // PostgREST `.or()` 는 nested foreign-key 칼럼을 직접 못 받아서 (예전엔
  // `breweries.name_ko.ilike` 라 logic-tree parse 에러) brewery 매칭은 별도 쿼리로
  // brewery_id 풀 만들고 main 검색은 products 의 자기 칼럼 + brewery_id IN 으로 합침.
  // sanitizeSearch 가 ilike wildcard + PostgREST query 분리자 둘 다 escape.
  const cleanQ = sanitizeSearch(q);
  if (cleanQ) {
    const pat = `%${cleanQ}%`;
    const { data: breweryMatches } = await sb
      .from("breweries")
      .select("id")
      .or(`name_ko.ilike.${pat},name_en.ilike.${pat}`)
      .limit(200);
    const breweryIds = (breweryMatches ?? []).map((b) => b.id);

    const orParts = [`name_ko.ilike.${pat}`, `name_en.ilike.${pat}`];
    if (breweryIds.length > 0) {
      orParts.push(`brewery_id.in.(${breweryIds.join(",")})`);
    }
    query = query.or(orParts.join(","));
  }

  const { data, error, count } = await query.returns<ProductRow[]>();
  const products = data ?? [];
  const total = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  // 페이지네이션 URL 생성 — 기존 필터 보존
  function hrefForPage(p: number): string {
    const next = new URLSearchParams();
    if (q) next.set("q", q);
    if (category) next.set("category", category);
    if (region) next.set("region", region);
    if (p > 1) next.set("page", String(p));
    const qs = next.toString();
    return qs ? `/products?${qs}` : "/products";
  }

  const isFiltered = Boolean(q || category || region);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <header className="mb-6">
        <h1 className="font-serif text-3xl font-semibold tracking-tight">
          {t(locale, "productsList.h1")}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {isFiltered ? (
            <>
              {t(locale, "productsList.searchSummaryPre")}
              <strong className="text-foreground">{total}</strong>
              {t(locale, "productsList.searchSummarySuffix")}
              {q && <> · "{q}"</>}
              {category && <> · {tCategory(locale, category)}</>}
              {region && <> · {region}</>}
            </>
          ) : (
            <>
              {t(locale, "productsList.totalSummaryPre")}
              <strong className="text-foreground">{total}</strong>
              {t(locale, "productsList.totalSummarySuffix")}
            </>
          )}
          {totalPages > 1 && (
            <span>
              {" · "}
              {t(locale, "productsList.pageInfo", { page, total: totalPages })}
            </span>
          )}
        </p>
      </header>

      <ProductFilters categories={CATEGORIES} regions={regions} locale={locale} />

      {error && (
        <p className="mt-6 text-red-600">
          {t(locale, "productsList.error", { message: error.message })}
        </p>
      )}

      {products.length === 0 && !error && (
        <p className="mt-16 text-center text-muted-foreground">
          {t(locale, "productsList.empty")}
        </p>
      )}

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => {
          const b = Array.isArray(p.breweries) ? p.breweries[0] : p.breweries;
          const productName = pick(locale, p.name_ko, p.name_en) ?? p.name_ko;
          const breweryName = b
            ? (pick(locale, b.name_ko, b.name_en) ?? b.name_ko)
            : t(locale, "productsList.noBreweryName");
          return (
            <Link
              key={p.id}
              href={`/products/${p.id}`}
              className="group flex flex-col rounded-lg border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-serif text-lg font-medium leading-tight group-hover:underline">
                  {productName}
                </h3>
                {p.category && (
                  <Badge variant="secondary" className="shrink-0">
                    {tCategory(locale, p.category)}
                  </Badge>
                )}
              </div>
              <div className="mt-2 text-sm text-muted-foreground">
                {breweryName}
                {b?.region && (
                  <span className="ml-1 text-xs opacity-70">· {b.region}</span>
                )}
              </div>
              <div className="mt-3">
                <Stars value={0} className="text-sm opacity-40" />
              </div>
              <div className="mt-auto pt-3 flex gap-3 text-xs text-muted-foreground">
                {p.abv != null && <span>{p.abv}%</span>}
                {p.volume_ml != null && <span>{p.volume_ml}ml</span>}
              </div>
            </Link>
          );
        })}
      </div>

      <Pagination page={page} totalPages={totalPages} hrefForPage={hrefForPage} />
    </main>
  );
}
