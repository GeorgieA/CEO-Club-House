-- CEO Clubhouse: Erweitertes, verschachteltes Kommentarsystem
-- Im Supabase SQL Editor ausführen, NACH auth-schema.sql und admin-settings.sql.
-- Alle Blöcke sind idempotent und können gefahrlos erneut ausgeführt werden.

-- ===========================================================================
-- A.1  comments um parent_id erweitern (Replies / Threads)
-- ===========================================================================
-- Self-FK für Replies. NULL = Top-Level-Kommentar.
alter table public.comments
  add column if not exists parent_id uuid
  references public.comments(id) on delete cascade;

create index if not exists comments_parent_id_idx
  on public.comments (parent_id);

create index if not exists comments_article_created_idx
  on public.comments (article_id, created_at asc);

-- ===========================================================================
-- A.2  comment_votes (Likes pro Kommentar — nur Like, Zeilenexistenz = Like)
-- ===========================================================================
create table if not exists public.comment_votes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  comment_id uuid not null references public.comments(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, comment_id)
);

create index if not exists comment_votes_comment_id_idx
  on public.comment_votes (comment_id);

-- ===========================================================================
-- A.3  comment_reports (Meldungen)
-- ===========================================================================
create table if not exists public.comment_reports (
  id uuid primary key default gen_random_uuid(),
  comment_id uuid not null references public.comments(id) on delete cascade,
  reporter_id uuid not null references auth.users on delete cascade,
  reason text check (reason is null or char_length(reason) <= 500),
  created_at timestamptz not null default now(),
  unique (reporter_id, comment_id)
);

create index if not exists comment_reports_comment_id_idx
  on public.comment_reports (comment_id);

-- ===========================================================================
-- A.4  RLS-Policies
-- ===========================================================================
alter table public.comment_votes enable row level security;
alter table public.comment_reports enable row level security;

-- comment_votes: public read (Counts), insert/delete nur eigene
drop policy if exists "comment_votes public read" on public.comment_votes;
create policy "comment_votes public read"
  on public.comment_votes for select
  to anon, authenticated using (true);

drop policy if exists "comment_votes insert own" on public.comment_votes;
create policy "comment_votes insert own"
  on public.comment_votes for insert
  to authenticated with check (auth.uid() = user_id);

drop policy if exists "comment_votes delete own" on public.comment_votes;
create policy "comment_votes delete own"
  on public.comment_votes for delete
  to authenticated using (auth.uid() = user_id);

-- comment_reports: insert nur als man selbst, lesen nur Admin
drop policy if exists "comment_reports insert authenticated" on public.comment_reports;
create policy "comment_reports insert authenticated"
  on public.comment_reports for insert
  to authenticated with check (auth.uid() = reporter_id);

drop policy if exists "comment_reports admin read" on public.comment_reports;
create policy "comment_reports admin read"
  on public.comment_reports for select
  to authenticated using (public.is_admin());

-- ===========================================================================
-- A.5  Auto-Ausblenden ab Schwellwert (DB-Trigger, atomar)
-- ===========================================================================
create or replace function public.auto_hide_reported_comment()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  report_count int;
  threshold constant int := 5;  -- ab 5 unterschiedlichen Meldungen ausblenden
begin
  select count(*) into report_count
  from public.comment_reports
  where comment_id = new.comment_id;

  if report_count >= threshold then
    update public.comments
      set status = 'hidden'
      where id = new.comment_id
        and status = 'published';
  end if;

  return new;
end;
$$;

drop trigger if exists comment_reports_auto_hide on public.comment_reports;
create trigger comment_reports_auto_hide
  after insert on public.comment_reports
  for each row execute function public.auto_hide_reported_comment();

-- ===========================================================================
-- A.6  Optional: Admin-RPC für Moderations-Queue (Phase 5)
-- ===========================================================================
create or replace function public.reported_comments()
returns table (
  comment_id uuid,
  body text,
  status text,
  article_id uuid,
  author text,
  report_count bigint,
  last_reported timestamptz
)
language sql
security definer
set search_path = public
as $$
  select c.id, c.body, c.status, c.article_id,
         p.username, count(r.id), max(r.created_at)
  from public.comment_reports r
  join public.comments c on c.id = r.comment_id
  left join public.profiles p on p.id = c.user_id
  group by c.id, p.username
  order by max(r.created_at) desc;
$$;

revoke all on function public.reported_comments() from public;
grant execute on function public.reported_comments() to authenticated;
