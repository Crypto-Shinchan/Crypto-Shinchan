// web/next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
