import Link from "next/link";
import { supabaseServer } from "@/lib/supabase/server";
import { CheckInForm } from "@/components/check-in-form";
import { getLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";

/**
 * 제품 상세에서 체크인 영역.
 * - 비로그인: 로그인 CTA (?next=/products/{id})
 * - 로그인: 빈 폼 — 매 제출은 새 row (여러 체크인 허용)
 *
 * 수정·삭제는 RecentCheckIns 에서 본인 체크인 옆 인라인.
 */
export async function CheckInBlock({ productId }: { productId: string }) {
  const locale = await getLocale();
  const sb = await supabaseServer();
  const {
    data: { user },
  } = await sb.auth.getUser();

  if (!user) {
    return (
      <div className="rounded-xl border border-primary/20 bg-primary/[0.04] p-5">
        <p className="font-serif text-base font-medium">
          {t(locale, "checkIn.block.title")}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          {t(locale, "checkIn.block.subtitleAnonymous")}
        </p>
        <Link
          href={`/login?next=${encodeURIComponent(`/products/${productId}`)}`}
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          {t(locale, "checkIn.block.loginCta")}
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-primary/20 bg-primary/[0.04] p-5">
      <p className="font-serif text-base font-medium">
        {t(locale, "checkIn.block.title")}
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        {t(locale, "checkIn.block.subtitleLoggedIn")}
      </p>
      <div className="mt-4">
        <CheckInForm productId={productId} locale={locale} />
      </div>
    </div>
  );
}
