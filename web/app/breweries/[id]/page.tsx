import Link from "next/link";
import { notFound } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import { PhotoPlaceholder } from "@/components/photo-placeholder";
import { BreweryContentSlot } from "@/components/brewery-content-slot";
import { JsonLd } from "@/components/json-ld";
import { Stars } from "@/components/rating-display";
import { env } from "@/lib/env";
import { getLocale, pick } from "@/lib/locale";
import type { Metadata } from "next";

export const revalidate = 600;

type Brewery = {
  id: string;
  name_ko: string;
  name_en: string | null;
  region: string | null;
  address: string | null;
  founded_year: number | null;
  story_ko: string | null;
  story_en: string | null;
  website: string | null;
  instagram: string | null;
  is_visiting_brewery: boolean | null;
};

type BreweryProduct = {
  id: string;
  name_ko: string;
  name_en: string | null;
  category: string | null;
  abv: number | null;
  volume_ml: number | null;
  image_url: string | null;
};

type ProductWithRating = BreweryProduct & {
  avgRating: number | null;
  ratingCount: number;
};

async function getBrewery(id: string) {
  const sb = await supabaseServer();
  const { data, error } = await sb
    .from("breweries")
    .select("*")
    .eq("id", id)
    .single<Brewery>();
  if (error || !data) return null;
  return data;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const brewery = await getBrewery(id);
  if (!brewery) return { title: "양조장 없음" };
  return {
    title: brewery.name_ko,
    description: `${brewery.region ?? ""} ${brewery.name_ko} 양조장 — 제품·스토리·위치 정보`,
  };
}

