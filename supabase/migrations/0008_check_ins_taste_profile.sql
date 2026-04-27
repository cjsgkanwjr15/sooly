-- =====================================================================
-- check_ins 에 6축 맛 프로필 칼럼 추가
-- 축: 단맛·산미·쓴맛·감칠맛·향·목넘김 (TasteRadar 컴포넌트와 1:1 매핑)
-- 1~5 정수. NULL 허용 — 모든 축 NULL 인 체크인은 radar 평균 기여 안 함.
-- 이유: 사용자가 체크인할 때마다 맛을 평가 → product 페이지의 TasteRadar 가
--      AVG(taste_*) 로 자동 채워짐. Vivino 모델.
-- =====================================================================

alter table public.check_ins
  add column if not exists taste_sweet  smallint check (taste_sweet  is null or taste_sweet  between 1 and 5),
  add column if not exists taste_sour   smallint check (taste_sour   is null or taste_sour   between 1 and 5),
  add column if not exists taste_bitter smallint check (taste_bitter is null or taste_bitter between 1 and 5),
  add column if not exists taste_umami  smallint check (taste_umami  is null or taste_umami  between 1 and 5),
  add column if not exists taste_aroma  smallint check (taste_aroma  is null or taste_aroma  between 1 and 5),
  add column if not exists taste_finish smallint check (taste_finish is null or taste_finish between 1 and 5);
