"use client";

import { useActionState } from "react";
import {
  sendMagicLink,
  signInWithGoogle,
  signInWithKakao,
  type LoginState,
} from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const initialState: LoginState = { status: "idle" };

/**
 * 로그인 폼 — Google OAuth + 매직 링크 두 경로.
 *
 * useActionState 로 매직 링크 server action 결과를 progressive enhancement 친화적으로 받음.
 * (자바스크립트 꺼져 있어도 form 제출은 동작 — Next.js 16 권장 패턴)
 *
 * Google 버튼은 별도 form 으로 분리 — server action 안에서 redirect 가 발생해
 * useActionState 로 결과를 받을 필요가 없음.
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
    <div className="space-y-5">
      {/*
        카카오 버튼은 Kakao 비즈 앱 인증 받기 전까지 숨김.
        새 Kakao Developers UI 가 개인 앱한테 OAuth Redirect URI 등록을 막아놨음.
        비즈 인증 후 아래 form 블록 + signInWithKakao import + KakaoIcon 만 풀면 동작.

        <form action={signInWithKakao}>
          <input type="hidden" name="next" value={next ?? "/"} />
          <button
            type="submit"
            className="inline-flex h-11 w-full items-center justify-center gap-2.5 rounded-lg bg-[#FEE500] px-4 text-sm font-medium text-[#191919] transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <KakaoIcon />
            카카오로 계속하기
          </button>
        </form>
      */}
      <form action={signInWithGoogle}>
        <input type="hidden" name="next" value={next ?? "/"} />
        <button
          type="submit"
          className="inline-flex h-11 w-full items-center justify-center gap-2.5 rounded-lg border border-input bg-background px-4 text-sm font-medium transition-colors hover:bg-foreground/[0.04] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <GoogleIcon />
          Google 로 계속하기
        </button>
      </form>

      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <div className="h-px flex-1 bg-border" />
        <span>또는 이메일</span>
        <div className="h-px flex-1 bg-border" />
      </div>

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
    </div>
  );
}

function KakaoIcon() {
  // 카카오 공식 말풍선 마크 (브랜드 가이드 #191919, 노란 배경 #FEE500 위).
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="#191919"
        d="M9 1.5C4.582 1.5 1 4.32 1 7.797c0 2.236 1.485 4.196 3.726 5.317-.165.604-.595 2.184-.681 2.524-.107.42.155.414.326.301.135-.089 2.155-1.46 3.025-2.052.526.078 1.066.118 1.604.118 4.418 0 8-2.82 8-6.208C17 4.32 13.418 1.5 9 1.5z"
      />
    </svg>
  );
}

function GoogleIcon() {
  // 공식 Google 멀티컬러 G 마크 (브랜드 가이드 준수).
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="#4285F4"
        d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.614z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
      />
    </svg>
  );
}
