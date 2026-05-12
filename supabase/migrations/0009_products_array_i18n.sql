-- =====================================================================
-- products 의 한국어 array 칼럼에 영문판 추가
-- 이유: 5-08 i18n 풀세트 후 남은 마지막 한국어 잔재. UI 라벨이 아니라 DB
--      데이터라 dictionary 로 풀 수 없고, 가변 텍스트(791 product × 평균
--      4~6 entries)라 AI 번역 + 칼럼 분리 필요.
-- 인덱스 미생성 — 검색 대상 X (display only).
-- =====================================================================

alter table public.products
  add column if not exists ingredients_en text[],
  add column if not exists pairing_suggestions_en text[];
