import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import NewsFeed from "@/components/NewsFeed";
import ScrollToTop from "@/components/ScrollToTop";
import Sidebar from "@/components/Sidebar";
import {
  getAllArticles,
  getTodayArticleCount,
  getTrendingArticles,
} from "@/lib/articles";
import { newsItems as fallbackItems } from "@/lib/data";
import { getCurrentProfile, getPreferredCategories } from "@/lib/profile";

export const revalidate = 3600;

export default async function Home() {
  const [articles, todayCount, trending, profile] = await Promise.all([
    getAllArticles(200),
    getTodayArticleCount(),
    getTrendingArticles(5),
    getCurrentProfile(),
  ]);

  const items = articles.length > 0 ? articles : fallbackItems;
  const preferredCategories = getPreferredCategories(profile);

  return (
    <>
      <Header />
      <Hero todayCount={todayCount} />
      <div className="mx-auto grid max-w-[1140px] grid-cols-1 items-start gap-10 border-t border-line px-6 pt-7 pb-16 lg:grid-cols-[1fr_360px] lg:gap-14 dark:border-line">
        <NewsFeed items={items} preferredCategories={preferredCategories} />
        <Sidebar trending={trending} />
      </div>
      <Footer />
      <ScrollToTop />
    </>
  );
}
