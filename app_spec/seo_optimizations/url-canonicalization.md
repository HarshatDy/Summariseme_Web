# URL Canonicalization

## Overview

This document details the implementation of URL canonicalization for the SummariseMe website. URL canonicalization ensures that search engines understand the preferred version of each URL, preventing duplicate content issues and improving SEO performance.

## Implementation Details

### 1. Middleware Implementation (`middleware.ts`)

#### Complete Middleware Code
```typescript
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

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
```

#### Middleware Configuration
```typescript
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
```

### 2. Canonicalization Rules

#### 1. Development Environment Handling
```typescript
// Skip middleware for localhost development
if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
  return NextResponse.next()
}
```

**Purpose**: Ensures development environment works normally without redirects
**Benefits**: 
- No redirects during development
- Faster development workflow
- Prevents development issues

#### 2. HTTPS Enforcement (Production Only)
```typescript
// Force HTTPS in production only
if (process.env.NODE_ENV === 'production' && !request.headers.get('x-forwarded-proto')?.includes('https')) {
  url.protocol = 'https:'
  return NextResponse.redirect(url)
}
```

**Purpose**: Redirects HTTP to HTTPS in production
**Benefits**:
- Improved security
- Better search engine ranking
- Enhanced user trust
- Modern web standards compliance

#### 3. WWW Subdomain Handling
```typescript
// Remove www subdomain (only in production)
if (process.env.NODE_ENV === 'production' && hostname.startsWith('www.')) {
  url.hostname = hostname.replace('www.', '')
  return NextResponse.redirect(url)
}
```

**Purpose**: Redirects www.example.com to example.com
**Benefits**:
- Consistent URL structure
- Eliminates duplicate content
- Simplified URL management
- Better brand consistency

#### 4. Trailing Slash Normalization
```typescript
// Remove trailing slashes except for root
if (url.pathname.length > 1 && url.pathname.endsWith('/')) {
  url.pathname = url.pathname.slice(0, -1)
  return NextResponse.redirect(url)
}
```

**Purpose**: Removes trailing slashes from URLs (except root)
**Benefits**:
- Consistent URL structure
- Eliminates duplicate content
- Cleaner URLs
- Better user experience

#### 5. Case Sensitivity Normalization
```typescript
// Force lowercase URLs
if (url.pathname !== url.pathname.toLowerCase()) {
  url.pathname = url.pathname.toLowerCase()
  return NextResponse.redirect(url)
}
```

**Purpose**: Converts all URLs to lowercase
**Benefits**:
- Consistent URL structure
- Eliminates case-sensitive duplicates
- Better cross-platform compatibility
- Simplified URL management

## URL Examples

### Before Canonicalization
```
http://www.example.com/Category/Politics/
https://www.example.com/category/politics
http://example.com/category/POLITICS
https://example.com/category/politics/
```

### After Canonicalization
```
https://example.com/category/politics
```

## Implementation Benefits

### 1. SEO Benefits
- **Eliminates Duplicate Content**: Prevents multiple URLs for the same content
- **Improved Crawling**: Search engines focus on canonical URLs
- **Better Rankings**: Consolidates link equity to preferred URLs
- **Enhanced Indexing**: Cleaner search engine index

### 2. User Experience Benefits
- **Consistent URLs**: Users see consistent URL structure
- **Better Bookmarking**: Cleaner URLs for bookmarking
- **Improved Sharing**: Consistent URLs for social sharing
- **Reduced Confusion**: No duplicate content confusion

### 3. Technical Benefits
- **Security**: HTTPS enforcement
- **Performance**: Reduced redirect chains
- **Maintenance**: Easier URL management
- **Analytics**: Cleaner analytics data

## Canonical URL Implementation

### 1. Meta Canonical Tags
```typescript
// In layout.tsx
<link rel="canonical" href={process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'} />

// In page metadata
alternates: {
  canonical: '/',
}
```

