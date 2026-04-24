import Link from "next/link";
import { supabaseServer } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import type { Metadata } from "next";
import { ProductFilters } from "@/components/product-filters";
import { Stars } from "@/components/rating-display";
import { Pagination } from "@/components/pagination";

export const metadata: Metadata = {
  title: "제품",
  description: "한국 전통주·막걸리·소주·과실주 791개 제품 카탈로그.",
};

type SearchParams = {
  q?: string;
  category?: string;
  region?: string;
  page?: string;
};

type ProductRow = {
  id: string;
  name_ko: string;
  category: string | null;
  abv: number | null;
  volume_ml: number | null;
  breweries: { name_ko: string; region: string | null } | null;
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

  const sb = await supabaseServer();

  // breweries 전체 unique region — 필터 옵션용
  const { data: regionRows } = await sb
    .from("breweries")
    .select("region")
    .not("region", "is", null);
  const regions = [...new Set((regionRows ?? []).map((r) => r.region as string))].sort();

  let query = sb
    .from("products")
    .select("id, name_ko, category, abv, volume_ml, breweries!inner(name_ko, region)", {
      count: "exact",
    })
    .order("category", { ascending: true })
    .order("name_ko", { ascending: true })
    .range(from, to);

  if (category) query = query.eq("category", category);
  if (region) query = query.eq("breweries.region", region);
  if (q) {
    query = query.or(
      `name_ko.ilike.%${q}%,breweries.name_ko.ilike.%${q}%`,
    );
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

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <header className="mb-6">
        <h1 className="font-serif text-3xl font-semibold tracking-tight">
          제품 카탈로그
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {q || category || region ? (
            <>
              검색 결과 <strong className="text-foreground">{total}</strong>건
              {q && <> · "{q}"</>}
              {category && <> · {category}</>}
              {region && <> · {region}</>}
            </>
          ) : (
            <>총 <strong className="text-foreground">{total}</strong>개 제품</>
          )}
          {totalPages > 1 && (
            <span> · {page}/{totalPages} 페이지</span>
          )}
        </p>
      </header>

      <ProductFilters categories={CATEGORIES} regions={regions} />

      {error && (
        <p className="mt-6 text-red-600">DB 조회 실패: {error.message}</p>
      )}

      {products.length === 0 && !error && (
        <p className="mt-16 text-center text-muted-foreground">
          조건에 맞는 제품이 없습니다.
        </p>
      )}

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => {
          const b = Array.isArray(p.breweries) ? p.breweries[0] : p.breweries;
          return (
            <Link
              key={p.id}
              href={`/products/${p.id}`}
              className="group flex flex-col rounded-lg border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-serif text-lg font-medium leading-tight group-hover:underline">
                  {p.name_ko}
                </h3>
                {p.category && (
                  <Badge variant="secondary" className="shrink-0">
                    {p.category}
                  </Badge>
                )}
              </div>
              <div className="mt-2 text-sm text-muted-foreground">
                {b?.name_ko ?? "양조장 미상"}
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
