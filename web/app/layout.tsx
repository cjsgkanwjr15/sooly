import type { Metadata } from "next";
import { Fraunces, Inter, Gowun_Batang } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { getLocale } from "@/lib/locale";

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
        <SiteHeader />
        <div className="flex-1">{children}</div>
      </body>
    </html>
  );
}
