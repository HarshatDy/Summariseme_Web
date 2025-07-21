/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  trailingSlash: false, // Ensure consistent trailing slash behavior
  images: {
    domains: ['69.62.84.22', '127.0.0.1', 'your-production-domain.com', 'lh3.googleusercontent.com', 'storage.googleapis.com'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '69.62.84.22',
        port: '3001',
        pathname: '/**',
      },
    ],
  },
}

module.exports = nextConfig
