create table if not exists public.page_views (
  id uuid primary key default gen_random_uuid(),
  page_key text not null,
  created_at timestamptz not null default now()
);

create index if not exists page_views_page_key_idx
on public.page_views (page_key, created_at desc);

alter table public.page_views enable row level security;

drop policy if exists "Public can read page views" on public.page_views;
create policy "Public can read page views"
on public.page_views
for select
to anon, authenticated
using (true);

drop policy if exists "Public can insert page views" on public.page_views;
create policy "Public can insert page views"
on public.page_views
for insert
to anon, authenticated
with check (true);
