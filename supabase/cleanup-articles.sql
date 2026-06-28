-- CEO Clubhouse: Bestandsbereinigung der articles-Tabelle
-- Im Supabase SQL Editor der Reihe nach ausführen.
-- Entfernt Off-Topic-/Spam-Artikel und löscht den " - Quelle"-Zusatz aus alten
-- Titeln (Altlasten aus früheren Cron-Läufen vor der Filter-/Titel-Bereinigung).
--
-- FK-Hinweis: article_votes und comments haben ON DELETE CASCADE, zugehörige
-- Likes/Kommentare gelöschter Artikel werden also automatisch mitentfernt.

-- 0) VORSCHAU (optional zuerst) – wie viele Zeilen sind betroffen?
select
  count(*) as gesamt,
  count(*) filter (
    where title ~ '\s+[-–—]\s+[[:alnum:]äöüßÄÖÜ.&]+(\s[[:alnum:]äöüßÄÖÜ.&]+){0,3}$'
  ) as mit_quelle_im_titel
from public.articles;

-- 1) Automatisierte Aktien-/Finanz-Ticker und SEO-Quellen löschen
--    (Quelle steht bei diesen Altlasten noch im Titel)
delete from public.articles
where title ~* '\s[-–—]\s(börse express|boerse express|börse global|boerse global|börse online|boerse online|investing\.com|ad-hoc-news|aktien\.news|marketscreener|wallstreet[- ]online|finanzen\.net|finanznachrichten|der aktionär|der aktionaer|4investors|boersengefluester)( deutsch(land)?)?$';

-- 2) Off-Topic löschen (Sport, Krimi/Lokales, Wetter, Boulevard, Krieg,
--    Ratgeber/SEO, Politik-Umfragen, Promi/Schlager)
delete from public.articles
where title ~* '(wetter|unwetter|hitze|hitzewelle|hitzerekord|temperaturrekord|gewitter|starkregen|hochwasser|überschwemmung|waldbrand|dürre|sturmtief|schneefall|glatteis|dwd|fußball|fussball|bundesliga|champions league|formel 1|olympia|tennis|basketball|handball|radsport|mord|festnahme|polizei|unfall|tötung|brandstiftung|kriminal|staatsanwalt|messerangriff|messerattacke|vermisst|leiche|royals|skandal|promi|schauspieler|sängerin|saengerin|horoskop|lotto|silbereisen|schlager|krebs|ukraine|russland|putin|krieg|militär|militaer|nato|israel|gaza|drohne|rakete|anleitung|schritt.für.schritt|schritt.fuer.schritt|top.10|ratgeber|bewerbung|karriere|lebenslauf|jobsuche|kalenderwoche|meistgelesen|top-artikel|wochenrückblick|wochenrueckblick|sonntagstrend|umfrage|gta 6|kaufen oder verkaufen|aktien-profis|aktientip)';

-- 3) Verbleibenden " - Quelle"-Zusatz (1-4 Wörter) aus den Titeln entfernen
update public.articles
set title = regexp_replace(
  title,
  '\s+[-–—]\s+[[:alnum:]äöüßÄÖÜ.&]+([-\s][[:alnum:]äöüßÄÖÜ.&]+){0,3}$',
  ''
)
where title ~ '\s+[-–—]\s+[[:alnum:]äöüßÄÖÜ.&]+([-\s][[:alnum:]äöüßÄÖÜ.&]+){0,3}$';

-- 4) Ergebnis prüfen
select category, count(*) from public.articles group by category order by count(*) desc;
