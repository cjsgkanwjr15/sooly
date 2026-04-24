/**
 * 공용 로딩 스켈레톤. 네비게이션 시 즉시 표시돼
 * "버튼 눌러도 반응 없음" 체감을 제거.
 */

export function SkeletonCard() {
  return (
    <div className="flex flex-col rounded-lg border bg-card p-5">
      <div className="h-4 w-16 animate-pulse rounded bg-muted" />
      <div className="mt-3 h-5 w-3/4 animate-pulse rounded bg-muted" />
      <div className="mt-2 h-4 w-1/2 animate-pulse rounded bg-muted" />
      <div className="mt-3 h-4 w-24 animate-pulse rounded bg-muted" />
      <div className="mt-auto pt-3 flex gap-3">
        <div className="h-3 w-10 animate-pulse rounded bg-muted" />
        <div className="h-3 w-12 animate-pulse rounded bg-muted" />
      </div>
    </div>
  );
}

export function SkeletonCardGrid({ count = 9 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonHeader() {
  return (
    <header className="mb-6">
      <div className="h-8 w-48 animate-pulse rounded bg-muted sm:h-10" />
      <div className="mt-3 h-4 w-64 animate-pulse rounded bg-muted" />
    </header>
  );
}

export function SkeletonText({ lines = 3, className = "" }: { lines?: number; className?: string }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 animate-pulse rounded bg-muted"
          style={{ width: `${100 - i * 12}%` }}
        />
      ))}
    </div>
  );
}
