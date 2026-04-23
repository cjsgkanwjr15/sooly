import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { supabaseServer } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";

export const revalidate = 1800;

type Params = { slug: string };

/**
 * 카테고리별 큐레이션 페이지. Vivino 의 "Wine styles" 포맷.
 * - 카테고리 소개 (역사·특징·마시는 법)
 * - 이 카테고리의 제품 리스트 (필터 기본 적용)
 * - 대표 양조장 몇 곳
 */

const CATEGORY_INFO: Record<
  string,
  {
    title: string;
    tagline: string;
    description: string;
    tips: string[];
  }
> = {
  탁주: {
    title: "탁주",
    tagline: "쌀과 누룩이 빚어내는 우리네 가장 친숙한 술",
    description:
      "탁주는 막걸리로도 불리며, 쌀을 주원료로 누룩과 물을 섞어 발효시킨 뒤 걸러내지 않은 술입니다. 뿌연 빛깔과 부드러운 목넘김, 은은한 단맛과 시큼함이 어우러진 맛이 특징. 도수는 보통 5~12% 사이로 가볍게 즐기기 좋습니다.",
    tips: [
      "처음 마실 땐 차갑게 (5~7℃) 시작해보세요",
      "부침개·보쌈·전·파전 등 기름진 음식과 완벽한 궁합",
      "마시기 전 가볍게 흔들어 침전물을 섞어주세요",
    ],
  },
  약주: {
    title: "약주",
    tagline: "쌀의 맑은 정수를 뽑아낸 은근한 깊이의 술",
    description:
      "약주는 탁주에서 가라앉은 맑은 윗부분만 떠낸 맑은 술입니다. 맛이 깔끔하면서 쌀의 단맛과 누룩의 향이 어우러져 우아한 풍미를 냅니다. 도수는 13~18% 사이가 일반적.",
    tips: [
      "상온~약간 차가운 온도(10~14℃)에서 향이 가장 잘 피어납니다",
      "회, 나물, 두부 같은 담백한 음식과 어울림",
      "잔은 얕고 넓은 것으로 — 향을 충분히 느낄 수 있게",
    ],
  },
  청주: {
    title: "청주",
    tagline: "섬세함의 정점, 우리 술의 귀공자",
    description:
      "청주는 약주와 비슷하나 더욱 정제된 맑은 술입니다. 일본의 사케와 기원이 같으며, 차갑게 마시면 과실향, 따뜻하게 마시면 쌀의 단맛이 두드러집니다. 도수 14~18%.",
    tips: [
      "냉장 또는 40℃ 내외로 따뜻하게(데움주)",
      "생선회·초밥·담백한 일식과 페어링",
      "개봉 후 1주일 내에 마시는 게 좋음",
    ],
  },
  증류주: {
    title: "증류주",
    tagline: "강렬하고 순수한 한국의 정수",
    description:
      "전통 소주를 포함한 증류주는 발효주를 증류해 얻은 맑은 술입니다. 높은 도수(25~45%)에 원재료의 향이 농축돼 있으며, 향이 오래 남는 것이 특징. 안동소주, 이강주 등 지역별 명주가 유명.",
    tips: [
      "스트레이트로 향을 먼저 음미한 뒤 얼음을 넣어 변화를 즐기기",
      "튀김·전 같은 기름진 음식과 잘 맞음",
      "소량씩 천천히 — 도수가 높아 빠르게 취함",
    ],
  },
  과실주: {
    title: "과실주",
    tagline: "계절의 과일을 담은 발효의 예술",
    description:
      "복분자·머루·사과·매실 등 과실을 발효해 빚은 술. 과일 본연의 단맛·산미·향이 살아있어 입문자도 편하게 접근할 수 있습니다. 도수는 보통 8~15%.",
    tips: [
      "차갑게 마시거나 탄산수와 섞어 가볍게",
      "디저트·치즈·과일과 페어링",
      "달콤한 맛이 강하니 소량씩",
    ],
  },
  리큐르: {
    title: "리큐르",
    tagline: "증류주 위에 향과 풍미를 더한 한국식 조화",
    description:
      "증류주에 과실·약초·꿀 등을 침출하거나 조합해 만든 술. 도수는 15~40% 범위로 다양하며, 향긋하고 달콤한 스타일이 많아 칵테일 베이스로도 훌륭합니다.",
    tips: [
      "스트레이트, 온더락, 토닉워터 조합 등 다양하게",
      "디저트 와인처럼 식후주로 잘 어울림",
      "감미로움을 살리려면 차갑게",
    ],
  },
};

