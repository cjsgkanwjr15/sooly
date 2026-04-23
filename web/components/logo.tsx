import type { SVGProps } from "react";

/**
 * Sooly 로고 마크 — 술잔(전통 사발)을 단순화한 추상 심볼.
 * 전통주 사발(막걸리 사발)의 단면을 기하학적으로 추상화.
 * 지금은 임시 디자인이며, 브랜드 확정 후 교체 예정.
 */
export function LogoMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      {/* 사발 외곽 */}
      <path
        d="M6 14 Q20 10 34 14 L31 30 Q20 34 9 30 Z"
        className="fill-primary/10 stroke-primary"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* 액체 라인 (막걸리) */}
      <path
        d="M8 18 Q20 14 32 18"
        className="stroke-primary"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* 쌀알 점 2개 */}
      <circle cx="15" cy="22" r="1" className="fill-primary" />
      <circle cx="25" cy="22" r="1" className="fill-primary" />
    </svg>
  );
}

/**
 * 로고 전체 (마크 + 워드마크).
 */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <LogoMark className="size-7" />
      <span className="font-serif text-xl font-semibold tracking-tight">
        Sooly
      </span>
    </div>
  );
}
