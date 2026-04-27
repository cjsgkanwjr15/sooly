import type { Metadata } from "next";
import Script from "next/script";
import { Fraunces, Inter, Gowun_Batang } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { JsonLd } from "@/components/json-ld";
import { getLocale } from "@/lib/locale";
import { env } from "@/lib/env";

// Google Analytics 4 측정 ID. 프로덕션 빌드에서만 로드 (아래 IS_PROD 게이트).
const GA_MEASUREMENT_ID = "G-9Y8QY6L8M6";
const IS_PROD = process.env.NODE_ENV === "production";

// Site-wide schema.org 데이터.
// SearchAction 으로 Google 검색 결과 아래에 사이트 내부 검색 박스 노출 가능
// (충분한 트래픽 + 검색 사용 패턴 쌓이면 자동 활성화됨).
const siteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Sooly",
  alternateName: "Sooly · 한국술 정보 허브",
  url: env.NEXT_PUBLIC_SITE_URL,
  description: "한국 전통주·막걸리·소주·과실주 정보 허브",
  inLanguage: "ko-KR",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${env.NEXT_PUBLIC_SITE_URL}/products?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
  publisher: {
    "@type": "Organization",
    name: "Sooly",
    url: env.NEXT_PUBLIC_SITE_URL,
  },
};

// 영문 세리프 (디스플레이/헤드라인용)
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

// 영문 산세리프 (본문)
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

// 한글 세리프 (디스플레이·한국술 감성에 어울림)
const gowunBatang = Gowun_Batang({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-kr-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Sooly · 한국술 정보 허브",
    template: "%s · Sooly",
  },
  description: "한국 전통주·막걸리·소주·과실주를 발견하고 기록하는 곳. Korean alcohol, curated.",
  verification: {
    // 동일 빌드에 여러 Search Console 속성 verification 태그를 동시 노출.
    // 옛 계정 (sooly.vercel.app 등록한 계정) 에 sooly.co.kr 도 등록해서
    // 주소 변경 도구로 SEO 이전 가능하게 함.
    google: [
      "gPIy7t5wc1y1qXzIfYvHYdFlIOSQKTzrBRG_ruL7670", // 신 계정 / sooly.vercel.app
      "alf0maWWk0xgKxeUDQ_QjXvaHQsD3NhqQsjeKXsA4ZI", // 신 계정 / sooly.co.kr
      "oulnq0F0gDjr3BnFdB-a2q2jVa_jMYvvHdNYRXlmKyc", // 옛 계정 / sooly.co.kr — 주소 변경 도구용
    ],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  return (
    <html
      lang={locale}
      className={`${inter.variable} ${fraunces.variable} ${gowunBatang.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <JsonLd data={siteJsonLd} />
        <SiteHeader />
        <div className="flex-1">{children}</div>
        <SiteFooter />

        {/* Google Analytics 4 — prod 빌드에서만.
            dev (npm run dev) 에선 NODE_ENV === "development" 라 로컬 트래픽이
            프로덕션 통계를 오염시키지 않음.
            strategy="afterInteractive" 로 페이지 최초 렌더 방해 안 함. */}
        {IS_PROD && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_MEASUREMENT_ID}');
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
