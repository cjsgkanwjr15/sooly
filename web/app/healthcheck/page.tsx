import { supabaseServer } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * 개발 중 Supabase 연결 확인용 페이지.
 * - breweries / products 테이블 count 를 찍어봄으로써
 *   RLS(SELECT=public) 와 ENV 가 정상 동작하는지 검증.
 * - 프로덕션 배포 직전에 제거하거나 관리자 전용으로 전환 권장.
 */

type Probe = { ok: true; count: number } | { ok: false; message: string };

async function probeTable(
  sb: Awaited<ReturnType<typeof supabaseServer>>,
  table: string,
): Promise<Probe> {
  const { count, error, status } = await sb
    .from(table)
    .select("*", { count: "exact", head: true });

  if (error) return { ok: false, message: error.message };
  if (count === null) {
    return { ok: false, message: `count=null (status=${status}) — 테이블이 없거나 권한 문제일 수 있음` };
  }
  return { ok: true, count };
}

export default async function HealthcheckPage() {
  const sb = await supabaseServer();

  const [breweries, products] = await Promise.all([
    probeTable(sb, "breweries"),
    probeTable(sb, "products"),
  ]);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "(unset)";

  return (
    <main className="mx-auto max-w-2xl px-6 py-12 font-mono text-sm">
      <h1 className="mb-6 text-2xl font-bold">Sooly · Healthcheck</h1>

      <section className="mb-6 rounded-md border border-neutral-300 p-4">
        <h2 className="mb-2 font-semibold">Env</h2>
        <ul className="space-y-1">
          <li>
            NEXT_PUBLIC_SUPABASE_URL:{" "}
            <span className="text-neutral-600">{supabaseUrl.replace(/(https:\/\/[^.]+).*/, "$1...")}</span>
          </li>
        </ul>
      </section>

      {(["breweries", "products"] as const).map((name) => {
        const r = name === "breweries" ? breweries : products;
        return (
          <section key={name} className="mb-6 rounded-md border border-neutral-300 p-4">
            <h2 className="mb-2 font-semibold">DB · {name}</h2>
            {r.ok ? (
              <p className="text-emerald-600">✓ count = {r.count}</p>
            ) : (
              <p className="text-red-600">✗ {r.message}</p>
            )}
          </section>
        );
      })}

      <p className="text-neutral-500">
        두 테이블 모두 ✓ 가 뜨면 Supabase · 스키마 · RLS · ENV 가 정상.
      </p>
    </main>
  );
}
