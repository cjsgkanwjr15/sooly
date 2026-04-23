/**
 * 별점 표시 컴포넌트. 평균 별점 + 체크인 수.
 * 체크인이 0이면 empty state (곧 체크인 기능 붙을 자리).
 */

type Props = {
  average: number | null; // 0~5, null=데이터 없음
  count: number;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const SIZE_MAP = {
  sm: { star: "text-sm", num: "text-sm", label: "text-xs" },
  md: { star: "text-base", num: "text-lg", label: "text-sm" },
  lg: { star: "text-2xl", num: "text-3xl", label: "text-sm" },
} as const;

export function RatingDisplay({ average, count, size = "md", className = "" }: Props) {
  const s = SIZE_MAP[size];
  const hasRating = average != null && count > 0;

  if (!hasRating) {
    return (
      <div className={`flex items-baseline gap-2 ${className}`}>
        <Stars value={0} className={s.star} />
        <span className={`text-muted-foreground ${s.label}`}>
          아직 체크인 없음
        </span>
      </div>
    );
  }

  return (
    <div className={`flex items-baseline gap-2 ${className}`}>
      <Stars value={average} className={s.star} />
      <span className={`font-serif font-semibold ${s.num}`}>
        {average.toFixed(1)}
      </span>
      <span className={`text-muted-foreground ${s.label}`}>
        체크인 {count.toLocaleString()}회
      </span>
    </div>
  );
}

/**
 * 0~5 사이 값으로 별 5개 렌더. 반 개 단위까지 지원.
 */
export function Stars({ value, className = "" }: { value: number; className?: string }) {
  const rounded = Math.round(value * 2) / 2; // 0, 0.5, 1, 1.5, ...

  return (
    <div className={`inline-flex gap-0.5 text-primary ${className}`} aria-label={`${value}/5`}>
      {[1, 2, 3, 4, 5].map((n) => {
        const fill = rounded >= n ? "full" : rounded >= n - 0.5 ? "half" : "empty";
        return <Star key={n} fill={fill} />;
      })}
    </div>
  );
}

function Star({ fill }: { fill: "full" | "half" | "empty" }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="size-[1em]"
      aria-hidden
    >
      <defs>
        <linearGradient id={`half-${fill}`}>
          <stop offset="50%" stopColor="currentColor" />
          <stop offset="50%" stopColor="transparent" />
        </linearGradient>
      </defs>
      <path
        d="M10 1.5l2.6 5.27 5.82.85-4.21 4.1.99 5.78L10 14.77l-5.2 2.73.99-5.78L1.58 7.62l5.82-.85L10 1.5z"
        fill={
          fill === "full"
            ? "currentColor"
            : fill === "half"
              ? `url(#half-${fill})`
              : "none"
        }
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
        opacity={fill === "empty" ? 0.35 : 1}
      />
    </svg>
  );
}
