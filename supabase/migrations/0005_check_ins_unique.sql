-- =====================================================================
-- check_ins (user_id, product_id) unique 제약 추가
-- 이유: Phase 1 정책 = 1인 1제품 1체크인. 같은 술에 별점/메모를 *수정* 하는 식.
--      서버 액션이 onConflict=user_id,product_id 로 upsert 하려면 이 제약 필수.
--
-- 미래 확장: "여러 체크인 허용" 으로 가려면 (Untappd 스타일 — 술자리마다 다른 별점)
--          이 제약 제거하면 됨. 그땐 별도 history 페이지 필요.
-- =====================================================================

alter table public.check_ins
  add constraint check_ins_user_product_unique unique (user_id, product_id);
