// lib/news.ts - Server-side news data fetching utilities

export interface NewsItem {
  id: number;
  title: string;
  summary: string;
  image: string;
  category: string;
  date: string;
  slug: string;
  views: number;
  isRead: boolean;
  articleId?: string;
  articleCount?: number;
  sourceCount?: number;
  isBookmarked?: boolean;
  size?: string;
  type?: string;
  readTime?: string;
  images?: string[];
}

export interface EnvisageWebResponse {
  _id: string;
  envisage_web: {
    [dateKey: string]: {
      newsItems: NewsItem[];
    };
  };
}

/**
 * Fetch news items from the envisage_web collection
 * This function runs on the server side for SEO optimization
 */
export async function getNewsItems(): Promise<NewsItem[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001';
    const response = await fetch(`${apiUrl}/api/envisage_web`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Add cache control for better performance
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    if (!response.ok) {
      console.error(`Failed to fetch news items: ${response.status} ${response.statusText}`);
      return getFallbackNewsItems();
    }

    const result = await response.json();
    
    // Find the date key from the envisage_web object
    const dateKey = result.envisage_web ? Object.keys(result.envisage_web)[0] : null;

    if (!dateKey || !result.envisage_web[dateKey]?.newsItems) {
      console.error('Invalid data structure in envisage_web response');
      return getFallbackNewsItems();
    }

    const documentId = result._id;
    const newsItemsData = result.envisage_web[dateKey].newsItems;

    // Transform the data to match our NewsItem interface
    const newsItems: NewsItem[] = newsItemsData.map((item: any, index: number) => {
      // Create combined articleId
      const combinedArticleId = documentId ? `${documentId}_${item.id}` : `fallback-id_${item.id}`;
      
      // Assign size based on index for visual variety
      const sizeOptions = ["tiny", "small", "medium", "large", "wide", "tall"];
      const size = sizeOptions[Math.floor(Math.random() * sizeOptions.length)];
      
      // Select image: Use random image from 'images' array if available, else fallback
      let selectedImage = item.image || "/placeholder.svg?height=400&width=600";
      if (item.images && Array.isArray(item.images) && item.images.length > 0) {
        const randomIndex = Math.floor(Math.random() * item.images.length);
        selectedImage = item.images[randomIndex];
      }

      return {
        id: item.id,
        title: item.title,
        summary: item.summary || "",
        image: selectedImage,
        category: item.category,
        date: item.date,
        slug: item.slug,
        views: item.views || 0,
        isRead: false, // Will be updated client-side based on user interactions
        articleId: combinedArticleId,
        articleCount: item.articleCount,
        sourceCount: item.sourceCount,
        isBookmarked: false,
        size: size,
        type: "article",
        readTime: `${Math.floor((item.summary || "").length / 1000) + 1} min`,
        images: item.images,
      };
    });

    console.log(`✅ Server-side: Fetched ${newsItems.length} news items`);
    return newsItems;

  } catch (error) {
    console.error('❌ Server-side: Error fetching news items:', error);
    return getFallbackNewsItems();
  }
}

/**
 * Get fallback news items when API is unavailable
 */
function getFallbackNewsItems(): NewsItem[] {
  console.log('⚠️ Server-side: Using fallback news items');
  
  return [
    {
      id: 1,
      title: "Global Markets React to Economic Policy Shifts",
      summary: "Stock markets worldwide show mixed reactions to the latest economic policy announcements. Analysts predict continued volatility as investors adjust to the new landscape. Central banks are closely monitoring the situation and may intervene if necessary.",
      image: "/placeholder.svg?height=400&width=600",
      category: "Business",
      date: "2023-03-15",
      slug: "global-markets-react",
      views: 1243,
      isRead: false,
      articleId: "fallback-1",
      isBookmarked: false,
      size: "medium",
      type: "article",
      readTime: "3 min",
    },
    {
      id: 2,
      title: "New Study Reveals Benefits of Mediterranean Diet",
      summary: "Research confirms significant health benefits for those following a traditional Mediterranean diet. The study tracked participants over a five-year period and found reduced risks of heart disease, stroke, and certain cancers.",
      image: "/placeholder.svg?height=400&width=600",
      category: "Health",
      date: "2023-03-14",
      slug: "mediterranean-diet-benefits",
      views: 876,
      isRead: false,
      articleId: "fallback-2",
      isBookmarked: false,
      size: "medium",
      type: "article",
      readTime: "4 min",
    },
    {
      id: 3,
      title: "Tech Company Unveils Next-Generation Smartphone",
      summary: "The latest flagship device features groundbreaking camera technology and extended battery life. Industry experts are calling it a significant leap forward in mobile technology. Pre-orders have already broken previous records.",
      image: "/placeholder.svg?height=400&width=600",
      category: "Technology",
      date: "2023-03-13",
      slug: "next-gen-smartphone",
      views: 2105,
      isRead: false,
      articleId: "fallback-3",
      isBookmarked: false,
      size: "large",
      type: "article",
      readTime: "5 min",
    },
  ];
}

/**
 * Get hero news items for the hero section
 * Filters items with valid images and returns top 5
 */
export async function getHeroNewsItems(): Promise<NewsItem[]> {
  const allNewsItems = await getNewsItems();
  
  // Filter items that have a valid image URL (not placeholder or empty)
  const itemsWithImages = allNewsItems.filter(item => 
    item.image && !item.image.includes('placeholder.svg')
  );

  if (itemsWithImages.length > 0) {
    // Shuffle the array and take the first 5 (or fewer if less than 5 available)
    const shuffled = itemsWithImages.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 5);
  }

  // Fallback to first 3 items if no valid images
  return allNewsItems.slice(0, 3);
} 