import { client } from '@/lib/sanity.client';
import { postsQuery } from '@/lib/queries';
import PostGrid from '@/components/PostGrid';

// Define the type for a single post, matching the query result
interface Post {
  _id: string;
  title: string;
  slug: { current: string };
  coverImage?: any;
  excerpt?: string;
  publishedAt: string;
}

// Revalidate the page every 60 seconds
export const revalidate = 60;

async function BlogPage() {
  const posts: Post[] = await client.fetch(postsQuery);

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl mb-8">
        All Posts
      </h1>
      
      {posts && posts.length > 0 ? (
        <PostGrid posts={posts} />
      ) : (
        <p>No posts to show.</p>
      )}
    </main>
  );
}

export default BlogPage;