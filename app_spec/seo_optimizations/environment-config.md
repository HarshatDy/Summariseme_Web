# Environment Configuration

## Overview

This document details the environment configuration required for the SEO optimizations implemented in the SummariseMe website. Proper environment configuration is essential for production deployment and optimal SEO performance.

## Required Environment Variables

### 1. Production Environment Variables

#### `.env.local` (Development)
```env
# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Google Search Console Verification
GOOGLE_SITE_VERIFICATION=your_google_verification_code

# Database Configuration
MONGODB_URI=your_mongodb_connection_string
MONGODB_DB=your_database_name

# API Configuration
NEXT_PUBLIC_API_URL=http://127.0.0.1:3001

# Authentication
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# OAuth Providers
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_ID=your_github_client_id
GITHUB_SECRET=your_github_client_secret
```

#### `.env.production` (Production)
```env
# Site Configuration
NEXT_PUBLIC_SITE_URL=https://yourdomain.com

# Google Search Console Verification
GOOGLE_SITE_VERIFICATION=your_google_verification_code

# Database Configuration
MONGODB_URI=your_production_mongodb_connection_string
MONGODB_DB=your_production_database_name

# API Configuration
NEXT_PUBLIC_API_URL=https://api.yourdomain.com

# Authentication
NEXTAUTH_SECRET=your_production_nextauth_secret
NEXTAUTH_URL=https://yourdomain.com

# OAuth Providers
GOOGLE_CLIENT_ID=your_production_google_client_id
GOOGLE_CLIENT_SECRET=your_production_google_client_secret
GITHUB_ID=your_production_github_client_id
GITHUB_SECRET=your_production_github_client_secret
```

## Environment Variable Details

### 1. Site Configuration

#### `NEXT_PUBLIC_SITE_URL`
**Purpose**: Defines the canonical URL for the website
**Usage**: Used in metadata, structured data, and canonical URLs
**Format**: Full URL including protocol (http:// or https://)
**Examples**:
```env
# Development
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Production
NEXT_PUBLIC_SITE_URL=https://summariseme.com
```

**Implementation**:
```typescript
// In layout.tsx
metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),

// In structured data
"url": process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',

// In canonical URLs
<link rel="canonical" href={process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'} />
```

### 2. Google Search Console Verification

#### `GOOGLE_SITE_VERIFICATION`
**Purpose**: Verifies website ownership with Google Search Console
**Usage**: Used in meta tags for Google verification
**Format**: Verification code provided by Google Search Console
**Example**:
```env
GOOGLE_SITE_VERIFICATION=abc123def456ghi789
```

**Implementation**:
```typescript
// In layout.tsx
verification: {
  google: process.env.GOOGLE_SITE_VERIFICATION,
},
```

### 3. API Configuration

#### `NEXT_PUBLIC_API_URL`
**Purpose**: Defines the backend API URL
**Usage**: Used for data fetching and API calls
**Format**: Full URL including protocol
**Examples**:
```env
# Development
NEXT_PUBLIC_API_URL=http://127.0.0.1:3001

# Production
NEXT_PUBLIC_API_URL=https://api.summariseme.com
```

**Implementation**:
```typescript
// In components
const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001'}/api/news`)
```

## Environment Setup Process

### 1. Development Setup

#### Step 1: Create Environment File
```bash
# Create .env.local file
touch .env.local
```

#### Step 2: Add Development Variables
```env
# Copy the development environment variables above
NEXT_PUBLIC_SITE_URL=http://localhost:3000
GOOGLE_SITE_VERIFICATION=your_google_verification_code
# ... other variables
```

#### Step 3: Restart Development Server
```bash
# Stop the development server
npm run dev
# Restart to load new environment variables
```

### 2. Production Setup

#### Step 1: Create Production Environment File
```bash
# Create .env.production file
touch .env.production
```

#### Step 2: Add Production Variables
```env
# Copy the production environment variables above
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
GOOGLE_SITE_VERIFICATION=your_google_verification_code
# ... other variables
```

#### Step 3: Deploy with Environment Variables
```bash
# Build the application
npm run build

