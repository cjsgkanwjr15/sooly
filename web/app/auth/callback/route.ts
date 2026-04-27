import { NextResponse, type NextRequest } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

/**
 * 매직 링크 destination. 이메일에서 링크 클릭 시 진입.
 *
 * 두 형태 모두 지원 (Supabase 버전·설정에 따라 다름):
 *   1. `?code=<one-time>&next=<path>` — PKCE flow (권장 / 신규 default)
 *   2. `?token_hash=<>&type=magiclink&next=<path>` — token hash flow (legacy / fallback)
 *
 * 성공: next 경로로 redirect. 실패: /login?error=callback.
 *
 * Note: 이 route 는 next/headers cookies 를 통해 Set-Cookie 헤더를 설정.
 *       그래서 supabaseServer() 의 setAll 이 정상 동작 (Server Action / Route Handler 컨텍스트).
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  const next = sanitizeNext(searchParams.get("next"));

  const sb = await supabaseServer();

  if (code) {
    const { error } = await sb.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}${next}`);
  } else if (tokenHash && type) {
    const { error } = await sb.auth.verifyOtp({
      // Supabase 의 EmailOtpType union — magiclink/recovery/invite/email/email_change.
      // 매직 링크만 사용하면 사실상 'magiclink' 또는 'email' 가 들어옴.
      type: type as "magiclink" | "email" | "recovery" | "invite" | "email_change",
      token_hash: tokenHash,
    });
    if (!error) return NextResponse.redirect(`${origin}${next}`);
  }

  return NextResponse.redirect(`${origin}/login?error=callback`);
}

/**
 * Open redirect 방지: next 는 반드시 같은 호스트의 path 여야 함.
 * "/" 시작하지 않거나 "//" 로 시작하면 (protocol-relative) 홈으로.
 */
function sanitizeNext(raw: string | null): string {
  if (!raw) return "/";
  if (!raw.startsWith("/") || raw.startsWith("//")) return "/";
  return raw;
}
