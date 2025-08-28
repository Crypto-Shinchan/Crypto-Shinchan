import { client } from '@/lib/sanity.client'
import { postsByCategoryPageQuery, postsByCategoryCountQuery, categoryPathsQuery, categoryQuery } from '@/lib/queries'
import PostGrid from '@/components/PostGrid'
import Pagination from '@/components/Pagination'
import Breadcrumbs from '@/components/Breadcrumbs'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

const PAGE_SIZE = 12

export async function generateStaticParams() {
  const categories: { params: { category: string } }[] = await client.fetch(categoryPathsQuery)
  const params: { category: string; page: string }[] = []
  for (const c of categories) {
    const total: number = await client.fetch(postsByCategoryCountQuery, { category: c.params.category })
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
    for (let p = 2; p <= totalPages; p++) params.push({ category: c.params.category, page: String(p) })
  }
  return params
}

export async function generateMetadata({ params }: { params: { category: string; page: string } }): Promise<Metadata> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'
  const category = await client.fetch(categoryQuery, { slug: params.category })
  const title = category?.title || params.category
  const pageNum = Number(params.page) || 1
  return {
    title: `Category: ${title} - Page ${pageNum}`,
    alternates: { canonical: `${siteUrl}/blog/category/${params.category}/page/${pageNum}` },
    robots: { index: true, follow: true },
  }
}

export default async function Page({ params }: { params: { category: string; page: string } }) {
  const currentPage = Math.max(1, Number(params.page) || 1)
  const start = (currentPage - 1) * PAGE_SIZE
  const end = start + PAGE_SIZE

  const [category, posts, total] = await Promise.all([
    client.fetch(categoryQuery, { slug: params.category }),
    client.fetch(postsByCategoryPageQuery, { category: params.category, start, end }, { next: { tags: ['posts'] } }),
    client.fetch(postsByCategoryCountQuery, { category: params.category }, { next: { tags: ['posts'] } }),
  ])

  if (!category) notFound()
  const totalPages = Math.max(1, Math.ceil((total as number) / PAGE_SIZE))

  return (
    <main className="container mx-auto px-4 py-8">
      <Breadcrumbs items={[
        { name: 'Home', href: '/' },
        { name: 'Blog', href: '/blog' },
        { name: `Category: ${category.title}` },
      ]} />
      <h1 className="text-3xl font-bold tracking-tight text-gray-100 sm:text-4xl mb-8">
        Category: {category.title}
      </h1>
      {posts?.length ? (
        <>
          <PostGrid posts={posts} />
          <Pagination currentPage={currentPage} totalPages={totalPages} basePath={`/blog/category/${params.category}`} />
        </>
      ) : (
        <p>No posts found in this category.</p>
      )}
    </main>
  )
}
