import type React from "react"
import type { Metadata } from "next/types"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import SessionWrapper from "@/components/session-wrapper"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "SummariseMe - Latest News & Breaking Stories | AI-Powered News Summaries",
    template: "%s | SummariseMe"
  },
  description: "Stay informed with the latest breaking news, trending stories, and AI-powered news summaries. Get comprehensive coverage of politics, technology, business, sports, entertainment, science, and health news.",
  keywords: [
    "news",
    "breaking news",
    "latest news",
    "news summaries",
    "AI news",
    "current events",
    "politics news",
    "technology news",
    "business news",
    "sports news",
    "entertainment news",
    "science news",
    "health news",
    "daily digest",
    "news aggregator",
    "summarized news",
    "news reading",
    "trending stories"
  ],
  authors: [{ name: "SummariseMe Team" }],
  creator: "SummariseMe",
  publisher: "SummariseMe",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'SummariseMe - Latest News & Breaking Stories',
    description: 'Stay informed with the latest breaking news, trending stories, and AI-powered news summaries.',
    siteName: 'SummariseMe',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'SummariseMe - Latest News & Breaking Stories',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SummariseMe - Latest News & Breaking Stories',
    description: 'Stay informed with the latest breaking news, trending stories, and AI-powered news summaries.',
    images: ['/og-image.jpg'],
  },
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
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Bungee+Spice&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Unbounded:wght@200..900&display=swap" rel="stylesheet" />
        <link rel="canonical" href={process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'} />
      </head>
      <body className={inter.className}>
        <SessionWrapper>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <div className="flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </ThemeProvider>
        </SessionWrapper>
      </body>
    </html>
  )
}

