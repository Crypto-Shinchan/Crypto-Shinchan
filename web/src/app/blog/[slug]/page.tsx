import { client } from '@/lib/sanity.client';
import { postQuery, postPathsQuery, relatedPostsQuery, globalSettingsQuery } from '@/lib/queries';
import { extractHeadings } from '@/lib/portableText';
import PostBody from '@/components/PostBody';
import Toc from '@/components/Toc';
import ShareButtons from '@/components/ShareButtons';
import RelatedPosts from '@/components/RelatedPosts';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import urlFor from '@/lib/urlFor';
import Image from 'next/image';

// Custom type for page props to avoid PageProps import issues
type PageComponentProps<P = object, S = object> = {
  params: P;
  searchParams: S;
};

// Define the type for a single post, matching the query result
interface Post {
  title: string;
  slug: { current: string };
  coverImage?: any;
  body: any; // Portable Text
  publishedAt: string;
  updatedAt?: string; // Add this line
  author: { name: string; avatar: any; bio: string };
  categories: { title: string; slug: { current: string } }[];
  tags: { title: string; slug: { current: string } }[];
  excerpt?: string;
}

// Generate metadata for the page
export async function generateMetadata({ params }): Promise<Metadata> {
  const post: Post = await client.fetch(postQuery, { slug: params.slug }, {
    next: { tags: [`post:${params.slug}`] },
  });
  if (!post) {
    return {};
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://your-domain.com';
  const ogImageUrl = new URL(`${siteUrl}/og`);
  ogImageUrl.searchParams.set('title', post.title);
  ogImageUrl.searchParams.set('author', post.author?.name || '');
  ogImageUrl.searchParams.set('date', new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));


  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: new Date(post.publishedAt).toISOString(),
      url: `${siteUrl}/blog/${post.slug.current}`,
      images: [
        {
          url: ogImageUrl.toString(),
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
  };
}

// Generate static paths for all posts
export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const paths = await client.fetch(postPathsQuery);
  return paths.map((path: { params: { slug: string } }) => path.params);
}

export const revalidate = 60; // Revalidate this page every 60 seconds

async function PostPage({ params }) {
  const [post, settings] = await Promise.all([
    client.fetch(postQuery, { slug: params.slug }, {
      next: { tags: [`post:${params.slug}`] },
    }),
    client.fetch(globalSettingsQuery, {}, {
      next: { tags: ['layout'] },
    })
  ]);

  if (!post) {
    notFound();
  }

  const categorySlugs = post.categories?.map(c => c.slug.current) || [];
  const relatedPosts = await client.fetch(relatedPostsQuery, {
    slug: params.slug,
    categorySlugs,
  }, {
    next: { tags: ['posts'] },
  });

  const headings = extractHeadings(post.body);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://your-domain.com';
  const siteTitle = settings?.siteTitle || 'Your Blog Name';
  const coverImageUrl = post.coverImage ? urlFor(post.coverImage).width(1200).height(630).url() : '';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: coverImageUrl,
    datePublished: new Date(post.publishedAt).toISOString(),
    dateModified: new Date(post.updatedAt || post.publishedAt).toISOString(),
    author: {
      '@type': 'Person',
      name: post.author.name,
    },
    publisher: {
      '@type': 'Organization',
      name: siteTitle,
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo.png`, // TODO: Update with your logo path
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteUrl}/blog/${post.slug.current}`,
    },
  };

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
      ...(post.categories?.[0] ? [{
        '@type': 'ListItem',
        position: 3,
        name: post.categories[0].title,
        item: `${siteUrl}/blog/category/${post.categories[0].slug.current}`,
      }] : []),
      {
        '@type': 'ListItem',
        position: post.categories?.[0] ? 4 : 3,
        name: post.title,
        item: `${siteUrl}/blog/${post.slug.current}`,
      },
    ],
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <article>
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-100 sm:text-4xl md:text-5xl">
            {post.title}
          </h1>
          <p className="mt-4 text-lg text-gray-400">
            {new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </header>

        {coverImageUrl && (
          <Image
            src={coverImageUrl}
            alt={post.coverImage.alt || 'Cover Image'}
            width={1200}
            height={630}
            className="w-full rounded-lg mb-8"
            priority
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <PostBody body={post.body} />
          </div>
          <aside className="lg:col-span-1">
            <div className="sticky top-24">
              <Toc headings={headings} />
              <div className="mt-6">
                <ShareButtons url={`${siteUrl}/blog/${post.slug.current}`} title={post.title} />
              </div>
            </div>
          </aside>
        </div>
      </article>

      <footer className="mt-12">
        <RelatedPosts posts={relatedPosts} />
      </footer>
    </main>
  );
}

export default PostPage;
