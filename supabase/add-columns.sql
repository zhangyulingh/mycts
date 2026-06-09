-- 在 Supabase SQL Editor 执行：为已有 products 表添加新字段

alter table public.products add column if not exists specification text default '';
alter table public.products add column if not exists operator text default '';
alter table public.products add column if not exists remark text default '';
