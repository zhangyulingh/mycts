-- products 表结构参考（若表已存在可跳过）
-- 条码编号使用 barcode 字段，id 为 UUID 主键由数据库自动生成

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  barcode text not null unique,
  product_name text not null default '',
  product_model text default '',
  specification text default '',
  batch_no text default '',
  production_date text default '',
  operator text default '',
  remark text default '',
  created_at timestamptz not null default now()
);

create index if not exists products_created_at_idx on public.products (created_at desc);
create index if not exists products_barcode_idx on public.products (barcode);

alter table public.products enable row level security;

drop policy if exists "products_anon_select" on public.products;
create policy "products_anon_select"
  on public.products for select
  to anon, authenticated
  using (true);

drop policy if exists "products_anon_insert" on public.products;
create policy "products_anon_insert"
  on public.products for insert
  to anon, authenticated
  with check (true);

drop policy if exists "products_anon_update" on public.products;
create policy "products_anon_update"
  on public.products for update
  to anon, authenticated
  using (true)
  with check (true);

drop policy if exists "products_anon_delete" on public.products;
create policy "products_anon_delete"
  on public.products for delete
  to anon, authenticated
  using (true);

-- 已有 products 表时，在 SQL Editor 执行以下语句添加新字段：
-- alter table public.products add column if not exists specification text default '';
-- alter table public.products add column if not exists operator text default '';
-- alter table public.products add column if not exists remark text default '';
