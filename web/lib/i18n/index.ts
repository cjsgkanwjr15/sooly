import type { Locale } from "@/lib/locale";
import { ko, type Dict } from "./ko";
import { en } from "./en";

const dicts = { ko, en } as const;

/**
 * Recursive type extracting dot-paths to STRING leaves of `Dict`.
 * - "header.login" ✓ (leaf is string)
 * - "header" ✗ (leaf is object)
 *
 * 잘못된 키 = 컴파일 에러. IDE 자동완성도 동작.
 */
type DotPath<T, P extends string = ""> = {
  [K in keyof T & string]: T[K] extends string
    ? P extends ""
      ? K
      : `${P}.${K}`
    : T[K] extends object
      ? DotPath<T[K], P extends "" ? K : `${P}.${K}`>
      : never;
}[keyof T & string];

export type TKey = DotPath<Dict>;

/**
 * locale + dot-path 으로 라벨 조회.
 *
 * Server Component 사용 예:
 *   const locale = await getLocale();
 *   <h1>{t(locale, "header.nav.products")}</h1>
 *
 * 매개변수 치환 (placeholder `{name}`):
 *   t(locale, "pagination.pageOf", { page: 3, total: 10 })
 *
 * Client Component 사용 예: 부모 (서버) 가 locale 을 prop 으로 내려주거나,
 * 향후 LocaleContext 로 감싸기 (지금은 prop drilling 으로 충분).
 *
 * 키 누락 시 fallback: ko 사전에서 찾기 → 그래도 없으면 path 자체를 반환 (디버깅용).
 */
export function t(
  locale: Locale,
  path: TKey,
  vars?: Record<string, string | number>,
): string {
  const fromLocale = resolve(dicts[locale], path);
  let raw =
    typeof fromLocale === "string"
      ? fromLocale
      : (() => {
          // ko fallback (en 사전에 키 빠진 케이스 — 컴파일러가 잡지만 런타임 안전망)
          const fromKo = resolve(dicts.ko, path);
          return typeof fromKo === "string" ? fromKo : path;
        })();

  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      raw = raw.replaceAll(`{${k}}`, String(v));
    }
  }
  return raw;
}

function resolve(obj: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object" && key in acc) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

/**
 * Dynamic 한국어 키 매핑용 helper. DotPath 의 generic string 인자가 들어가는 타입
 * narrowing 한계를 우회하면서도 사용처에서 namespace 별로 구분된 호출을 노출.
 *
 * 예: tCategory(locale, product.category)
 *     tTaste(locale, "단맛")
 */
export function tCategory(locale: Locale, koValue: string): string {
  return t(locale, `categories.${koValue}` as TKey);
}

export function tCategoryHint(locale: Locale, koValue: string): string {
  return t(locale, `categoryHints.${koValue}` as TKey);
}

export function tTaste(locale: Locale, koValue: string): string {
  return t(locale, `taste.${koValue}` as TKey);
}

/**
 * 한국 시도 한국어 → locale 별 표기. dictionary 에 없는 region (raw value 가
 * "경기" 처럼 짧거나 시군구 단위면) 은 한국어 그대로 fallback.
 */
export function tRegion(locale: Locale, koValue: string): string {
  const path = `regions.${koValue}`;
  const fromLocale = resolve(dicts[locale], path);
  if (typeof fromLocale === "string") return fromLocale;
  // 매칭 없으면 raw 한국어 (외국인 사용자가 봐도 한국 시도명 검색 가능 — 안전)
  return koValue;
}
