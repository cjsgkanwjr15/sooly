import { redirect } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { supabaseServer } from "@/lib/supabase/server";
import { getLocale } from "@/lib/locale";

export const metadata: Metadata = {
  title: "설정",
  description: "프로필·언어 등 계정 설정을 관리합니다.",
  robots: { index: false, follow: false },
};

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
  const isEn = locale === "en";
  const displayName =
    profile?.display_name ?? user.email?.split("@")[0] ?? "User";

  return (
    <main className="mx-auto flex max-w-xl flex-1 flex-col px-6 py-12">
      <h1 className="font-serif text-3xl font-semibold tracking-tight">
        {isEn ? "Settings" : "설정"}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {isEn
          ? `Signed in as ${displayName} (@${profile?.username ?? "—"}).`
          : `${displayName} (@${profile?.username ?? "—"}) 로 로그인되어 있어요.`}
      </p>

      <ul className="mt-10 space-y-3">
        <SettingsRow
          href="/settings/profile"
          title={isEn ? "Profile" : "프로필"}
          subtitle={
            isEn
              ? "Display name, username, bio"
              : "표시 이름·사용자명·한 줄 소개"
          }
        />
        {profile?.username && (
          <SettingsRow
            href={`/u/${profile.username}`}
            title={isEn ? "View my profile" : "내 프로필 보기"}
            subtitle={
              isEn
                ? "Public page with your check-ins"
                : "공개 프로필·체크인 기록"
            }
          />
        )}
        <li className="rounded-xl border bg-card p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="font-serif text-base font-medium">
                {isEn ? "Language" : "언어"}
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {isEn
                  ? "Toggle Korean / English from the header (KO · EN)."
                  : "헤더 우측의 KO · EN 토글로 변경할 수 있어요."}
              </p>
            </div>
            <span className="rounded-md bg-foreground/[0.06] px-2.5 py-1 font-mono text-xs">
              {locale.toUpperCase()}
            </span>
          </div>
        </li>
        <li className="rounded-xl border border-dashed bg-card/50 p-4 text-sm text-muted-foreground">
          {isEn
            ? "Notifications, account deletion, and more — coming soon."
            : "알림 설정·계정 삭제 등은 곧 추가됩니다."}
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
        <span className="text-muted-foreground group-hover:text-primary">
          →
        </span>
      </Link>
    </li>
  );
}
