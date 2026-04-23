import { getLocale } from "@/lib/locale";

/**
 * Sooly 로고 (inline SVG + 사이트 폰트).
 * 원본 PNG 디자인을 레이아웃에 "녹여" 렌더 — 배경 없음, 컬러는 currentColor.
 * 사이트 폰트(Fraunces)와 통일된 타이포그래피로 브랜드가 페이지의 일부처럼.
 *
 * 원본 PNG 는 /public/logo/ 에 보관 (SNS·인쇄 등 외부 용도).
 */
export async function Logo({ className = "" }: { className?: string }) {
  const locale = await getLocale();
  const tagline =
    locale === "en" ? "KOREAN SPIRITS GLOBAL HUB" : "우리술의 모든 것";

  return (
    <div
      className={`flex items-center gap-2.5 text-[#0c2545] ${className}`}
      aria-label={`Sooly — ${tagline}`}
    >
      <VesselMark className="size-8 shrink-0 sm:size-9" />
      <div className="flex flex-col leading-none">
        <span className="font-serif text-[1.35rem] font-bold tracking-[0.02em] sm:text-2xl">
          SOOLY
        </span>
        <span className="mt-0.5 text-[0.55rem] tracking-[0.12em] opacity-80 sm:text-[0.6rem]">
          {tagline}
        </span>
      </div>
    </div>
  );
}

/**
 * 전통주 주전자 + 사발 라인아트.
 * Kim 의 원본 로고 일러스트를 SVG 로 재해석.
 */
function VesselMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      {/* 주전자: 좁은 목 → 어깨 → 불룩한 몸통 → 받침 */}
      <path
        d="M17 6 L17 14
           Q17 16 19 16
           L19 20
           Q11 22 11 34
           Q11 44 20 47
           L32 47
           Q35 47 35 43
           L35 37
           Q35 34 33 33
           L33 22
           Q25 20 25 16 Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      {/* 주전자 손잡이 (오른쪽 곡선) */}
      <path
        d="M35 28 Q41 28 41 34 Q41 40 35 40"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
      {/* 막걸리 라인 (몸통 안쪽) */}
      <path
        d="M14 32 Q22 30 30 32"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.7"
        fill="none"
      />
      {/* 사발: 오른쪽 아래 작은 컵 */}
      <path
        d="M44 40
           Q44 47 50 47
           Q56 47 56 40 Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      {/* 받침 라인 */}
      <line
        x1="8"
        y1="51"
        x2="36"
        y2="51"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="42"
        y1="51"
        x2="58"
        y2="51"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
