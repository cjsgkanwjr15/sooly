import Link from "next/link";
import { getLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";

/**
 * 양조장이 직접 관리하는 공간 (placeholder).
 *
 * 현재는 빈 슬롯 — 양조장 비즈니스 플랜 (CLAUDE.md §5 Phase 3) 출시 후
 * 양조장 사장님이 직접 글·소식·사진을 업데이트하는 공간이 됨.
 *
 * 미리 슬롯을 노출하는 이유:
 * 1. 양조장이 "내 정보 어디서 수정하지" 하고 찾을 때 명확한 답을 제공 → 리드 수집
 * 2. 유저가 "아 여기는 양조장이 직접 말하는 곳이구나" 를 인지 (UGC 와 구분)
 */

type Variant = "product" | "brewery";

export async function BreweryContentSlot({
  variant,
  breweryName,
}: {
  variant: Variant;
  breweryName?: string;
}) {
  const locale = await getLocale();
  const title =
    variant === "product"
      ? t(locale, "brewerySlot.productTitle")
      : t(locale, "brewerySlot.breweryTitle", {
          brewery: breweryName ?? t(locale, "brewerySlot.breweryDefault"),
        });
  const desc =
    variant === "product"
      ? t(locale, "brewerySlot.productDesc")
      : t(locale, "brewerySlot.breweryDesc");

  return (
    <section className="rounded-xl border border-dashed border-primary/30 bg-primary/[0.03] p-6">
      <div className="flex items-start gap-3">
        <span className="text-2xl" aria-hidden>
          🏛️
        </span>
        <div className="flex-1">
          <h3 className="font-serif text-lg font-medium">{title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {desc}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs">
            <Link
              href="/for-breweries"
              className="font-medium underline underline-offset-4 hover:text-primary"
            >
              {t(locale, "brewerySlot.cta")}
            </Link>
            <span className="text-muted-foreground">
              {t(locale, "brewerySlot.soon")}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
