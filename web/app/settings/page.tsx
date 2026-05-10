import { redirect } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { supabaseServer } from "@/lib/supabase/server";
import { getLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: t(locale, "settings.metaTitle"),
    description: t(locale, "settings.metaDescription"),
    robots: { index: false, follow: false },
  };
}

export default async function SettingsIndexPage() {
  const sb = await supabaseServer();
  const {
    data: { user },
  } = await sb.auth.getUser();

  if (!user) {
    redirect("/login?next=/settings");
  }

  const { data: profile } = await sb
    .from("profiles")
    .select("username, display_name, locale")
    .eq("id", user.id)
    .single();

  const locale = await getLocale();
  const displayName =
    profile?.display_name ?? user.email?.split("@")[0] ?? "User";

  return (
    <main className="mx-auto flex max-w-xl flex-1 flex-col px-6 py-12">
      <h1 className="font-serif text-3xl font-semibold tracking-tight">
        {t(locale, "settings.h1")}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {t(locale, "settings.signedInAs", {
          name: displayName,
          username: profile?.username ?? "—",
        })}
      </p>

      <ul className="mt-10 space-y-3">
        <SettingsRow
          href="/settings/profile"
          title={t(locale, "settings.rowProfile")}
          subtitle={t(locale, "settings.rowProfileSub")}
        />
        {profile?.username && (
          <SettingsRow
            href={`/u/${profile.username}`}
            title={t(locale, "settings.rowMyProfile")}
            subtitle={t(locale, "settings.rowMyProfileSub")}
          />
        )}
        <li className="rounded-xl border bg-card p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="font-serif text-base font-medium">
                {t(locale, "settings.rowLanguage")}
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {t(locale, "settings.rowLanguageHint")}
              </p>
            </div>
            <span className="rounded-md bg-foreground/[0.06] px-2.5 py-1 font-mono text-xs">
              {locale.toUpperCase()}
            </span>
          </div>
        </li>
        <li className="rounded-xl border border-dashed bg-card/50 p-4 text-sm text-muted-foreground">
          {t(locale, "settings.rowComingSoon")}
        </li>
      </ul>
    </main>
  );
}

function SettingsRow({
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
        className="group flex items-center justify-between gap-4 rounded-xl border bg-card p-4 transition-colors hover:border-primary/30"
      >
        <div>
          <div className="font-serif text-base font-medium group-hover:text-primary">
            {title}
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
        </div>
        <span className="text-muted-foreground group-hover:text-primary">→</span>
      </Link>
    </li>
  );
}
