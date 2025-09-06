import { client } from '@/lib/sanity.client'
import { postsPageQuery, postsCountQuery } from '@/lib/queries'
import Layout from '@/components/Layout'
import PostGrid from '@/components/PostGrid'
import Pagination from '@/components/Pagination'
import type { Metadata } from 'next'
import { getSiteUrl } from '@/lib/site'

const PAGE_SIZE = 12

export async function generateStaticParams() {
  try {
    const total: number = await client.fetch(postsCountQuery, {}, { next: { tags: ['posts'] } })
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
    return Array.from({ length: totalPages - 1 }, (_, i) => ({ page: String(i + 2) }))
  } catch (e) {
    return []
  }
}

export async function generateMetadata({ params }: { params: { page: string } }): Promise<Metadata> {
  const siteUrl = getSiteUrl()
  const pageNum = Number(params.page) || 1
  const title = `すべての記事 - ページ ${pageNum}`
  const description = `すべての記事のページ ${pageNum} の記事一覧ページです。`
  const clamp = (t?: string) => {
    if (!t) return undefined
    const s = t.replace(/\s+/g, ' ').trim()
    return s.length > 160 ? s.slice(0,157) + '…' : s
  }
  const ogImageUrl = new URL('/og', siteUrl)
  ogImageUrl.searchParams.set('title', title)
  let totalPages = 1
  try {
    const total: number = await client.fetch(postsCountQuery, {}, { next: { tags: ['posts'] } })
    totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  } catch {}
  return {
    title,
    description: clamp(description),
    alternates: {
      canonical: pageNum === 1 ? `${siteUrl}/blog` : `${siteUrl}/blog/page/${pageNum}`,
      ...(pageNum > 1 ? { prev: pageNum === 2 ? `${siteUrl}/blog` : `${siteUrl}/blog/page/${pageNum - 1}` } : {}),
      ...(pageNum < totalPages ? { next: `${siteUrl}/blog/page/${pageNum + 1}` } : {}),
    },
    robots: { index: true, follow: true },
    openGraph: {
      type: 'website',
      url: pageNum === 1 ? `${siteUrl}/blog` : `${siteUrl}/blog/page/${pageNum}`,
      title,
      images: [
        { url: ogImageUrl.toString(), width: 1200, height: 630, alt: title },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      images: [ogImageUrl.toString()],
    },
    other: {
      'twitter:image:alt': title,
    },
  }
}

export default async function Page({ params }: { params: { page: string } }) {
  const currentPage = Math.max(1, Number(params.page) || 1)
  const start = (currentPage - 1) * PAGE_SIZE
  const end = start + PAGE_SIZE

  let posts: any[] = []
  let total: number = 0
  try {
    const res = await Promise.all([
      client.fetch(postsPageQuery, { start, end }, { next: { tags: ['posts'] } }),
      client.fetch(postsCountQuery, {}, { next: { tags: ['posts'] } }),
    ])
    posts = res[0] || []
    total = (res[1] as number) || 0
  } catch (e) {}
  const totalPages = Math.max(1, Math.ceil((total as number) / PAGE_SIZE))

  return (
    <Layout>
      <section className="py-8">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            '@context': 'https://schema.org',
            inLanguage: 'ja-JP',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'ホーム', item: getSiteUrl() },
              { '@type': 'ListItem', position: 2, name: 'ブログ', item: `${getSiteUrl()}/blog` },
              { '@type': 'ListItem', position: 3, name: `ページ ${currentPage}`, item: `${getSiteUrl()}/blog/page/${currentPage}` },
            ],
          }) }}
        />
        <h1 className="text-3xl font-bold tracking-tight text-gray-100 sm:text-4xl mb-6">すべての記事</h1>
        {posts?.length ? (
          <>
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify({
                '@context': 'https://schema.org',
                inLanguage: 'ja-JP',
                '@type': 'ItemList',
                itemListElement: posts.map((p: any, i: number) => ({
                  '@type': 'ListItem',
                  position: i + 1,
                  url: `${getSiteUrl()}/blog/${p.slug.current}`,
                  name: p.title,
                })),
              }) }}
            />
            <PostGrid posts={posts} />
            <Pagination currentPage={currentPage} totalPages={totalPages} />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center text-gray-700 dark:text-gray-300">
            <img src="/file.svg" alt="記事がありません" className="w-12 h-12 mb-4 opacity-80" />
            <p>該当する記事がありません。<a className="underline" href="/blog">すべての記事</a>に戻るか、<a className="underline" href="/search">検索</a>をお試しください。</p>
          </div>
        )}
      </section>
    </Layout>
  )
}
