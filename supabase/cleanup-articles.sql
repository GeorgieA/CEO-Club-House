-- CEO Clubhouse: Bestehende irrelevante Artikel entfernen
-- Im Supabase SQL Editor ausführen.
-- Entfernt Wetter-, Sport-, Kriminalitäts-, Boulevard-, Kriegs-, Ratgeber-
-- und Meta-Aggregator-News aus der DB.

-- 1. Vorschau: Wie viele Artikel würden gelöscht? (optional zuerst ausführen)
-- select count(*) from public.articles
-- where title ~* '(wetter|unwetter|hitze|hitzewelle|hitzerekord|temperaturrekord|gewitter|starkregen|hochwasser|überschwemmung|waldbrand|dürre|sturmtief|schneefall|glatteis|dwd|fußball|fussball|bundesliga|champions league|formel 1|olympia|tennis|basketball|handball|mord|festnahme|polizei|unfall|tötung|brandstiftung|kriminal|staatsanwalt|messerangriff|messerattacke|vermisst|leiche|royals|skandal|promi|schauspieler|sängerin|horoskop|lotto|ukraine|russland|putin|krieg|militär|militaer|nato|israel|gaza|drohne|rakete|anleitung|schritt.für.schritt|schritt.fuer.schritt|top.10|ratgeber|bewerbung|karriere|lebenslauf|kalenderwoche|meistgelesen|top-artikel|wochenrückblick|wochenrueckblick|kaufen oder verkaufen|aktien-profis|aktientip)';

-- 2. Löschen
delete from public.articles
where title ~* '(wetter|unwetter|hitze|hitzewelle|hitzerekord|temperaturrekord|gewitter|starkregen|hochwasser|überschwemmung|waldbrand|dürre|sturmtief|schneefall|glatteis|dwd|fußball|fussball|bundesliga|champions league|formel 1|olympia|tennis|basketball|handball|mord|festnahme|polizei|unfall|tötung|brandstiftung|kriminal|staatsanwalt|messerangriff|messerattacke|vermisst|leiche|royals|skandal|promi|schauspieler|sängerin|horoskop|lotto|ukraine|russland|putin|krieg|militär|militaer|nato|israel|gaza|drohne|rakete|anleitung|schritt.für.schritt|schritt.fuer.schritt|top.10|ratgeber|bewerbung|karriere|lebenslauf|kalenderwoche|meistgelesen|top-artikel|wochenrückblick|wochenrueckblick|kaufen oder verkaufen|aktien-profis|aktientip)';

-- 3. Verbleibende Verteilung prüfen
select category, count(*) from public.articles group by category order by count(*) desc;
