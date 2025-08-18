import { client } from '@/lib/sanity.client';
import { postsByCategoryQuery, categoryPathsQuery } from '@/lib/queries';
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
  const title = params.category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
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
  const { category } = params;
  // TODO: Fetch category details to display a proper title instead of the slug
  const posts: Post[] = await client.fetch(postsByCategoryQuery, { category });

  if (!posts || posts.length === 0) {
    // It might be better to show a page with "No posts" than a 404
    // notFound();
  }
  
  const title = category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl mb-8">
        Category: {title}
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