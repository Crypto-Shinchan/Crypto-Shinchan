import { client } from '@/lib/sanity.client';
import { postQuery, postPathsQuery, relatedPostsQuery, globalSettingsQuery, newerPostQuery, olderPostQuery } from '@/lib/queries';
import { extractHeadings } from '@/lib/portableText';
import PostBody from '@/components/PostBody';
import Toc from '@/components/Toc';
import ShareButtons from '@/components/ShareButtons';
import RelatedPosts from '@/components/RelatedPosts';
import PostNav from '@/components/PostNav';
import Breadcrumbs from '@/components/Breadcrumbs';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import urlFor from '@/lib/urlFor';
import Image from 'next/image';
import { getSiteUrl } from '@/lib/site';
import MetaChips from '@/components/MetaChips';

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
  let post: Post | null = null
  try {
    post = await client.fetch(postQuery, { slug: params.slug }, {
      next: { tags: [`post:${params.slug}`] },
    });
  } catch (e) {
    // fall through to minimal metadata
  }
  if (!post) return {}

  const siteUrl = getSiteUrl();
  const ogImageUrl = new URL('/og', siteUrl);
  ogImageUrl.searchParams.set('title', post.title);
  ogImageUrl.searchParams.set('author', post.author?.name || '');
  ogImageUrl.searchParams.set('date', new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));


  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: `${siteUrl}/blog/${post.slug.current}`,
    },
    robots: {
      index: true,
      follow: true,
    },
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
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [ogImageUrl.toString()],
    },
  };
}

// Generate static paths for all posts
export async function generateStaticParams(): Promise<{ slug: string }[]> {
  try {
    const paths = await client.fetch(postPathsQuery)
    return paths.map((path: { params: { slug: string } }) => path.params)
  } catch (e) {
    // Return empty to avoid build-time failure when CMS is unavailable
    return []
  }
}

export const revalidate = 60; // Revalidate this page every 60 seconds

async function PostPage({ params }) {
  let post: Post | null = null
  let settings: any = null
  try {
    const result = await Promise.all([
      client.fetch(postQuery, { slug: params.slug }, { next: { tags: [`post:${params.slug}`] } }),
      client.fetch(globalSettingsQuery, {}, { next: { tags: ['layout'] } }),
    ])
    post = result[0]
    settings = result[1]
  } catch (e) {
    // proceed with nulls
  }
  // OFFLINE ci sample post for smoke tests
  if (!post && process.env.OFFLINE_BUILD === '1' && params?.slug === 'sample-ci') {
    post = {
      title: 'Sample CI Post',
      slug: { current: 'sample-ci' },
      coverImage: undefined,
      excerpt: 'This is a sample post rendered during offline CI to verify layout and components.',
      body: [
        {
          _type: 'block',
          style: 'h2',
          children: [{ _type: 'span', text: 'Section One' }],
        },
        {
          _type: 'block',
          style: 'normal',
          children: [{ _type: 'span', text: 'Body text for CI sample.' }],
        },
        {
          _type: 'code',
          language: 'ts',
          filename: 'example.ts',
          code: 'const add = (a:number,b:number)=> a+b\nconsole.log(add(2,3))',
          highlight: '2',
        },
        {
          _type: 'block',
          style: 'h3',
          children: [{ _type: 'span', text: 'Sub Section' }],
        },
      ] as any,
      publishedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      author: { name: 'CI Bot', avatar: null, bio: '' },
      categories: [],
      tags: [],
    }
  }

  if (!post) {
    notFound()
  }

  const categorySlugs = post.categories?.map(c => c.slug.current) || [];
  const tagSlugs = post.tags?.map(t => t.slug.current) || [];
  let relatedPosts: any[] = []
  try {
    relatedPosts = await client.fetch(relatedPostsQuery, { slug: params.slug, categorySlugs, tagSlugs }, { next: { tags: ['posts'] } })
  } catch (e) {}

  let newer: any = null
  let older: any = null
  try {
    const res = await Promise.all([
      client.fetch(newerPostQuery, { publishedAt: post.publishedAt }, { next: { tags: ['posts'] } }),
      client.fetch(olderPostQuery, { publishedAt: post.publishedAt }, { next: { tags: ['posts'] } }),
    ])
    newer = res[0]
    older = res[1]
  } catch (e) {}

  const headings = extractHeadings(post.body);

  const siteUrl = getSiteUrl();
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
        url: `${siteUrl}/logo.svg`,
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
        <Breadcrumbs
          items={[
            { name: 'ホーム', href: '/' },
            { name: 'ブログ', href: '/blog' },
            ...(post.categories?.[0]
              ? [{ name: post.categories[0].title, href: `/blog/category/${post.categories[0].slug.current}` }]
              : []),
            { name: post.title },
          ]}
        />
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-100 sm:text-4xl md:text-5xl">
            {post.title}
          </h1>
          <p className="mt-4 text-lg text-gray-400">
            {new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          <MetaChips categories={post.categories} tags={post.tags} />
        </header>

        {coverImageUrl && (
          <Image
            src={coverImageUrl}
            alt={post.coverImage.alt || 'Cover Image'}
            width={1200}
            height={630}
            sizes="(min-width: 1024px) 1200px, 100vw"
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
        <PostNav newer={newer} older={older} />
        <div className="mt-10">
        <RelatedPosts posts={relatedPosts} />
        </div>
      </footer>
    </main>
  );
}

export default PostPage;
