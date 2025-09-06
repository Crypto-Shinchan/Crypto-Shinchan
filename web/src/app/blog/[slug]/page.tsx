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

// Helper: derive lead text from first paragraph
function deriveLeadFromBody(body: any): string | null {
  try {
    if (!Array.isArray(body)) return null
    for (const block of body) {
      if (block?._type === 'block' && (block.style === 'normal' || !block.style)) {
        const text = (block.children || []).map((c: any) => c?.text || '').join(' ').trim()
        if (text) return text.length > 180 ? text.slice(0, 177) + '…' : text
      }
    }
  } catch {}
  return null
}

// Clamp meta description to ~160 chars
function clampMeta(input?: string | null): string | undefined {
  if (!input) return undefined
  const t = String(input).replace(/\s+/g, ' ').trim()
  if (!t) return undefined
  return t.length > 160 ? t.slice(0, 157) + '…' : t
}

// Helper: extract simple Q/A pairs for FAQPage JSON-LD (heuristic)
function extractFAQPairs(body: any): { question: string; answer: string }[] {
  const pairs: { question: string; answer: string }[] = []
  try {
    if (!Array.isArray(body)) return pairs
    for (let i = 0; i < body.length - 1; i++) {
      const cur = body[i]
      const nxt = body[i + 1]
      const getText = (blk: any) => (blk?.children || []).map((c: any) => c?.text || '').join(' ').trim()
      const qText = getText(cur)
      const aText = getText(nxt)
      const isQ = cur?._type === 'block' && /^q[：:.\)]/i.test(qText)
      const isA = nxt?._type === 'block' && /^a[：:.\)]/i.test(aText)
      if (isQ && isA) {
        pairs.push({
          question: qText.replace(/^q[：:.\)]\s*/i, ''),
          answer: aText.replace(/^a[：:.\)]\s*/i, ''),
        })
        i++
      }
    }
  } catch {}
  return pairs
}

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
  author: { name: string; avatar: any; bio: string; url?: string; sameAs?: string[] };
  categories: { title: string; slug: { current: string } }[];
  tags: { title: string; slug: { current: string } }[];
  excerpt?: string;
}

function extractPlainText(body: any): string {
  try {
    if (!Array.isArray(body)) return ''
    const parts: string[] = []
    for (const block of body) {
      if (block?._type === 'block' && Array.isArray(block.children)) {
        parts.push(block.children.map((c: any) => c?.text || '').join(' '))
      }
    }
    return parts.join('\n')
  } catch {
    return ''
  }
}

function estimateWordCountAndTime(body: any): { wordCount?: number; timeRequired?: string } {
  try {
    const text = extractPlainText(body)
    if (!text) return {}
    let words = text.trim().split(/\s+/).filter(Boolean).length
    // 日本語など空白分かち書きでない場合の簡易推定
    if (words === 0) {
      words = Math.ceil(text.length / 2)
    }
    const minutes = Math.max(1, Math.round(words / 200)) // ~200wpm 読了時間の目安
    return { wordCount: words, timeRequired: `PT${minutes}M` }
  } catch {
    return {}
  }
}

