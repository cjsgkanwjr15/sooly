import Image from "next/image";

type AspectRatio = "1/1" | "4/3" | "16/9" | "3/4";

type Props = {
  src?: string | null;
  alt: string;
  aspectRatio?: AspectRatio;
  /** 카테고리가 있으면 그에 맞춰 색조 살짝 조정 */
  category?: string | null;
  className?: string;
};

const ASPECT_CLASS: Record<AspectRatio, string> = {
  "1/1": "aspect-square",
  "4/3": "aspect-[4/3]",
  "16/9": "aspect-[16/9]",
  "3/4": "aspect-[3/4]",
};

const CATEGORY_ACCENT: Record<string, string> = {
  탁주: "from-amber-100 via-amber-50 to-orange-100",
  약주: "from-yellow-100 via-amber-50 to-yellow-50",
  청주: "from-sky-50 via-blue-50 to-indigo-50",
  증류주: "from-rose-50 via-orange-50 to-amber-50",
  과실주: "from-purple-50 via-pink-50 to-rose-50",
  리큐르: "from-emerald-50 via-teal-50 to-cyan-50",
};

/**
 * 제품/양조장 사진 슬롯.
 * src 가 없으면 따뜻한 그라데이션 + "사진 준비중이에요 🍶" 귀엽게 표시.
 * src 가 있으면 Next.js Image 로 정상 렌더.
 */
export function PhotoPlaceholder({
  src,
  alt,
  aspectRatio = "4/3",
  category,
  className = "",
}: Props) {
  if (src) {
    return (
      <div className={`relative overflow-hidden rounded-xl ${ASPECT_CLASS[aspectRatio]} ${className}`}>
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 60vw"
        />
      </div>
    );
  }

  const gradient =
    (category && CATEGORY_ACCENT[category]) ?? "from-primary/10 via-primary/5 to-background";

  return (
    <div
      className={[
        "relative overflow-hidden rounded-xl border border-primary/10",
        "bg-gradient-to-br",
        gradient,
        ASPECT_CLASS[aspectRatio],
        className,
      ].join(" ")}
      role="img"
      aria-label={alt}
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center">
        <span className="text-4xl" aria-hidden>🍶</span>
        <p className="font-serif text-sm text-foreground/70 sm:text-base">
          사진 준비중이에요
        </p>
        <p className="text-[10px] uppercase tracking-widest text-foreground/40">
          Photo coming soon
        </p>
      </div>
    </div>
  );
}