# Start production server
npm start
```

### 3. Deployment Platform Setup

#### Vercel Deployment
1. **Environment Variables**: Add in Vercel dashboard
2. **Production URL**: Set in project settings
3. **Custom Domain**: Configure in domain settings

#### Netlify Deployment
1. **Environment Variables**: Add in site settings
2. **Production URL**: Set in site settings
3. **Custom Domain**: Configure in domain settings

#### Other Platforms
1. **Environment Variables**: Add in platform-specific settings
2. **Production URL**: Configure in platform settings
3. **Custom Domain**: Set up in domain management

## Security Considerations

### 1. Environment Variable Security
- **Never commit sensitive data**: Keep .env files in .gitignore
- **Use strong secrets**: Generate strong secrets for production
- **Rotate secrets regularly**: Update secrets periodically
- **Limit access**: Restrict access to environment variables

### 2. Production Security
- **HTTPS only**: Ensure all production URLs use HTTPS
- **Secure headers**: Implement security headers
- **CORS configuration**: Configure CORS properly
- **Rate limiting**: Implement API rate limiting

### 3. API Security
- **Authentication**: Implement proper authentication
- **Authorization**: Set up proper authorization
- **Input validation**: Validate all inputs
- **Error handling**: Implement secure error handling

## Validation and Testing

### 1. Environment Variable Validation
```typescript
// Validation function
function validateEnvironment() {
  const required = [
    'NEXT_PUBLIC_SITE_URL',
    'MONGODB_URI',
    'MONGODB_DB',
    'NEXTAUTH_SECRET'
  ]
  
  const missing = required.filter(key => !process.env[key])
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
  }
}
```

### 2. URL Validation
```typescript
// URL validation function
function validateSiteUrl() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  
  if (!siteUrl) {
    throw new Error('NEXT_PUBLIC_SITE_URL is required')
  }
  
  try {
    new URL(siteUrl)
  } catch {
    throw new Error('NEXT_PUBLIC_SITE_URL must be a valid URL')
  }
}
```

### 3. Production Validation
```typescript
// Production validation
if (process.env.NODE_ENV === 'production') {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  
  if (!siteUrl?.startsWith('https://')) {
    throw new Error('Production site URL must use HTTPS')
  }
}
```

## Monitoring and Maintenance

### 1. Environment Monitoring
- **Variable validation**: Regular environment variable checks
- **URL monitoring**: Monitor site URL availability
- **API monitoring**: Monitor API endpoint availability
- **Error tracking**: Track environment-related errors

### 2. Regular Maintenance
- **Secret rotation**: Regular secret updates
- **URL updates**: Update URLs as needed
- **Configuration reviews**: Regular configuration audits
- **Security updates**: Keep security configurations current

### 3. Backup and Recovery
- **Configuration backup**: Backup environment configurations
- **Recovery procedures**: Document recovery procedures
- **Testing**: Regular backup and recovery testing
- **Documentation**: Maintain up-to-date documentation

## Troubleshooting

### 1. Common Issues

#### Missing Environment Variables
**Issue**: Application fails to start due to missing variables
**Solution**: Check .env file and ensure all required variables are set

#### Invalid URLs
**Issue**: Invalid URL format in environment variables
**Solution**: Validate URL format and ensure proper protocol

#### Production HTTPS Issues
**Issue**: Production site not using HTTPS
**Solution**: Ensure production URL uses HTTPS protocol

#### API Connection Issues
**Issue**: API calls failing in production
**Solution**: Check API URL and ensure proper configuration

### 2. Debugging Steps
1. **Check environment file**: Verify .env file exists and has correct variables
2. **Validate URLs**: Ensure all URLs are properly formatted
3. **Check deployment**: Verify environment variables are set in deployment platform
4. **Test locally**: Test with production-like environment locally
5. **Check logs**: Review application logs for environment-related errors

## Best Practices

### 1. Environment Management
- **Use .env.local for development**: Keep development variables separate
- **Use .env.production for production**: Keep production variables separate
- **Never commit .env files**: Keep sensitive data out of version control
- **Document all variables**: Maintain clear documentation

### 2. Security Best Practices
- **Use strong secrets**: Generate cryptographically strong secrets
- **Rotate secrets regularly**: Update secrets periodically
- **Limit access**: Restrict access to environment variables
- **Monitor access**: Track access to sensitive variables

### 3. Deployment Best Practices
- **Validate before deployment**: Check environment variables before deployment
- **Test in staging**: Test with production-like environment
- **Monitor after deployment**: Monitor application after deployment
- **Have rollback plan**: Plan for quick rollback if needed

## Conclusion

Proper environment configuration is essential for the SEO optimizations to work correctly in production. The systematic approach ensures all required variables are properly set and validated, providing a solid foundation for optimal SEO performance.

---

**Last Updated**: December 2024  
**Version**: 1.0  
**Next Review**: January 2025 