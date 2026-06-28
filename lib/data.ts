export type NewsCategory = "tech" | "ai" | "business" | "trend";

export interface NewsItem {
  id: string;
  slug: string;
  category: NewsCategory;
  categoryLabel: string;
  time: string;
  source: string;
  headline: string;
  summary: string;
  link?: string;
  publishedAt?: string;
  likeCount?: number;
  dislikeCount?: number;
  commentCount?: number;
}

export const categoryLabels: Record<NewsCategory, string> = {
  tech: "Tech",
  ai: "AI",
  business: "Business",
  trend: "Trends",
};

export interface TrendingTopic {
  id: number;
  title: string;
}

export const newsItems: NewsItem[] = [
  {
    id: "1",
    slug: "openai-enterprise-os",
    category: "ai",
    categoryLabel: "AI",
    time: "vor 12 Min.",
    source: "Reuters",
    headline: "OpenAI plant eigenes Betriebssystem für Enterprise-Kunden",
    summary:
      "OpenAI arbeitet laut internen Quellen an einem KI-nativen OS, das direkt in Unternehmensinfrastruktur integriert werden soll. Launch noch 2026 geplant.",
  },
  {
    id: "2",
    slug: "deutsche-startups-vc-rekord",
    category: "business",
    categoryLabel: "Business",
    time: "vor 28 Min.",
    source: "Handelsblatt",
    headline: "Deutsche Startups ziehen Rekord-VC-Kapital trotz Zinsumfeld",
    summary:
      "Im ersten Halbjahr 2026 wurden über 4,2 Mrd. Euro in deutsche Startups investiert — ein Plus von 18% gegenüber Vorjahr. Wachstumsmotor bleibt der AI-Sektor.",
  },
  {
    id: "3",
    slug: "apple-m5-macbook-pro",
    category: "tech",
    categoryLabel: "Tech",
    time: "vor 1 Std.",
    source: "TechCrunch",
    headline: "Apple stellt neue M5-Chip-Generation für MacBook Pro vor",
    summary:
      "Der M5-Chip bringt laut Apple 40% mehr CPU-Leistung und erstmals einen dedizierten Neural Engine Core. Marktstart Herbst 2026.",
  },
  {
    id: "4",
    slug: "4-tage-woche-dax-pilot",
    category: "trend",
    categoryLabel: "Trend",
    time: "vor 2 Std.",
    source: "Financial Times",
    headline: "4-Tage-Woche: Erste DAX-Unternehmen starten Pilotprojekte",
    summary:
      "Mehrere Konzerne testen ab Herbst verkürzte Arbeitswochen bei vollem Lohnausgleich. Ziel ist es, im Wettbewerb um Fachkräfte attraktiver zu werden.",
  },
  {
    id: "5",
    slug: "eu-ai-act-gruender",
    category: "ai",
    categoryLabel: "AI",
    time: "vor 3 Std.",
    source: "t3n",
    headline: "EU AI Act: Was Gründer ab August 2026 wissen müssen",
    summary:
      "Die ersten verbindlichen Pflichten für KI-Hochrisiko-Systeme treten in Kraft. Experten raten Startups, jetzt Compliance-Roadmaps zu erstellen.",
  },
  {
    id: "6",
    slug: "sap-ki-agenten-mittelstand",
    category: "business",
    categoryLabel: "Business",
    time: "vor 5 Std.",
    source: "Manager Magazin",
    headline: "SAP bringt KI-Agenten für die Automatisierung im Mittelstand",
    summary:
      "Ab Q3 erhalten KMU Zugang zu vortrainierten Agenten für Buchhaltung und Einkauf. Ein strategischer Schritt gegen cloud-native Wettbewerber.",
  },
];

export const trendingTopics: TrendingTopic[] = [
  { id: 1, title: "KI-Regulierung EU AI Act" },
  { id: 2, title: "Remote Work vs. Office Return" },
  { id: 3, title: "Venture Capital Deutschland 2026" },
  { id: 4, title: "OpenAI Enterprise OS" },
  { id: 5, title: "Inflation & EZB Zinsentscheid" },
];

export const categoryBadgeClasses: Record<NewsCategory, string> = {
  tech: "bg-tech-bg text-tech-fg",
  ai: "bg-ai-bg text-ai-fg",
  business: "bg-business-bg text-business-fg",
  trend: "bg-trend-bg text-trend-fg",
};
