import { client } from '@/lib/sanity.client'
import { postsByTagPageQuery, postsByTagCountQuery, tagPathsQuery, tagQuery } from '@/lib/queries'
import PostGrid from '@/components/PostGrid'
import Pagination from '@/components/Pagination'
import Breadcrumbs from '@/components/Breadcrumbs'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

const PAGE_SIZE = 12

export async function generateStaticParams() {
  try {
    const tags: { params: { tag: string } }[] = await client.fetch(tagPathsQuery)
    const params: { tag: string; page: string }[] = []
    for (const t of tags) {
      const total: number = await client.fetch(postsByTagCountQuery, { tag: t.params.tag })
      const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
      for (let p = 2; p <= totalPages; p++) params.push({ tag: t.params.tag, page: String(p) })
    }
    return params
  } catch (e) {
    return []
  }
}

export async function generateMetadata({ params }: { params: { tag: string; page: string } }): Promise<Metadata> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'
  let tag: any = null
  try { tag = await client.fetch(tagQuery, { slug: params.tag }) } catch (e) {}
  const title = tag?.title || params.tag
  const pageNum = Number(params.page) || 1
  return {
    title: `Tag: ${title} - Page ${pageNum}`,
    alternates: { canonical: `${siteUrl}/blog/tag/${params.tag}/page/${pageNum}` },
    robots: { index: true, follow: true },
  }
}

export default async function Page({ params }: { params: { tag: string; page: string } }) {
  const currentPage = Math.max(1, Number(params.page) || 1)
  const start = (currentPage - 1) * PAGE_SIZE
  const end = start + PAGE_SIZE

  let tag: any = null
  let posts: any[] = []
  let total: number = 0
  try {
    const res = await Promise.all([
      client.fetch(tagQuery, { slug: params.tag }),
      client.fetch(postsByTagPageQuery, { tag: params.tag, start, end }, { next: { tags: ['posts'] } }),
      client.fetch(postsByTagCountQuery, { tag: params.tag }, { next: { tags: ['posts'] } }),
    ])
    tag = res[0]
    posts = res[1] || []
    total = (res[2] as number) || 0
  } catch (e) {}

  if (!tag) notFound()
  const totalPages = Math.max(1, Math.ceil((total as number) / PAGE_SIZE))

  return (
    <main className="container mx-auto px-4 py-8">
      <Breadcrumbs items={[
        { name: 'Home', href: '/' },
        { name: 'Blog', href: '/blog' },
        { name: `Tag: ${tag.title}` },
      ]} />
      <h1 className="text-3xl font-bold tracking-tight text-gray-100 sm:text-4xl mb-8">
        Posts tagged: {tag.title}
      </h1>
      {posts?.length ? (
        <>
          <PostGrid posts={posts} />
          <Pagination currentPage={currentPage} totalPages={totalPages} basePath={`/blog/tag/${params.tag}`} />
        </>
      ) : (
        <p>No posts found with this tag.</p>
      )}
    </main>
  )
}
