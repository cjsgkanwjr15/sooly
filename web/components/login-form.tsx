"use client";

import { useActionState } from "react";
import { sendMagicLink, type LoginState } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const initialState: LoginState = { status: "idle" };

/**
 * 매직 링크 로그인 폼.
 * useActionState 로 server action 결과를 progressive enhancement 친화적으로 받음.
 * (자바스크립트 꺼져 있어도 form 제출은 동작 — Next.js 16 권장 패턴)
 */
export function LoginForm({ next }: { next?: string }) {
  const [state, formAction, pending] = useActionState(
    sendMagicLink,
    initialState,
  );

  if (state.status === "sent") {
    return (
      <div className="rounded-xl border border-primary/20 bg-primary/[0.04] p-6">
        <p className="font-serif text-base font-medium">메일을 확인해주세요</p>
        <p className="mt-2 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{state.email}</span>
          {" 로 로그인 링크를 보냈어요. 이메일의 버튼을 누르면 로그인됩니다."}
        </p>
        <p className="mt-3 text-xs text-muted-foreground">
          메일이 안 보이면 스팸함을 확인해주세요. 5분 안에 안 오면 다시
          시도하세요.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="next" value={next ?? "/"} />
      <div>
        <label
          htmlFor="email"
          className="text-xs uppercase tracking-wider text-muted-foreground"
        >
          이메일
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          className="mt-1.5 h-10"
        />
      </div>
      {state.status === "error" && state.message && (
        <p className="text-sm text-destructive">{state.message}</p>
      )}
      <Button type="submit" disabled={pending} size="lg" className="w-full">
        {pending ? "전송 중..." : "로그인 링크 보내기"}
      </Button>
    </form>
  );
}
