import HeroSection from "@/components/hero-section"
import NewsGrid from "@/components/news-grid"
import BreakingNewsTicker from "@/components/breaking-news-ticker"
import DailyDigestBanner from "@/components/daily-digest-banner"
import WelcomePopup from "@/components/welcome-popup"
import { getNewsItems, getHeroNewsItems, type NewsItem } from "@/lib/news"
import type { Metadata } from "next/types"

// Generate dynamic metadata for the home page
export async function generateMetadata(): Promise<Metadata> {
  const newsItems = await getNewsItems()
  const heroNewsItems = await getHeroNewsItems()
  
  // Get the most recent news items for structured data
  const latestNews = newsItems.slice(0, 5)
  
  return {
    title: "Latest Breaking News & Trending Stories | SummariseMe",
    description: `Stay informed with today's top ${newsItems.length} breaking news stories. Get AI-powered summaries of the latest ${heroNewsItems.length} trending headlines in politics, technology, business, sports, entertainment, science, and health.`,
    keywords: [
      "breaking news today",
      "latest news",
      "trending stories",
      "current events",
      "news headlines",
      "daily news",
      "news summaries",
      "AI news",
      "politics news",
      "technology news",
      "business news",
      "sports news",
      "entertainment news",
      "science news",
      "health news"
    ],
    openGraph: {
      title: "Latest Breaking News & Trending Stories | SummariseMe",
      description: `Stay informed with today's top ${newsItems.length} breaking news stories. Get AI-powered summaries of the latest trending headlines.`,
      url: '/',
      images: [
        {
          url: '/og-image.jpg',
          width: 1200,
          height: 630,
          alt: 'Latest Breaking News & Trending Stories',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: "Latest Breaking News & Trending Stories | SummariseMe",
      description: `Stay informed with today's top ${newsItems.length} breaking news stories.`,
    },
    alternates: {
      canonical: '/',
    },
  }
}

// Make this an async server component
export default async function Home() {
  // Fetch news data server-side for SEO
  const newsItems = await getNewsItems()
  const heroNewsItems = await getHeroNewsItems()

  return (
    <>
      {/* Add structured data for news articles */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "NewsMediaOrganization",
            "name": "SummariseMe",
            "url": process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
            "logo": `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/logo.png`,
            "description": "AI-powered news summaries and breaking news coverage",
            "foundingDate": "2024",
            "sameAs": [
              "https://twitter.com/summariseme",
              "https://facebook.com/summariseme"
            ]
          })
        }}
      />
      
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
    </>
  )
}

