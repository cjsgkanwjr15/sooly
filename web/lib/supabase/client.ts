"use client";

import { createBrowserClient } from "@supabase/ssr";
import { env } from "@/lib/env";

/**
 * Client Component 전용 Supabase 클라이언트.
 * - 로컬 스토리지 기반 세션, 브라우저 쿠키 동기화는 @supabase/ssr 이 처리.
 * - Server Component 에서는 절대 import 하지 말 것 (use client 경계).
 */
export function supabaseBrowser() {
  return createBrowserClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}
