import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { supabaseServer } from "@/lib/supabase/server";

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
      <section className="border-b bg-[color-mix(in_oklab,var(--color-primary)_4%,var(--color-background))]">
        <div className="mx-auto max-w-4xl px-6 py-24 text-center sm:py-32">
          <p className="mb-4 font-kr-serif text-sm tracking-widest text-primary/80 uppercase">
            Korean alcohol, curated
          </p>
          <h1 className="font-serif text-5xl font-semibold tracking-tight sm:text-6xl">
            한국술의 모든 것
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            전통주·막걸리·소주·과실주 {productCount ?? 0}종을 한 곳에서 발견하고, 기록하고, 공유하세요.
          </p>

          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link
              href="/products"
              className={buttonVariants({ size: "lg" })}
            >
              제품 둘러보기
            </Link>
            <Link
              href="/breweries"
              className={buttonVariants({ size: "lg", variant: "outline" })}
            >
              양조장 찾아보기
            </Link>
          </div>

          <dl className="mx-auto mt-14 flex max-w-sm justify-center gap-12 text-sm text-muted-foreground">
            <div>
              <dt>제품</dt>
              <dd className="font-serif text-3xl font-semibold text-foreground">
                {productCount ?? 0}
              </dd>
            </div>
            <div>
              <dt>양조장</dt>
              <dd className="font-serif text-3xl font-semibold text-foreground">
                {breweryCount ?? 0}
              </dd>
            </div>
            <div>
              <dt>지역</dt>
              <dd className="font-serif text-3xl font-semibold text-foreground">17</dd>
            </div>
          </dl>
        </div>
      </section>

      {picks && picks.length > 0 && (
        <section className="mx-auto w-full max-w-6xl px-6 py-16">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="font-serif text-2xl font-semibold tracking-tight">
              오늘의 발견
            </h2>
            <Link
              href="/products"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              전체 보기 →
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {picks.map((p) => {
              const brewery = Array.isArray(p.breweries) ? p.breweries[0] : p.breweries;
              return (
                <Link
                  key={p.id}
                  href={`/products/${p.id}`}
                  className="group rounded-lg border bg-card p-5 transition-colors hover:bg-accent/50"
                >
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">
                    {p.category ?? ""}
                  </div>
                  <div className="mt-1.5 font-serif text-lg font-medium leading-snug group-hover:underline">
                    {p.name_ko}
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground">
                    {brewery?.name_ko ?? "양조장 미상"}
                    {brewery?.region && (
                      <span className="ml-1 text-xs opacity-70">· {brewery.region}</span>
                    )}
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

      <footer className="border-t py-6 text-center text-xs text-muted-foreground">
        일부 데이터 출처: 더술닷컴(aT). 제품 정보는 지속적으로 업데이트됩니다.
      </footer>
    </main>
  );
}
