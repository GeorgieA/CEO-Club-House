import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import NewsList from "@/components/NewsList";
import ScrollToTop from "@/components/ScrollToTop";
import Sidebar from "@/components/Sidebar";

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <div className="mx-auto grid max-w-[1140px] grid-cols-1 items-start gap-10 border-t border-line px-6 pt-7 pb-16 lg:grid-cols-[1fr_360px] lg:gap-14 dark:border-line">
        <NewsList />
        <Sidebar />
      </div>
      <Footer />
      <ScrollToTop />
    </>
  );
}
