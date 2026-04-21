import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { env } from "@/lib/env";

/**
 * Server Component / Route Handler / Server Action 용 Supabase 클라이언트.
 * - 요청별로 cookies() 에서 세션을 읽어 auth 상태를 그대로 이어받음.
 * - RLS 적용됨 (anon/authenticated 역할).
 *
 * 사용 예:
 *   const sb = await supabaseServer();
 *   const { data } = await sb.from("products").select("*").limit(10);
 */
export async function supabaseServer() {
  const cookieStore = await cookies();

  return createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Server Component 에서 호출되면 set 은 불가 — 무시.
            // Route Handler / Server Action 에서는 정상 동작.
          }
        },
      },
    },
  );
}
