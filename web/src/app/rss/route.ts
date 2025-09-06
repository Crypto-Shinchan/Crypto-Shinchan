import { client } from '@/lib/sanity.client'
import { postsQuery, globalSettingsQuery } from '@/lib/queries'
import { getSiteUrl } from '@/lib/site'
import { coverImageUrl } from '@/lib/urlFor'

export const revalidate = 600 // seconds

function cdata(input: string | undefined): string {
  if (!input) return ''
  return `<![CDATA[${input}]]>`
}

function escAttr(input: string | undefined): string {
  if (!input) return ''
  return String(input)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
}

async function getContentLength(url: string): Promise<number | null> {
  try {
    if (process.env.OFFLINE_BUILD === '1') return null
    const res = await fetch(url, { method: 'HEAD' })
    const len = res.headers.get('content-length')
    return len ? Number(len) : null
  } catch {
    return null
  }
}

export async function GET() {
  let posts: any[] = []
  let settings: any = null
  try {
    const res = await Promise.all([
      client.fetch(postsQuery, {}, { next: { tags: ['posts'] } }),
      client.fetch(globalSettingsQuery, {}, { next: { tags: ['layout'] } }),
    ])
    posts = res[0] || []
    settings = res[1] || null
  } catch (e) {
    // Network or CMS unavailable at build-time: serve minimal feed
    posts = []
    settings = null
  }

  const siteUrl = getSiteUrl()
  const siteName = settings?.siteTitle || 'Crypto Shinchan Blog'
  const siteDesc = settings?.siteDescription || 'Insights on crypto, markets, and technology.'

  const itemsArr = await Promise.all((posts || []).map(async (post: any) => {
    const link = `${siteUrl}/blog/${post.slug?.current}`
    const pubDate = post.publishedAt ? new Date(post.publishedAt).toUTCString() : new Date().toUTCString()
    const title = post.title || ''
    const desc = post.excerpt || ''
    const imageUrl = post?.coverImage ? coverImageUrl(post.coverImage, 1200, 675, 80) : ''
    const imageType = imageUrl.endsWith('.webp') ? 'image/webp' : 'image/jpeg'
    const alt = post?.coverImage?.alt || title
    const readMore = `<p><a href="${link}" rel="nofollow noopener">続きを読む</a></p>`
    const contentHtml = `${imageUrl ? `<p><img src="${imageUrl}" alt="${escAttr(alt)}" width="1200" height="675" /></p>` : ''}${desc ? `<p>${desc}</p>` : ''}${readMore}`
    const length = imageUrl ? await getContentLength(imageUrl) : null
    return `
      <item>
        <title>${cdata(title)}</title>
        <link>${link}</link>
        <guid isPermaLink="true">${link}</guid>
        <pubDate>${pubDate}</pubDate>
        <description>${cdata(desc)}</description>
        ${contentHtml ? `<content:encoded>${cdata(contentHtml)}</content:encoded>` : ''}
        ${imageUrl ? `<enclosure url="${imageUrl}" type="${imageType}"${length ? ` length="${length}"` : ''} />` : ''}
      </item>
    `
  }))

  const items = itemsArr.join('\n')

  const xml = `<?xml version=\"1.0\" encoding=\"UTF-8\"?>
<rss version=\"2.0\" xmlns:content=\"http://purl.org/rss/1.0/modules/content/\">
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
