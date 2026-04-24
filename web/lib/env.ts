import { z } from "zod";

/**
 * 환경변수 스키마.
 * - NEXT_PUBLIC_* 은 브라우저·서버 모두에서 접근 가능 (빌드 시 인라인됨).
 * - 나머지는 서버 전용. 클라이언트 번들에 절대 포함되면 안 됨.
 *
 * next.config 에서 이 파일을 import 해 빌드 시 검증하는 것을 권장.
 */
const serverSchema = z.object({
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
});

const clientSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3000"),
});

// Vercel 자동 주입 env 우선순위:
//   1. NEXT_PUBLIC_SITE_URL       — 명시적 override (커스텀 도메인 붙일 때)
//   2. VERCEL_PROJECT_PRODUCTION_URL — stable production 도메인 (예: sooly.vercel.app)
//      * 배포 hash 가 바뀌어도 안 바뀌므로 sitemap/robots 용으로 안전
//   3. VERCEL_URL                 — 현재 배포의 deployment-specific URL (preview/dev fallback)
//
// robots.txt 와 sitemap.xml 이 이 값을 기반으로 생성되므로 production 에서는
// 꼭 2번이 잡혀야 함 — 아니면 sooly-xxxxx.vercel.app 이 sitemap 에 박힌다.
const vercelUrl =
  process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL ??
  process.env.VERCEL_PROJECT_PRODUCTION_URL ??
  process.env.NEXT_PUBLIC_VERCEL_URL ??
  process.env.VERCEL_URL;
const inferredSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (vercelUrl ? `https://${vercelUrl}` : undefined);

const _client = clientSchema.safeParse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_SITE_URL: inferredSiteUrl,
});

if (!_client.success) {
  // dev 에서 .env.local 이 비어 있으면 명확히 실패하도록.
  console.error(
    "❌ Invalid public env:",
    _client.error.flatten().fieldErrors,
  );
  throw new Error("Invalid public env — check web/.env.local against web/.env.example");
}

const _server = serverSchema.safeParse({
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
});

if (!_server.success) {
  console.error(
    "❌ Invalid server env:",
    _server.error.flatten().fieldErrors,
  );
  throw new Error("Invalid server env");
}

export const env = {
  ..._client.data,
  ..._server.data,
} as const;
