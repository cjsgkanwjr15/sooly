import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { supabaseServer } from "@/lib/supabase/server";
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

  const sb = await supabaseServer();
  const {
    data: { user: viewer },
  } = await sb.auth.getUser();
  const isMe = viewer?.id === profile.id;

  // 체크인 + 제품 메타. products 와는 직접 FK 있으므로 nested select.
  const { data: checkInsRaw } = await sb
    .from("check_ins")
    .select(
      `id, rating, pairing, note, drank_at, created_at,
       products(id, name_ko, category, abv, image_url)`,
    )
    .eq("user_id", profile.id)
    .order("created_at", { ascending: false })
    .limit(60);

  const checkIns = (checkInsRaw ?? []) as CheckInWithProduct[];
  const total = checkIns.length;
  const avg =
    total > 0
      ? (checkIns.reduce((s, c) => s + c.rating, 0) / total).toFixed(1)
      : null;

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
          <span
            className="self-start rounded-md border border-border/60 px-3 py-1 text-xs text-muted-foreground"
            aria-label="본인 프로필"
          >
            내 프로필
          </span>
        )}
      </header>

      {/* Stats */}
      <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-3 border-y py-4 sm:grid-cols-4">
        <Stat label="체크인" value={String(total)} />
        <Stat label="평균 별점" value={avg ? `${avg} ★` : "—"} />
        <Stat
          label="가입"
          value={formatJoined(checkIns[checkIns.length - 1]?.created_at)}
        />
        <Stat label="언어" value={profile.locale.toUpperCase()} />
      </dl>

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
              const product = Array.isArray(c.products)
                ? c.products[0]
                : c.products;
              if (!product) return null;
              return (
                <li key={c.id}>
                  <Link
                    href={`/products/${product.id}`}
                    className="group flex h-full flex-col rounded-xl border bg-card transition-all hover:-translate-y-0.5 hover:border-primary/30"
                  >
                    <div className="overflow-hidden rounded-t-xl">
                      <PhotoPlaceholder
                        src={product.image_url}
                        alt={product.name_ko}
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
                        {product.name_ko}
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

function formatJoined(iso?: string): string {
  // 가장 오래된 체크인의 시간 — 가입일 정확치는 아니지만 활동 시작 신호로.
  if (!iso) return "—";
  const d = new Date(iso);
  return `${d.getFullYear()}년`;
}
