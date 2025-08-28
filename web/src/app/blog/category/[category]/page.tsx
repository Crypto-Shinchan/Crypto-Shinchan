import { client } from '@/lib/sanity.client';
import { postsByCategoryPageQuery, postsByCategoryCountQuery, categoryPathsQuery, categoryQuery } from '@/lib/queries';
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
  const category = await client.fetch(categoryQuery, { slug: params.category });
  const title = category?.title || params.category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';
  return {
    title: `Posts in category: ${title}`,
    alternates: { canonical: `${siteUrl}/blog/category/${params.category}` },
    robots: { index: true, follow: true },
  };
}

// Generate static paths for all categories
export async function generateStaticParams(): Promise<{ category: string }[]> {
  const paths = await client.fetch(categoryPathsQuery);
  return paths.map((path: { params: { category: string } }) => path.params);
}

export const revalidate = 60;

async function CategoryPage({ params }) {
  const { category: categorySlug } = params;
  const pageSize = 12;
  const currentPage = 1;

  const [category, posts, total] = await Promise.all([
    client.fetch(categoryQuery, { slug: categorySlug }),
    client.fetch(postsByCategoryPageQuery, { category: categorySlug, start: 0, end: pageSize }, { next: { tags: ['posts'] } }),
    client.fetch(postsByCategoryCountQuery, { category: categorySlug }, { next: { tags: ['posts'] } }),
  ]);

  if (!category) {
    notFound();
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://your-domain.com';

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
        { name: 'Home', href: '/' },
        { name: 'Blog', href: '/blog' },
        { name: `Category: ${category.title}` },
      ]} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <h1 className="text-3xl font-bold tracking-tight text-gray-100 sm:text-4xl mb-8">
        Category: {category.title}
      </h1>
      
      {posts && posts.length > 0 ? (
        <>
          <PostGrid posts={posts} />
          <Pagination currentPage={currentPage} totalPages={Math.max(1, Math.ceil((total as number)/pageSize))} basePath={`/blog/category/${category.slug.current}`} />
        </>
      ) : (
        <p>No posts found in this category.</p>
      )}
    </main>
  );
}

export default CategoryPage;
