-- CEO Clubhouse: Seed-Likes neu streuen (einmalig, optional)
-- Nutzt created_at = Zeitpunkt auf CEO Clubhouse (nicht RSS-published_at).
-- Anzeige berechnet Likes live im Code; dieses SQL hält nur die DB-Spalte synchron.

update public.articles a
set seed_likes = least(
  350,
  greatest(
    case
      when extract(epoch from (now() - a.created_at)) / 3600.0 < 1
        then (abs(hashtext(a.id::text)) % 4)::int
      when extract(epoch from (now() - a.created_at)) / 3600.0 < 6
        then 1 + (abs(hashtext(a.id::text)) % 9)::int
      when extract(epoch from (now() - a.created_at)) / 3600.0 < 24
        then 2 + (abs(hashtext(a.id::text)) % 28)::int
      when extract(epoch from (now() - a.created_at)) / 3600.0 < 24 * 7
        then 8 + (abs(hashtext(a.id::text)) % 65)::int
      when extract(epoch from (now() - a.created_at)) / 3600.0 < 24 * 30
        then 20 + (abs(hashtext(a.id::text)) % 140)::int
      else 40 + (abs(hashtext(a.id::text)) % 280)::int
    end,
    (
      floor(
        350.0
        * (1 - exp(
          -greatest(0, extract(epoch from (now() - a.created_at)) / 3600.0)
          / (24.0 * 30)
        ))
        * (0.45 + (abs(hashtext(a.id::text)) % 1000) / 1000.0)
      )
      + ((abs(hashtext(a.id::text || ':spread')) % 37) - 18)
    )::int
  )
);

select
  min(seed_likes) as min_seed,
  max(seed_likes) as max_seed,
  round(avg(seed_likes), 1) as avg_seed
from public.articles;
