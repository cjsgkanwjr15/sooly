import Link from "next/link";
import { Logo } from "@/components/logo";
import { SearchBar } from "@/components/search-bar";
import { LocaleToggle } from "@/components/locale-toggle";
import { UserMenu } from "@/components/user-menu";
import { getLocale } from "@/lib/locale";
import { supabaseServer } from "@/lib/supabase/server";

export async function SiteHeader() {
  const locale = await getLocale();

  // 세션 + 프로필 (username/display_name) 한꺼번에 가져와 UserMenu 에 전달.
  // proxy.ts 가 매 요청마다 토큰을 refresh 하므로 여기서 getUser() 는 fresh.
  const sb = await supabaseServer();
  const {
    data: { user },
  } = await sb.auth.getUser();

  let profile: { username: string | null; display_name: string | null } | null =
    null;
  if (user) {
    const { data } = await sb
      .from("profiles")
      .select("username, display_name")
      .eq("id", user.id)
      .single();
    profile = data ?? null;
  }

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
          <Link href="/blog" className="transition-colors hover:text-foreground">
            Journal
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <SearchBar />
          <LocaleToggle current={locale} />
          {user ? (
            <UserMenu
              username={profile?.username ?? null}
              displayName={
                profile?.display_name ?? user.email?.split("@")[0] ?? "User"
              }
            />
          ) : (
            <Link
              href="/login"
              className="rounded-md border border-border/60 px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-foreground/30 hover:bg-foreground/5"
            >
              로그인
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
