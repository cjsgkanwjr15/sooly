"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { LOCALE_COOKIE, type Locale } from "@/lib/locale";

/**
 * Locale toggle 용 Server Action.
 * 쿠키를 설정하고 현재 경로를 재검증해 서버 컴포넌트(Logo 등)를
 * 새 locale 로 다시 렌더.
 */
export async function setLocale(locale: Locale) {
  const c = await cookies();
  c.set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1년
    sameSite: "lax",
  });
  revalidatePath("/", "layout");
}
