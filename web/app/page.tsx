import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { supabaseServer } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { getLocale } from "@/lib/locale";
import { getAllPosts } from "@/lib/blog";
import { t, tCategory, tCategoryHint, tRegion } from "@/lib/i18n";

export const revalidate = 3600;

type FeaturedBrewery = {
  id: string;
  name_ko: string;
  region: string | null;
  story_ko: string | null;
  founded_year: number | null;
};

// 카테고리 한국어 키 (DB column 그대로). 이름·hint 는 dictionary, emoji 만 코드에.
const CATEGORY_KEYS = [
  "탁주",
  "약주",
  "청주",
  "증류주",
  "과실주",
  "리큐르",
] as const;
const CATEGORY_EMOJI: Record<string, string> = {
  탁주: "🍶",
  약주: "🪷",
  청주: "🌾",
  증류주: "🔥",
  과실주: "🍇",
  리큐르: "🍯",
};

export default async function Home() {
  const locale = await getLocale();
  const sb = await supabaseServer();

  const [
    { count: productCount },
    { count: breweryCount },
    { data: picks },
    { data: categoryCounts },
  ] = await Promise.all([
    sb.from("products").select("*", { count: "exact", head: true }),
    sb.from("breweries").select("*", { count: "exact", head: true }),
    sb
      .from("products")
      .select("id, name_ko, name_en, category, abv, volume_ml, breweries(name_ko, name_en, region)")
      .not("category", "is", null)
      .limit(6),
    sb.from("products").select("category"),
  ]);

  // 카테고리별 제품 수 집계
  const catMap = new Map<string, number>();
  for (const p of categoryCounts ?? []) {
    if (!p.category) continue;
    catMap.set(p.category, (catMap.get(p.category) ?? 0) + 1);
  }

  // Featured brewery — 1순위 찾아가는 양조장, 없으면 임의 양조장 (revalidate=3600 라
  // 시간당 한 번 변경). is_visiting_brewery flag 가 아직 채워지지 않았어도 빈 영역
  // 없이 항상 한 곳을 노출.
  let featuredBrewery: FeaturedBrewery | null = null;
  const { data: visiting } = await sb
    .from("breweries")
    .select("id, name_ko, region, story_ko, founded_year")
    .eq("is_visiting_brewery", true)
    .limit(1);
  if (visiting && visiting.length > 0) {
    featuredBrewery = visiting[0];
  } else {
    const { data: pool } = await sb
      .from("breweries")
      .select("id, name_ko, region, story_ko, founded_year")
      .order("created_at", { ascending: false })
      .limit(20);
    if (pool && pool.length > 0) {
      featuredBrewery = pool[Math.floor(Math.random() * pool.length)];
    }
  }

  // 최신 블로그 글 (Journal 섹션 카드용)
  const allPosts = await getAllPosts(locale);
  const latestPosts = allPosts.slice(0, 2);

  return (
    <main className="flex flex-col">
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden">
        {/* Layered background: stronger gradient + subtle dot pattern + two decorative vessels */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[color-mix(in_oklab,var(--color-primary)_14%,var(--color-background))] via-[color-mix(in_oklab,var(--color-primary)_4%,var(--color-background))] to-background" />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 text-primary opacity-[0.05]"
          style={{
            backgroundImage:
              "radial-gradient(circle, currentColor 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <DecorativeVessel className="pointer-events-none absolute right-[-4%] top-[2%] -z-10 h-[560px] w-auto text-primary/[0.10] sm:h-[640px] lg:right-[-2%]" />
        <DecorativeVessel className="pointer-events-none absolute -left-24 -bottom-32 -z-10 hidden h-[420px] w-auto rotate-12 text-primary/[0.05] lg:block" />

        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[1.55fr_1fr] lg:gap-16">
            {/* Left — copy + CTAs */}
            <div>
              <p className="font-kr-serif text-xs tracking-[0.3em] text-primary/70 uppercase">
                {t(locale, "home.hero.uppercase")}
              </p>
              <h1 className="mt-6 font-serif text-[2.75rem] font-medium leading-[1.1] tracking-tight sm:text-[3.75rem] lg:text-[4.5rem]">
                {t(locale, "home.hero.h1Pre")}
                <em className="not-italic text-primary">
                  {t(locale, "home.hero.h1Highlight")}
                </em>
                {t(locale, "home.hero.h1Mid")
                  .split("\n")
                  .map((line, i, arr) => (
                    <span key={i}>
                      {line}
                      {i < arr.length - 1 && <br />}
                    </span>
                  ))}
              </h1>
              <p className="mt-7 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                {t(locale, "home.hero.description", {
                  productCount: productCount ?? 0,
                  breweryCount: breweryCount ?? 0,
                })}
              </p>

              <div className="mt-10 flex flex-wrap gap-3">
                <Link href="/products" className={buttonVariants({ size: "lg" })}>
                  {t(locale, "home.hero.browseProducts")}
                </Link>
                <Link
                  href="/breweries"
                  className={buttonVariants({ size: "lg", variant: "outline" })}
                >
                  {t(locale, "home.hero.findBreweries")}
                </Link>
              </div>
            </div>

            {/* Right — "오늘의 술" mini-card (lg+) */}
            {picks && picks[0] && (
              <aside className="hidden self-center lg:block">
                <Link
                  href={`/products/${picks[0].id}`}
                  className="group relative block overflow-hidden rounded-2xl border border-border/60 bg-card/80 p-7 shadow-sm backdrop-blur transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
                >
                  <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-primary/80">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/60 opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                    </span>
                    {t(locale, "home.hero.todayPick")}
                  </div>
                  {picks[0].category && (
                    <Badge variant="secondary" className="mt-4 w-fit text-[10px]">
                      {tCategory(locale, picks[0].category)}
                    </Badge>
                  )}
                  <div className="mt-3 font-serif text-2xl font-medium leading-snug group-hover:underline">
                    {(() => {
                      const p = picks[0];
                      if (locale === "en" && p.name_en && p.name_en.trim())
                        return p.name_en;
                      return p.name_ko;
                    })()}
                  </div>
                  {(() => {
                    const brewery = Array.isArray(picks[0].breweries)
                      ? picks[0].breweries[0]
                      : picks[0].breweries;
                    if (!brewery) return null;
                    const breweryName =
                      locale === "en" && brewery.name_en && brewery.name_en.trim()
                        ? brewery.name_en
                        : brewery.name_ko;
                    return (
                      <div className="mt-1.5 text-sm text-muted-foreground">
                        {breweryName}
                        {brewery.region && (
                          <span className="ml-1 text-xs opacity-70">
                            · {tRegion(locale, brewery.region)}
                          </span>
                        )}
                      </div>
                    );
                  })()}
                  <div className="mt-5 flex items-center gap-3 text-xs text-muted-foreground">
                    {picks[0].abv != null && <span>{picks[0].abv}%</span>}
                    {picks[0].volume_ml != null && (
                      <span>{picks[0].volume_ml}ml</span>
                    )}
                  </div>
                  <div className="mt-5 text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                    {t(locale, "home.hero.productPageLink")}
                  </div>
                </Link>
              </aside>
            )}
          </div>

          {/* Stats — 카드형 (가로 4 박스) */}
          <dl className="mt-16 grid grid-cols-2 gap-3 border-t pt-8 sm:grid-cols-4 sm:gap-4">
            <StatCard
              label={t(locale, "home.stats.productsLabel")}
              value={productCount ?? 0}
              suffix={t(locale, "home.stats.productsSuffix")}
            />
            <StatCard
              label={t(locale, "home.stats.breweriesLabel")}
              value={breweryCount ?? 0}
              suffix={t(locale, "home.stats.breweriesSuffix")}
            />
            <StatCard
              label={t(locale, "home.stats.regionsLabel")}
              value={17}
              suffix={t(locale, "home.stats.regionsSuffix")}
            />
            <StatCard
              label={t(locale, "home.stats.categoriesLabel")}
              value={6}
              suffix={t(locale, "home.stats.categoriesSuffix")}
            />
          </dl>
        </div>
      </section>

      {/* ===== 카테고리 둘러보기 ===== */}
      <section className="border-t px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                {t(locale, "home.categoriesSection.subtitle")}
              </p>
              <h2 className="mt-1 font-serif text-3xl font-semibold tracking-tight">
                {t(locale, "home.categoriesSection.h2")}
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {CATEGORY_KEYS.map((key) => (
              <Link
                key={key}
                href={`/categories/${encodeURIComponent(key)}`}
                className="group flex flex-col items-center rounded-xl border border-border/60 bg-card p-5 text-center transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-md"
              >
                <div
                  aria-hidden
                  className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/5 text-3xl transition-colors group-hover:bg-primary/10 sm:h-16 sm:w-16 sm:text-4xl"
                >
                  {CATEGORY_EMOJI[key]}
                </div>
                <div className="mt-3 font-serif text-base font-medium group-hover:underline">
                  {tCategory(locale, key)}
                </div>
                <div className="mt-0.5 text-xs text-muted-foreground">
                  {tCategoryHint(locale, key)}
                </div>
                <div className="mt-2 text-xs font-semibold text-primary">
                  {catMap.get(key) ?? 0}
                  {t(locale, "home.categoriesSection.countSuffix")}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 오늘의 발견 ===== */}
      {picks && picks.length > 0 && (
        <section className="border-t bg-background px-6 py-16">
          <div className="mx-auto max-w-6xl">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">
                  {t(locale, "home.picksSection.subtitle")}
                </p>
                <h2 className="mt-1 font-serif text-3xl font-semibold tracking-tight">
                  {t(locale, "home.picksSection.h2")}
                </h2>
              </div>
              <Link
                href="/products"
                className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                {t(locale, "common.viewAll")}
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {picks.map((p) => {
                const brewery = Array.isArray(p.breweries)
                  ? p.breweries[0]
                  : p.breweries;
                const productName =
                  locale === "en" && p.name_en && p.name_en.trim()
                    ? p.name_en
                    : p.name_ko;
                const breweryName = brewery
                  ? locale === "en" && brewery.name_en && brewery.name_en.trim()
                    ? brewery.name_en
                    : brewery.name_ko
                  : t(locale, "home.hero.noBreweryName");
                return (
                  <Link
                    key={p.id}
                    href={`/products/${p.id}`}
                    className="group flex flex-col rounded-xl border border-border/60 bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-md"
                  >
                    {p.category && (
                      <Badge variant="secondary" className="w-fit text-[10px]">
                        {tCategory(locale, p.category)}
                      </Badge>
                    )}
                    <div className="mt-3 font-serif text-xl font-medium leading-snug group-hover:underline">
                      {productName}
                    </div>
                    <div className="mt-2 text-sm text-muted-foreground">
                      {breweryName}
                      {brewery?.region && (
                        <span className="ml-1 text-xs opacity-70">· {tRegion(locale, brewery.region)}</span>
                      )}
                    </div>
                    <div className="mt-auto pt-5 flex gap-3 text-xs text-muted-foreground">
                      {p.abv != null && <span>{p.abv}%</span>}
                      {p.volume_ml != null && <span>{p.volume_ml}ml</span>}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ===== Featured Brewery ===== */}
      {featuredBrewery && (
        <section className="border-t px-6 py-16">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                {t(locale, "home.featuredSection.subtitle")}
              </p>
              <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
                {t(locale, "home.featuredSection.h2")}
              </h2>
              <p className="mt-2 font-serif text-2xl text-primary">
                {featuredBrewery.name_ko}
              </p>
              {featuredBrewery.region && (
                <p className="mt-1 text-sm text-muted-foreground">
                  {tRegion(locale, featuredBrewery.region)}
                  {featuredBrewery.founded_year &&
                    ` · ${t(locale, "home.featuredSection.foundedYearLabel", {
                      year: featuredBrewery.founded_year,
                    })}`}
                </p>
              )}
              <Link
                href={`/breweries/${featuredBrewery.id}`}
                className="mt-5 inline-block text-sm font-medium underline underline-offset-4 hover:text-primary"
              >
                {t(locale, "home.featuredSection.viewStory")}
              </Link>
            </div>
            <blockquote className="border-l-2 border-primary/30 pl-6 italic leading-relaxed text-muted-foreground">
              {featuredBrewery.story_ko ??
                t(locale, "home.featuredSection.emptyStory")}
            </blockquote>
          </div>
        </section>
      )}

      {/* ===== Journal — 실제 최신 글 카드 ===== */}
      <section className="border-t bg-[color-mix(in_oklab,var(--color-primary)_3%,var(--color-background))]">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                {t(locale, "home.journalSection.subtitle")}
              </p>
              <h2 className="mt-1 font-serif text-3xl font-semibold tracking-tight">
                {t(locale, "home.journalSection.h2")}
              </h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                {t(locale, "home.journalSection.description")}
              </p>
            </div>
            <Link
              href="/blog"
              className="text-sm font-medium underline-offset-4 hover:text-primary hover:underline"
            >
              {t(locale, "common.viewAll")}
            </Link>
          </div>

          {latestPosts.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2">
              {latestPosts.map((post) => (
                <Link
                  key={`${post.slug}-${post.locale}`}
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col rounded-xl border border-border/60 bg-card p-7 transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-md"
                >
                  <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
                    <span>{post.date}</span>
                    <span aria-hidden>·</span>
                    <span>
                      {post.readingMinutes}
                      {t(locale, "home.journalSection.readingMinutesSuffix")}
                    </span>
                    {post.locale !== locale && (
                      <Badge variant="secondary" className="ml-1 text-[10px]">
                        {post.locale.toUpperCase()}
                      </Badge>
                    )}
                  </div>
                  <h3 className="mt-3 font-serif text-2xl font-medium leading-snug group-hover:underline">
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground line-clamp-3">
                      {post.excerpt}
                    </p>
                  )}
                  <div className="mt-auto pt-5 text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                    {t(locale, "home.journalSection.readMore")}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border/60 bg-card p-10 text-center text-sm text-muted-foreground">
              {t(locale, "home.journalSection.empty")}
            </div>
          )}
        </div>
      </section>

    </main>
  );
}

function StatCard({
  label,
  value,
  suffix,
}: {
  label: string;
  value: number;
  suffix?: string;
}) {
  return (
    <div className="rounded-xl border border-border/50 bg-card/60 px-4 py-3 backdrop-blur transition-colors hover:border-primary/30">
      <dt className="text-[11px] uppercase tracking-wider text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-1 font-serif text-2xl font-medium leading-none">
        {value.toLocaleString()}
        {suffix && (
          <span className="ml-1 text-sm font-normal text-muted-foreground">
            {suffix}
          </span>
        )}
      </dd>
    </div>
  );
}

function DecorativeVessel({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M70 30 L70 70 Q70 75 80 77 L80 110 Q40 125 40 200 Q40 260 100 270 Q160 265 160 200 Q160 125 120 110 L120 77 Q130 75 130 70 L130 30 Z"
        fill="currentColor"
      />
    </svg>
  );
}