export default async function BreweryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const brewery = await getBrewery(id);
  if (!brewery) notFound();

  const sb = await supabaseServer();
  const { data: productsRaw } = await sb
    .from("products")
    .select("id, name_ko, name_en, category, abv, volume_ml, image_url")
    .eq("brewery_id", id)
    .returns<BreweryProduct[]>();

  const products = productsRaw ?? [];

  // 양조장 모든 제품의 별점 한 번에 집계 (별도 쿼리, application 집계).
  // RLS check_ins_select 가 public read 라 anon 권한으로도 조회 가능.
  let productsWithRating: ProductWithRating[] = [];
  if (products.length > 0) {
    const productIds = products.map((p) => p.id);
    const { data: checkIns } = await sb
      .from("check_ins")
      .select("product_id, rating")
      .in("product_id", productIds);

    const ratingMap = new Map<string, number[]>();
    for (const c of checkIns ?? []) {
      const arr = ratingMap.get(c.product_id) ?? [];
      arr.push(c.rating);
      ratingMap.set(c.product_id, arr);
    }

    productsWithRating = products.map((p) => {
      const ratings = ratingMap.get(p.id) ?? [];
      const avg =
        ratings.length > 0
          ? ratings.reduce((s, r) => s + r, 0) / ratings.length
          : null;
      return { ...p, avgRating: avg, ratingCount: ratings.length };
    });

    // 정렬: 별점 있는 거 위 (별점 desc → 체크인 수 desc), 없는 거는 이름 가나다순.
    productsWithRating.sort((a, b) => {
      if (a.avgRating != null && b.avgRating != null) {
        if (b.avgRating !== a.avgRating) return b.avgRating - a.avgRating;
        return b.ratingCount - a.ratingCount;
      }
      if (a.avgRating != null) return -1;
      if (b.avgRating != null) return 1;
      return a.name_ko.localeCompare(b.name_ko, "ko");
    });
  }

  const locale = await getLocale();
  const breweryName = pick(locale, brewery.name_ko, brewery.name_en) ?? brewery.name_ko;
  const breweryNameAlt = locale === "en" ? brewery.name_ko : brewery.name_en;
  const breweryStory = pick(locale, brewery.story_ko, brewery.story_en);

  // Schema.org Brewery (LocalBusiness 의 더 구체적 type).
  // sameAs 에 외부 공식 URL (홈페이지·인스타) 넣어 entity reconciliation 강화.
  const breweryJsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": ["Brewery", "LocalBusiness"],
    name: brewery.name_ko,
    ...(brewery.name_en && { alternateName: brewery.name_en }),
    url: `${env.NEXT_PUBLIC_SITE_URL}/breweries/${brewery.id}`,
    ...(brewery.story_ko && { description: brewery.story_ko }),
    ...(brewery.founded_year && {
      foundingDate: String(brewery.founded_year),
    }),
    ...((brewery.address || brewery.region) && {
      address: {
        "@type": "PostalAddress",
        ...(brewery.address && { streetAddress: brewery.address }),
        ...(brewery.region && { addressRegion: brewery.region }),
        addressCountry: "KR",
      },
    }),
    ...((brewery.website || brewery.instagram) && {
      sameAs: [
        ...(brewery.website
          ? [brewery.website.startsWith("http") ? brewery.website : `https://${brewery.website}`]
          : []),
        ...(brewery.instagram
          ? [`https://instagram.com/${brewery.instagram.replace(/^@/, "")}`]
          : []),
      ],
    }),
  };

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <JsonLd data={breweryJsonLd} />
      <nav className="mb-8 text-sm text-muted-foreground">
        <Link href="/products" className="hover:text-foreground">제품</Link>
        {brewery.region && (
          <>
            {" "}·{" "}
            <Link
              href={`/products?region=${encodeURIComponent(brewery.region)}`}
              className="hover:text-foreground"
            >
              {brewery.region}
            </Link>
          </>
        )}
      </nav>

      <PhotoPlaceholder
        src={null}
        alt={`${breweryName} 양조장 전경`}
        aspectRatio="16/9"
        className="mb-8"
      />

      <header className="mb-10">
        <div className="mb-3 text-xs uppercase tracking-widest text-primary/80">
          {locale === "en" ? "Brewery" : "양조장"}
        </div>
        <h1 className="font-serif text-4xl font-semibold tracking-tight sm:text-5xl">
          {breweryName}
        </h1>
        {breweryNameAlt && (
          <p className="mt-2 text-lg text-muted-foreground">{breweryNameAlt}</p>
        )}
        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
          {brewery.region && <span>{brewery.region}</span>}
          {brewery.founded_year && (
            <span>
              {locale === "en"
                ? `Founded ${brewery.founded_year}`
                : `설립 ${brewery.founded_year}년`}
            </span>
          )}
          {brewery.is_visiting_brewery && (
            <span className="rounded-full border border-primary/30 bg-primary/5 px-2 py-0.5 text-xs text-primary">
              {locale === "en" ? "Visiting brewery" : "찾아가는 양조장"}
            </span>
          )}
        </div>
      </header>

      {brewery.address && (
        <section className="mb-10">
          <h2 className="mb-2 text-sm font-medium uppercase tracking-wider text-muted-foreground">
            주소
          </h2>
          <p className="text-sm">{brewery.address}</p>
        </section>
      )}

      {(brewery.website || brewery.instagram) && (
        <section className="mb-10">
          <h2 className="mb-2 text-sm font-medium uppercase tracking-wider text-muted-foreground">
            링크
          </h2>
          <ul className="space-y-1 text-sm">
            {brewery.website && (
              <li>
                <a
                  href={brewery.website.startsWith("http") ? brewery.website : `https://${brewery.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2"
                >
                  {brewery.website}
                </a>
              </li>
            )}
            {brewery.instagram && (
              <li>
                <a
                  href={`https://instagram.com/${brewery.instagram.replace(/^@/, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2"
                >
                  @{brewery.instagram.replace(/^@/, "")}
                </a>
              </li>
            )}
          </ul>
        </section>
      )}

      {breweryStory ? (
        <section className="mb-10">
          <h2 className="mb-3 text-sm font-medium uppercase tracking-wider text-muted-foreground">
            {locale === "en" ? "Story" : "이야기"}
          </h2>
          <p className="whitespace-pre-line leading-relaxed text-muted-foreground">
            {breweryStory}
          </p>
        </section>
      ) : (
        <section className="mb-10 rounded-xl border border-dashed border-border bg-card/40 p-6">
          <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            {locale === "en" ? "Story" : "이야기"}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {locale === "en"
              ? `The story, photos, and details for ${breweryName} are still being gathered. If you're from this brewery, you can help fill this page in.`
              : `${breweryName} 의 이야기·사진·세부 정보는 아직 채워지는 중이에요. 양조장 측에서 직접 등록하시면 빠르게 반영됩니다.`}
          </p>
          <Link
            href="/for-breweries"
            className="mt-3 inline-block text-xs font-medium text-primary underline-offset-4 hover:underline"
          >
            {locale === "en"
              ? "Brewery onboarding →"
              : "양조장 등록 안내 →"}
          </Link>
        </section>
      )}

      <section className="mb-10">
        <BreweryContentSlot variant="brewery" breweryName={breweryName} />
      </section>

      {productsWithRating.length > 0 && (
        <section className="mb-12">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                {locale === "en"
                  ? `From ${breweryName}`
                  : `${breweryName} 의 제품`}
              </p>
              <h2 className="mt-1 font-serif text-2xl font-semibold tracking-tight">
                {locale === "en" ? "Lineup" : "라인업"}{" "}
                <span className="text-muted-foreground">
                  {productsWithRating.length}
                </span>
              </h2>
            </div>
          </div>

          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {productsWithRating.map((p) => {
              const pName = pick(locale, p.name_ko, p.name_en) ?? p.name_ko;
              return (
                <li key={p.id}>
                  <Link
                    href={`/products/${p.id}`}
                    className="group flex h-full flex-col rounded-xl border bg-card transition-all hover:-translate-y-0.5 hover:border-primary/30"
                  >
                    <div className="overflow-hidden rounded-t-xl">
                      <PhotoPlaceholder
                        src={p.image_url}
                        alt={pName}
                        aspectRatio="4/3"
                        category={p.category}
                      />
                    </div>
                    <div className="flex flex-1 flex-col p-4">
                      <h3 className="font-serif text-lg font-medium leading-tight group-hover:underline">
                        {pName}
                      </h3>
                      <div className="mt-1.5 text-xs text-muted-foreground">
                        {p.category}
                        {p.abv != null && ` · ${p.abv}%`}
                        {p.volume_ml != null && ` · ${p.volume_ml}ml`}
                      </div>
                      <div className="mt-auto pt-3">
                        {p.avgRating != null && p.ratingCount > 0 ? (
                          <div className="flex items-baseline gap-2">
                            <Stars value={p.avgRating} className="text-sm" />
                            <span className="font-serif text-sm font-medium">
                              {p.avgRating.toFixed(1)}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {locale === "en"
                                ? `${p.ratingCount} check-ins`
                                : `${p.ratingCount}회`}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground/70">
                            {locale === "en"
                              ? "No check-ins yet"
                              : "아직 체크인 없음"}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {/* 운영자 CTA — 모든 양조장 페이지 공통. 양조장이 본인 페이지 보고 자발적 컨택 동선. */}
      <BreweryOwnerCta locale={locale} breweryName={breweryName} />
    </main>
  );
}

function BreweryOwnerCta({
  locale,
  breweryName,
}: {
  locale: "ko" | "en";
  breweryName: string;
}) {
  const subject =
    locale === "en"
      ? `[Sooly] Brewery onboarding — ${breweryName}`
      : `[Sooly] 양조장 등록 문의 — ${breweryName}`;
  const mailto = `mailto:soolyhello@gmail.com?subject=${encodeURIComponent(subject)}`;

  return (
    <section className="mt-2 rounded-2xl border border-primary/25 bg-[color-mix(in_oklab,var(--color-primary)_4%,var(--color-background))] p-7">
      <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-background/60 px-3 py-1 text-[11px] font-medium text-primary">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/60 opacity-75" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
        </span>
        {locale === "en"
          ? "Founding cohort · 5~10 breweries"
          : "1기 양조장 · 5~10곳 모집 중"}
      </div>
      <h3 className="mt-4 font-serif text-xl font-medium leading-snug">
        {locale === "en"
          ? `Are you from ${breweryName}?`
          : `이 양조장 운영자이신가요?`}
      </h3>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        {locale === "en"
          ? "Sooly is recruiting a founding cohort of 5~10 breweries. The verification, story, photos, and check-in replies are free forever; analytics and promotion tools are co-designed and priced together with the cohort."
          : "Sooly 는 1기 양조장 5~10곳을 모집해 가격·기능을 함께 정합니다. 공식 인증·이야기·사진·체크인 답변은 앞으로도 무료, 분석·홍보 도구만 1기 양조장과 함께 설계 후 정식 출시됩니다. 1기 합류 시 6개월 무료 + 평생 가격 락인."}
      </p>
      <div className="mt-5 flex flex-wrap gap-3">
        <Link
          href="/for-breweries"
          className="rounded-md border border-primary/30 bg-background px-4 py-2 text-sm font-medium transition-colors hover:border-primary/50 hover:bg-primary/5"
        >
          {locale === "en" ? "Plan comparison" : "플랜 비교"}
        </Link>
        <a
          href={mailto}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          {locale === "en" ? "Apply" : "신청하기"}
        </a>
      </div>
    </section>
  );
}
