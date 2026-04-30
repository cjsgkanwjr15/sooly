"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { createCheckIn, updateCheckIn } from "@/app/actions/check-in";

const TASTE_AXES = [
  { key: "taste_sweet", label: "단맛" },
  { key: "taste_sour", label: "산미" },
  { key: "taste_bitter", label: "쓴맛" },
  { key: "taste_umami", label: "감칠맛" },
  { key: "taste_aroma", label: "향" },
  { key: "taste_finish", label: "목넘김" },
] as const;

type TasteKey = (typeof TASTE_AXES)[number]["key"];
type TasteState = Record<TasteKey, number>; // 0 = 미선택

export type CheckInFormInitial = {
  id: string;
  rating: number;
  pairing: string | null;
  note: string | null;
  drank_at: string | null;
  taste_sweet: number | null;
  taste_sour: number | null;
  taste_bitter: number | null;
  taste_umami: number | null;
  taste_aroma: number | null;
  taste_finish: number | null;
};

const EMPTY_TASTE: TasteState = {
  taste_sweet: 0,
  taste_sour: 0,
  taste_bitter: 0,
  taste_umami: 0,
  taste_aroma: 0,
  taste_finish: 0,
};

function tasteFromInitial(init?: CheckInFormInitial): TasteState {
  if (!init) return EMPTY_TASTE;
  return {
    taste_sweet: init.taste_sweet ?? 0,
    taste_sour: init.taste_sour ?? 0,
    taste_bitter: init.taste_bitter ?? 0,
    taste_umami: init.taste_umami ?? 0,
    taste_aroma: init.taste_aroma ?? 0,
    taste_finish: init.taste_finish ?? 0,
  };
}

/**
 * 체크인 폼 — 신규 (createCheckIn) 또는 수정 (updateCheckIn) 모드.
 * - 별점 1–5 picker
 * - 함께 한 음식 (선택, max 120)
 * - 한 줄 메모 (선택, max 500)
 * - 마신 날 (기본 오늘)
 * - 맛 프로필 6축 (선택, 1–5 dot picker)
 *
 * onSuccess: 저장 성공 후 호출 (수정 모드에서 인라인 폼 닫기에 사용).
 * onCancel: 사용자가 취소 누르면 호출 (수정 모드 only).
 */
