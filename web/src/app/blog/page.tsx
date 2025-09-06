import { client } from '@/lib/sanity.client'
import { postsPageQuery, postsCountQuery, categoriesAllQuery, tagsAllQuery, postsFilteredPageQuery, postsFilteredCountQuery } from '@/lib/queries'
import Layout from '@/components/Layout'
import PostGrid from '@/components/PostGrid'
import Pagination from '@/components/Pagination'
import FilterBar from '@/components/FilterBar'
import ActiveFilters from '@/components/ActiveFilters'
import type { Metadata } from 'next'
import { getSiteUrl } from '@/lib/site'

export async function generateMetadata(): Promise<Metadata> {
  const siteUrl = getSiteUrl()
  const title = 'すべての記事'
  const description = '最新の記事一覧とカテゴリ・タグでの絞り込みができます。'
  const clamp = (t?: string) => {
    if (!t) return undefined
    const s = t.replace(/\s+/g, ' ').trim()
    return s.length > 160 ? s.slice(0,157) + '…' : s
  }
  const ogImageUrl = new URL('/og', siteUrl)
  ogImageUrl.searchParams.set('title', title)
  return {
    title,
    description: clamp(description),
    alternates: { canonical: `${siteUrl}/blog` },
    robots: { index: true, follow: true },
    openGraph: {
      type: 'website',
      url: `${siteUrl}/blog`,
      title,
      description,
      images: [
        { url: ogImageUrl.toString(), width: 1200, height: 630, alt: title },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl.toString()],
    },
    other: {
      'twitter:image:alt': title,
    },
  }
}

export default async function Page({ searchParams }: { searchParams?: { category?: string; tag?: string } }) {
  const pageSize = 12
  const currentPage = 1
  let posts: any[] = []
  let total: number = 0
  let categories: any[] = []
  let tags: any[] = []
  const category = (searchParams?.category || '').trim() || null
  const tag = (searchParams?.tag || '').trim() || null
  try {
    const result = await Promise.all([
      category || tag
        ? client.fetch(postsFilteredPageQuery as any, { start: 0, end: pageSize, category, tag } as any, { next: { tags: ['posts'] } })
        : client.fetch(postsPageQuery, { start: 0, end: pageSize }, { next: { tags: ['posts'] } }),
      category || tag
        ? client.fetch(postsFilteredCountQuery as any, { category, tag } as any, { next: { tags: ['posts'] } })
        : client.fetch(postsCountQuery, {}, { next: { tags: ['posts'] } }),
      client.fetch(categoriesAllQuery, {}, { next: { tags: ['posts'] } }),
      client.fetch(tagsAllQuery, {}, { next: { tags: ['posts'] } }),
    ])
    posts = result[0] || []
    total = (result[1] as number) || 0
    categories = result[2] || []
    tags = result[3] || []
  } catch (e) {
    // Graceful fallback: render empty state when CMS fetch fails
  }
  const totalPages = Math.max(1, Math.ceil((total as number) / pageSize))
  const qs = new URLSearchParams()
  if (category) qs.set('category', category)
  if (tag) qs.set('tag', tag)
  const queryString = qs.toString()

  return (
    <Layout>
      <section className="py-8">
        {/* BreadcrumbList JSON-LD (Home > Blog) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'ホーム', item: getSiteUrl() },
              { '@type': 'ListItem', position: 2, name: 'ブログ', item: `${getSiteUrl()}/blog` },
            ],
          }) }}
        />
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl mb-6">すべての記事</h1>
        <ActiveFilters />
        <FilterBar categories={categories} tags={tags} />
        {posts?.length ? (
          <>
            {/* ItemList JSON-LD for the listing page (SEO) */}
            <script
              type="application/ld+json"
              // Provide basic ItemList with post names and URLs
              dangerouslySetInnerHTML={{ __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'ItemList',
                itemListElement: posts.map((p, i) => ({
                  '@type': 'ListItem',
                  position: i + 1,
                  url: `${getSiteUrl()}/blog/${p.slug.current}`,
                  name: p.title,
                })),
              }) }}
            />
            <PostGrid posts={posts} />
            <Pagination currentPage={currentPage} totalPages={totalPages} queryString={queryString} />
          </>
        ) : (
          <p className="text-gray-700 dark:text-gray-300">
            記事が見つかりませんでした。フィルターをクリアするか、
            <a className="underline" href="/search">検索</a>をご利用ください。
          </p>
        )}
      </section>
    </Layout>
  )
}
