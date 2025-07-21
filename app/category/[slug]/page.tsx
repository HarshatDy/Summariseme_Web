import { notFound } from "next/navigation"
import NewsGrid from "@/components/news-grid"
import Sidebar from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { getNewsItems } from "@/lib/news"
import type { Metadata } from "next/types"

// Sample categories data
const validCategories = ["politics", "technology", "business", "sports", "entertainment", "science", "health"]

// Map for display names
const categoryDisplayNames: Record<string, string> = {
  politics: "Politics",
  technology: "Technology",
  business: "Business",
  sports: "Sports",
  entertainment: "Entertainment",
  science: "Science",
  health: "Health",
}

// Map for SEO descriptions
const categoryDescriptions: Record<string, string> = {
  politics: "Latest political news, government updates, and policy developments. Stay informed about elections, legislation, and political events.",
  technology: "Breaking technology news, latest tech innovations, and digital trends. Get updates on AI, software, hardware, and tech industry developments.",
  business: "Latest business news, market updates, and economic developments. Stay informed about companies, investments, and financial markets.",
  sports: "Breaking sports news, game results, and athlete updates. Get the latest on football, basketball, baseball, and all major sports.",
  entertainment: "Latest entertainment news, celebrity updates, and pop culture trends. Stay informed about movies, TV shows, music, and celebrity events.",
  science: "Latest science news, research discoveries, and scientific breakthroughs. Get updates on space, medicine, environment, and scientific studies.",
  health: "Latest health news, medical research, and wellness updates. Stay informed about healthcare, fitness, nutrition, and medical breakthroughs.",
}

// Map for SEO keywords
const categoryKeywords: Record<string, string[]> = {
  politics: ["political news", "government news", "election news", "policy news", "political updates", "legislation news"],
  technology: ["tech news", "technology updates", "AI news", "software news", "hardware news", "digital trends", "innovation news"],
  business: ["business news", "market news", "economic news", "financial news", "company news", "investment news"],
  sports: ["sports news", "game results", "athlete news", "football news", "basketball news", "baseball news", "sports updates"],
  entertainment: ["entertainment news", "celebrity news", "movie news", "TV news", "music news", "pop culture news"],
  science: ["science news", "research news", "scientific discoveries", "space news", "medical research", "environmental news"],
  health: ["health news", "medical news", "wellness news", "fitness news", "nutrition news", "healthcare news"],
}

export function generateStaticParams() {
  return validCategories.map((slug) => ({ slug }))
}

// Generate metadata for each category
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { slug } = params
  
  if (!validCategories.includes(slug)) {
    return {
      title: "Category Not Found",
    }
  }

  const categoryName = categoryDisplayNames[slug]
  const description = categoryDescriptions[slug]
  const keywords = categoryKeywords[slug]
  
  // Fetch news data for this category
  const allNewsItems = await getNewsItems()
  const categoryNewsItems = allNewsItems.filter(item => 
    item.category.toLowerCase() === slug
  )

  return {
    title: `${categoryName} News - Latest ${categoryName} Stories & Updates | SummariseMe`,
    description: `${description} Browse ${categoryNewsItems.length} latest ${categoryName.toLowerCase()} news articles and stay updated with breaking ${categoryName.toLowerCase()} stories.`,
    keywords: [
      ...keywords,
      `${categoryName.toLowerCase()} news`,
      `${categoryName.toLowerCase()} updates`,
      `${categoryName.toLowerCase()} stories`,
      "breaking news",
      "latest news",
      "news summaries"
    ],
    openGraph: {
      title: `${categoryName} News - Latest ${categoryName} Stories & Updates`,
      description: `${description} Browse ${categoryNewsItems.length} latest ${categoryName.toLowerCase()} news articles.`,
      url: `/category/${slug}`,
      images: [
        {
          url: `/category-${slug}.jpg`,
          width: 1200,
          height: 630,
          alt: `${categoryName} News`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${categoryName} News - Latest ${categoryName} Stories & Updates`,
      description: `${description} Browse ${categoryNewsItems.length} latest ${categoryName.toLowerCase()} news articles.`,
    },
    alternates: {
      canonical: `/category/${slug}`,
    },
  }
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const { slug } = params

  // Check if the category exists
  if (!validCategories.includes(slug)) {
    notFound()
  }

  const categoryName = categoryDisplayNames[slug] || slug

  // Fetch news data server-side
  const allNewsItems = await getNewsItems()
  
  // Filter news items by category
  const categoryNewsItems = allNewsItems.filter(item => 
    item.category.toLowerCase() === slug
  )

  return (
    <>
      {/* Add structured data for category page */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": `${categoryName} News`,
            "description": categoryDescriptions[slug],
            "url": `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/category/${slug}`,
            "mainEntity": {
              "@type": "ItemList",
              "numberOfItems": categoryNewsItems.length,
              "itemListElement": categoryNewsItems.slice(0, 10).map((item, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "item": {
                  "@type": "NewsArticle",
                  "headline": item.title,
                  "description": item.summary.split('\n\n')[0],
                  "datePublished": item.date,
                  "author": {
                    "@type": "Organization",
                    "name": "SummariseMe"
                  },
                  "publisher": {
                    "@type": "Organization",
                    "name": "SummariseMe"
                  }
                }
              }))
            }
          })
        }}
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">{categoryName} News</h1>
          <p className="text-muted-foreground">
            {categoryDescriptions[slug]}
          </p>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">
            Latest
          </Button>
          <Button variant="outline" size="sm">
            Most Read
          </Button>
          <Button variant="outline" size="sm">
            Trending
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-2/3">
            <NewsGrid initialNewsItems={categoryNewsItems} />
            <div className="mt-8 flex justify-center">
              <Button variant="outline">Load More</Button>
            </div>
          </div>
          <div className="w-full md:w-1/3 mt-8 md:mt-0">
            <Sidebar />
          </div>
        </div>
      </div>
    </>
  )
}
