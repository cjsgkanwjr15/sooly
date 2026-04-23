"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export function BreweriesFilter({ regions }: { regions: string[] }) {
  const pathname = usePathname();
  const params = useSearchParams();
  const active = params.get("region");

  function hrefFor(value: string): string {
    const next = new URLSearchParams(params);
    if (next.get("region") === value) next.delete("region");
    else next.set("region", value);
    const qs = next.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 text-xs font-medium text-muted-foreground">지역</span>
      {regions.map((r) => {
        const isActive = active === r;
        return (
          <Link
            key={r}
            href={hrefFor(r)}
            className={
              "rounded-full border px-3 py-1 text-xs transition-colors " +
              (isActive
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground")
            }
          >
            {r}
          </Link>
        );
      })}
      {(active || params.get("q")) && (
        <Link
          href={pathname}
          className="ml-1 text-xs text-muted-foreground underline-offset-2 hover:underline"
        >
          해제
        </Link>
      )}
    </div>
  );
}
