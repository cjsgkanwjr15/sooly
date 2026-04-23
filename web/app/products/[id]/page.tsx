import Link from "next/link";
import { notFound } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
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

type RelatedProduct = {
  id: string;
  name_ko: string;
  category: string | null;
  abv: number | null;
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

  // 같은 양조장의 다른 제품 (최대 6개)
  let related: RelatedProduct[] = [];
  if (brewery?.id) {
    const sb = await supabaseServer();
    const { data } = await sb
      .from("products")
      .select("id, name_ko, category, abv")
      .eq("brewery_id", brewery.id)
      .neq("id", product.id)
      .limit(6);
    related = data ?? [];
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <nav className="mb-8 text-sm text-muted-foreground">
        <Link href="/products" className="hover:text-foreground">제품</Link>
        {product.category && (
          <>
            {" "}·{" "}
            <Link
              href={`/products?category=${encodeURIComponent(product.category)}`}
              className="hover:text-foreground"
            >
              {product.category}
            </Link>
          </>
        )}
      </nav>

      <article>
        <header className="mb-10">
          {product.category && (
            <div className="mb-3 text-xs uppercase tracking-widest text-primary/80">
              {product.category}
            </div>
          )}
          <h1 className="font-serif text-4xl font-semibold tracking-tight sm:text-5xl">
            {product.name_ko}
          </h1>
          {product.name_en && (
            <p className="mt-2 text-lg text-muted-foreground">{product.name_en}</p>
          )}
          {brewery && (
            <p className="mt-5 text-base">
              <Link
                href={`/breweries/${brewery.id}`}
                className="font-medium text-foreground hover:underline"
              >
                {brewery.name_ko}
              </Link>
              {brewery.region && (
                <span className="text-muted-foreground"> · {brewery.region}</span>
              )}
            </p>
          )}
        </header>

        <dl className="mb-10 grid grid-cols-2 gap-6 border-y py-6 sm:grid-cols-4">
          <Stat label="도수" value={product.abv != null ? `${product.abv}%` : "—"} />
          <Stat label="용량" value={product.volume_ml != null ? `${product.volume_ml}ml` : "—"} />
          <Stat label="카테고리" value={product.category ?? "—"} />
          <Stat label="지역" value={brewery?.region ?? "—"} />
        </dl>

        {product.tasting_notes_ko ? (
          <Section title="맛 노트">
            <p className="whitespace-pre-line leading-relaxed">
              {product.tasting_notes_ko}
            </p>
          </Section>
        ) : (
          <Section title="맛 노트">
            <p className="text-sm text-muted-foreground italic">
              곧 정리된 맛 노트가 제공됩니다.
            </p>
          </Section>
        )}

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
            <ul className="space-y-1.5 text-sm leading-relaxed">
              {product.pairing_suggestions.map((p, i) => (
                <li key={i} className="text-foreground">· {p}</li>
              ))}
            </ul>
          </Section>
        )}

        {brewery?.story_ko && (
          <Section title={`${brewery.name_ko} 이야기`}>
            <p className="whitespace-pre-line leading-relaxed text-muted-foreground">
              {brewery.story_ko}
            </p>
          </Section>
        )}

        {related.length > 0 && brewery && (
          <Section title={`${brewery.name_ko}의 다른 제품`}>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {related.map((r) => (
                <Link
                  key={r.id}
                  href={`/products/${r.id}`}
                  className="rounded-md border bg-card p-3 text-sm transition-colors hover:border-primary/30"
                >
                  <div className="font-medium">{r.name_ko}</div>
                  <div className="mt-0.5 text-xs text-muted-foreground">
                    {r.category}
                    {r.abv != null && ` · ${r.abv}%`}
                  </div>
                </Link>
              ))}
            </div>
          </Section>
        )}

        {product.source_url && (
          <div className="mt-10 border-t pt-6 text-xs text-muted-foreground">
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
      </article>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-1 font-serif text-xl font-medium">{value}</dd>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="mb-3 text-sm font-medium uppercase tracking-wider text-muted-foreground">
        {title}
      </h2>
      {children}
    </section>
  );
}
