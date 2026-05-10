import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { supabaseServer } from "@/lib/supabase/server";
import { LoginForm } from "@/components/login-form";
import { getLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: t(locale, "login.metaTitle"),
    description: t(locale, "login.metaDescription"),
  };
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { next, error } = await searchParams;
  const locale = await getLocale();

  // 이미 로그인된 사용자는 next 또는 홈으로.
  const sb = await supabaseServer();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (user) redirect(next ?? "/");

  return (
    <main className="mx-auto flex max-w-md flex-1 flex-col px-6 py-16">
      <h1 className="font-serif text-3xl font-semibold tracking-tight">
        {t(locale, "login.h1")}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {t(locale, "login.subtitle")}
      </p>

      <div className="mt-8">
        <LoginForm next={next} locale={locale} />
        {error === "callback" && (
          <p className="mt-4 text-sm text-destructive">
            {t(locale, "login.errorCallback")}
          </p>
        )}
        {error === "oauth" && (
          <p className="mt-4 text-sm text-destructive">
            {t(locale, "login.errorOauth")}
          </p>
        )}
      </div>

      <p className="mt-10 text-xs text-muted-foreground">
        {t(locale, "login.termsPrefix")}
        <span className="underline-offset-4">{t(locale, "login.termsLink")}</span>
        {t(locale, "login.termsMid")}
        <span className="underline-offset-4">
          {t(locale, "login.privacyLink")}
        </span>
        {t(locale, "login.termsSuffix")}
      </p>
    </main>
  );
}
