// web/next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // basePath や output は当面使わない
  async redirects() {
    return [
      {
        source: '/:year(\d{4})/:month(\d{2})/:slug',
        destination: '/blog/:slug',
        permanent: true,
      },
    ]
  },
};
export default nextConfig;
