import Link from "next/link";

/**
 * 양조장이 직접 관리하는 공간 (placeholder).
 *
 * 현재는 빈 슬롯 — 양조장 Verified 플랜 (CLAUDE.md §5 Phase 3) 출시 후
 * 양조장 사장님이 직접 글·소식·사진을 업데이트하는 공간이 됨.
 *
 * 미리 슬롯을 노출하는 이유:
 * 1. 양조장이 "내 정보 어디서 수정하지" 하고 찾을 때 명확한 답을 제공 → 리드 수집
 * 2. 유저가 "아 여기는 양조장이 직접 말하는 곳이구나" 를 인지 (UGC 와 구분)
 */

type Variant = "product" | "brewery";

export function BreweryContentSlot({
  variant,
  breweryName,
}: {
  variant: Variant;
  breweryName?: string;
}) {
  const titleMap = {
    product: "양조장이 직접 전하는 이야기",
    brewery: `${breweryName ?? "양조장"} 의 공식 소식`,
  };

  const descMap = {
    product:
      "이 제품을 만든 양조장이 곧 직접 전하는 이야기·신제품·이벤트가 이 공간에 업데이트됩니다.",
    brewery:
      "이 양조장이 직접 업데이트하는 공지·신제품 소식·이벤트가 이 공간에 쌓입니다.",
  };

  return (
    <section className="rounded-xl border border-dashed border-primary/30 bg-primary/[0.03] p-6">
      <div className="flex items-start gap-3">
        <span className="text-2xl" aria-hidden>🏛️</span>
        <div className="flex-1">
          <h3 className="font-serif text-lg font-medium">{titleMap[variant]}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {descMap[variant]}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs">
            <Link
              href="/for-breweries"
              className="font-medium underline underline-offset-4 hover:text-primary"
            >
              양조장이신가요? 공식 등록 문의 →
            </Link>
            <span className="text-muted-foreground">
              · 곧 출시 예정
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