function clampAlt(s?: string, max = 120): string {
  const t = (s || '').toString().trim()
  return t.length > max ? t.slice(0, max - 1) + '…' : (t || 'Cover Image')
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
  const ogFallback = new URL('/og', siteUrl);
  ogFallback.searchParams.set('title', post.title);
  ogFallback.searchParams.set('author', post.author?.name || '');
  ogFallback.searchParams.set('date', new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));
  const ogImageUrl = post.coverImage
    ? urlFor(post.coverImage).width(1200).height(630).url()
    : ogFallback.toString();

  // Prefer excerpt, otherwise derive from first paragraph
  const derivedLead = deriveLeadFromBody(post.body)
  const metaDescription = clampMeta(post.excerpt || derivedLead || undefined)


  return {
    title: post.title,
    description: metaDescription,
    keywords: [
      ...(post.categories?.map(c => c.title) || []),
      ...(post.tags?.map(t => t.title) || []),
    ],
    alternates: {
      canonical: `${siteUrl}/blog/${post.slug.current}`,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: post.title,
      description: metaDescription,
      type: 'article',
      publishedTime: new Date(post.publishedAt).toISOString(),
      modifiedTime: new Date(post.updatedAt || post.publishedAt).toISOString(),
      authors: post.author?.name ? [post.author.name] : undefined,
      section: post.categories?.[0]?.title,
      tags: post.tags?.map(t => t.title),
      url: `${siteUrl}/blog/${post.slug.current}`,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: metaDescription,
      images: [ogImageUrl],
    },
    other: {
      'twitter:image:alt': post.title,
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
  const faqPairs = extractFAQPairs(post.body)
  const derivedLeadRuntime = deriveLeadFromBody(post.body)
  const metaDescription = post.excerpt || derivedLeadRuntime || ''
  const reading = estimateWordCountAndTime(post.body)

  const siteUrl = getSiteUrl();
  const siteTitle = settings?.siteTitle || 'Your Blog Name';
  const coverImageUrl = post.coverImage ? urlFor(post.coverImage).width(1200).height(630).url() : '';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    inLanguage: 'ja-JP',
    isAccessibleForFree: true,
    '@id': `${siteUrl}/blog/${post.slug.current}#article`,
    headline: post.title,
    description: metaDescription || post.excerpt,
    image: coverImageUrl
      ? {
          '@type': 'ImageObject',
          url: coverImageUrl,
          width: 1200,
          height: 630,
        }
      : undefined,
    datePublished: new Date(post.publishedAt).toISOString(),
    dateModified: new Date(post.updatedAt || post.publishedAt).toISOString(),
    keywords: [
      ...(post.categories?.map((c) => c.title) || []),
      ...(post.tags?.map((t) => t.title) || []),
    ].join(', '),
    about: [
      ...(post.categories?.length ? [{ '@type': 'Thing', name: post.categories[0].title, url: `${siteUrl}/blog/category/${post.categories[0].slug.current}` }] : []),
      ...(post.tags?.map((t) => ({ '@type': 'Thing', name: t.title, url: `${siteUrl}/blog/tag/${t.slug.current}` })) || []),
    ],
    ...(post.categories?.[0]?.title ? { articleSection: post.categories[0].title } : {}),
    author: {
      '@type': 'Person',
      name: post.author.name,
      ...(post.author?.url ? { url: post.author.url } : {}),
      ...(Array.isArray(post.author?.sameAs) && post.author.sameAs.length ? { sameAs: post.author.sameAs } : {}),
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
    isPartOf: { '@id': `${siteUrl}#website` },
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['article h1', 'article p:first-of-type'],
    },
    ...(reading.wordCount ? { wordCount: reading.wordCount } : {}),
    ...(reading.timeRequired ? { timeRequired: reading.timeRequired } : {}),
    ...(Array.isArray(relatedPosts) && relatedPosts.length
      ? {
          isRelatedTo: relatedPosts.map((r: any) => ({
            '@type': 'Article',
            url: `${siteUrl}/blog/${r.slug?.current}`,
            name: r.title,
          })),
        }
      : {}),
  };

  const faqLd = faqPairs.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqPairs.map((p) => ({
          '@type': 'Question',
          name: p.question,
          acceptedAnswer: { '@type': 'Answer', text: p.answer },
        })),
      }
    : null

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'ホーム',
        item: siteUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'ブログ',
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
      {faqLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />
      )}
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
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl md:text-5xl">
            {post.title}
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            {new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          <MetaChips categories={post.categories} tags={post.tags} />
        </header>

        {coverImageUrl && (
          <Image
            src={coverImageUrl}
            alt={clampAlt(post.coverImage.alt || post.title || 'Cover Image')}
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
