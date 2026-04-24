import type { MetadataRoute } from "next";
import { supabaseServer } from "@/lib/supabase/server";
import { env } from "@/lib/env";

/**
 * sitemap.xml — 정적 경로 + 모든 products / breweries 상세 페이지.
 * 총 규모: ~1,230 URL (793 products + 431 breweries + 10여 static).
 *
 * Next.js 의 MetadataRoute.Sitemap 은 자동으로 50,000 URL 단위로 분할되지만,
 * 현재 규모에선 단일 파일로 충분.
 *
 * revalidate 를 넉넉히: ETL 주기가 빠르지 않고, 검색엔진은 보통 하루 1회 이하로 재방문.
 */
export const revalidate = 86400; // 24시간

const CATEGORIES = ["탁주", "약주", "청주", "증류주", "과실주", "리큐르"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  const now = new Date();

  // --- READ ONLY: 전체 products.id/updated_at + breweries.id/updated_at ---
  const sb = await supabaseServer();

  // Supabase 기본 리밋이 1000. 현재 규모 (793/431) 는 여유. 1000 넘어가면 페이지네이션 추가 필요.
  const [productRes, breweryRes] = await Promise.all([
    sb.from("products").select("id, updated_at").limit(2000),
    sb.from("breweries").select("id, updated_at").limit(2000),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${base}/products`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/breweries`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/for-breweries`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    ...CATEGORIES.map((c) => ({
      url: `${base}/categories/${encodeURIComponent(c)}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];

  const productRoutes: MetadataRoute.Sitemap = (productRes.data ?? []).map((p) => ({
    url: `${base}/products/${p.id}`,
    lastModified: p.updated_at ? new Date(p.updated_at) : now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const breweryRoutes: MetadataRoute.Sitemap = (breweryRes.data ?? []).map((b) => ({
    url: `${base}/breweries/${b.id}`,
    lastModified: b.updated_at ? new Date(b.updated_at) : now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...productRoutes, ...breweryRoutes];
}
