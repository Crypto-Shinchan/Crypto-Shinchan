import { client } from '@/lib/sanity.client';
import { postsByTagQuery, tagPathsQuery } from '@/lib/queries';
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
  const title = params.tag.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  return {
    title: `Posts tagged: ${title}`,
  };
}

// Generate static paths for all tags
export async function generateStaticParams(): Promise<{ tag: string }[]> {
  const paths = await client.fetch(tagPathsQuery);
  return paths.map((path: { params: { tag: string } }) => path.params);
}

export const revalidate = 60;

async function TagPage({ params }) {
  const { tag } = params;
  // TODO: Fetch tag details to display a proper title instead of the slug
  const posts: Post[] = await client.fetch(postsByTagQuery, { tag });

  if (!posts || posts.length === 0) {
    // notFound();
  }
  
  const title = tag.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl mb-8">
        Posts tagged: {title}
      </h1>
      
      {posts && posts.length > 0 ? (
        <PostGrid posts={posts} />
      ) : (
        <p>No posts found with this tag.</p>
      )}
    </main>
  );
}

export default TagPage;