export function CheckInForm({
  productId,
  initial,
  onCancel,
  onSuccess,
  compact = false,
}: {
  productId: string;
  initial?: CheckInFormInitial;
  onCancel?: () => void;
  onSuccess?: () => void;
  compact?: boolean;
}) {
  const isEdit = !!initial;
  const [rating, setRating] = useState(initial?.rating ?? 0);
  const [hover, setHover] = useState<number | null>(null);
  const [taste, setTaste] = useState<TasteState>(tasteFromInitial(initial));

  const today = new Date().toISOString().slice(0, 10);
  const defaultDate = initial?.drank_at
    ? initial.drank_at.slice(0, 10)
    : today;
  const showRating = hover ?? rating;

  // server action 자체는 직접 호출되어야 함 ("use server" 경계). 그러나 client
  // 가 form 의 action prop 에 *client* 함수를 주면 그 안에서 server action 을
  // 호출 후 client state 정리도 가능. wrapper 패턴.
  const baseAction = isEdit ? updateCheckIn : createCheckIn;
  async function actionWrapper(formData: FormData) {
    await baseAction(formData);
    onSuccess?.();
  }

  return (
    <form action={actionWrapper} className="space-y-4">
      <input type="hidden" name="product_id" value={productId} />
      <input type="hidden" name="rating" value={rating} />
      {isEdit && <input type="hidden" name="id" value={initial.id} />}

      {/* 별점 */}
      <div>
        <div className="text-xs uppercase tracking-wider text-muted-foreground">
          별점 <span className="text-destructive/80">*</span>
        </div>
        <div
          className="mt-2 flex items-center gap-1"
          onMouseLeave={() => setHover(null)}
        >
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(n)}
              onMouseEnter={() => setHover(n)}
              aria-label={`${n}점`}
              aria-pressed={rating === n}
              className="text-2xl leading-none transition-transform hover:scale-110"
            >
              <span
                className={
                  showRating >= n ? "text-primary" : "text-foreground/20"
                }
              >
                ★
              </span>
            </button>
          ))}
          {rating > 0 ? (
            <span className="ml-2 text-sm text-muted-foreground">
              {rating}점
            </span>
          ) : (
            <span className="ml-2 text-xs text-muted-foreground/80">
              별 1~5개를 눌러주세요
            </span>
          )}
        </div>
      </div>

      {/* 함께 한 음식 */}
      <div>
        <label
          htmlFor={`checkin-pairing-${initial?.id ?? "new"}`}
          className="text-xs uppercase tracking-wider text-muted-foreground"
        >
          함께 한 음식 <span className="text-muted-foreground/60">(선택)</span>
        </label>
        <input
          id={`checkin-pairing-${initial?.id ?? "new"}`}
          name="pairing"
          type="text"
          maxLength={120}
          defaultValue={initial?.pairing ?? ""}
          placeholder="감자전, 보쌈, 회…"
          className="mt-1.5 block w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        />
      </div>

      {/* 메모 */}
      <div>
        <label
          htmlFor={`checkin-note-${initial?.id ?? "new"}`}
          className="text-xs uppercase tracking-wider text-muted-foreground"
        >
          한 줄 메모 <span className="text-muted-foreground/60">(선택)</span>
        </label>
        <textarea
          id={`checkin-note-${initial?.id ?? "new"}`}
          name="note"
          maxLength={500}
          rows={2}
          defaultValue={initial?.note ?? ""}
          placeholder="어떤 맛이었나요? 누구랑 마셨나요?"
          className="mt-1.5 w-full resize-y rounded-lg border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        />
      </div>

      {/* 마신 날 */}
      <div>
        <label
          htmlFor={`checkin-date-${initial?.id ?? "new"}`}
          className="text-xs uppercase tracking-wider text-muted-foreground"
        >
          마신 날
        </label>
        <input
          id={`checkin-date-${initial?.id ?? "new"}`}
          type="date"
          name="drank_at"
          defaultValue={defaultDate}
          max={today}
          className="mt-1.5 block rounded-lg border border-input bg-transparent px-3 py-1.5 text-sm focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        />
      </div>

      {/* 맛 프로필 6축 */}
      <div className="rounded-lg border border-border/50 p-4">
        <div className="flex items-center justify-between">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">
            맛 프로필 <span className="text-muted-foreground/60">(선택)</span>
          </div>
          <button
            type="button"
            onClick={() => setTaste(EMPTY_TASTE)}
            className="text-[11px] text-muted-foreground/70 underline-offset-4 hover:text-foreground hover:underline"
          >
            모두 지우기
          </button>
        </div>
        <p className="mt-1 text-[11px] text-muted-foreground/80">
          이 술의 맛을 1~5 로 평가해보세요. 다른 사람들의 평가와 합쳐져 육각형
          차트로 표시됩니다.
        </p>
        <div className={compact ? "mt-3 grid grid-cols-1 gap-2" : "mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2"}>
          {TASTE_AXES.map(({ key, label }) => (
            <TasteRow
              key={key}
              name={key}
              label={label}
              value={taste[key]}
              onChange={(v) => setTaste((s) => ({ ...s, [key]: v }))}
            />
          ))}
        </div>
      </div>

      {/* 액션 버튼 */}
      <div className="flex flex-wrap items-center gap-3">
        <SubmitButton disabled={rating === 0} isEdit={isEdit} />
        {isEdit && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            취소
          </button>
        )}
      </div>
    </form>
  );
}

function TasteRow({
  name,
  label,
  value,
  onChange,
}: {
  name: TasteKey;
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-sm text-foreground/85">{label}</span>
      <input type="hidden" name={name} value={value || ""} />
      <div className="flex items-center gap-1.5">
        {[1, 2, 3, 4, 5].map((n) => {
          const filled = value >= n && value > 0;
          return (
            <button
              key={n}
              type="button"
              onClick={() => onChange(value === n ? 0 : n)}
              aria-label={`${label} ${n}점`}
              aria-pressed={value === n}
              className={
                "h-3 w-3 rounded-full border transition-colors " +
                (filled
                  ? "border-primary bg-primary"
                  : "border-foreground/25 bg-transparent hover:border-foreground/50")
              }
            />
          );
        })}
      </div>
    </div>
  );
}

function SubmitButton({
  disabled,
  isEdit,
}: {
  disabled: boolean;
  isEdit: boolean;
}) {
  const { pending } = useFormStatus();
  const label = pending
    ? isEdit
      ? "저장 중..."
      : "기록 중..."
    : isEdit
      ? "저장"
      : "🍶 체크인 남기기";
  return (
    <button
      type="submit"
      disabled={disabled || pending}
      className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {label}
    </button>
  );
}
