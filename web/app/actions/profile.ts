"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { supabaseServer } from "@/lib/supabase/server";

/**
 * 라우트 충돌 방지용 예약어. 이 username 들은 사용 못 함.
 * (예: /u/settings 가 /settings 와 헷갈림 — 실제 라우트는 정적이라 충돌은 안 나지만
 *  심리적 충돌·향후 라우트 추가 대비)
 */
const RESERVED_USERNAMES = new Set([
  "admin",
  "auth",
  "blog",
  "breweries",
  "categories",
  "for-breweries",
  "for_breweries",
  "login",
  "logout",
  "me",
  "products",
  "settings",
  "u",
  "user",
  "users",
  "sooly",
  "api",
  "healthcheck",
]);

const profileSchema = z.object({
  display_name: z
    .string()
    .trim()
    .min(1, "표시 이름을 입력해주세요.")
    .max(50, "표시 이름은 50자 이내여야 합니다."),
  username: z
    .string()
    .trim()
    .toLowerCase()
    .min(2, "사용자명은 2자 이상이어야 합니다.")
    .max(20, "사용자명은 20자 이내여야 합니다.")
    .regex(
      /^[a-z0-9_]+$/,
      "사용자명은 영문 소문자·숫자·언더스코어(_) 만 가능합니다.",
    )
    .refine((v) => !RESERVED_USERNAMES.has(v), {
      message: "사용할 수 없는 사용자명입니다.",
    }),
  bio: z
    .string()
    .trim()
    .max(200, "한 줄 소개는 200자 이내여야 합니다.")
    .optional()
    .transform((v) => (v && v.length > 0 ? v : null)),
});

export type ProfileState = {
  status: "idle" | "error";
  message?: string;
  fieldErrors?: Partial<Record<"display_name" | "username" | "bio", string>>;
};

/**
 * 프로필 업데이트.
 * - 검증 실패 → fieldErrors 반환 (폼이 표시)
 * - username 충돌 (Postgres unique violation) → 명확한 에러 메시지
 * - 성공 → 새 /u/{username} 으로 redirect (username 이 안 바뀌어도 동일 경로)
 *
 * RLS 정책 `profiles_update_self` (auth.uid() = id) 로 본인만 수정 가능.
 */
export async function updateProfile(
  _prev: ProfileState,
  formData: FormData,
): Promise<ProfileState> {
  const parsed = profileSchema.safeParse({
    display_name: formData.get("display_name"),
    username: formData.get("username"),
    bio: formData.get("bio") ?? "",
  });

  if (!parsed.success) {
    const fieldErrors: ProfileState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof NonNullable<ProfileState["fieldErrors"]>;
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { status: "error", fieldErrors };
  }

  const sb = await supabaseServer();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) {
    return { status: "error", message: "로그인이 필요해요." };
  }

  const { error } = await sb
    .from("profiles")
    .update({
      display_name: parsed.data.display_name,
      username: parsed.data.username,
      bio: parsed.data.bio,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) {
    // unique violation: 23505 (Postgres) — username 충돌.
    if (error.code === "23505") {
      return {
        status: "error",
        fieldErrors: { username: "이미 사용 중인 사용자명입니다." },
      };
    }
    return {
      status: "error",
      message: "저장에 실패했어요. 잠시 후 다시 시도해주세요.",
    };
  }

  // 헤더 user-menu 가 새 display_name/username 을 보여주도록 layout 무효화.
  revalidatePath("/", "layout");
  revalidatePath(`/u/${parsed.data.username}`);

  // 새 username 의 프로필 페이지로 이동.
  redirect(`/u/${parsed.data.username}`);
}
