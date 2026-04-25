import Link from "next/link";
import { notFound } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { PhotoPlaceholder } from "@/components/photo-placeholder";
import { RatingDisplay } from "@/components/rating-display";
import { TasteRadar } from "@/components/taste-profile";
import { BreweryContentSlot } from "@/components/brewery-content-slot";
import { JsonLd } from "@/components/json-ld";
import { env } from "@/lib/env";
import type { Metadata } from "next";

export const revalidate = 600;

type ProductDetail = {
  id: string;
  name_ko: string;
  name_en: string | null;
  category: string | null;
  abv: number | null;
  volume_ml: number | null;
  ingredients: string[] | null;
  tasting_notes_ko: string | null;
  tasting_notes_en: string | null;
  pairing_suggestions: string[] | null;
  image_url: string | null;
  source_url: string | null;
  brewery_id: string | null;
  breweries: {
    id: string;
    name_ko: string;
    name_en: string | null;
    region: string | null;
    address: string | null;
    website: string | null;
    story_ko: string | null;
  } | null;
};

async function getProduct(id: string) {
  const sb = await supabaseServer();
  const { data, error } = await sb
    .from("products")
    .select(
      `id, name_ko, name_en, category, abv, volume_ml, ingredients,
       tasting_notes_ko, tasting_notes_en, pairing_suggestions,
       image_url, source_url, brewery_id,
       breweries(id, name_ko, name_en, region, address, website, story_ko)`,
    )
    .eq("id", id)
    .single<ProductDetail>();
  if (error || !data) return null;
  return data;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) return { title: "제품 없음" };
  const brewery = Array.isArray(product.breweries) ? product.breweries[0] : product.breweries;
  return {
    title: product.name_ko,
    description: `${brewery?.name_ko ?? ""} ${product.name_ko} · ${product.category ?? ""} ${product.abv ?? ""}% ${product.volume_ml ?? ""}ml`,
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) notFound();

  const brewery = Array.isArray(product.breweries) ? product.breweries[0] : product.breweries;

  const sb = await supabaseServer();

  // 같은 양조장의 다른 제품 (최대 4개)
  const { data: sameBreweryData } = brewery?.id
    ? await sb
        .from("products")
        .select("id, name_ko, category, abv")
        .eq("brewery_id", brewery.id)
        .neq("id", product.id)
        .limit(4)
    : { data: [] };
  const sameBrewery = sameBreweryData ?? [];

  // 같은 카테고리 다른 양조장의 비슷한 제품 (최대 6개)
  const { data: similarData } = product.category
    ? await sb
        .from("products")
        .select("id, name_ko, category, abv, volume_ml, breweries(name_ko, region)")
        .eq("category", product.category)
        .neq("id", product.id)
        .neq("brewery_id", brewery?.id ?? "")
        .limit(6)
    : { data: [] };
  const similar = similarData ?? [];

  // 체크인 집계 — 현재 0, 인증 붙으면 자동 동작
  const { count: checkinCount } = await sb
    .from("check_ins")
    .select("*", { count: "exact", head: true })
    .eq("product_id", product.id);
  const averageRating: number | null = null; // 추후: AVG(rating) 집계

  // Schema.org Product — Google 검색 결과 rich snippet (카테고리·브랜드·가격) 활성화.
  // 알코올 음료를 위한 별도 type 이 schema.org 에 없어 Product + additionalProperty 로 표현.
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name_ko,
    ...(product.name_en && { alternateName: product.name_en }),
    ...(product.category && { category: product.category }),
    description:
      product.tasting_notes_ko ??
      `${brewery?.name_ko ? brewery.name_ko + " · " : ""}${product.category ?? ""} ${product.abv ? product.abv + "%" : ""}`.trim(),
    url: `${env.NEXT_PUBLIC_SITE_URL}/products/${product.id}`,
    ...(product.image_url && { image: product.image_url }),
    ...(brewery && {
      brand: { "@type": "Brand", name: brewery.name_ko },
      manufacturer: {
        "@type": "Organization",
        name: brewery.name_ko,
        url: `${env.NEXT_PUBLIC_SITE_URL}/breweries/${brewery.id}`,
        ...(brewery.region && {
          address: { "@type": "PostalAddress", addressRegion: brewery.region, addressCountry: "KR" },
        }),
      },
    }),
    ...((product.abv != null || product.volume_ml != null) && {
      additionalProperty: [
        ...(product.abv != null
          ? [{ "@type": "PropertyValue", name: "Alcohol by volume", value: `${product.abv}%` }]
          : []),
        ...(product.volume_ml != null
          ? [{ "@type": "PropertyValue", name: "Volume", value: `${product.volume_ml}ml` }]
          : []),
      ],
    }),
  };

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <JsonLd data={productJsonLd} />
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-muted-foreground">
        <Link href="/products" className="hover:text-foreground">제품</Link>
        {product.category && (
          <>
            {" · "}
            <Link
              href={`/categories/${encodeURIComponent(product.category)}`}
              className="hover:text-foreground"
            >
              {product.category}
            </Link>
          </>
        )}
        {brewery && (
          <>
            {" · "}
            <Link href={`/breweries/${brewery.id}`} className="hover:text-foreground">
              {brewery.name_ko}
            </Link>
          </>
        )}
      </nav>

      {/* Hero: photo + title + key stats */}
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <div>
          <PhotoPlaceholder
            src={product.image_url}
            alt={product.name_ko}
            aspectRatio="1/1"
            category={product.category}
          />
        </div>

        <div className="flex flex-col">
          {product.category && (
            <div className="text-xs uppercase tracking-[0.25em] text-primary/80">
              {product.category}
            </div>
          )}
          <h1 className="mt-3 font-serif text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            {product.name_ko}
          </h1>
          {product.name_en && (
            <p className="mt-2 text-lg text-muted-foreground">{product.name_en}</p>
          )}
          {brewery && (
            <p className="mt-4 text-base">
              <Link
                href={`/breweries/${brewery.id}`}
                className="font-medium hover:underline"
              >
                {brewery.name_ko}
              </Link>
              {brewery.region && (
                <span className="text-muted-foreground"> · {brewery.region}</span>
              )}
            </p>
          )}

          <div className="mt-6">
            <RatingDisplay
              average={averageRating}
              count={checkinCount ?? 0}
              size="lg"
            />
          </div>

          <dl className="mt-6 grid grid-cols-2 gap-x-8 gap-y-4 border-y py-5 sm:grid-cols-4 sm:border-y-0 sm:border-t sm:pb-0">
            <Stat label="도수" value={product.abv != null ? `${product.abv}%` : "—"} />
            <Stat label="용량" value={product.volume_ml != null ? `${product.volume_ml}ml` : "—"} />
            <Stat label="카테고리" value={product.category ?? "—"} />
            <Stat label="지역" value={brewery?.region ?? "—"} />
          </dl>

          {/* 체크인 CTA — 인증 붙기 전까지는 안내 */}
          <div className="mt-8 rounded-xl border border-primary/20 bg-primary/[0.04] p-5">
            <p className="font-serif text-base font-medium">첫 체크인을 남겨보세요</p>
            <p className="mt-1 text-sm text-muted-foreground">
              이 술을 마셨다면 별점과 한 줄 메모로 기록해보세요. 다른 사람과 취향을 공유할 수 있어요.
            </p>
            <button
              type="button"
              disabled
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary/70 px-4 py-2 text-sm font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-70"
              aria-label="체크인 기능 곧 출시"
            >
              🍶 체크인 (곧 출시)
            </button>
          </div>
        </div>
      </div>

      {/* 맛 프로필 + 본문 섹션들 */}
      <div className="mt-16 grid gap-12 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="space-y-12">
          <Section title="맛 노트">
            {product.tasting_notes_ko ? (
              <p className="whitespace-pre-line text-[1.0625rem] leading-[1.8]">
                {product.tasting_notes_ko}
              </p>
            ) : (
              <p className="text-sm italic text-muted-foreground">
                큐레이팅된 맛 노트가 곧 제공됩니다.
              </p>
            )}
          </Section>

          {product.ingredients && product.ingredients.length > 0 && (
            <Section title="원재료">
              <div className="flex flex-wrap gap-2">
                {product.ingredients.map((ing) => (
                  <Badge key={ing} variant="outline" className="font-normal">
                    {ing}
                  </Badge>
                ))}
              </div>
            </Section>
          )}

          {product.pairing_suggestions && product.pairing_suggestions.length > 0 && (
            <Section title="어울리는 음식">
              <ul className="space-y-2 text-[1rem] leading-relaxed">
                {product.pairing_suggestions.map((p, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="shrink-0 text-primary">·</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {brewery?.story_ko && (
            <Section title={`${brewery.name_ko} 이야기`}>
              <blockquote className="border-l-2 border-primary/30 pl-5 italic leading-relaxed text-muted-foreground">
                {brewery.story_ko}
              </blockquote>
              <Link
                href={`/breweries/${brewery.id}`}
                className="mt-4 inline-block text-sm underline underline-offset-4 hover:text-primary"
              >
                양조장 자세히 보기 →
              </Link>
            </Section>
          )}

          <BreweryContentSlot variant="product" />
        </div>

        {/* 오른쪽 사이드: 맛 프로필 */}
        <aside className="space-y-8">
          <div className="rounded-xl border bg-card p-6">
            <h3 className="mb-4 text-sm font-medium uppercase tracking-wider text-muted-foreground">
              맛 프로필
            </h3>
            <TasteRadar profile={null} className="aspect-square" />
          </div>

          {sameBrewery.length > 0 && brewery && (
            <div className="rounded-xl border bg-card p-6">
              <h3 className="mb-4 text-sm font-medium uppercase tracking-wider text-muted-foreground">
                {brewery.name_ko} 의 다른 제품
              </h3>
              <ul className="space-y-3">
                {sameBrewery.map((r) => (
                  <li key={r.id}>
                    <Link
                      href={`/products/${r.id}`}
                      className="group block"
                    >
                      <div className="font-medium group-hover:underline">{r.name_ko}</div>
                      <div className="text-xs text-muted-foreground">
                        {r.category}
                        {r.abv != null && ` · ${r.abv}%`}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>

      {/* You might also like */}
      {similar.length > 0 && (
        <section className="mt-20">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                You might also like
              </p>
              <h2 className="mt-1 font-serif text-2xl font-semibold tracking-tight">
                비슷한 {product.category}
              </h2>
            </div>
            <Link
              href={`/categories/${encodeURIComponent(product.category ?? "")}`}
              className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              더 보기 →
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((p) => {
              const b = Array.isArray(p.breweries) ? p.breweries[0] : p.breweries;
              return (
                <Link
                  key={p.id}
                  href={`/products/${p.id}`}
                  className="group flex flex-col rounded-lg border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/30"
                >
                  <div className="font-serif text-lg font-medium group-hover:underline">
                    {p.name_ko}
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {b?.name_ko} {b?.region && <span className="opacity-70">· {b.region}</span>}
                  </div>
                  <div className="mt-3 flex gap-3 text-xs text-muted-foreground">
                    {p.abv != null && <span>{p.abv}%</span>}
                    {p.volume_ml != null && <span>{p.volume_ml}ml</span>}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {product.source_url && (
        <div className="mt-16 border-t pt-6 text-xs text-muted-foreground">
          원본 출처:{" "}
          <a
            href={product.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2"
          >
            더술닷컴
          </a>
        </div>
      )}
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</dt>
      <dd className="mt-1 font-serif text-xl font-medium">{value}</dd>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-muted-foreground">
        {title}
      </h2>
      {children}
    </section>
  );
}
