-- CEO Clubhouse: Automatische Seed-Likes
-- Im Supabase SQL Editor der Reihe nach ausführen.
--
-- Seed-Likes sind künstliche Like-Zähler auf articles.seed_likes (max. 350).
-- Echte User-Votes in article_votes addieren sich in der App oben drauf.
-- Der stündliche Cron erhöht seed_likes automatisch Richtung Zielkurve.

-- 0) VORSCHAU (optional)
select
  count(*) as artikel_gesamt,
  count(*) filter (where coalesce(seed_likes, 0) = 0) as ohne_seed_likes
from public.articles;

-- 1) Spalte auf articles
alter table public.articles
  add column if not exists seed_likes int not null default 0
  check (seed_likes between 0 and 350);

-- 2) Admin-Toggle in app_settings
alter table public.app_settings
  add column if not exists seed_likes_enabled boolean not null default true;

-- 3) Teil-Backfill für Bestandsartikel: sofort 30–50 Likes
update public.articles
set seed_likes = least(
  350,
  30 + floor(random() * 21)::int
)
where seed_likes = 0;

-- 4) Kontrolle
select
  count(*) as artikel_gesamt,
  min(seed_likes) as min_seed,
  max(seed_likes) as max_seed,
  round(avg(seed_likes), 1) as avg_seed
from public.articles;
