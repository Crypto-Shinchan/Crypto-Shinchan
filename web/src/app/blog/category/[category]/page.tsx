import { client } from '@/lib/sanity.client';
import { postsByCategoryQuery, categoryPathsQuery, categoryQuery } from '@/lib/queries';
import PostGrid from '@/components/PostGrid';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

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
  return {
    title: `Posts in category: ${title}`,
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

  const [category, posts] = await Promise.all([
    client.fetch(categoryQuery, { slug: categorySlug }),
    client.fetch(postsByCategoryQuery, { category: categorySlug })
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <h1 className="text-3xl font-bold tracking-tight text-gray-100 sm:text-4xl mb-8">
        Category: {category.title}
      </h1>
      
      {posts && posts.length > 0 ? (
        <PostGrid posts={posts} />
      ) : (
        <p>No posts found in this category.</p>
      )}
    </main>
  );
}

export default CategoryPage;