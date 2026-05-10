import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { supabaseServer } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { getLocale, pick, type Locale } from "@/lib/locale";
import { t, tCategory, type TKey } from "@/lib/i18n";

export const revalidate = 1800;

type Params = { slug: string };

/**
 * 카테고리별 큐레이션 페이지. Vivino 의 "Wine styles" 포맷.
 * - 카테고리 소개 (역사·특징·마시는 법)
 * - 이 카테고리의 제품 리스트 (필터 기본 적용)
 * - 대표 양조장 몇 곳
 *
 * CATEGORY_INFO 의 tagline/description/tips 는 이제 dictionary 의 categoryInfo 에서 조회.
 * 카테고리 영문명은 categories namespace.
 */

const CATEGORY_KEYS = ["탁주", "약주", "청주", "증류주", "과실주", "리큐르"];

function getInfo(locale: Locale, koCategory: string) {
  const base = `categoryInfo.${koCategory}` as const;
  return {
    title: tCategory(locale, koCategory),
    tagline: t(locale, `${base}.tagline` as TKey),
    description: t(locale, `${base}.description` as TKey),
    tips: [
      t(locale, `${base}.tip1` as TKey),
      t(locale, `${base}.tip2` as TKey),
      t(locale, `${base}.tip3` as TKey),
    ],
  };
}

export async function generateStaticParams() {
  return CATEGORY_KEYS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const decoded = decodeURIComponent(slug);
  const locale = await getLocale();
  if (!CATEGORY_KEYS.includes(decoded)) {
    return { title: t(locale, "category.notFound") };
  }
  const info = getInfo(locale, decoded);
  return {
    title: info.title,
    description: info.description.slice(0, 160),
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const category = decodeURIComponent(slug);
  if (!CATEGORY_KEYS.includes(category)) notFound();

  const locale = await getLocale();
  const info = getInfo(locale, category);
  const sb = await supabaseServer();

  const [{ data: products, count }] = await Promise.all([
    sb
      .from("products")
      .select(
        "id, name_ko, name_en, abv, volume_ml, breweries(id, name_ko, name_en, region)",
        { count: "exact" },
      )
      .eq("category", category)
      .order("name_ko"),
  ]);

  // 이 카테고리 대표 양조장 (제품 수 많은 순 — 간단한 집계)
  const breweryCounts = new Map<
    string,
    { id: string; name_ko: string; name_en: string | null; region: string | null; count: number }
  >();
  for (const p of products ?? []) {
    const b = Array.isArray(p.breweries) ? p.breweries[0] : p.breweries;
    if (!b) continue;
    const existing = breweryCounts.get(b.id);
    if (existing) existing.count++;
    else
      breweryCounts.set(b.id, {
        id: b.id,
        name_ko: b.name_ko,
        name_en: b.name_en,
        region: b.region,
        count: 1,
      });
  }
  const topBreweries = [...breweryCounts.values()]
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  return (
    <main className="mx-auto max-w-6xl">
      {/* Hero */}
      <section className="border-b bg-[color-mix(in_oklab,var(--color-primary)_4%,var(--color-background))] px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl">
          <nav className="mb-6 text-sm text-muted-foreground">
            <Link href="/products" className="hover:text-foreground">
              {t(locale, "category.productsCrumb")}
            </Link>
            <span> · {info.title}</span>
          </nav>
          <p className="text-xs uppercase tracking-[0.3em] text-primary/70">
            {t(locale, "category.uppercase")}
          </p>
          <h1 className="mt-3 font-serif text-5xl font-semibold tracking-tight sm:text-6xl">
            {info.title}
          </h1>
          <p className="mt-4 font-kr-serif text-lg text-foreground/80 sm:text-xl">
            {info.tagline}
          </p>
          <p className="mt-6 max-w-2xl leading-relaxed text-muted-foreground">
            {info.description}
          </p>
        </div>
      </section>

      {/* Tips */}
      <section className="mx-auto max-w-4xl px-6 py-12">
        <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-muted-foreground">
          {t(locale, "category.drinkingTipsH2")}
        </h2>
        <ul className="space-y-3">
          {info.tips.map((tip, i) => (
            <li key={i} className="flex gap-4">
              <span className="font-serif text-primary">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="leading-relaxed">{tip}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Top breweries */}
      {topBreweries.length > 0 && (
        <section className="border-t px-6 py-14">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-6 font-serif text-2xl font-semibold tracking-tight">
              {t(locale, "category.topBreweriesH2", { category: info.title })}
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {topBreweries.map((b) => {
                const breweryName =
                  pick(locale, b.name_ko, b.name_en) ?? b.name_ko;
                return (
                  <Link
                    key={b.id}
                    href={`/breweries/${b.id}`}
                    className="group rounded-lg border bg-card p-4 text-center transition-colors hover:border-primary/30"
                  >
                    <div className="font-serif text-sm font-medium leading-tight group-hover:underline">
                      {breweryName}
                    </div>
                    {b.region && (
                      <div className="mt-1 text-xs text-muted-foreground">
                        {b.region}
                      </div>
                    )}
                    <div className="mt-2 text-[10px] uppercase tracking-wider text-primary/70">
                      {b.count}
                      {t(locale, "category.productCountSuffix")}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Products */}
      <section className="border-t px-6 py-14">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="font-serif text-2xl font-semibold tracking-tight">
              {t(locale, "category.productsH2", { category: info.title })}{" "}
              <span className="text-muted-foreground">({count ?? 0})</span>
            </h2>
            <Link
              href={`/products?category=${encodeURIComponent(category)}`}
              className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              {t(locale, "category.filterView")}
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(products ?? []).slice(0, 24).map((p) => {
              const b = Array.isArray(p.breweries) ? p.breweries[0] : p.breweries;
              const productName = pick(locale, p.name_ko, p.name_en) ?? p.name_ko;
              const breweryName = b
                ? (pick(locale, b.name_ko, b.name_en) ?? b.name_ko)
                : t(locale, "category.noBreweryName");
              return (
                <Link
                  key={p.id}
                  href={`/products/${p.id}`}
                  className="group flex flex-col rounded-lg border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/30"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-serif text-lg font-medium leading-tight group-hover:underline">
                      {productName}
                    </h3>
                    <Badge variant="secondary" className="shrink-0 text-[10px]">
                      {info.title}
                    </Badge>
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground">
                    {breweryName}
                    {b?.region && (
                      <span className="ml-1 text-xs opacity-70">· {b.region}</span>
                    )}
                  </div>
                  <div className="mt-auto pt-3 flex gap-3 text-xs text-muted-foreground">
                    {p.abv != null && <span>{p.abv}%</span>}
                    {p.volume_ml != null && <span>{p.volume_ml}ml</span>}
                  </div>
                </Link>
              );
            })}
          </div>

          {(count ?? 0) > 24 && (
            <div className="mt-8 text-center">
              <Link
                href={`/products?category=${encodeURIComponent(category)}`}
                className="text-sm underline underline-offset-4 hover:text-primary"
              >
                {t(locale, "category.viewAllPrefix")}
                {info.title}
                {t(locale, "category.viewAllSuffix", { count: count ?? 0 })}
              </Link>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
