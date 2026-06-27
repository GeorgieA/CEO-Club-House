// Blocklist für harte Regeln — erweiterbar
export const BLOCKED_WORDS = [
  "mord",
  "töten",
  "toeten",
  "vergewaltig",
  "drogenhandel",
  "terror",
  "bombe",
  "waffenhandel",
  "kinderporn",
  "hetze",
  "nazi",
  "heil hitler",
  "arschloch",
  "hurensohn",
  "fotze",
  "schlampe",
  "missbrauch",
  "selbstmord",
  "suizid",
];

export const LINK_PATTERNS = [
  /https?:\/\//i,
  /www\./i,
  /\b[a-z0-9-]+\.(com|de|net|org|io|co|eu|info|biz|app|dev|xyz|me|tv|cc|ly|link|site|online|shop|store|blog|news|tech|ai|cloud|pro|live|world|global|media|digital|finance|money|capital|ventures|startup|business|agency|consulting|group|team|studio|labs|works|space|zone|network|systems|solutions|services|company|corp|inc|ltd|gmbh|ag|ch|at|uk|us|fr|it|es|nl|be|pl|cz|se|no|dk|fi|ru|cn|jp|kr|in|br|mx|au|nz|ca|sg|hk|tw|ae|sa|il|za|ng|ke|eg|tr|gr|pt|ro|hu|bg|hr|sk|si|lt|lv|ee|is|ie|lu|mt|cy)\b/i,
  /@[a-z0-9_]{2,}/i,
  /\b[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}\b/i,
  /\[.*?\]\(.*?\)/,
  /\b(punkt|dot)\s*(de|com|net|org|io)\b/i,
  /\b(de|com|net|org|io)\s*(punkt|dot)\b/i,
];
