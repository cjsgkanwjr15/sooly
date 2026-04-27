import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { env } from "@/lib/env";

/**
 * Next.js 16 에서 `middleware.ts` 가 `proxy.ts` 로 리네임됨.
 * 함수명도 `proxy`.
 *
 * 매 요청마다 Supabase 세션 토큰을 갱신해 만료된 access_token 을 refresh.
 * - request.cookies 에 새 토큰을 쓰면 같은 요청 안의 Server Component 가 fresh 토큰 사용.
 * - response.cookies 에도 써서 브라우저가 새 토큰 저장.
 *
 * 중요: createServerClient ↔ getUser() 사이에 다른 로직 두지 말 것.
 *       getUser() 가 cookies 헬퍼를 호출해 토큰을 갱신하므로,
 *       그 사이에 다른 호출 끼면 세션이 inconsistent 해짐.
 */
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: [
    // 정적 자산·이미지·favicon·sitemap·robots 는 스킵 (불필요한 토큰 refresh 회피)
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|xml|txt)$).*)",
  ],
};
