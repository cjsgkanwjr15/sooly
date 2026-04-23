import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { supabaseServer } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";

export const revalidate = 3600;

const CATEGORIES: Array<{ name: string; hint: string; emoji: string }> = [
  { name: "탁주", hint: "막걸리의 뿌리", emoji: "🍶" },
  { name: "약주", hint: "맑고 우아한", emoji: "🪷" },
  { name: "청주", hint: "한국의 정수", emoji: "🌾" },
  { name: "증류주", hint: "강렬한 향기", emoji: "🔥" },
  { name: "과실주", hint: "계절의 단맛", emoji: "🍇" },
  { name: "리큐르", hint: "조화의 술", emoji: "🍯" },
];

export default async function Home() {
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
      .select("id, name_ko, category, abv, volume_ml, breweries(name_ko, region)")
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

  // Featured brewery — 찾아가는 양조장 중 랜덤 하나
  const { data: featuredBrewery } = await sb
    .from("breweries")
    .select("id, name_ko, region, story_ko, founded_year")
    .eq("is_visiting_brewery", true)
    .limit(1)
    .single();

  return (
    <main className="flex flex-col">
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[color-mix(in_oklab,var(--color-primary)_6%,var(--color-background))] via-background to-background" />
        <DecorativeVessel className="pointer-events-none absolute right-[-6%] top-[8%] -z-10 h-[520px] w-auto text-primary/[0.06] sm:right-[4%]" />

        <div className="mx-auto max-w-5xl px-6 py-20 sm:py-28 lg:py-32">
          <p className="font-kr-serif text-xs tracking-[0.3em] text-primary/70 uppercase">
            Korean alcohol, curated
          </p>
          <h1 className="mt-6 font-serif text-[2.75rem] font-medium leading-[1.1] tracking-tight sm:text-[3.75rem] lg:text-[4.5rem]">
            한국술을 <em className="not-italic text-primary">발견</em>하고,<br />
            기록하고, 공유하세요.
          </h1>
          <p className="mt-7 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            전통주·막걸리·소주·과실주 {productCount ?? 0}종과 전국 양조장 {breweryCount ?? 0}곳.
            이름만 알던 술의 맛·지역·양조장 이야기를 한 자리에서.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/products" className={buttonVariants({ size: "lg" })}>
              제품 둘러보기
            </Link>
            <Link
              href="/breweries"
              className={buttonVariants({ size: "lg", variant: "outline" })}
            >
              양조장 찾아보기
            </Link>
          </div>

          <dl className="mt-16 flex flex-wrap gap-x-10 gap-y-6 border-t pt-8 text-sm">
            <Stat label="제품" value={productCount ?? 0} />
            <Stat label="양조장" value={breweryCount ?? 0} />
            <Stat label="지역" value={17} />
            <Stat label="카테고리" value={6} />
          </dl>
        </div>
      </section>

      {/* ===== 카테고리 둘러보기 ===== */}
      <section className="border-t px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                Explore by style
              </p>
              <h2 className="mt-1 font-serif text-3xl font-semibold tracking-tight">
                카테고리 둘러보기
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {CATEGORIES.map((c) => (
              <Link
                key={c.name}
                href={`/categories/${encodeURIComponent(c.name)}`}
                className="group rounded-xl border bg-card p-5 text-center transition-all hover:-translate-y-0.5 hover:border-primary/30"
              >
                <div className="text-3xl sm:text-4xl" aria-hidden>{c.emoji}</div>
                <div className="mt-3 font-serif text-base font-medium group-hover:underline">
                  {c.name}
                </div>
                <div className="mt-0.5 text-xs text-muted-foreground">{c.hint}</div>
                <div className="mt-2 text-[10px] uppercase tracking-wider text-primary/70">
                  {catMap.get(c.name) ?? 0}개
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
                  Today's Picks
                </p>
                <h2 className="mt-1 font-serif text-3xl font-semibold tracking-tight">
                  오늘의 발견
                </h2>
              </div>
              <Link
                href="/products"
                className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                전체 보기 →
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {picks.map((p) => {
                const brewery = Array.isArray(p.breweries) ? p.breweries[0] : p.breweries;
                return (
                  <Link
                    key={p.id}
                    href={`/products/${p.id}`}
                    className="group flex flex-col rounded-xl border border-border/60 bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-md"
                  >
                    {p.category && (
                      <Badge variant="secondary" className="w-fit text-[10px]">
                        {p.category}
                      </Badge>
                    )}
                    <div className="mt-3 font-serif text-xl font-medium leading-snug group-hover:underline">
                      {p.name_ko}
                    </div>
                    <div className="mt-2 text-sm text-muted-foreground">
                      {brewery?.name_ko ?? "양조장 미상"}
                      {brewery?.region && (
                        <span className="ml-1 text-xs opacity-70">· {brewery.region}</span>
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
                Featured Brewery
              </p>
              <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
                이번 주 양조장
              </h2>
              <p className="mt-2 font-serif text-2xl text-primary">
                {featuredBrewery.name_ko}
              </p>
              {featuredBrewery.region && (
                <p className="mt-1 text-sm text-muted-foreground">
                  {featuredBrewery.region}
                  {featuredBrewery.founded_year && ` · 설립 ${featuredBrewery.founded_year}년`}
                </p>
              )}
              <Link
                href={`/breweries/${featuredBrewery.id}`}
                className="mt-5 inline-block text-sm font-medium underline underline-offset-4 hover:text-primary"
              >
                양조장 이야기 보기 →
              </Link>
            </div>
            <blockquote className="border-l-2 border-primary/30 pl-6 italic leading-relaxed text-muted-foreground">
              {featuredBrewery.story_ko ?? "이 양조장의 이야기는 곧 업데이트됩니다."}
            </blockquote>
          </div>
        </section>
      )}

      {/* ===== Journal Teaser ===== */}
      <section className="border-t bg-[color-mix(in_oklab,var(--color-primary)_3%,var(--color-background))]">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              Journal
            </p>
            <h2 className="mt-1 font-serif text-3xl font-semibold tracking-tight">
              마시는 즐거움, 읽는 깊이
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              양조장 방문기, 페어링 가이드, 전통주의 역사. 한국술을 더 풍성하게 즐기기 위한 읽을거리.
            </p>
            <Link
              href="/blog"
              className="mt-6 inline-block text-sm font-medium underline underline-offset-4 hover:text-primary"
            >
              블로그 읽으러 가기 →
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wider text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 font-serif text-2xl font-medium">{value}</dd>
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
