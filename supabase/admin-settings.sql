-- CEO Clubhouse: Admin & globale Einstellungen
-- Im Supabase SQL Editor ausführen (nach auth-schema.sql)

-- ============================================================
-- Admin-Flag auf profiles
-- ============================================================
alter table public.profiles
  add column if not exists is_admin boolean not null default false;

-- ============================================================
-- app_settings (Singleton-Zeile für globale Einstellungen)
-- ============================================================
create table if not exists public.app_settings (
  id boolean primary key default true,
  gemini_instructions text not null default '',
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users on delete set null,
  constraint app_settings_singleton check (id = true)
);

insert into public.app_settings (id)
  values (true)
  on conflict (id) do nothing;

drop trigger if exists app_settings_set_updated_at on public.app_settings;
create trigger app_settings_set_updated_at
  before update on public.app_settings
  for each row execute function public.set_updated_at();

-- ============================================================
-- Helper: aktueller Nutzer ist Admin?
-- (security definer, umgeht RLS beim Lesen von profiles)
-- ============================================================
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select coalesce(
    (select is_admin from public.profiles where id = auth.uid()),
    false
  );
$$;

grant execute on function public.is_admin() to authenticated;

-- ============================================================
-- RLS: nur Admins dürfen Einstellungen lesen/ändern
-- (der service_role-Key des Cron-Jobs umgeht RLS ohnehin)
-- ============================================================
alter table public.app_settings enable row level security;

drop policy if exists "app_settings admin read" on public.app_settings;
create policy "app_settings admin read"
  on public.app_settings for select
  to authenticated
  using (public.is_admin());

drop policy if exists "app_settings admin update" on public.app_settings;
create policy "app_settings admin update"
  on public.app_settings for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ============================================================
-- admin_1 (team@finity-in.com) zum Admin machen
-- ============================================================
update public.profiles
  set is_admin = true
  where id = (
    select id from auth.users where lower(email) = 'team@finity-in.com'
  );
