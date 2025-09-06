import { client } from '@/lib/sanity.client';
import { postsByCategoryPageQuery, postsByCategoryCountQuery, categoryPathsQuery, categoryQuery } from '@/lib/queries';
import { getSiteUrl } from '@/lib/site';
import PostGrid from '@/components/PostGrid';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Pagination from '@/components/Pagination';
import Breadcrumbs from '@/components/Breadcrumbs';

// Define the type for a single post
interface Post {
  _id: string;
  title: string;
  slug: { current: string };
  coverImage?: any;
  excerpt?: string;
  publishedAt: string;
}

// Generate metadata
export async function generateMetadata({ params }): Promise<Metadata> {
  let category: any = null
  try { category = await client.fetch(categoryQuery, { slug: params.category }) } catch (e) {}
  const title = category?.title || params.category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  const siteUrl = getSiteUrl();
  const ogImageUrl = new URL('/og', siteUrl)
  ogImageUrl.searchParams.set('title', `カテゴリ: ${title}`)
  return {
    title: `カテゴリ「${title}」の記事`,
    description: `カテゴリ「${title}」に属する記事一覧です。最新順に表示しています。`,
    alternates: { canonical: `${siteUrl}/blog/category/${params.category}` },
    robots: { index: true, follow: true },
    openGraph: {
      type: 'website',
      url: `${siteUrl}/blog/category/${params.category}`,
      title: `カテゴリ「${title}」の記事`,
      description: `カテゴリ「${title}」に属する記事一覧です。`,
      images: [
        { url: ogImageUrl.toString(), width: 1200, height: 630, alt: `カテゴリ: ${title}` },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `カテゴリ「${title}」の記事`,
      description: `カテゴリ「${title}」に属する記事一覧です。`,
      images: [ogImageUrl.toString()],
    },
  };
}

// Generate static paths for all categories
export async function generateStaticParams(): Promise<{ category: string }[]> {
  try {
    const paths = await client.fetch(categoryPathsQuery)
    return paths.map((path: { params: { category: string } }) => path.params)
  } catch (e) {
    return []
  }
}

export const revalidate = 60;

async function CategoryPage({ params }) {
  const { category: categorySlug } = params;
  const pageSize = 12;
  const currentPage = 1;

  let category: any = null
  let posts: Post[] = []
  let total: number = 0
  try {
    const result = await Promise.all([
      client.fetch(categoryQuery, { slug: categorySlug }),
      client.fetch(postsByCategoryPageQuery, { category: categorySlug, start: 0, end: pageSize }, { next: { tags: ['posts'] } }),
      client.fetch(postsByCategoryCountQuery, { category: categorySlug }, { next: { tags: ['posts'] } }),
    ])
    category = result[0]
    posts = result[1] || []
    total = (result[2] as number) || 0
  } catch (e) {}

  if (!category && process.env.OFFLINE_BUILD === '1' && categorySlug === 'sample-ci') {
    category = { title: 'Sample Category', slug: { current: 'sample-ci' } }
    posts = []
    total = 0
  }

  if (!category) {
    notFound();
  }

  const siteUrl = getSiteUrl();

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: siteUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: `${siteUrl}/blog`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: category.title,
        item: `${siteUrl}/blog/category/${category.slug.current}`,
      },
    ],
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <Breadcrumbs items={[
        { name: 'ホーム', href: '/' },
        { name: 'ブログ', href: '/blog' },
        { name: `カテゴリ: ${category.title}` },
      ]} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl mb-8">
        カテゴリ: {category.title}
      </h1>
      <div className="mb-6 flex items-center gap-3 text-sm">
        <a href="/blog" className="underline">すべての記事</a>
        <span className="text-gray-500">/</span>
        <a href={`/blog?category=${encodeURIComponent(category.slug.current)}`} className="underline">このカテゴリで絞り込み</a>
        <span className="text-gray-500">/</span>
        <a href={'/search?q=' + encodeURIComponent(category.title)} className="underline">「{category.title}」を検索</a>
      </div>
      
      {posts && posts.length > 0 ? (
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
          <Pagination currentPage={currentPage} totalPages={Math.max(1, Math.ceil((total as number)/pageSize))} basePath={`/blog/category/${category.slug.current}`} />
        </>
      ) : (
        <p>このカテゴリには記事がありません。<a className="underline" href="/blog">すべての記事</a>、<a className="underline" href={`/blog?category=${encodeURIComponent(category.slug.current)}`}>カテゴリで絞り込み</a>、または<a className="underline" href={'/search?q=' + encodeURIComponent(category.title)}>検索</a>をお試しください。</p>
      )}
    </main>
  );
}

export default CategoryPage;
