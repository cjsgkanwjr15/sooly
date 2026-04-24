import Link from "next/link";

type Props = {
  /** 현재 페이지 (1-based) */
  page: number;
  /** 전체 페이지 수 */
  totalPages: number;
  /** URL 생성 함수: 페이지 번호 → 해당 페이지 href */
  hrefForPage: (page: number) => string;
};

export function Pagination({ page, totalPages, hrefForPage }: Props) {
  if (totalPages <= 1) return null;

  // 최대 7개 페이지 번호 표시 (현재 ± 2, 양 끝)
  const pages: Array<number | "ellipsis"> = [];
  const add = (n: number | "ellipsis") => pages.push(n);

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) add(i);
  } else {
    add(1);
    if (page > 3) add("ellipsis");
    const start = Math.max(2, page - 1);
    const end = Math.min(totalPages - 1, page + 1);
    for (let i = start; i <= end; i++) add(i);
    if (page < totalPages - 2) add("ellipsis");
    add(totalPages);
  }

  const baseClass =
    "inline-flex h-9 min-w-[2.25rem] items-center justify-center rounded-md px-2 text-sm transition-colors";

  return (
    <nav className="mt-10 flex items-center justify-center gap-1" aria-label="Pagination">
      {page > 1 && (
        <Link
          href={hrefForPage(page - 1)}
          className={`${baseClass} border hover:border-primary/40 hover:text-primary`}
        >
          ← 이전
        </Link>
      )}
      {pages.map((p, i) =>
        p === "ellipsis" ? (
          <span key={`e-${i}`} className={`${baseClass} text-muted-foreground`}>…</span>
        ) : (
          <Link
            key={p}
            href={hrefForPage(p)}
            aria-current={p === page ? "page" : undefined}
            className={
              p === page
                ? `${baseClass} bg-primary text-primary-foreground`
                : `${baseClass} border hover:border-primary/40 hover:text-primary`
            }
          >
            {p}
          </Link>
        ),
      )}
      {page < totalPages && (
        <Link
          href={hrefForPage(page + 1)}
          className={`${baseClass} border hover:border-primary/40 hover:text-primary`}
        >
          다음 →
        </Link>
      )}
    </nav>
  );
}
