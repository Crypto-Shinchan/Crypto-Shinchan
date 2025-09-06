// web/next.config.mjs
import path from 'path'
import { fileURLToPath } from 'url'
import { createRequire } from 'module'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const require = createRequire(import.meta.url)

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.sanity.io' },
    ],
  },
  experimental: {
    // Allow Next to trace files starting from the monorepo root
    outputFileTracingRoot: path.join(__dirname, '..'),
  },
  // Ensure alias '@' resolves to './src' in all environments (Vercel included)
  webpack: (config) => {
    config.resolve = config.resolve || {}
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@': path.join(__dirname, 'src'),
    }
    return config
  },
  async redirects() {
    return [
      // RSS/Feed
      { source: '/feed', destination: '/rss', permanent: true },
      { source: '/index.xml', destination: '/sitemap.xml', permanent: true },

      // WordPress-like taxonomy paths
      { source: '/category/:category*', destination: '/blog/category/:category*', permanent: true },
      { source: '/tag/:tag*', destination: '/blog/tag/:tag*', permanent: true },

      // WordPress-like dated permalink to post slug
      { source: '/blog/:year(\\d{4})/:month(\\d{2})/:day(\\d{2})/:slug', destination: '/blog/:slug', permanent: true },
      { source: '/:year(\\d{4})/:month(\\d{2})/:day(\\d{2})/:slug', destination: '/blog/:slug', permanent: true },
    ];
  },
  async headers() {
    const csp = [
      "default-src 'self'",
      "script-src 'self' https://www.googletagmanager.com https://www.google-analytics.com 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https:",
      "connect-src 'self' https://cdn.sanity.io https://www.google-analytics.com",
      "font-src 'self' data:",
      "frame-src 'self'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; ')
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Content-Security-Policy-Report-Only', value: csp },
        ],
      },
    ]
  },
};
export default nextConfig;
