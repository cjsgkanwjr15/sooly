"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { supabaseServer } from "@/lib/supabase/server";

// 1~5 정수 또는 빈값 → null. 폼은 hidden input 에 0 = "선택 안 함" 의미로 보냄.
const tasteAxis = z
  .string()
  .optional()
  .transform((v) => {
    if (!v) return null;
    const n = Number(v);
    if (!Number.isFinite(n) || n < 1 || n > 5) return null;
    return Math.round(n);
  });

const baseSchema = z.object({
  product_id: z.uuid(),
  rating: z.coerce.number().int().min(1).max(5),
  pairing: z
    .string()
    .max(120)
    .optional()
    .transform((v) => {
      const t = v?.trim();
      return t ? t : null;
    }),
  note: z
    .string()
    .max(500)
    .optional()
    .transform((v) => {
      const t = v?.trim();
      return t ? t : null;
    }),
  drank_at: z
    .string()
    .optional()
    .transform((v) => {
      if (!v) return new Date().toISOString();
      const d = new Date(v + "T12:00:00Z");
      if (Number.isNaN(d.getTime())) return new Date().toISOString();
      return d.toISOString();
    }),
  taste_sweet: tasteAxis,
  taste_sour: tasteAxis,
  taste_bitter: tasteAxis,
  taste_umami: tasteAxis,
  taste_aroma: tasteAxis,
  taste_finish: tasteAxis,
});

const updateSchema = baseSchema.extend({
  id: z.uuid(),
});

/**
 * 체크인 추가 — 항상 새 row insert. 같은 술 여러 번 OK.
 */
export async function createCheckIn(formData: FormData) {
  const productId = String(formData.get("product_id") ?? "");
  const productPath = `/products/${productId}`;

  const sb = await supabaseServer();
  const {
    data: { user },
  } = await sb.auth.getUser();

  if (!user) {
    redirect(`/login?next=${encodeURIComponent(productPath)}`);
  }

  const parsed = baseSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    redirect(`${productPath}?error=invalid`);
  }

  const { error } = await sb.from("check_ins").insert({
    user_id: user.id,
    product_id: parsed.data.product_id,
    rating: parsed.data.rating,
    pairing: parsed.data.pairing,
    note: parsed.data.note,
    drank_at: parsed.data.drank_at,
    taste_sweet: parsed.data.taste_sweet,
    taste_sour: parsed.data.taste_sour,
    taste_bitter: parsed.data.taste_bitter,
    taste_umami: parsed.data.taste_umami,
    taste_aroma: parsed.data.taste_aroma,
    taste_finish: parsed.data.taste_finish,
  });

  if (error) {
    redirect(`${productPath}?error=save`);
  }

  revalidatePath(productPath);
}

/**
 * 본인 체크인 수정. RecentCheckIns 의 본인 row 인라인 폼이 호출.
 * RLS 가 user_id=auth.uid() 만 허용하지만 application 레벨에서도 한 번 더 체크.
 */
export async function updateCheckIn(formData: FormData) {
  const productId = String(formData.get("product_id") ?? "");
  const productPath = `/products/${productId}`;

  const sb = await supabaseServer();
  const {
    data: { user },
  } = await sb.auth.getUser();

  if (!user) {
    redirect(`/login?next=${encodeURIComponent(productPath)}`);
  }

  const parsed = updateSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    redirect(`${productPath}?error=invalid`);
  }

  const { error } = await sb
    .from("check_ins")
    .update({
      rating: parsed.data.rating,
      pairing: parsed.data.pairing,
      note: parsed.data.note,
      drank_at: parsed.data.drank_at,
      taste_sweet: parsed.data.taste_sweet,
      taste_sour: parsed.data.taste_sour,
      taste_bitter: parsed.data.taste_bitter,
      taste_umami: parsed.data.taste_umami,
      taste_aroma: parsed.data.taste_aroma,
      taste_finish: parsed.data.taste_finish,
    })
    .eq("id", parsed.data.id)
    .eq("user_id", user.id);

  if (error) {
    redirect(`${productPath}?error=save`);
  }

  revalidatePath(productPath);
}

/**
 * 본인 체크인 삭제.
 */
export async function deleteCheckIn(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const productId = String(formData.get("product_id") ?? "");
  const productPath = `/products/${productId}`;

  const sb = await supabaseServer();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) {
    redirect(`/login?next=${encodeURIComponent(productPath)}`);
  }

  await sb.from("check_ins").delete().eq("id", id).eq("user_id", user.id);

  revalidatePath(productPath);
  revalidatePath("/u/[username]", "page");
}
