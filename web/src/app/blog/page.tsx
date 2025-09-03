import { client } from '@/lib/sanity.client'
import { postsPageQuery, postsCountQuery, categoriesAllQuery, tagsAllQuery, postsFilteredPageQuery, postsFilteredCountQuery } from '@/lib/queries'
import Layout from '@/components/Layout'
import PostGrid from '@/components/PostGrid'
import Pagination from '@/components/Pagination'
import FilterBar from '@/components/FilterBar'
import ActiveFilters from '@/components/ActiveFilters'

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
        <h1 className="text-3xl font-bold tracking-tight text-gray-100 sm:text-4xl mb-6">すべての記事</h1>
        <ActiveFilters />
        <FilterBar categories={categories} tags={tags} />
        {posts?.length ? (
          <>
            <PostGrid posts={posts} />
            <Pagination currentPage={currentPage} totalPages={totalPages} queryString={queryString} />
          </>
        ) : (
          <p className="text-gray-300">
            記事が見つかりませんでした。フィルターをクリアするか、
            <a className="underline" href="/search">検索</a>をご利用ください。
          </p>
        )}
      </section>
    </Layout>
  )
}
