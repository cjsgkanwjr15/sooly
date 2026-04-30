import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { supabaseServer } from "@/lib/supabase/server";
import { getLocale, pick, type Locale } from "@/lib/locale";
import { PhotoPlaceholder } from "@/components/photo-placeholder";

export const revalidate = 60;

type Profile = {
  id: string;
  username: string;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  locale: string;
};

type ProductLite = {
  id: string;
  name_ko: string;
  name_en: string | null;
  category: string | null;
  abv: number | null;
  image_url: string | null;
};

type CheckInWithProduct = {
  id: string;
  rating: number;
  pairing: string | null;
  note: string | null;
  drank_at: string | null;
  created_at: string;
  products: ProductLite | ProductLite[] | null;
};

type BreweryLite = {
  id: string;
  name_ko: string;
  name_en: string | null;
};

type StatRow = {
  rating: number;
  drank_at: string | null;
  created_at: string;
  products: {
    category: string | null;
    brewery_id: string | null;
    breweries: BreweryLite | BreweryLite[] | null;
  } | null | Array<{
    category: string | null;
    brewery_id: string | null;
    breweries: BreweryLite | BreweryLite[] | null;
  }>;
};

/** Supabase 가 nested select 를 array 로 줄 때가 있어 안전하게 unwrap. */
function unwrap<T>(v: T | T[] | null): T | null {
  if (!v) return null;
  return Array.isArray(v) ? (v[0] ?? null) : v;
}

