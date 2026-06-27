-- CEO Clubhouse: articles-Tabelle
-- Im Supabase SQL Editor ausführen (neues Projekt, Free Plan)

create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  summary text not null,
  category text not null check (category in ('ai', 'tech', 'business', 'trend')),
  source text not null,
  source_url text not null unique,
  published_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index if not exists articles_published_at_idx
  on public.articles (published_at desc);

alter table public.articles enable row level security;

create policy "public read"
  on public.articles
  for select
  to anon
  using (true);

-- Schreiben nur über service_role (Cron-Job), daher keine INSERT-Policy für anon.

-- Newsletter (falls noch nicht vorhanden)
create table if not exists public.subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);

alter table public.subscribers enable row level security;

create policy "Anmeldung erlaubt"
  on public.subscribers
  for insert
  to anon
  with check (true);
