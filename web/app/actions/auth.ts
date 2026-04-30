"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { supabaseServer } from "@/lib/supabase/server";
import { env } from "@/lib/env";

const emailSchema = z
  .email({ message: "올바른 이메일 형식이 아닙니다." })
  .max(254)
  .trim();

const nextSchema = z
  .string()
  .max(512)
  .refine((v) => v.startsWith("/") && !v.startsWith("//"), {
    message: "invalid next path",
  });

export type LoginState = {
  status: "idle" | "sent" | "error";
  message?: string;
  email?: string;
};

/**
 * 매직 링크 발송. /login 폼이 useActionState 로 호출.
 *
 * 성공:
 *   - status="sent" → 폼이 "이메일을 확인해주세요" 화면으로 전환
 *   - 이메일 링크 = ${SITE_URL}/auth/callback?next=...
 *
 * 실패:
 *   - 이메일 형식 오류: zod 메시지 노출
 *   - Supabase 에러: 일반 메시지 (rate limit 정확 메시지 노출 안 함, 보안상)
 */
export async function sendMagicLink(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const rawEmail = formData.get("email");
  const next = (formData.get("next") as string | null) ?? "/";

  const parsed = emailSchema.safeParse(rawEmail);
  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "이메일을 확인해주세요.",
    };
  }

  // 절대 URL 로 콜백 구성. SITE_URL 이 prod 기준이라 prod 에서 보낸 메일은
  // localhost 로 안 향함 (dev 에서는 localhost:3000 으로 향함).
  const callback = new URL(`${env.NEXT_PUBLIC_SITE_URL}/auth/callback`);
  callback.searchParams.set("next", next);

  const sb = await supabaseServer();
  const { error } = await sb.auth.signInWithOtp({
    email: parsed.data,
    options: {
      emailRedirectTo: callback.toString(),
    },
  });

  if (error) {
    return {
      status: "error",
      message: "메일 전송에 실패했어요. 잠시 후 다시 시도해주세요.",
    };
  }

  return { status: "sent", email: parsed.data };
}

/**
 * 로그아웃 → 홈으로.
 * 헤더의 `<form action={signOut}>` 에서 호출.
 */
export async function signOut() {
  const sb = await supabaseServer();
  await sb.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}

/**
 * OAuth provider 로 로그인 시작 (공통 로직).
 * `<form action={signInWithGoogle | signInWithKakao}>` 가 호출.
 *
 * 흐름:
 *   1. 이 액션 호출 → Supabase 가 provider authorize URL 발급 (PKCE)
 *   2. 우리가 그 URL 로 302 redirect
 *   3. 사용자 동의 → provider 가 Supabase 콜백으로 redirect
 *   4. Supabase 가 ${SITE_URL}/auth/callback?code=... 로 redirect
 *   5. 기존 /auth/callback 라우트가 code 를 세션으로 교환 → next 경로로 이동
 */
async function startOAuth(
  provider: "google" | "kakao",
  formData: FormData,
): Promise<never> {
  const rawNext = (formData.get("next") as string | null) ?? "/";
  const nextParsed = nextSchema.safeParse(rawNext);
  const next = nextParsed.success ? nextParsed.data : "/";

  const callback = new URL(`${env.NEXT_PUBLIC_SITE_URL}/auth/callback`);
  callback.searchParams.set("next", next);

  const sb = await supabaseServer();
  const { data, error } = await sb.auth.signInWithOAuth({
    provider,
    options: { redirectTo: callback.toString() },
  });

  if (error || !data?.url) {
    redirect(`/login?error=oauth&next=${encodeURIComponent(next)}`);
  }

  redirect(data.url);
}

export async function signInWithGoogle(formData: FormData) {
  await startOAuth("google", formData);
}

export async function signInWithKakao(formData: FormData) {
  await startOAuth("kakao", formData);
}
