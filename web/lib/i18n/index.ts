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
 * Client Component 사용 예: 부모 (서버) 가 locale 을 prop 으로 내려주거나,
 * 향후 LocaleContext 로 감싸기 (지금은 prop drilling 으로 충분).
 *
 * 키 누락 시 fallback: ko 사전에서 찾기 → 그래도 없으면 path 자체를 반환 (디버깅용).
 */
export function t(locale: Locale, path: TKey): string {
  const fromLocale = resolve(dicts[locale], path);
  if (typeof fromLocale === "string") return fromLocale;
  // ko fallback (en 사전에 키 빠진 케이스 — 컴파일러가 잡지만 런타임 안전망)
  const fromKo = resolve(dicts.ko, path);
  return typeof fromKo === "string" ? fromKo : path;
}

function resolve(obj: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object" && key in acc) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}
