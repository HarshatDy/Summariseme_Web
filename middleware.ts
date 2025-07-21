import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  const hostname = request.headers.get('host') || ''
  
  // Skip middleware for localhost development
  // Comment this out to test canonicalization in development
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
  
  // Remove trailing slashes except for root (works in both dev and prod)
  if (url.pathname.length > 1 && url.pathname.endsWith('/')) {
    url.pathname = url.pathname.slice(0, -1)
    return NextResponse.redirect(url)
  }
  
  // Force lowercase URLs (works in both dev and prod)
  if (url.pathname !== url.pathname.toLowerCase()) {
    url.pathname = url.pathname.toLowerCase()
    return NextResponse.redirect(url)
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
} 