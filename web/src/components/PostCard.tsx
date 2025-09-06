import Link from 'next/link'
import Image from 'next/image'
import { coverImageUrl } from '@/lib/urlFor'

// This type is now aligned with the updated postsQuery
export interface PostCardData {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  coverImage?: {
    alt: string;
    asset: {
      url: string;
      metadata: {
        lqip: string;
      };
    };
  };
  excerpt?: string;
  publishedAt: string;
  categories?: { title: string; slug: { current: string } }[];
  tags?: { title: string; slug: { current: string } }[];
}

export default function PostCard({ post, priority = false }: { post: PostCardData; priority?: boolean }) {
  return (
    <Link href={`/blog/${post.slug.current}`} className="border rounded-lg overflow-hidden block hover:shadow-lg transition-shadow duration-200 border-gray-700 bg-black/30 backdrop-blur-sm">
      <div className="relative w-full aspect-[16/9] bg-gradient-to-br from-gray-200/40 to-gray-300/30 dark:from-white/5 dark:to-white/10">
        {post.coverImage?.asset?.url ? (
          <Image
            src={coverImageUrl(post.coverImage) || post.coverImage.asset.url}
            alt={post.coverImage.alt || post.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
            placeholder={post.coverImage.asset.metadata?.lqip ? 'blur' : undefined}
            blurDataURL={post.coverImage.asset.metadata?.lqip}
            priority={priority}
            loading={priority ? undefined : 'lazy'}
            fetchPriority={priority ? 'high' : 'auto'}
            decoding="async"
          />
        ) : null}
      </div>
      <div className="p-4">
        <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">{post.title}</h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
          {new Date(post.publishedAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
        {(post.categories?.length || post.tags?.length) && (
          <div className="mb-2 flex flex-wrap gap-2">
            {post.categories?.slice(0, 2).map((c) => (
              <span key={`c-${c.slug.current}`} className="rounded-full border border-gray-300/60 bg-white/40 px-2 py-0.5 text-xs text-gray-800 dark:border-white/10 dark:bg-white/10 dark:text-gray-100">
                #{c.title}
              </span>
            ))}
            {post.tags?.slice(0, 2).map((t) => (
              <span key={`t-${t.slug.current}`} className="rounded-full border border-gray-300/60 bg-white/40 px-2 py-0.5 text-xs text-gray-800 dark:border-white/10 dark:bg-white/10 dark:text-gray-100">
                #{t.title}
              </span>
            ))}
          </div>
        )}
        <p className="text-gray-700 dark:text-gray-300">{post.excerpt}</p>
      </div>
    </Link>
  )
}
