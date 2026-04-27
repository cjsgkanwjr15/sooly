import { cookies, headers } from "next/headers";

export type Locale = "ko" | "en";
export const LOCALES: Locale[] = ["ko", "en"];
export const DEFAULT_LOCALE: Locale = "ko";
const COOKIE_NAME = "NEXT_LOCALE";

/**
 * 현재 요청의 locale 결정.
 * 우선순위: 쿠키(유저 override) → Accept-Language → 기본값(ko).
 * Server Component·Route Handler·Server Action 에서 호출 가능.
 */
export async function getLocale(): Promise<Locale> {
  const c = await cookies();
  const fromCookie = c.get(COOKIE_NAME)?.value;
  if (fromCookie === "ko" || fromCookie === "en") return fromCookie;

  const h = await headers();
  const accept = h.get("accept-language") ?? "";
  // "ko-KR,ko;q=0.9,en;q=0.8" → 첫 번째 매칭 locale
  const first = accept
    .split(",")
    .map((part) => part.split(";")[0].trim().toLowerCase())
    .find((lang) => lang.startsWith("ko") || lang.startsWith("en"));

  if (first?.startsWith("en")) return "en";
  return DEFAULT_LOCALE;
}

export { COOKIE_NAME as LOCALE_COOKIE };

/**
 * locale 에 맞는 텍스트 선택. locale='en' 이고 en 값이 있으면 en, 그 외엔 ko fallback.
 * Translate 가 아직 채우지 않은 row 도 안전하게 ko 로 떨어짐.
 *
 * 사용 예:
 *   pick(locale, product.name_ko, product.name_en)
 *   pick(locale, brewery.story_ko, brewery.story_en)
 */
export function pick(
  locale: Locale,
  ko: string | null | undefined,
  en: string | null | undefined,
): string | null {
  if (locale === "en" && en && en.trim()) return en;
  if (ko && ko.trim()) return ko;
  // ko 도 비어있으면 en 마지막 fallback (드물지만 ko 만 비어있는 경우)
  if (en && en.trim()) return en;
  return null;
}
