import { redirect } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { supabaseServer } from "@/lib/supabase/server";
import { ProfileEditForm } from "@/components/profile-edit-form";

export const metadata: Metadata = {
  title: "프로필 설정",
  description: "표시 이름·사용자명·한 줄 소개를 수정합니다.",
  robots: { index: false, follow: false },
};

export default async function ProfileSettingsPage() {
  const sb = await supabaseServer();
  const {
    data: { user },
  } = await sb.auth.getUser();

  if (!user) {
    redirect("/login?next=/settings/profile");
  }

  const { data: profile } = await sb
    .from("profiles")
    .select("username, display_name, bio")
    .eq("id", user.id)
    .single();

  // 트리거가 정상이면 profile 은 항상 존재. 안전망으로 fallback.
  const initialDisplayName =
    profile?.display_name ?? user.email?.split("@")[0] ?? "";
  const initialUsername = profile?.username ?? "";
  const initialBio = profile?.bio ?? "";

  return (
    <main className="mx-auto flex max-w-xl flex-1 flex-col px-6 py-12">
      <nav className="mb-6 text-xs text-muted-foreground">
        <Link
          href="/settings"
          className="underline-offset-4 hover:text-foreground hover:underline"
        >
          ← 설정으로
        </Link>
      </nav>

      <h1 className="font-serif text-3xl font-semibold tracking-tight">
        프로필 설정
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        다른 사용자에게 보여지는 정보를 수정할 수 있어요.
      </p>

      <div className="mt-10">
        <ProfileEditForm
          initialDisplayName={initialDisplayName}
          initialUsername={initialUsername}
          initialBio={initialBio}
        />
      </div>
    </main>
  );
}
