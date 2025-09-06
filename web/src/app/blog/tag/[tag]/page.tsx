import { client } from '@/lib/sanity.client';
import { postsByTagPageQuery, postsByTagCountQuery, tagPathsQuery, tagQuery } from '@/lib/queries';
import PostGrid from '@/components/PostGrid';
import { notFound } from 'next/navigation';
import { getSiteUrl } from '@/lib/site';
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
  let tag: any = null
  try { tag = await client.fetch(tagQuery, { slug: params.tag }) } catch (e) {}
  const title = tag?.title || params.tag.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  const siteUrl = getSiteUrl();
  const ogImageUrl = new URL('/og', siteUrl)
  ogImageUrl.searchParams.set('title', `タグ: ${title}`)
  return {
    title: `タグ「${title}」の記事`,
    description: `タグ「${title}」が付いた記事一覧です。最新順に表示しています。`,
    alternates: { canonical: `${siteUrl}/blog/tag/${params.tag}` },
    robots: { index: true, follow: true },
    openGraph: {
      type: 'website',
      url: `${siteUrl}/blog/tag/${params.tag}`,
      title: `タグ「${title}」の記事`,
      description: `タグ「${title}」が付いた記事一覧です。`,
      images: [
        { url: ogImageUrl.toString(), width: 1200, height: 630, alt: `タグ: ${title}` },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `タグ「${title}」の記事`,
      description: `タグ「${title}」が付いた記事一覧です。`,
      images: [ogImageUrl.toString()],
    },
  };
}

// Generate static paths for all tags
export async function generateStaticParams(): Promise<{ tag: string }[]> {
  try {
    const paths = await client.fetch(tagPathsQuery)
    return paths.map((path: { params: { tag: string } }) => path.params)
  } catch (e) {
    return []
  }
}

export const revalidate = 60;

async function TagPage({ params }) {
  const { tag: tagSlug } = params;
  const pageSize = 12;
  const currentPage = 1;
  let tag: any = null
  let posts: Post[] = []
  let total: number = 0
  try {
    const result = await Promise.all([
      client.fetch(tagQuery, { slug: tagSlug }),
      client.fetch(postsByTagPageQuery, { tag: tagSlug, start: 0, end: pageSize }, { next: { tags: ['posts'] } }),
      client.fetch(postsByTagCountQuery, { tag: tagSlug }, { next: { tags: ['posts'] } }),
    ])
    tag = result[0]
    posts = result[1] || []
    total = (result[2] as number) || 0
  } catch (e) {}

  if (!tag && process.env.OFFLINE_BUILD === '1' && tagSlug === 'sample-ci') {
    tag = { title: 'Sample Tag', slug: { current: 'sample-ci' } }
    posts = []
    total = 0
  }

  if (!tag) {
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
        name: `Posts tagged: ${tag.title}`,
        item: `${siteUrl}/blog/tag/${tag.slug.current}`,
      },
    ],
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <Breadcrumbs items={[
        { name: 'ホーム', href: '/' },
        { name: 'ブログ', href: '/blog' },
        { name: `タグ: ${tag.title}` },
      ]} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <h1 className="text-3xl font-bold tracking-tight text-gray-100 sm:text-4xl mb-8">
        タグ: {tag.title}
      </h1>
      <div className="mb-6 flex items-center gap-3 text-sm">
        <a href="/blog" className="underline">すべての記事</a>
        <span className="text-gray-500">/</span>
        <a href={`/blog?tag=${encodeURIComponent(tag.slug.current)}`} className="underline">このタグで絞り込み</a>
        <span className="text-gray-500">/</span>
        <a href={'/search?q=' + encodeURIComponent(tag.title)} className="underline">「{tag.title}」を検索</a>
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
          <Pagination currentPage={currentPage} totalPages={Math.max(1, Math.ceil((total as number)/pageSize))} basePath={`/blog/tag/${tag.slug.current}`} />
        </>
      ) : (
        <p>このタグには記事がありません。<a className="underline" href="/blog">すべての記事</a>、<a className="underline" href={`/blog?tag=${encodeURIComponent(tag.slug.current)}`}>タグで絞り込み</a>、または<a className="underline" href={'/search?q=' + encodeURIComponent(tag.title)}>検索</a>をお試しください。</p>
      )}
    </main>
  );
}

export default TagPage;
