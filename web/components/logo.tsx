import Image from "next/image";
import { getLocale } from "@/lib/locale";

/**
 * Sooly 로고. 브라우저 언어(또는 NEXT_LOCALE 쿠키)에 따라
 * 한글판 / 영문판 자동 선택. Server Component.
 *
 * 로고 파일은 /public/logo/ 에서 관리. 원본은 ~512x284 비율.
 */
export async function Logo({ className = "" }: { className?: string }) {
  const locale = await getLocale();
  const src = locale === "en" ? "/logo/sooly-en.png" : "/logo/sooly-ko.png";
  const alt =
    locale === "en"
      ? "Sooly — Korean Spirits Global Hub"
      : "Sooly — 우리술의 모든 것";

  return (
    <Image
      src={src}
      alt={alt}
      width={512}
      height={284}
      priority
      className={`h-8 w-auto sm:h-9 ${className}`}
    />
  );
}
