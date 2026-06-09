-- 在 Supabase SQL Editor 执行：彻底修复 products 表 RLS
-- 会删除该表上所有旧策略后重建，解决 "row-level security policy" 写入失败

alter table public.products enable row level security;

-- 删除 products 表上全部已有策略（含 Dashboard 手动创建的）
do $$
declare
  pol record;
begin
  for pol in
    select policyname
    from pg_policies
    where schemaname = 'public' and tablename = 'products'
  loop
    execute format('drop policy if exists %I on public.products', pol.policyname);
  end loop;
end $$;

create policy "products_anon_select"
  on public.products for select
  to anon, authenticated
  using (true);

create policy "products_anon_insert"
  on public.products for insert
  to anon, authenticated
  with check (true);

create policy "products_anon_update"
  on public.products for update
  to anon, authenticated
  using (true)
  with check (true);

create policy "products_anon_delete"
  on public.products for delete
  to anon, authenticated
  using (true);
