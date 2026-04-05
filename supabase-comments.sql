create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null,
  entity_slug text not null,
  name text not null,
  email text not null,
  avatar text,
  body text not null,
  created_at timestamptz not null default now()
);

create index if not exists comments_entity_idx
on public.comments (entity_type, entity_slug, created_at desc);

alter table public.comments enable row level security;

drop policy if exists "Public can read comments" on public.comments;
create policy "Public can read comments"
on public.comments
for select
to anon, authenticated
using (true);

drop policy if exists "Public can insert comments" on public.comments;
create policy "Public can insert comments"
on public.comments
for insert
to anon, authenticated
with check (true);
