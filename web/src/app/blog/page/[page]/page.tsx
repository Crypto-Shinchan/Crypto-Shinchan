import { client } from '@/lib/sanity.client'
import { postsPageQuery, postsCountQuery } from '@/lib/queries'
import Layout from '@/components/Layout'
import PostGrid from '@/components/PostGrid'
import Pagination from '@/components/Pagination'
import type { Metadata } from 'next'

const PAGE_SIZE = 12

export async function generateStaticParams() {
  const total: number = await client.fetch(postsCountQuery, {}, { next: { tags: ['posts'] } })
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  return Array.from({ length: totalPages - 1 }, (_, i) => ({ page: String(i + 2) }))
}

export async function generateMetadata({ params }: { params: { page: string } }): Promise<Metadata> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'
  const pageNum = Number(params.page) || 1
  return {
    title: `All Posts - Page ${pageNum}`,
    alternates: {
      canonical: pageNum === 1 ? `${siteUrl}/blog` : `${siteUrl}/blog/page/${pageNum}`,
    },
    robots: { index: true, follow: true },
  }
}

export default async function Page({ params }: { params: { page: string } }) {
  const currentPage = Math.max(1, Number(params.page) || 1)
  const start = (currentPage - 1) * PAGE_SIZE
  const end = start + PAGE_SIZE

  const [posts, total] = await Promise.all([
    client.fetch(postsPageQuery, { start, end }, { next: { tags: ['posts'] } }),
    client.fetch(postsCountQuery, {}, { next: { tags: ['posts'] } }),
  ])
  const totalPages = Math.max(1, Math.ceil((total as number) / PAGE_SIZE))

  return (
    <Layout>
      <section className="py-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-100 sm:text-4xl mb-6">All Posts</h1>
        {posts?.length ? (
          <>
            <PostGrid posts={posts} />
            <Pagination currentPage={currentPage} totalPages={totalPages} />
          </>
        ) : (
          <p className="text-gray-300">No posts yet.</p>
        )}
      </section>
    </Layout>
  )
}

