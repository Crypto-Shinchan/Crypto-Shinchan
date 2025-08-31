import { client } from '@/lib/sanity.client'
import { postsQuery, globalSettingsQuery } from '@/lib/queries'
import { getSiteUrl } from '@/lib/site'

export const revalidate = 600 // seconds

function cdata(input: string | undefined): string {
  if (!input) return ''
  return `<![CDATA[${input}]]>`
}

export async function GET() {
  const [posts, settings] = await Promise.all([
    client.fetch(postsQuery, {}, { next: { tags: ['posts'] } }),
    client.fetch(globalSettingsQuery, {}, { next: { tags: ['layout'] } }),
  ])

  const siteUrl = getSiteUrl()
  const siteName = settings?.siteTitle || 'Crypto Shinchan Blog'
  const siteDesc = settings?.siteDescription || 'Insights on crypto, markets, and technology.'

  const items = (posts || []).map((post: any) => {
    const link = `${siteUrl}/blog/${post.slug?.current}`
    const pubDate = post.publishedAt ? new Date(post.publishedAt).toUTCString() : new Date().toUTCString()
    const title = post.title || ''
    const desc = post.excerpt || ''
    return `
      <item>
        <title>${cdata(title)}</title>
        <link>${link}</link>
        <guid isPermaLink="true">${link}</guid>
        <pubDate>${pubDate}</pubDate>
        <description>${cdata(desc)}</description>
      </item>
    `
  }).join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${cdata(siteName)}</title>
    <link>${siteUrl}</link>
    <description>${cdata(siteDesc)}</description>
    <language>ja</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=86400',
    },
  })
}