### 2. Dynamic Canonical URLs
```typescript
// Category pages
alternates: {
  canonical: `/category/${slug}`,
}

// Article pages
alternates: {
  canonical: `/news/${slug}`,
}
```

## Testing and Validation

### 1. Development Testing
```bash
# Test localhost (should not redirect)
curl -I http://localhost:3000/category/politics/

# Test localhost with trailing slash (should not redirect)
curl -I http://localhost:3000/category/politics/
```

### 2. Production Testing
```bash
# Test HTTP to HTTPS redirect
curl -I http://example.com/category/politics

# Test www to non-www redirect
curl -I https://www.example.com/category/politics

# Test trailing slash removal
curl -I https://example.com/category/politics/

# Test case sensitivity
curl -I https://example.com/Category/Politics
```

### 3. Search Console Validation
- Submit canonical URLs to Google Search Console
- Monitor for duplicate content issues
- Check redirect chains
- Validate canonical implementation

## Common Issues and Solutions

### 1. Redirect Chains
**Issue**: Multiple redirects causing performance issues
**Solution**: Implement direct redirects to canonical URLs

### 2. Development Environment Issues
**Issue**: Middleware affecting development workflow
**Solution**: Skip middleware for localhost development

### 3. HTTPS Mixed Content
**Issue**: Mixed HTTP/HTTPS content
**Solution**: Ensure all resources use HTTPS

### 4. Canonical URL Conflicts
**Issue**: Conflicting canonical URLs
**Solution**: Ensure consistent canonical URL implementation

## Performance Considerations

### 1. Redirect Performance
- **Minimal Impact**: Redirects are fast and efficient
- **Caching**: Browsers cache redirects
- **CDN Optimization**: CDNs handle redirects efficiently

### 2. SEO Performance
- **Crawl Budget**: Efficient use of search engine crawl budget
- **Index Quality**: Cleaner search engine index
- **Ranking Consolidation**: Better ranking potential

### 3. User Experience Performance
- **Fast Redirects**: Minimal user experience impact
- **Consistent URLs**: Better user understanding
- **Reduced Confusion**: Clear URL structure

## Monitoring and Maintenance

### 1. Regular Monitoring
- **Search Console**: Monitor for duplicate content issues
- **Analytics**: Track redirect performance
- **User Feedback**: Monitor user experience issues
- **Technical SEO**: Regular canonical URL audits

### 2. Maintenance Tasks
- **URL Audits**: Regular URL structure reviews
- **Redirect Monitoring**: Check redirect chain performance
- **Canonical Validation**: Validate canonical URL implementation
- **Performance Optimization**: Optimize redirect performance

### 3. Future Enhancements
- **Advanced Redirects**: Implement more sophisticated redirect logic
- **URL Optimization**: Further URL structure optimization
- **Performance Monitoring**: Enhanced redirect performance tracking
- **User Experience**: Improved URL user experience

## Best Practices

### 1. Implementation Best Practices
- **Test Thoroughly**: Test all redirect scenarios
- **Monitor Performance**: Track redirect performance
- **Validate Implementation**: Use SEO tools for validation
- **Document Changes**: Maintain clear documentation

### 2. SEO Best Practices
- **Consistent Implementation**: Apply canonicalization consistently
- **Monitor Search Console**: Track SEO impact
- **Regular Audits**: Conduct regular URL audits
- **Performance Optimization**: Optimize for performance

### 3. User Experience Best Practices
- **Fast Redirects**: Ensure redirects are fast
- **Clear URLs**: Maintain clear URL structure
- **Consistent Experience**: Provide consistent user experience
- **Accessibility**: Ensure accessibility compliance

## Conclusion

The URL canonicalization implementation provides a robust foundation for consistent URL structure and improved SEO performance. The systematic approach ensures comprehensive coverage of all URL variations while maintaining excellent user experience and performance.

---

**Last Updated**: December 2024  
**Version**: 1.0  
**Next Review**: January 2025 