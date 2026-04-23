-- =====================================================================
-- breweries.name_ko 에 unique 제약 추가
-- 이유: ETL 재실행 시 upsert(onConflict=name_ko) 가 동작하려면 필요.
-- 양조장명은 사실상 식별자 역할을 해야 맞음. 0001 에 누락된 보강.
-- =====================================================================

alter table public.breweries
  add constraint breweries_name_ko_unique unique (name_ko);
