import Link from "next/link";
import type { Metadata } from "next";
import { getLocale } from "@/lib/locale";

export const metadata: Metadata = {
  title: "페이지를 찾을 수 없어요",
  description: "찾으시는 페이지가 없거나 이동했어요.",
  robots: { index: false, follow: false },
};

export default async function NotFound() {
  const locale = await getLocale();
  const isEn = locale === "en";

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-6 py-20 text-center">
      <p className="font-serif text-xs uppercase tracking-[0.3em] text-primary/70">
        404
      </p>
      <h1 className="mt-4 font-serif text-4xl font-semibold tracking-tight sm:text-5xl">
        {isEn ? "Page not found" : "페이지를 찾을 수 없어요"}
      </h1>
      <p className="mt-4 max-w-md text-[0.95rem] leading-relaxed text-muted-foreground">
        {isEn
          ? "The page you're looking for doesn't exist or has moved. Try one of these instead."
          : "찾으시는 페이지가 없거나 이동했어요. 아래 링크에서 다시 시작해보세요."}
      </p>

      <ul className="mt-10 grid w-full max-w-sm grid-cols-1 gap-3 sm:grid-cols-2">
        <NavCard
          href="/"
          title={isEn ? "Home" : "홈"}
          subtitle={isEn ? "Back to start" : "처음으로"}
        />
        <NavCard
          href="/products"
          title={isEn ? "Products" : "제품"}
          subtitle={isEn ? "791 sools" : "791개의 술"}
        />
        <NavCard
          href="/breweries"
          title={isEn ? "Breweries" : "양조장"}
          subtitle={isEn ? "431 makers" : "431곳의 양조장"}
        />
        <NavCard
          href="/blog"
          title="Journal"
          subtitle={isEn ? "Latest posts" : "최근 글"}
        />
      </ul>
    </main>
  );
}

function NavCard({
  href,
  title,
  subtitle,
}: {
  href: string;
  title: string;
  subtitle: string;
}) {
  return (
    <li>
      <Link
        href={href}
        className="group flex flex-col rounded-xl border bg-card px-4 py-3 text-left transition-all hover:-translate-y-0.5 hover:border-primary/30"
      >
        <span className="font-serif text-base font-medium group-hover:text-primary">
          {title}
        </span>
        <span className="mt-0.5 text-xs text-muted-foreground">{subtitle}</span>
      </Link>
    </li>
  );
}
