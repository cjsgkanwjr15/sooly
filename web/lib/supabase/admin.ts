import { createClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";

/**
 * service_role 키를 쓰는 관리자용 클라이언트.
 * - RLS 를 우회하므로 반드시 서버 컨텍스트(Server Actions, Route Handlers,
 *   또는 별도 ETL 스크립트)에서만 사용.
 * - Client Component 에서 import 하면 키가 번들에 노출됨. 절대 금지.
 */
export function supabaseAdmin() {
  if (!env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is not set — admin client unavailable",
    );
  }
  return createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
