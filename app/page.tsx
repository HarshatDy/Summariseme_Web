import HeroSection from "@/components/hero-section"
import NewsGrid from "@/components/news-grid"
import BreakingNewsTicker from "@/components/breaking-news-ticker"
import DailyDigestBanner from "@/components/daily-digest-banner"
import WelcomePopup from "@/components/welcome-popup"
import { getNewsItems, getHeroNewsItems, type NewsItem } from "@/lib/news"

// Make this an async server component
export default async function Home() {
  // Fetch news data server-side for SEO
  const newsItems = await getNewsItems()
  const heroNewsItems = await getHeroNewsItems()

  return (
    <div className="container mx-auto px-4 py-8">
      <WelcomePopup />
      <BreakingNewsTicker />
      <div className="mt-6">
        <HeroSection initialHeroNews={heroNewsItems} />
      </div>
      <DailyDigestBanner />
      <div className="mt-8">
        <NewsGrid initialNewsItems={newsItems} />
      </div>
    </div>
  )
}

