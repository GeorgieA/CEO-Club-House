-- CEO Clubhouse: Bestehende irrelevante Artikel entfernen
-- Im Supabase SQL Editor ausführen.
-- Entfernt Wetter-, Sport-, Kriminalitäts- und Boulevard-News, die durch die
-- alte (zu großzügige) Kategorisierung in der DB gelandet sind.

-- 1. Vorschau: Wie viele Artikel würden gelöscht? (optional zuerst ausführen)
-- select count(*) from public.articles
-- where title ~* '(wetter|unwetter|hitze|hitzewelle|hitzerekord|temperaturrekord|gewitter|starkregen|hochwasser|überschwemmung|waldbrand|dürre|sturmtief|schneefall|glatteis|dwd|fußball|fussball|bundesliga|champions league|formel 1|olympia|tennis|basketball|handball|mord|festnahme|polizei|unfall|tötung|brandstiftung|kriminal|staatsanwalt|messerangriff|messerattacke|vermisst|leiche|royals|skandal|promi|schauspieler|sängerin|horoskop|lotto)';

-- 2. Löschen
delete from public.articles
where title ~* '(wetter|unwetter|hitze|hitzewelle|hitzerekord|temperaturrekord|gewitter|starkregen|hochwasser|überschwemmung|waldbrand|dürre|sturmtief|schneefall|glatteis|dwd|fußball|fussball|bundesliga|champions league|formel 1|olympia|tennis|basketball|handball|mord|festnahme|polizei|unfall|tötung|brandstiftung|kriminal|staatsanwalt|messerangriff|messerattacke|vermisst|leiche|royals|skandal|promi|schauspieler|sängerin|horoskop|lotto)';

-- 3. Verbleibende Verteilung prüfen
select category, count(*) from public.articles group by category order by count(*) desc;
