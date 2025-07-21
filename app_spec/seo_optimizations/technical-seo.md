# Technical SEO

## Overview

This document details the technical SEO implementation for the SummariseMe website. Technical SEO focuses on the technical aspects that affect search engine crawling, indexing, and ranking.

## Core Technical SEO Elements

### 1. URL Structure and Canonicalization

#### URL Canonicalization Implementation
```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  const hostname = request.headers.get('host') || ''
  
  // Skip middleware for localhost development
  if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
    return NextResponse.next()
  }
  
  // Force HTTPS in production only
  if (process.env.NODE_ENV === 'production' && !request.headers.get('x-forwarded-proto')?.includes('https')) {
    url.protocol = 'https:'
    return NextResponse.redirect(url)
  }
  
  // Remove www subdomain (only in production)
  if (process.env.NODE_ENV === 'production' && hostname.startsWith('www.')) {
    url.hostname = hostname.replace('www.', '')
    return NextResponse.redirect(url)
  }
  
  // Remove trailing slashes except for root
  if (url.pathname.length > 1 && url.pathname.endsWith('/')) {
    url.pathname = url.pathname.slice(0, -1)
    return NextResponse.redirect(url)
  }
  
  // Force lowercase URLs
  if (url.pathname !== url.pathname.toLowerCase()) {
    url.pathname = url.pathname.toLowerCase()
    return NextResponse.redirect(url)
  }
  
  return NextResponse.next()
}
```

#### Canonical URL Implementation
```typescript
// In layout.tsx
<link rel="canonical" href={process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'} />

// In page metadata
alternates: {
  canonical: '/',
}

// Dynamic canonical URLs
alternates: {
  canonical: `/category/${slug}`,
}
```

### 2. Meta Tags and Headers

#### Robots Meta Tags
```typescript
robots: {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    'max-video-preview': -1,
    'max-image-preview': 'large',
    'max-snippet': -1,
  },
}
```

#### Security Headers
```typescript
// Security headers implementation
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  }
]
```

### 3. Structured Data Implementation

#### JSON-LD Schema Markup
```typescript
// NewsArticle Schema
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      "headline": article.title,
      "description": cleanContent.substring(0, 200),
      "image": article.image,
      "author": {
        "@type": "Person",
        "name": article.author.name,
        "jobTitle": article.author.role
      },
      "publisher": {
        "@type": "Organization",
        "name": "SummariseMe",
        "logo": {
          "@type": "ImageObject",
          "url": `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/logo.png`
        }
      },
      "datePublished": article.date,
      "dateModified": article.date,
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/news/${slug}`
      },
      "articleSection": article.category,
      "wordCount": cleanContent.split(' ').length
    })
  }}
/>
```

### 4. Performance Optimization

#### Image Optimization
```typescript
// Next.js Image component optimization
<Image
  src={imageUrl}
  alt={description}
  width={1200}
  height={630}
  priority={isHero}
  loading={isHero ? "eager" : "lazy"}
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
/>
```

#### Font Optimization
```typescript
// Font preloading
<link
  rel="preload"
  href="/fonts/inter.woff2"
  as="font"
  type="font/woff2"
  crossOrigin="anonymous"
/>

// Font optimization in layout
const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  preload: true
})
```

### 5. Core Web Vitals Optimization

#### Largest Contentful Paint (LCP)
```typescript
// Optimize LCP with priority loading
<Image
  src={heroImage}
  alt={heroTitle}
  priority={true}
  loading="eager"
  width={1200}
  height={630}
/>
```

#### First Input Delay (FID)
```typescript
// Optimize FID with code splitting
import dynamic from 'next/dynamic'

const DynamicComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>Loading...</p>,
  ssr: false
})
```

#### Cumulative Layout Shift (CLS)
```typescript
// Prevent CLS with proper image dimensions
<div className="relative h-[400px] w-full">
  <Image
    src={imageUrl}
    alt={description}
    fill
    className="object-cover"
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  />
</div>
```

## Technical SEO Implementation

### 1. Server-Side Rendering (SSR)

#### Metadata Generation
```typescript
// Server-side metadata generation
export async function generateMetadata({ params }): Promise<Metadata> {
  const data = await fetchData(params)
  
  return {
    title: data.title,
    description: data.description,
    // ... other metadata
  }
}
```

#### Static Generation
```typescript
// Static site generation for better performance
export async function generateStaticParams() {
  const posts = await getPosts()
  
  return posts.map((post) => ({
    slug: post.slug,
  }))
}
```

### 2. Mobile Optimization

#### Responsive Design
```css
/* Mobile-first CSS approach */
.container {
  padding: 1rem;
  max-width: 100%;
}

