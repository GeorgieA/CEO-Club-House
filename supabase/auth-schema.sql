-- CEO Clubhouse: Auth, Profile & Community
-- Im Supabase SQL Editor ausführen (nach schema.sql)

-- ============================================================
-- profiles
-- ============================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  username text not null,
  business_url text,
  preferred_categories text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_username_format check (username ~ '^[a-z0-9_]{3,20}$'),
  constraint profiles_business_url_length check (
    business_url is null or char_length(business_url) <= 500
  ),
  constraint profiles_preferred_categories_valid check (
    preferred_categories <@ array['tech', 'ai', 'business', 'trend']::text[]
  )
);

create unique index if not exists profiles_username_lower_idx
  on public.profiles (lower(username));

-- ============================================================
-- article_votes
-- ============================================================
create table if not exists public.article_votes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  article_id uuid not null references public.articles on delete cascade,
  vote smallint not null check (vote in (-1, 1)),
  created_at timestamptz not null default now(),
  unique (user_id, article_id)
);

create index if not exists article_votes_article_id_idx
  on public.article_votes (article_id);

-- ============================================================
-- comments
-- ============================================================
create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  article_id uuid not null references public.articles on delete cascade,
  user_id uuid not null references auth.users on delete cascade,
  body text not null check (char_length(body) between 1 and 2000),
  status text not null default 'published' check (status in ('published', 'hidden')),
  created_at timestamptz not null default now()
);

create index if not exists comments_article_id_idx
  on public.comments (article_id, created_at desc);

create index if not exists comments_user_id_created_at_idx
  on public.comments (user_id, created_at desc);

alter table public.comments
  drop constraint if exists comments_user_id_profiles_fkey;
alter table public.comments
  add constraint comments_user_id_profiles_fkey
  foreign key (user_id) references public.profiles(id) on delete cascade;

-- ============================================================
-- triggers
-- ============================================================
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  raw_username text;
begin
  raw_username := lower(trim(coalesce(new.raw_user_meta_data->>'username', '')));

  if raw_username !~ '^[a-z0-9_]{3,20}$' then
    raise exception 'Ungültiger Username';
  end if;

  insert into public.profiles (id, username)
  values (new.id, raw_username);

  return new;
exception
  when unique_violation then
    raise exception 'Username bereits vergeben';
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- RPC: username availability check
-- ============================================================
create or replace function public.username_available(name text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  if lower(trim(name)) !~ '^[a-z0-9_]{3,20}$' then
    return false;
  end if;

  return not exists (
    select 1 from public.profiles where lower(username) = lower(trim(name))
  );
end;
$$;

grant execute on function public.username_available(text) to anon, authenticated;

-- ============================================================
-- RLS
-- ============================================================
alter table public.profiles enable row level security;
alter table public.article_votes enable row level security;
alter table public.comments enable row level security;

-- profiles
drop policy if exists "profiles public read" on public.profiles;
create policy "profiles public read"
  on public.profiles for select
  to anon, authenticated
  using (true);

drop policy if exists "profiles insert own" on public.profiles;
create policy "profiles insert own"
  on public.profiles for insert
  to authenticated
  with check (auth.uid() = id);

drop policy if exists "profiles update own" on public.profiles;
create policy "profiles update own"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- article_votes
drop policy if exists "votes public read" on public.article_votes;
create policy "votes public read"
  on public.article_votes for select
  to anon, authenticated
  using (true);

drop policy if exists "votes insert own" on public.article_votes;
create policy "votes insert own"
  on public.article_votes for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "votes update own" on public.article_votes;
create policy "votes update own"
  on public.article_votes for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "votes delete own" on public.article_votes;
create policy "votes delete own"
  on public.article_votes for delete
  to authenticated
  using (auth.uid() = user_id);

-- comments
drop policy if exists "comments public read published" on public.comments;
create policy "comments public read published"
  on public.comments for select
  to anon, authenticated
  using (status = 'published');

drop policy if exists "comments insert own" on public.comments;
create policy "comments insert own"
  on public.comments for insert
  to authenticated
  with check (auth.uid() = user_id and status = 'published');

drop policy if exists "comments delete own" on public.comments;
create policy "comments delete own"
  on public.comments for delete
  to authenticated
  using (auth.uid() = user_id);
