import Link from "next/link";
import { notFound } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import { PhotoPlaceholder } from "@/components/photo-placeholder";
import { BreweryContentSlot } from "@/components/brewery-content-slot";
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
  category: string | null;
  abv: number | null;
  volume_ml: number | null;
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
  const { data: products } = await sb
    .from("products")
    .select("id, name_ko, category, abv, volume_ml")
    .eq("brewery_id", id)
    .order("name_ko")
    .returns<BreweryProduct[]>();

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
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
        alt={`${brewery.name_ko} 양조장 전경`}
        aspectRatio="16/9"
        className="mb-8"
      />

      <header className="mb-10">
        <div className="mb-3 text-xs uppercase tracking-widest text-primary/80">
          양조장
        </div>
        <h1 className="font-serif text-4xl font-semibold tracking-tight sm:text-5xl">
          {brewery.name_ko}
        </h1>
        {brewery.name_en && (
          <p className="mt-2 text-lg text-muted-foreground">{brewery.name_en}</p>
        )}
        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
          {brewery.region && <span>{brewery.region}</span>}
          {brewery.founded_year && <span>설립 {brewery.founded_year}년</span>}
          {brewery.is_visiting_brewery && (
            <span className="rounded-full border border-primary/30 bg-primary/5 px-2 py-0.5 text-xs text-primary">
              찾아가는 양조장
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

      {brewery.story_ko && (
        <section className="mb-10">
          <h2 className="mb-3 text-sm font-medium uppercase tracking-wider text-muted-foreground">
            이야기
          </h2>
          <p className="whitespace-pre-line leading-relaxed text-muted-foreground">
            {brewery.story_ko}
          </p>
        </section>
      )}

      <section className="mb-10">
        <BreweryContentSlot variant="brewery" breweryName={brewery.name_ko} />
      </section>

      {products && products.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-muted-foreground">
            제품 <span className="text-foreground">{products.length}</span>
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {products.map((p) => (
              <Link
                key={p.id}
                href={`/products/${p.id}`}
                className="group rounded-md border bg-card p-4 transition-colors hover:border-primary/30"
              >
                <div className="font-serif text-base font-medium leading-snug group-hover:underline">
                  {p.name_ko}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {p.category}
                  {p.abv != null && ` · ${p.abv}%`}
                  {p.volume_ml != null && ` · ${p.volume_ml}ml`}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
