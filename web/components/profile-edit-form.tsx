"use client";

import { useActionState } from "react";
import { updateProfile, type ProfileState } from "@/app/actions/profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { t } from "@/lib/i18n";
import type { Locale } from "@/lib/locale";

const initialState: ProfileState = { status: "idle" };

/**
 * 프로필 편집 폼.
 * useActionState 로 server action 결과(검증 에러 등)를 받고, 성공 시 server action
 * 안에서 redirect 가 발생하므로 여기로 결과가 안 돌아옴.
 *
 * Client component — locale 은 부모 (server) 에서 prop drilling.
 */
export function ProfileEditForm({
  initialDisplayName,
  initialUsername,
  initialBio,
  locale,
}: {
  initialDisplayName: string;
  initialUsername: string;
  initialBio: string;
  locale: Locale;
}) {
  const [state, formAction, pending] = useActionState(
    updateProfile,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-6">
      {/* 표시 이름 */}
      <div>
        <label
          htmlFor="display_name"
          className="text-xs uppercase tracking-wider text-muted-foreground"
        >
          {t(locale, "settings.profile.displayNameLabel")}
        </label>
        <p className="mt-0.5 text-xs text-muted-foreground/80">
          {t(locale, "settings.profile.displayNameHint")}
        </p>
        <Input
          id="display_name"
          name="display_name"
          type="text"
          required
          maxLength={50}
          defaultValue={initialDisplayName}
          className="mt-2 h-10"
        />
        {state.fieldErrors?.display_name && (
          <p className="mt-1.5 text-xs text-destructive">
            {state.fieldErrors.display_name}
          </p>
        )}
      </div>

      {/* 사용자명 */}
      <div>
        <label
          htmlFor="username"
          className="text-xs uppercase tracking-wider text-muted-foreground"
        >
          {t(locale, "settings.profile.usernameLabel")}
        </label>
        <p className="mt-0.5 text-xs text-muted-foreground/80">
          {t(locale, "settings.profile.usernameHintPre")}
          <span className="font-mono">{initialUsername}</span>
          {t(locale, "settings.profile.usernameHintPost")}
        </p>
        <div className="mt-2 flex items-center gap-2">
          <span className="select-none text-sm text-muted-foreground">@</span>
          <Input
            id="username"
            name="username"
            type="text"
            required
            minLength={2}
            maxLength={20}
            pattern="[a-z0-9_]+"
            defaultValue={initialUsername}
            autoCapitalize="none"
            autoComplete="off"
            spellCheck={false}
            className="h-10 flex-1 font-mono"
          />
        </div>
        {state.fieldErrors?.username && (
          <p className="mt-1.5 text-xs text-destructive">
            {state.fieldErrors.username}
          </p>
        )}
      </div>

      {/* 한 줄 소개 */}
      <div>
        <label
          htmlFor="bio"
          className="text-xs uppercase tracking-wider text-muted-foreground"
        >
          {t(locale, "settings.profile.bioLabel")}{" "}
          <span className="text-muted-foreground/60">
            ({t(locale, "common.optional")})
          </span>
        </label>
        <textarea
          id="bio"
          name="bio"
          maxLength={200}
          rows={3}
          defaultValue={initialBio}
          placeholder={t(locale, "settings.profile.bioPlaceholder")}
          className="mt-2 w-full resize-y rounded-lg border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        />
        {state.fieldErrors?.bio && (
          <p className="mt-1.5 text-xs text-destructive">
            {state.fieldErrors.bio}
          </p>
        )}
      </div>

      {/* 일반 에러 (필드 단위가 아닌 것) */}
      {state.message && (
        <p className="text-sm text-destructive">{state.message}</p>
      )}

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={pending} size="lg">
          {pending
            ? t(locale, "settings.profile.saving")
            : t(locale, "settings.profile.save")}
        </Button>
        <a
          href={`/u/${initialUsername}`}
          className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          {t(locale, "settings.profile.cancel")}
        </a>
      </div>
    </form>
  );
}
