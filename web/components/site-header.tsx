import Link from "next/link";
import { Logo } from "@/components/logo";
import { SearchBar } from "@/components/search-bar";
import { LocaleToggle } from "@/components/locale-toggle";
import { getLocale } from "@/lib/locale";

export async function SiteHeader() {
  const locale = await getLocale();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-6 px-6">
        <Link href="/" aria-label="Sooly 홈" className="shrink-0">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-5 text-sm text-muted-foreground sm:flex">
          <Link href="/products" className="transition-colors hover:text-foreground">
            제품
          </Link>
          <Link href="/breweries" className="transition-colors hover:text-foreground">
            양조장
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <SearchBar />
          <LocaleToggle current={locale} />
        </div>
      </div>
    </header>
  );
}
