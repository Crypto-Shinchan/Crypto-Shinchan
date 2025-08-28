import { client } from '@/lib/sanity.client'
import { postsPageQuery, postsCountQuery } from '@/lib/queries'
import Layout from '@/components/Layout'
import PostGrid from '@/components/PostGrid'
import Pagination from '@/components/Pagination'

export default async function Page() {
  const pageSize = 12
  const currentPage = 1
  const [posts, total] = await Promise.all([
    client.fetch(postsPageQuery, { start: 0, end: pageSize }, { next: { tags: ['posts'] } }),
    client.fetch(postsCountQuery, {}, { next: { tags: ['posts'] } }),
  ])
  const totalPages = Math.max(1, Math.ceil((total as number) / pageSize))

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
