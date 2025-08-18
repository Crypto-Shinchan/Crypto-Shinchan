/** @type {import('next').NextConfig} */
const nextConfig = {
  // Add your Next.js configuration here
  async redirects() {
    return [
      {
        source: '/:year(\d{4})/:month(\d{2})/:slug/',
        destination: '/blog/:slug',
        permanent: true, // 301 redirect
      },
      // Add more specific redirects if needed
    ];
  },
};

export default nextConfig;