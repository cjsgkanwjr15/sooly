-- =====================================================================
-- Sooly · Initial schema (Phase 1)
-- Based on CLAUDE.md §7
-- =====================================================================

-- ---------- Extensions ----------
create extension if not exists "pgcrypto";

-- ---------- Tables ----------

-- 양조장
create table if not exists public.breweries (
  id uuid primary key default gen_random_uuid(),
  name_ko text not null,
  name_en text,
  region text,
  address text,
  founded_year int,
  story_ko text,
  story_en text,
  website text,
  instagram text,
  is_visiting_brewery boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 제품
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  brewery_id uuid references public.breweries(id) on delete set null,
  name_ko text not null,
  name_en text,
  category text,
  abv numeric,
  volume_ml int,
  price_krw_min int,
  price_krw_max int,
  ingredients text[],
  tasting_notes_ko text,
  tasting_notes_en text,
  pairing_suggestions text[],
  image_url text,
  source_url text,
  is_online_purchasable boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 수상 이력
create table if not exists public.awards (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  award_name text,
  award_year int,
  award_level text,
  created_at timestamptz not null default now()
);

-- 외부 구매 링크
create table if not exists public.purchase_links (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  retailer text,
  url text,
  price_krw int,
  is_affiliate boolean not null default false,
  created_at timestamptz not null default now()
);

-- 유저 프로필 (auth.users 확장)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  display_name text,
  avatar_url text,
  bio text,
  locale text not null default 'ko' check (locale in ('ko','en')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 체크인
create table if not exists public.check_ins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  rating int check (rating >= 1 and rating <= 5),
  note text,
  drank_at timestamptz,
  created_at timestamptz not null default now()
);

-- ---------- Indexes ----------
create index if not exists idx_products_category on public.products(category);
create index if not exists idx_products_brewery  on public.products(brewery_id);
create index if not exists idx_check_ins_user    on public.check_ins(user_id);
create index if not exists idx_check_ins_product on public.check_ins(product_id);
create index if not exists idx_awards_product    on public.awards(product_id);
create index if not exists idx_purchase_links_product on public.purchase_links(product_id);

-- ---------- updated_at trigger ----------
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_breweries_touch on public.breweries;
create trigger trg_breweries_touch
  before update on public.breweries
  for each row execute function public.touch_updated_at();

drop trigger if exists trg_products_touch on public.products;
create trigger trg_products_touch
  before update on public.products
  for each row execute function public.touch_updated_at();

drop trigger if exists trg_profiles_touch on public.profiles;
create trigger trg_profiles_touch
  before update on public.profiles
  for each row execute function public.touch_updated_at();

-- ---------- Auto-create profile on signup ----------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =====================================================================
-- Row Level Security
-- =====================================================================

-- Public read-only catalog tables
alter table public.breweries       enable row level security;
alter table public.products        enable row level security;
alter table public.awards          enable row level security;
alter table public.purchase_links  enable row level security;
alter table public.profiles        enable row level security;
alter table public.check_ins       enable row level security;

-- breweries: 누구나 읽기
drop policy if exists breweries_select on public.breweries;
create policy breweries_select on public.breweries
  for select using (true);

-- products: 누구나 읽기
drop policy if exists products_select on public.products;
create policy products_select on public.products
  for select using (true);

-- awards: 누구나 읽기
drop policy if exists awards_select on public.awards;
create policy awards_select on public.awards
  for select using (true);

-- purchase_links: 누구나 읽기
drop policy if exists purchase_links_select on public.purchase_links;
create policy purchase_links_select on public.purchase_links
  for select using (true);

-- profiles: 누구나 읽기, 본인만 수정
drop policy if exists profiles_select on public.profiles;
create policy profiles_select on public.profiles
  for select using (true);

drop policy if exists profiles_update_self on public.profiles;
create policy profiles_update_self on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists profiles_insert_self on public.profiles;
create policy profiles_insert_self on public.profiles
  for insert with check (auth.uid() = id);

-- check_ins: 누구나 읽기, 본인만 쓰기·수정·삭제
drop policy if exists check_ins_select on public.check_ins;
create policy check_ins_select on public.check_ins
  for select using (true);

drop policy if exists check_ins_insert_self on public.check_ins;
create policy check_ins_insert_self on public.check_ins
  for insert with check (auth.uid() = user_id);

drop policy if exists check_ins_update_self on public.check_ins;
create policy check_ins_update_self on public.check_ins
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists check_ins_delete_self on public.check_ins;
create policy check_ins_delete_self on public.check_ins
  for delete using (auth.uid() = user_id);

-- =====================================================================
-- 참고: breweries/products/awards/purchase_links 의 INSERT/UPDATE/DELETE
-- 정책은 일부러 만들지 않음. 이 테이블들은 ETL 스크립트(service_role key)로
-- 관리. service_role 은 RLS 를 우회하므로 정책 불필요.
-- 향후 어드민 UI 가 생기면 admin 역할 기반 정책 추가.
-- =====================================================================
