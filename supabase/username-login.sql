-- CEO Clubhouse: Anmeldung mit Username ermöglichen
-- Im Supabase SQL Editor ausführen (nach auth-schema.sql).
-- Legt eine security-definer-RPC an, die zu einem Username die zugehörige
-- E-Mail liefert. Wird ausschließlich serverseitig in der signIn-Action
-- genutzt; die E-Mail wird nie an den Browser gesendet.

create or replace function public.email_for_username(name text)
returns text
language sql
security definer
set search_path = public, auth
as $$
  select u.email
  from public.profiles p
  join auth.users u on u.id = p.id
  where lower(p.username) = lower(trim(name))
  limit 1;
$$;

revoke all on function public.email_for_username(text) from public;
grant execute on function public.email_for_username(text) to anon, authenticated;
