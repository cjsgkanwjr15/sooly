-- =====================================================================
-- products (brewery_id, name_ko) 복합 unique 제약 추가
-- 이유: ETL 재실행 시 products upsert(onConflict=brewery_id,name_ko) 가 필요.
-- 의미: 같은 양조장에서 같은 이름의 제품은 하나만 존재해야 함.
-- 다른 양조장이 같은 이름을 쓰는 건 허용 (ex. 여러 곳의 "전통 막걸리").
-- =====================================================================

alter table public.products
  add constraint products_brewery_name_unique unique (brewery_id, name_ko);
