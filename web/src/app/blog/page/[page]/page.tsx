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
  const ogImageUrl = new URL('/og', siteUrl)
  ogImageUrl.searchParams.set('title', title)
  return {
    title,
    alternates: {
      canonical: pageNum === 1 ? `${siteUrl}/blog` : `${siteUrl}/blog/page/${pageNum}`,
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
        <h1 className="text-3xl font-bold tracking-tight text-gray-100 sm:text-4xl mb-6">すべての記事</h1>
        {posts?.length ? (
          <>
            <PostGrid posts={posts} />
            <Pagination currentPage={currentPage} totalPages={totalPages} />
          </>
        ) : (
          <p className="text-gray-700 dark:text-gray-300">No posts yet.</p>
        )}
      </section>
    </Layout>
  )
}
