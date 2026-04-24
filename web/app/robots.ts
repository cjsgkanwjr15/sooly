import type { MetadataRoute } from "next";
import { env } from "@/lib/env";

/**
 * robots.txt — Next.js metadata route 로 자동 서빙.
 * - 검색엔진이 전체 공개 영역을 크롤링하도록 허용.
 * - /healthcheck, /api 같은 내부 경로는 차단.
 * - sitemap 위치 명시 (ref: app/sitemap.ts).
 */
export default function robots(): MetadataRoute.Robots {
  const base = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/healthcheck", "/api/"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
