"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { CheckInForm, type CheckInFormInitial } from "@/components/check-in-form";
import { deleteCheckIn } from "@/app/actions/check-in";
import { t } from "@/lib/i18n";
import type { Locale } from "@/lib/locale";

/**
 * RecentCheckIns 의 본인 체크인 row.
 * - 기본: 일반 디스플레이 + [수정] [삭제] 버튼
 * - 수정 모드: 인라인 expand → CheckInForm (initial prefill, action=updateCheckIn)
 *
 * 다른 유저 row 는 RecentCheckIns 에 그대로 (server-side 정적 렌더).
 */
export function MyCheckInRow({
  productId,
  checkIn,
  createdAt,
  locale,
}: {
  productId: string;
  checkIn: CheckInFormInitial;
  createdAt: string;
  locale: Locale;
}) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <li className="rounded-lg border border-primary/30 bg-primary/[0.03] p-4">
        <CheckInForm
          productId={productId}
          initial={checkIn}
          onCancel={() => setEditing(false)}
          onSuccess={() => setEditing(false)}
          compact
          locale={locale}
        />
      </li>
    );
  }

  return (
    <li className="border-b border-border/40 pb-5 last:border-0">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm">
          <Stars n={checkIn.rating} locale={locale} />
          <span className="font-medium text-primary">
            {t(locale, "checkIn.list.youLabel")}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">
            {formatRelative(checkIn.drank_at ?? createdAt, locale)}
          </span>
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="text-xs text-muted-foreground/80 underline-offset-4 hover:text-foreground hover:underline"
            aria-label={t(locale, "checkIn.list.editAria")}
          >
            {t(locale, "checkIn.list.editButton")}
          </button>
          <form action={deleteCheckIn} className="inline">
            <input type="hidden" name="id" value={checkIn.id} />
            <input type="hidden" name="product_id" value={productId} />
            <DeleteButton locale={locale} />
          </form>
        </div>
      </div>
      {checkIn.pairing && (
        <p className="mt-2 text-sm text-muted-foreground">🍽 {checkIn.pairing}</p>
      )}
      {checkIn.note && (
        <p className="mt-1.5 whitespace-pre-line text-sm leading-relaxed text-foreground/90">
          {checkIn.note}
        </p>
      )}
    </li>
  );
}

function DeleteButton({ locale }: { locale: Locale }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="text-xs text-muted-foreground/70 underline-offset-4 hover:text-destructive hover:underline disabled:opacity-50"
      aria-label={t(locale, "checkIn.list.deleteAria")}
    >
      {pending
        ? t(locale, "checkIn.list.deletePending")
        : t(locale, "checkIn.list.deleteButton")}
    </button>
  );
}

function Stars({ n, locale }: { n: number; locale: Locale }) {
  return (
    <span
      aria-label={t(locale, "checkIn.list.starsAria", { n })}
      className="text-base leading-none"
    >
      <span className="text-primary">{"★".repeat(n)}</span>
      <span className="text-foreground/15">{"★".repeat(5 - n)}</span>
    </span>
  );
}

function formatRelative(iso: string, locale: Locale): string {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const diffSec = Math.max(0, Math.floor((now - then) / 1000));
  if (diffSec < 60) return t(locale, "checkIn.list.relativeNow");
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60)
    return `${diffMin}${t(locale, "checkIn.list.relativeMinutesSuffix")}`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24)
    return `${diffHour}${t(locale, "checkIn.list.relativeHoursSuffix")}`;
  const diffDay = Math.floor(diffHour / 24);
  if (diffDay < 30)
    return `${diffDay}${t(locale, "checkIn.list.relativeDaysSuffix")}`;
  const diffMonth = Math.floor(diffDay / 30);
  if (diffMonth < 12)
    return `${diffMonth}${t(locale, "checkIn.list.relativeMonthsSuffix")}`;
  return `${Math.floor(diffMonth / 12)}${t(locale, "checkIn.list.relativeYearsSuffix")}`;
}
