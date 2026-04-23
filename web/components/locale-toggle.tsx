"use client";

import { useTransition } from "react";
import { setLocale } from "@/app/actions/set-locale";
import type { Locale } from "@/lib/locale";

/**
 * KO/EN 토글 버튼. 현재 locale 이 강조됨.
 * 클릭 시 서버 액션으로 쿠키 설정 → 전체 layout 재검증 → 로고·텍스트 갱신.
 */
export function LocaleToggle({ current }: { current: Locale }) {
  const [pending, startTransition] = useTransition();

  function select(locale: Locale) {
    if (locale === current || pending) return;
    startTransition(async () => {
      await setLocale(locale);
    });
  }

  return (
    <div className="flex items-center gap-1 text-xs">
      <button
        type="button"
        onClick={() => select("ko")}
        aria-pressed={current === "ko"}
        className={
          "rounded px-1.5 py-0.5 transition-colors " +
          (current === "ko"
            ? "bg-foreground/10 font-medium text-foreground"
            : "text-muted-foreground hover:text-foreground")
        }
      >
        KO
      </button>
      <span className="text-muted-foreground/40">·</span>
      <button
        type="button"
        onClick={() => select("en")}
        aria-pressed={current === "en"}
        className={
          "rounded px-1.5 py-0.5 transition-colors " +
          (current === "en"
            ? "bg-foreground/10 font-medium text-foreground"
            : "text-muted-foreground hover:text-foreground")
        }
      >
        EN
      </button>
    </div>
  );
}