@media (min-width: 768px) {
  .container {
    padding: 2rem;
    max-width: 1200px;
  }
}
```

#### Touch Optimization
```css
/* Touch-friendly button sizes */
.button {
  min-height: 44px;
  min-width: 44px;
  padding: 12px 16px;
}
```

### 3. Security Implementation

#### HTTPS Enforcement
```typescript
// Force HTTPS in production
if (process.env.NODE_ENV === 'production' && !request.headers.get('x-forwarded-proto')?.includes('https')) {
  url.protocol = 'https:'
  return NextResponse.redirect(url)
}
```

#### Content Security Policy
```typescript
// CSP headers
const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  font-src 'self';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  block-all-mixed-content;
  upgrade-insecure-requests;
`
```

### 4. Caching Strategy

#### Browser Caching
```typescript
// Cache control headers
const cacheControl = {
  'Cache-Control': 'public, max-age=31536000, immutable'
}
```

#### CDN Configuration
```typescript
// CDN optimization
const cdnConfig = {
  images: {
    domains: ['cdn.example.com'],
    formats: ['image/webp', 'image/avif'],
    sizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840]
  }
}
```

## Performance Monitoring

### 1. Core Web Vitals Tracking

#### LCP Monitoring
```typescript
// LCP tracking
new PerformanceObserver((entryList) => {
  for (const entry of entryList.getEntries()) {
    if (entry.entryType === 'largest-contentful-paint') {
      console.log('LCP:', entry.startTime)
      // Send to analytics
    }
  }
}).observe({ entryTypes: ['largest-contentful-paint'] })
```

#### FID Monitoring
```typescript
// FID tracking
new PerformanceObserver((entryList) => {
  for (const entry of entryList.getEntries()) {
    if (entry.entryType === 'first-input') {
      console.log('FID:', entry.processingStart - entry.startTime)
      // Send to analytics
    }
  }
}).observe({ entryTypes: ['first-input'] })
```

#### CLS Monitoring
```typescript
// CLS tracking
let clsValue = 0
new PerformanceObserver((entryList) => {
  for (const entry of entryList.getEntries()) {
    if (!entry.hadRecentInput) {
      clsValue += entry.value
      console.log('CLS:', clsValue)
      // Send to analytics
    }
  }
}).observe({ entryTypes: ['layout-shift'] })
```

### 2. Performance Metrics

#### Page Load Time
```typescript
// Page load time tracking
window.addEventListener('load', () => {
  const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart
  console.log('Page Load Time:', loadTime)
  // Send to analytics
})
```

#### Time to First Byte (TTFB)
```typescript
// TTFB tracking
const navigation = performance.getEntriesByType('navigation')[0]
const ttfb = navigation.responseStart - navigation.requestStart
console.log('TTFB:', ttfb)
// Send to analytics
```

## Technical SEO Best Practices

### 1. Crawlability

#### XML Sitemap
```typescript
// Generate XML sitemap
export async function generateSitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url>
        <loc>${baseUrl}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
      </url>
      <!-- Add more URLs -->
    </urlset>`
  
  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  })
}
```

#### Robots.txt
```txt
User-agent: *
Allow: /

Sitemap: https://example.com/sitemap.xml

Disallow: /api/
Disallow: /_next/
Disallow: /admin/
```

### 2. Indexability

#### Meta Robots Tags
```typescript
// Proper robots meta tags
robots: {
  index: true,
  follow: true,
  nocache: false,
  googleBot: {
    index: true,
    follow: true,
    noimageindex: false,
    'max-video-preview': -1,
    'max-image-preview': 'large',
    'max-snippet': -1,
  },
}
```

#### Noindex Implementation
```typescript
// Noindex for specific pages
export async function generateMetadata() {
  return {
    robots: {
      index: false,
      follow: true,
    }
  }
}
```

### 3. Schema Markup

#### Breadcrumb Schema
```typescript
// Breadcrumb structured data
const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://example.com"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Category",
      "item": "https://example.com/category"
    }
  ]
}
```

#### FAQ Schema
```typescript
// FAQ structured data
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is SummariseMe?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "SummariseMe is an AI-powered news aggregation platform..."
      }
    }
  ]
}
```

## Monitoring and Maintenance

### 1. Technical SEO Audits

#### Regular Audits
- **Monthly**: Core Web Vitals monitoring
- **Quarterly**: Technical SEO audits
- **Annually**: Comprehensive site audits

#### Audit Tools
- **Google PageSpeed Insights**: Performance monitoring
- **Google Search Console**: Technical issues
- **Lighthouse**: Comprehensive audits
- **Screaming Frog**: Technical SEO crawls

### 2. Performance Optimization

#### Continuous Optimization
- **Image Optimization**: Regular image compression
- **Code Optimization**: Bundle size monitoring
- **Caching Optimization**: Cache strategy updates
- **CDN Optimization**: CDN performance monitoring

#### Optimization Metrics
- **Page Speed**: Target < 3 seconds
- **Core Web Vitals**: Meet Google's thresholds
- **Mobile Performance**: Optimize for mobile
- **User Experience**: Monitor user engagement

## Conclusion

Technical SEO implementation provides the foundation for search engine optimization success. The systematic approach ensures optimal crawling, indexing, and ranking while maintaining excellent user experience and performance.

---

**Last Updated**: December 2024  
**Version**: 1.0  
**Next Review**: January 2025 