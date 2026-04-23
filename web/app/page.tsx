import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { supabaseServer } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";

export const revalidate = 3600;

export default async function Home() {
  const sb = await supabaseServer();

  const [
    { count: productCount },
    { count: breweryCount },
    { data: picks },
  ] = await Promise.all([
    sb.from("products").select("*", { count: "exact", head: true }),
    sb.from("breweries").select("*", { count: "exact", head: true }),
    sb
      .from("products")
      .select("id, name_ko, category, abv, volume_ml, breweries(name_ko, region)")
      .not("category", "is", null)
      .limit(6),
  ]);

  return (
    <main className="flex flex-col">
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden">
        {/* 배경: 따뜻한 수직 그라데이션 + 은은한 장식 */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[color-mix(in_oklab,var(--color-primary)_6%,var(--color-background))] via-background to-background" />
        {/* 큰 장식용 주전자 실루엣 — 오른쪽에 아주 은은하게 */}
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

      {/* ===== 오늘의 발견 ===== */}
      {picks && picks.length > 0 && (
        <section className="mx-auto w-full max-w-6xl px-6 py-20">
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
        </section>
      )}

      {/* ===== 블로그 티저 (블로그가 생기면 자동 연결) ===== */}
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

      <footer className="border-t py-8 text-center text-xs text-muted-foreground">
        <p>© 2026 Sooly · 한국술 정보 허브</p>
        <p className="mt-1">일부 데이터 출처: 더술닷컴(aT)</p>
      </footer>
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
