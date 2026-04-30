import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { supabaseServer } from "@/lib/supabase/server";
import { LoginForm } from "@/components/login-form";

export const metadata: Metadata = {
  title: "로그인",
  description: "이메일 매직 링크로 Sooly 에 로그인.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { next, error } = await searchParams;

  // 이미 로그인된 사용자는 next 또는 홈으로.
  const sb = await supabaseServer();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (user) redirect(next ?? "/");

  return (
    <main className="mx-auto flex max-w-md flex-1 flex-col px-6 py-16">
      <h1 className="font-serif text-3xl font-semibold tracking-tight">
        로그인
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        이메일을 입력하면 로그인 링크를 보내드려요. 비밀번호 없이 한 번에.
      </p>

      <div className="mt-8">
        <LoginForm next={next} />
        {error === "callback" && (
          <p className="mt-4 text-sm text-destructive">
            로그인 링크가 만료되었거나 유효하지 않아요. 다시 시도해주세요.
          </p>
        )}
        {error === "oauth" && (
          <p className="mt-4 text-sm text-destructive">
            소셜 로그인 시작에 실패했어요. 잠시 후 다시 시도해주세요.
          </p>
        )}
      </div>

      <p className="mt-10 text-xs text-muted-foreground">
        로그인하면 Sooly 의{" "}
        <span className="underline-offset-4">이용약관</span> 과{" "}
        <span className="underline-offset-4">개인정보 처리방침</span> 에
        동의하는 것으로 간주합니다.
      </p>
    </main>
  );
}