async function getProfile(username: string): Promise<Profile | null> {
  const sb = await supabaseServer();
  const { data } = await sb
    .from("profiles")
    .select("id, username, display_name, bio, avatar_url, locale")
    .eq("username", username)
    .maybeSingle<Profile>();
  return data;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  const profile = await getProfile(username);
  if (!profile) return { title: "프로필 없음" };
  const name = profile.display_name ?? `@${profile.username}`;
  return {
    title: `${name} (@${profile.username})`,
    description: `${name} 의 한국술 체크인 기록.`,
  };
}

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const profile = await getProfile(username);
  if (!profile) notFound();

  const locale = await getLocale();

  const sb = await supabaseServer();
  const {
    data: { user: viewer },
  } = await sb.auth.getUser();
  const isMe = viewer?.id === profile.id;

  // 그리드 표시용 — 최신 60개. 본문 (note) 까지 포함.
  const { data: checkInsRaw } = await sb
    .from("check_ins")
    .select(
      `id, rating, pairing, note, drank_at, created_at,
       products(id, name_ko, name_en, category, abv, image_url)`,
    )
    .eq("user_id", profile.id)
    .order("created_at", { ascending: false })
    .limit(60);

  const checkIns = (checkInsRaw ?? []) as CheckInWithProduct[];

  // 통계용 — 모든 체크인 (lightweight). 카테고리·양조장·별점·날짜만.
  // 전체 체크인이 수백~수천 단위 되기 전엔 별도 집계 테이블 불필요.
  const { data: statsRaw } = await sb
    .from("check_ins")
    .select(
      `rating, drank_at, created_at,
       products(category, brewery_id,
         breweries(id, name_ko, name_en))`,
    )
    .eq("user_id", profile.id);

  const statsRows = (statsRaw ?? []) as StatRow[];
  const stats = computeStats(statsRows, locale);

  const total = stats.total;
  const avg = total > 0 ? stats.avgRating.toFixed(1) : null;

  const initial =
    (profile.display_name || profile.username || "?")
      .trim()
      .charAt(0)
      .toUpperCase() || "?";

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      {/* Profile header */}
      <header className="flex flex-col gap-6 sm:flex-row sm:items-center">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-foreground/10 text-2xl font-semibold text-foreground">
          {initial}
        </div>
        <div className="flex-1">
          <h1 className="font-serif text-3xl font-semibold tracking-tight">
            {profile.display_name ?? `@${profile.username}`}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            @{profile.username}
          </p>
          {profile.bio && (
            <p className="mt-3 max-w-2xl text-[0.95rem] leading-relaxed">
              {profile.bio}
            </p>
          )}
        </div>
        {isMe && (
          <Link
            href="/settings/profile"
            className="self-start rounded-md border border-border/60 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-foreground/30 hover:bg-foreground/5 hover:text-foreground"
          >
            프로필 편집
          </Link>
        )}
      </header>

      {/* Top stats row */}
      <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-3 border-y py-4 sm:grid-cols-4">
        <Stat label="체크인" value={String(total)} />
        <Stat label="평균 별점" value={avg ? `${avg} ★` : "—"} />
        <Stat label="최근 30일" value={String(stats.last30Days)} />
        <Stat label="활동 시작" value={formatJoined(stats.firstCheckInAt)} />
      </dl>

      {/* Statistics cards — 체크인이 1개 이상일 때만 */}
      {total > 0 && (
        <section className="mt-10">
          <h2 className="mb-5 font-serif text-2xl font-semibold tracking-tight">
            통계
          </h2>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            {/* 카테고리 분포 — full width 위쪽 */}
            <div className="lg:col-span-3">
              <CategoryBreakdown categories={stats.categories} total={total} />
            </div>

            {/* 양조장 TOP 3 */}
            <div className="lg:col-span-2">
              <BreweryTopThree breweries={stats.breweryTop3} />
            </div>

            {/* 별점 분포 */}
            <div>
              <RatingHistogram counts={stats.ratingCounts} total={total} />
            </div>
          </div>
        </section>
      )}

      {/* Check-ins grid */}
      <section className="mt-12">
        <h2 className="mb-6 font-serif text-2xl font-semibold tracking-tight">
          마신 술
        </h2>

        {total === 0 ? (
          <div className="rounded-xl border border-dashed border-border/60 p-10 text-center">
            <p className="font-serif text-lg">아직 체크인이 없어요</p>
            <p className="mt-2 text-sm text-muted-foreground">
              {isMe
                ? "마음에 드는 술 페이지에서 ★ 별점을 남겨보세요."
                : "이 사용자는 아직 체크인을 남기지 않았습니다."}
            </p>
            {isMe && (
              <Link
                href="/products"
                className="mt-4 inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                술 둘러보기
              </Link>
            )}
          </div>
        ) : (
          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {checkIns.map((c) => {
              const product = unwrap(c.products);
              if (!product) return null;
              const productName =
                pick(locale, product.name_ko, product.name_en) ??
                product.name_ko;
              return (
                <li key={c.id}>
                  <Link
                    href={`/products/${product.id}`}
                    className="group flex h-full flex-col rounded-xl border bg-card transition-all hover:-translate-y-0.5 hover:border-primary/30"
                  >
                    <div className="overflow-hidden rounded-t-xl">
                      <PhotoPlaceholder
                        src={product.image_url}
                        alt={productName}
                        aspectRatio="4/3"
                        category={product.category}
                      />
                    </div>
                    <div className="flex flex-1 flex-col p-4">
                      <div className="flex items-center gap-1.5 text-base leading-none">
                        <span className="text-primary">
                          {"★".repeat(c.rating)}
                        </span>
                        <span className="text-foreground/15">
                          {"★".repeat(5 - c.rating)}
                        </span>
                      </div>
                      <h3 className="mt-2 font-serif text-lg font-medium leading-tight group-hover:underline">
                        {productName}
                      </h3>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {product.category}
                        {product.abv != null && ` · ${product.abv}%`}
                      </div>
                      {c.pairing && (
                        <p className="mt-3 text-xs text-muted-foreground">
                          🍽 {c.pairing}
                        </p>
                      )}
                      {c.note && (
                        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-foreground/85">
                          {c.note}
                        </p>
                      )}
                      <div className="mt-auto pt-3 text-xs text-muted-foreground">
                        {formatDate(c.drank_at ?? c.created_at)}
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </main>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 통계 계산
// ─────────────────────────────────────────────────────────────────────────────

type ComputedStats = {
  total: number;
  avgRating: number;
  last30Days: number;
  firstCheckInAt: string | null;
  categories: Array<{ name: string; count: number }>;
  breweryTop3: Array<{ id: string; name: string; count: number }>;
  ratingCounts: number[]; // index 0 = 1점, ... 4 = 5점
};

function computeStats(rows: StatRow[], locale: Locale): ComputedStats {
  const total = rows.length;
  if (total === 0) {
    return {
      total: 0,
      avgRating: 0,
      last30Days: 0,
      firstCheckInAt: null,
      categories: [],
      breweryTop3: [],
      ratingCounts: [0, 0, 0, 0, 0],
    };
  }

  const ratingCounts = [0, 0, 0, 0, 0];
  const categoryCounts = new Map<string, number>();
  const breweryCounts = new Map<string, { name: string; count: number }>();

  let ratingSum = 0;
  let firstCheckInAt: string | null = null;
  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
  let last30Days = 0;

  for (const row of rows) {
    if (row.rating >= 1 && row.rating <= 5) {
      ratingCounts[row.rating - 1]++;
      ratingSum += row.rating;
    }

    const refDate = row.drank_at ?? row.created_at;
    if (refDate) {
      const t = Date.parse(refDate);
      if (!Number.isNaN(t)) {
        if (t >= thirtyDaysAgo) last30Days++;
        if (firstCheckInAt === null || t < Date.parse(firstCheckInAt)) {
          firstCheckInAt = refDate;
        }
      }
    }

    const product = unwrap(row.products);
    if (!product) continue;

    if (product.category) {
      categoryCounts.set(
        product.category,
        (categoryCounts.get(product.category) ?? 0) + 1,
      );
    }

    if (product.brewery_id) {
      const brewery = unwrap(product.breweries);
      const name = brewery
        ? (pick(locale, brewery.name_ko, brewery.name_en) ?? brewery.name_ko)
        : null;
      if (name) {
        const existing = breweryCounts.get(product.brewery_id);
        if (existing) {
          existing.count++;
        } else {
          breweryCounts.set(product.brewery_id, { name, count: 1 });
        }
      }
    }
  }

  const categories = Array.from(categoryCounts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  const breweryTop3 = Array.from(breweryCounts.entries())
    .map(([id, v]) => ({ id, name: v.name, count: v.count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  return {
    total,
    avgRating: ratingSum / total,
    last30Days,
    firstCheckInAt,
    categories,
    breweryTop3,
    ratingCounts,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 통계 카드 컴포넌트
// ─────────────────────────────────────────────────────────────────────────────

function CategoryBreakdown({
  categories,
  total,
}: {
  categories: Array<{ name: string; count: number }>;
  total: number;
}) {
  return (
    <div className="rounded-xl border bg-card p-5">
      <h3 className="text-xs uppercase tracking-wider text-muted-foreground">
        카테고리별 분포
      </h3>
      {categories.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">
          아직 카테고리 데이터가 없어요.
        </p>
      ) : (
        <ul className="mt-4 space-y-2.5">
          {categories.map((c) => {
            const pct = total > 0 ? (c.count / total) * 100 : 0;
            return (
              <li key={c.name} className="flex items-center gap-3">
                <span className="w-16 shrink-0 text-sm text-foreground/85">
                  {c.name}
                </span>
                <div className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-foreground/[0.06]">
                  <div
                    className="absolute inset-y-0 left-0 rounded-full bg-primary transition-[width]"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-14 shrink-0 text-right text-xs tabular-nums text-muted-foreground">
                  {c.count} <span className="opacity-60">({pct.toFixed(0)}%)</span>
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function BreweryTopThree({
  breweries,
}: {
  breweries: Array<{ id: string; name: string; count: number }>;
}) {
  return (
    <div className="rounded-xl border bg-card p-5">
      <h3 className="text-xs uppercase tracking-wider text-muted-foreground">
        좋아하는 양조장 TOP 3
      </h3>
      {breweries.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">
          체크인을 더 남겨보세요.
        </p>
      ) : (
        <ol className="mt-4 space-y-3">
          {breweries.map((b, idx) => (
            <li key={b.id} className="flex items-center gap-3">
              <span
                className={
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold " +
                  (idx === 0
                    ? "bg-primary text-primary-foreground"
                    : "bg-foreground/[0.08] text-foreground/80")
                }
              >
                {idx + 1}
              </span>
              <Link
                href={`/breweries/${b.id}`}
                className="flex-1 truncate text-sm font-medium hover:underline"
              >
                {b.name}
              </Link>
              <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                체크인 {b.count}회
              </span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

function RatingHistogram({
  counts,
  total,
}: {
  counts: number[];
  total: number;
}) {
  const max = Math.max(...counts, 1);
  return (
    <div className="rounded-xl border bg-card p-5">
      <h3 className="text-xs uppercase tracking-wider text-muted-foreground">
        별점 분포
      </h3>
      <ul className="mt-4 space-y-2">
        {[5, 4, 3, 2, 1].map((star) => {
          const count = counts[star - 1];
          const pct = total > 0 ? (count / total) * 100 : 0;
          const widthPct = (count / max) * 100;
          return (
            <li key={star} className="flex items-center gap-2">
              <span className="w-10 shrink-0 text-xs text-foreground/85">
                <span className="text-primary">★</span> {star}
              </span>
              <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-foreground/[0.06]">
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-primary/70"
                  style={{ width: `${widthPct}%` }}
                />
              </div>
              <span className="w-12 shrink-0 text-right text-[11px] tabular-nums text-muted-foreground">
                {count} <span className="opacity-60">({pct.toFixed(0)}%)</span>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 작은 헬퍼들
// ─────────────────────────────────────────────────────────────────────────────

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] uppercase tracking-wider text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-1 font-serif text-xl font-medium">{value}</dd>
    </div>
  );
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

function formatJoined(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월`;
}
