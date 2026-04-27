import Link from "next/link";
import { supabaseServer } from "@/lib/supabase/server";
import { CheckInForm } from "@/components/check-in-form";

/**
 * 제품 상세에서 체크인 영역.
 * - 비로그인: 로그인 CTA (?next=/products/{id})
 * - 로그인: 빈 폼 — 매 제출은 새 row (여러 체크인 허용)
 *
 * 수정·삭제는 RecentCheckIns 에서 본인 체크인 옆 인라인.
 */
export async function CheckInBlock({ productId }: { productId: string }) {
  const sb = await supabaseServer();
  const {
    data: { user },
  } = await sb.auth.getUser();

  if (!user) {
    return (
      <div className="rounded-xl border border-primary/20 bg-primary/[0.04] p-5">
        <p className="font-serif text-base font-medium">
          체크인을 남겨보세요
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          별점과 함께 한 음식·한 줄 메모로 이 술을 기록해보세요.
        </p>
        <Link
          href={`/login?next=${encodeURIComponent(`/products/${productId}`)}`}
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          🍶 로그인하고 체크인하기
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-primary/20 bg-primary/[0.04] p-5">
      <p className="font-serif text-base font-medium">체크인을 남겨보세요</p>
      <p className="mt-1 text-sm text-muted-foreground">
        같은 술이라도 마실 때마다 새로 기록할 수 있어요.
      </p>
      <div className="mt-4">
        <CheckInForm productId={productId} />
      </div>
    </div>
  );
}
