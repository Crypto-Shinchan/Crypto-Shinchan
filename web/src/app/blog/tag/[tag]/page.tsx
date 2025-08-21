import { client } from '@/lib/sanity.client';
import { postsByTagQuery, tagPathsQuery, tagQuery } from '@/lib/queries';
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
  const tag = await client.fetch(tagQuery, { slug: params.tag });
  const title = tag?.title || params.tag.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
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
  const { tag: tagSlug } = params;

  const [tag, posts] = await Promise.all([
    client.fetch(tagQuery, { slug: tagSlug }),
    client.fetch(postsByTagQuery, { tag: tagSlug })
  ]);

  if (!tag) {
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
        name: `Posts tagged: ${tag.title}`,
        item: `${siteUrl}/blog/tag/${tag.slug.current}`,
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
        Posts tagged: {tag.title}
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