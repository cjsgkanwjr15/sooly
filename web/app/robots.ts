import type { MetadataRoute } from "next";
import { env } from "@/lib/env";

/**
 * robots.txt — Next.js metadata route.
 *
 * 5-12 보강: Hobby plan 4개 limit 동시 hit 후 봇 화이트리스트 + AI 학습 봇 차단 +
 * 기본 crawl-delay 5. SEO 가치 있는 검색엔진 (Google / Naver / Bing) 만 무제한.
 */
export default function robots(): MetadataRoute.Robots {
  const base = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  return {
    rules: [
      // 1. 검색엔진 — 전체 허용 (SEO 자산)
      {
        userAgent: ["Googlebot", "Yeti", "Bingbot", "DuckDuckBot", "Applebot"],
        allow: "/",
        disallow: ["/healthcheck", "/api/"],
      },
      // 2. 소셜 share preview 봇 — 전체 허용 (OG meta 가져가야 함)
      {
        userAgent: [
          "facebookexternalhit",
          "Twitterbot",
          "LinkedInBot",
          "Slackbot",
          "Slackbot-LinkExpanding",
          "WhatsApp",
          "TelegramBot",
        ],
        allow: "/",
        disallow: ["/healthcheck", "/api/"],
      },
      // 3. AI 학습 / 생성 봇 — 전면 차단 (Sooly 데이터 학습 X)
      {
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "OAI-SearchBot",
          "ClaudeBot",
          "anthropic-ai",
          "Claude-Web",
          "PerplexityBot",
          "Google-Extended",
          "Applebot-Extended",
          "CCBot",
          "Bytespider",
          "ImagesiftBot",
          "Diffbot",
          "Meta-ExternalAgent",
          "FacebookBot",
          "cohere-ai",
        ],
        disallow: "/",
      },
      // 4. SEO 스크레이퍼 — 차단 (Sooly 에게 가치 없는 트래픽)
      {
        userAgent: [
          "AhrefsBot",
          "SemrushBot",
          "MJ12bot",
          "DotBot",
          "BLEXBot",
          "DataForSeoBot",
          "PetalBot",
        ],
        disallow: "/",
      },
      // 5. 기본 — 허용하되 crawl-delay 로 rate limit
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/healthcheck", "/api/"],
        crawlDelay: 5,
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
