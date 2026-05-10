import Link from "next/link";
import type { Metadata } from "next";
import { getLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: t(locale, "notFound.metaTitle"),
    description: t(locale, "notFound.metaDescription"),
    robots: { index: false, follow: false },
  };
}

export default async function NotFound() {
  const locale = await getLocale();

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-6 py-20 text-center">
      <p className="font-serif text-xs uppercase tracking-[0.3em] text-primary/70">
        {t(locale, "notFound.code")}
      </p>
      <h1 className="mt-4 font-serif text-4xl font-semibold tracking-tight sm:text-5xl">
        {t(locale, "notFound.h1")}
      </h1>
      <p className="mt-4 max-w-md text-[0.95rem] leading-relaxed text-muted-foreground">
        {t(locale, "notFound.body")}
      </p>

      <ul className="mt-10 grid w-full max-w-sm grid-cols-1 gap-3 sm:grid-cols-2">
        <NavCard
          href="/"
          title={t(locale, "notFound.homeTitle")}
          subtitle={t(locale, "notFound.homeSubtitle")}
        />
        <NavCard
          href="/products"
          title={t(locale, "notFound.productsTitle")}
          subtitle={t(locale, "notFound.productsSubtitle")}
        />
        <NavCard
          href="/breweries"
          title={t(locale, "notFound.breweriesTitle")}
          subtitle={t(locale, "notFound.breweriesSubtitle")}
        />
        <NavCard
          href="/blog"
          title={t(locale, "notFound.journalTitle")}
          subtitle={t(locale, "notFound.journalSubtitle")}
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
