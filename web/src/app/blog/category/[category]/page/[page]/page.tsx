import { client } from '@/lib/sanity.client'
import { postsByCategoryPageQuery, postsByCategoryCountQuery, categoryPathsQuery, categoryQuery } from '@/lib/queries'
import { getSiteUrl } from '@/lib/site'
import PostGrid from '@/components/PostGrid'
import Pagination from '@/components/Pagination'
import Breadcrumbs from '@/components/Breadcrumbs'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

const PAGE_SIZE = 12

export async function generateStaticParams() {
  try {
    const categories: { params: { category: string } }[] = await client.fetch(categoryPathsQuery)
    const params: { category: string; page: string }[] = []
    for (const c of categories) {
      const total: number = await client.fetch(postsByCategoryCountQuery, { category: c.params.category })
      const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
      for (let p = 2; p <= totalPages; p++) params.push({ category: c.params.category, page: String(p) })
    }
    return params
  } catch (e) {
    return []
  }
}

export async function generateMetadata({ params }: { params: { category: string; page: string } }): Promise<Metadata> {
  const siteUrl = getSiteUrl()
  let category: any = null
  try { category = await client.fetch(categoryQuery, { slug: params.category }) } catch (e) {}
  const title = category?.title || params.category
  const pageNum = Number(params.page) || 1
  const ogImageUrl = new URL('/og', siteUrl)
  ogImageUrl.searchParams.set('title', `カテゴリ: ${title} - ページ ${pageNum}`)
  return {
    title: `カテゴリ「${title}」の記事 - ページ ${pageNum}`,
    description: `カテゴリ「${title}」に属する記事の ${pageNum} ページ目です。`,
    alternates: { canonical: `${siteUrl}/blog/category/${params.category}/page/${pageNum}` },
    robots: { index: true, follow: true },
    openGraph: {
      type: 'website',
      url: `${siteUrl}/blog/category/${params.category}/page/${pageNum}`,
      title: `カテゴリ「${title}」の記事 - ページ ${pageNum}`,
      description: `カテゴリ「${title}」に属する記事の ${pageNum} ページ目です。`,
      images: [
        { url: ogImageUrl.toString(), width: 1200, height: 630, alt: `カテゴリ: ${title} - ページ ${pageNum}` },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `カテゴリ「${title}」の記事 - ページ ${pageNum}`,
      description: `カテゴリ「${title}」に属する記事の ${pageNum} ページ目です。`,
      images: [ogImageUrl.toString()],
    },
  }
}

export default async function Page({ params }: { params: { category: string; page: string } }) {
  const currentPage = Math.max(1, Number(params.page) || 1)
  const start = (currentPage - 1) * PAGE_SIZE
  const end = start + PAGE_SIZE

  let category: any = null
  let posts: any[] = []
  let total: number = 0
  try {
    const res = await Promise.all([
      client.fetch(categoryQuery, { slug: params.category }),
      client.fetch(postsByCategoryPageQuery, { category: params.category, start, end }, { next: { tags: ['posts'] } }),
      client.fetch(postsByCategoryCountQuery, { category: params.category }, { next: { tags: ['posts'] } }),
    ])
    category = res[0]
    posts = res[1] || []
    total = (res[2] as number) || 0
  } catch (e) {}

  if (!category) notFound()
  const totalPages = Math.max(1, Math.ceil((total as number) / PAGE_SIZE))

  return (
    <main className="container mx-auto px-4 py-8">
      <Breadcrumbs items={[
        { name: 'ホーム', href: '/' },
        { name: 'ブログ', href: '/blog' },
        { name: `カテゴリ: ${category.title}` },
      ]} />
      <h1 className="text-3xl font-bold tracking-tight text-gray-100 sm:text-4xl mb-8">
        カテゴリ: {category.title}
      </h1>
      {posts?.length ? (
        <>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify({
              '@context': 'https://schema.org',
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
          <Pagination currentPage={currentPage} totalPages={totalPages} basePath={`/blog/category/${params.category}`} />
        </>
      ) : (
        <p>No posts found in this category.</p>
      )}
    </main>
  )
}
