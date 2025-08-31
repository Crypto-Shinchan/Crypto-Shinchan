/** @type {import('next-sitemap').IConfig} */
const rawSite = (process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com').trim()
const siteUrl = /^https?:\/\//.test(rawSite) ? rawSite : `https://${rawSite}`

module.exports = {
  siteUrl,
  // In monorepo CI, ensure next-sitemap reads the correct Next.js build dir
  sourceDir: 'web/.next',
  outDir: 'web/public',
  generateRobotsTxt: true,
  autoLastmod: true,
  exclude: ['/api/*', '/og', '/search'],
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
      { userAgent: '*', disallow: ['/api', '/search'] },
    ],
  },
  transform: async (config, path) => {
    let priority = 0.7
    let changefreq = 'weekly'

    if (path === '/') {
      priority = 1.0
      changefreq = 'daily'
    } else if (path.startsWith('/blog/tag/')) {
      priority = 0.6
      changefreq = 'weekly'
    } else if (path.startsWith('/blog/category/')) {
      priority = 0.6
      changefreq = 'weekly'
    } else if (path.startsWith('/blog/')) {
      priority = 0.8
      changefreq = 'daily'
    }

    return {
      loc: path,
      changefreq,
      priority,
      lastmod: new Date().toISOString(),
      alternateRefs: [],
    }
  },
}
