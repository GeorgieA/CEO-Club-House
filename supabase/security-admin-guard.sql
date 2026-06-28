-- CEO Clubhouse: Schutz gegen Privilege Escalation
-- Im Supabase SQL Editor ausführen (nach auth-schema.sql und admin-settings.sql).
--
-- Problem: Die RLS-Policy "profiles update own" erlaubt einem Nutzer, ALLE
-- Spalten seiner eigenen Zeile zu ändern – inklusive is_admin. Da der anon-Key
-- öffentlich ist, könnte sich jeder eingeloggte Nutzer per direktem
-- Supabase-Aufruf selbst zum Admin machen.
--
-- Lösung: Ein BEFORE-UPDATE-Trigger blockiert jede Änderung an is_admin,
-- sofern der Aufrufer nicht bereits Admin ist. Der service_role-Client
-- (Cron/Server) umgeht RLS und Trigger-Auth-Checks ohnehin nicht über
-- auth.uid(), daher wird is_admin dort weiterhin via direktem SQL gesetzt.

create or replace function public.prevent_admin_self_grant()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Nur relevant, wenn sich is_admin tatsächlich ändert.
  if new.is_admin is distinct from old.is_admin then
    -- Blockiere nur echte, eingeloggte Endnutzer (auth.uid() ist gesetzt),
    -- die nicht bereits Admin sind. Im SQL Editor und im service_role-Kontext
    -- ist auth.uid() NULL -> dort bleibt das Setzen von is_admin erlaubt
    -- (z. B. admin-settings.sql).
    if auth.uid() is not null and not public.is_admin() then
      raise exception 'Änderung von is_admin ist nicht erlaubt.';
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists profiles_protect_is_admin on public.profiles;
create trigger profiles_protect_is_admin
  before update on public.profiles
  for each row execute function public.prevent_admin_self_grant();
