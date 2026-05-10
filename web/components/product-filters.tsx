"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { t, tCategory, tRegion } from "@/lib/i18n";
import type { Locale } from "@/lib/locale";

type Props = {
  categories: string[];
  regions: string[];
  locale: Locale;
};

/**
 * URL param 기반 필터 UI. 클릭 → 해당 필터 적용된 URL 로 이동.
 * 이미 선택된 필터를 다시 클릭하면 해제.
 *
 * Client component 라 locale 은 부모 (server) 에서 prop drilling.
 */
export function ProductFilters({ categories, regions, locale }: Props) {
  const pathname = usePathname();
  const params = useSearchParams();
  const activeCategory = params.get("category");
  const activeRegion = params.get("region");

  function hrefFor(key: "category" | "region", value: string): string {
    const next = new URLSearchParams(params);
    if (next.get(key) === value) next.delete(key);
    else next.set(key, value);
    const qs = next.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  }

  function chipClass(active: boolean): string {
    return [
      "rounded-full border px-3 py-1 text-xs transition-colors",
      active
        ? "border-primary bg-primary text-primary-foreground"
        : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
    ].join(" ");
  }

  const hasAny = activeCategory || activeRegion || params.get("q");

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 text-xs font-medium text-muted-foreground">
          {t(locale, "filters.category")}
        </span>
        {categories.map((c) => (
          <Link
            key={c}
            href={hrefFor("category", c)}
            className={chipClass(activeCategory === c)}
          >
            {tCategory(locale, c)}
          </Link>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 text-xs font-medium text-muted-foreground">
          {t(locale, "filters.region")}
        </span>
        {regions.map((r) => (
          <Link
            key={r}
            href={hrefFor("region", r)}
            className={chipClass(activeRegion === r)}
          >
            {tRegion(locale, r)}
          </Link>
        ))}
      </div>
      {hasAny && (
        <div>
          <Link
            href={pathname}
            className="text-xs text-muted-foreground underline-offset-2 hover:underline"
          >
            {t(locale, "filters.clearAll")}
          </Link>
        </div>
      )}
    </div>
  );
}
