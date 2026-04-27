import Link from "next/link";
import { supabaseServer } from "@/lib/supabase/server";
import { MyCheckInRow } from "@/components/my-check-in-row";
import type { CheckInFormInitial } from "@/components/check-in-form";

type CheckInRow = {
  id: string;
  rating: number;
  pairing: string | null;
  note: string | null;
  drank_at: string | null;
  created_at: string;
  user_id: string;
  taste_sweet: number | null;
  taste_sour: number | null;
  taste_bitter: number | null;
  taste_umami: number | null;
  taste_aroma: number | null;
  taste_finish: number | null;
};

type ProfileRow = {
  id: string;
  username: string | null;
  display_name: string | null;
};

/**
 * 모든 체크인 시간순 desc, 최대 20개. 본인 row 는 MyCheckInRow (client) 로
 * 인라인 수정·삭제 가능. 다른 사람 row 는 정적 렌더.
 */
export async function RecentCheckIns({
  productId,
  currentUserId,
}: {
  productId: string;
  currentUserId?: string;
}) {
  const sb = await supabaseServer();

  const { data: checkIns } = await sb
    .from("check_ins")
    .select(
      `id, rating, pairing, note, drank_at, created_at, user_id,
       taste_sweet, taste_sour, taste_bitter, taste_umami, taste_aroma, taste_finish`,
    )
    .eq("product_id", productId)
    .order("created_at", { ascending: false })
    .limit(20);

  if (!checkIns || checkIns.length === 0) return null;

  const userIds = Array.from(new Set(checkIns.map((c) => c.user_id)));
  const { data: profiles } = await sb
    .from("profiles")
    .select("id, username, display_name")
    .in("id", userIds);

  const profileMap = new Map<string, ProfileRow>(
    (profiles ?? []).map((p) => [p.id, p as ProfileRow]),
  );

  return (
    <section>
      <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-muted-foreground">
        체크인 ({checkIns.length})
      </h2>
      <ul className="space-y-5">
        {(checkIns as CheckInRow[]).map((c) => {
          const isMine = c.user_id === currentUserId;
          if (isMine) {
            const initial: CheckInFormInitial = {
              id: c.id,
              rating: c.rating,
              pairing: c.pairing,
              note: c.note,
              drank_at: c.drank_at,
              taste_sweet: c.taste_sweet,
              taste_sour: c.taste_sour,
              taste_bitter: c.taste_bitter,
              taste_umami: c.taste_umami,
              taste_aroma: c.taste_aroma,
              taste_finish: c.taste_finish,
            };
            return (
              <MyCheckInRow
                key={c.id}
                productId={productId}
                checkIn={initial}
                createdAt={c.created_at}
              />
            );
          }

          const p = profileMap.get(c.user_id);
          const handle = p?.username;
          const name = p?.display_name ?? handle ?? "익명";

          return (
            <li
              key={c.id}
              className="border-b border-border/40 pb-5 last:border-0"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <Stars n={c.rating} />
                  {handle ? (
                    <Link
                      href={`/u/${handle}`}
                      className="font-medium hover:underline"
                    >
                      @{handle}
                    </Link>
                  ) : (
                    <span className="font-medium">{name}</span>
                  )}
                </div>
                <span className="text-xs text-muted-foreground">
                  {formatRelative(c.drank_at ?? c.created_at)}
                </span>
              </div>
              {c.pairing && (
                <p className="mt-2 text-sm text-muted-foreground">
                  🍽 {c.pairing}
                </p>
              )}
              {c.note && (
                <p className="mt-1.5 whitespace-pre-line text-sm leading-relaxed text-foreground/90">
                  {c.note}
                </p>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function Stars({ n }: { n: number }) {
  return (
    <span aria-label={`${n}점`} className="text-base leading-none">
      <span className="text-primary">{"★".repeat(n)}</span>
      <span className="text-foreground/15">{"★".repeat(5 - n)}</span>
    </span>
  );
}

function formatRelative(iso: string): string {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const diffSec = Math.max(0, Math.floor((now - then) / 1000));
  if (diffSec < 60) return "방금";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}분 전`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}시간 전`;
  const diffDay = Math.floor(diffHour / 24);
  if (diffDay < 30) return `${diffDay}일 전`;
  const diffMonth = Math.floor(diffDay / 30);
  if (diffMonth < 12) return `${diffMonth}달 전`;
  return `${Math.floor(diffMonth / 12)}년 전`;
}
