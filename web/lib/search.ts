/**
 * Sooly · 검색 입력값 안전화 (PostgREST + ilike).
 *
 * Supabase 의 `.ilike()` / `.or()` 는 query string 기반이라 두 종류 escape 가 필요:
 *
 *   1. ilike wildcard — `%` `_` `\` 가 패턴 메타. 사용자 input 에 그대로 두면
 *      "abc%" 같은 입력이 의도치 않게 광범위 매칭. 표준 `\` escape 로 처리.
 *   2. PostgREST query 분리자 — `,` `(` `)` `.` 가 query 문법. 사용자 input 에
 *      포함되면 parser 깨짐 (예: "(test)" → "failed to parse logic tree" 에러).
 *      안전을 위해 공백으로 치환.
 *
 * 길이 제한도 같이: 검색어가 비정상적으로 길면 DB 비용 + 잠재적 DoS. 100자 cap.
 */
export function sanitizeSearch(raw: string | null | undefined): string {
  if (!raw) return "";
  return raw
    .slice(0, 100)
    .replace(/[\\%_]/g, (m) => `\\${m}`)
    .replace(/[,()]/g, " ")
    .trim();
}
