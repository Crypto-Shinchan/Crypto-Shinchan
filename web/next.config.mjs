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
  webpack: (config) => {
    // Force a single instance of react/react-dom/styled-jsx during SSR/export
    try {
      config.resolve.alias = {
        ...(config.resolve.alias || {}),
        react: require.resolve('react'),
        'react-dom': require.resolve('react-dom'),
        'styled-jsx': require.resolve('styled-jsx'),
        'react/jsx-runtime': require.resolve('react/jsx-runtime'),
        'react/jsx-dev-runtime': require.resolve('react/jsx-dev-runtime'),
      }
    } catch {}
    // Ensure module resolution checks web and repo root node_modules
    const nmWeb = path.join(__dirname, 'node_modules')
    const nmRoot = path.join(__dirname, '..', 'node_modules')
    config.resolve.modules = Array.from(new Set([nmWeb, nmRoot, ...(config.resolve.modules || ['node_modules'])]))
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
};
export default nextConfig;