export async function generateStaticParams() {
  return Object.keys(CATEGORY_INFO).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const decoded = decodeURIComponent(slug);
  const info = CATEGORY_INFO[decoded];
  if (!info) return { title: "카테고리 없음" };
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
  const info = CATEGORY_INFO[category];
  if (!info) notFound();

  const sb = await supabaseServer();

  const [{ data: products, count }, { data: regions }] = await Promise.all([
    sb
      .from("products")
      .select("id, name_ko, abv, volume_ml, breweries(id, name_ko, region)", { count: "exact" })
      .eq("category", category)
      .order("name_ko"),
    sb
      .from("breweries")
      .select("id, name_ko, region")
      .limit(6), // 대충 6개, 추후 실제 featured 로직
  ]);

  // 이 카테고리 대표 양조장 (제품 수 많은 순 — 간단한 집계)
  const breweryCounts = new Map<string, { id: string; name_ko: string; region: string | null; count: number }>();
  for (const p of products ?? []) {
    const b = Array.isArray(p.breweries) ? p.breweries[0] : p.breweries;
    if (!b) continue;
    const existing = breweryCounts.get(b.id);
    if (existing) existing.count++;
    else breweryCounts.set(b.id, { id: b.id, name_ko: b.name_ko, region: b.region, count: 1 });
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
            <Link href="/products" className="hover:text-foreground">제품</Link>
            <span> · {info.title}</span>
          </nav>
          <p className="text-xs uppercase tracking-[0.3em] text-primary/70">Category</p>
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
          마시는 법
        </h2>
        <ul className="space-y-3">
          {info.tips.map((tip, i) => (
            <li key={i} className="flex gap-4">
              <span className="font-serif text-primary">{String(i + 1).padStart(2, "0")}</span>
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
              {info.title} 를 만드는 대표 양조장
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {topBreweries.map((b) => (
                <Link
                  key={b.id}
                  href={`/breweries/${b.id}`}
                  className="group rounded-lg border bg-card p-4 text-center transition-colors hover:border-primary/30"
                >
                  <div className="font-serif text-sm font-medium leading-tight group-hover:underline">
                    {b.name_ko}
                  </div>
                  {b.region && (
                    <div className="mt-1 text-xs text-muted-foreground">{b.region}</div>
                  )}
                  <div className="mt-2 text-[10px] uppercase tracking-wider text-primary/70">
                    {b.count}개 제품
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Products */}
      <section className="border-t px-6 py-14">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="font-serif text-2xl font-semibold tracking-tight">
              {info.title} 제품 <span className="text-muted-foreground">({count ?? 0})</span>
            </h2>
            <Link
              href={`/products?category=${encodeURIComponent(category)}`}
              className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              필터로 보기 →
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(products ?? []).slice(0, 24).map((p) => {
              const b = Array.isArray(p.breweries) ? p.breweries[0] : p.breweries;
              return (
                <Link
                  key={p.id}
                  href={`/products/${p.id}`}
                  className="group flex flex-col rounded-lg border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/30"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-serif text-lg font-medium leading-tight group-hover:underline">
                      {p.name_ko}
                    </h3>
                    <Badge variant="secondary" className="shrink-0 text-[10px]">
                      {info.title}
                    </Badge>
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground">
                    {b?.name_ko ?? "양조장 미상"}
                    {b?.region && <span className="ml-1 text-xs opacity-70">· {b.region}</span>}
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
                {info.title} 전체 {count}개 보기 →
              </Link>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
