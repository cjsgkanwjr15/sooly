-- =====================================================================
-- profiles.username 자동 생성
-- 이유: handle_new_user 트리거가 username 을 안 채워서 매번 null. /u/[username]
--      라우팅이 작동하려면 가입 시점에 자동 부여 필요. 사용자가 마음에 안 들면
--      /settings 에서 변경할 수 있도록 허용 (다음 세션).
--
-- 정책:
--   1. base = 이메일 prefix 의 [a-z0-9_] 만 남김 (소문자)
--   2. base 가 비어있거나 2자 미만이면 'user' fallback
--   3. base 가 충돌하면 base + '_' + (UUID 앞 4 hex) 시도
--   4. 그래도 충돌이면 unique 제약이 막음 (1/65k 확률)
--
-- 같은 핸들러로 기존 username NULL 인 row 백필 (dev 환경 0~1명 예상).
-- =====================================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  display text;
  base text;
  candidate text;
begin
  display := coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1));

  base := lower(regexp_replace(split_part(new.email, '@', 1), '[^a-z0-9_]', '', 'g'));
  if base is null or length(base) < 2 then
    base := 'user';
  end if;

  candidate := base;
  if exists (select 1 from public.profiles where username = candidate) then
    candidate := base || '_' || substr(replace(new.id::text, '-', ''), 1, 4);
  end if;

  insert into public.profiles (id, display_name, username)
  values (new.id, display, candidate)
  on conflict (id) do nothing;
  return new;
end;
$$;

-- 기존 username NULL row 백필
do $$
declare
  r record;
  base text;
  candidate text;
begin
  for r in
    select p.id, u.email
    from public.profiles p
    join auth.users u on u.id = p.id
    where p.username is null
  loop
    base := lower(regexp_replace(split_part(r.email, '@', 1), '[^a-z0-9_]', '', 'g'));
    if base is null or length(base) < 2 then
      base := 'user';
    end if;
    candidate := base;
    if exists (select 1 from public.profiles where username = candidate) then
      candidate := base || '_' || substr(replace(r.id::text, '-', ''), 1, 4);
    end if;
    update public.profiles set username = candidate where id = r.id;
  end loop;
end;
$$;
