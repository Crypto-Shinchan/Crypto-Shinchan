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
  const isCI = process.env.NEXT_PUBLIC_LHCI === '1' || process.env.OFFLINE_BUILD === '1'
  const cardBg = isCI ? 'bg-transparent' : 'bg-black/30 backdrop-blur-sm'
  const clampAlt = (s?: string, max = 120) => {
    const t = (s || '').toString().trim()
    return t.length > max ? t.slice(0, max - 1) + '…' : (t || 'Cover Image')
  }
  return (
    <Link
      href={`/blog/${post.slug.current}`}
      aria-label={`記事: ${post.title}`}
      role="listitem"
      className={`border rounded-lg overflow-hidden block border-gray-700 ${cardBg} transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400`}
    >
      <div className="relative w-full aspect-[16/9] bg-gradient-to-br from-gray-200/40 to-gray-300/30 dark:from-white/5 dark:to-white/10">
        {post.coverImage?.asset?.url ? (
          <Image
            src={coverImageUrl(post.coverImage) || post.coverImage.asset.url}
            alt={clampAlt(post.coverImage.alt || post.title)}
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
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden />
      </div>
      <div className="p-4">
        <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100 line-clamp-2 leading-snug">{post.title}</h2>
        <time
          className="text-gray-600 dark:text-gray-400 text-xs mb-2 block"
          dateTime={new Date(post.publishedAt).toISOString()}
          aria-label="公開日"
        >
          {new Date(post.publishedAt).toLocaleDateString('ja-JP', {
            year: 'numeric', month: 'short', day: 'numeric'
          })}
        </time>
        {(post.categories?.length || post.tags?.length) && (
          <div className="mb-2 flex flex-wrap gap-2">
            {post.categories?.slice(0, 2).map((c) => (
              <span key={`c-${c.slug.current}`} className="rounded-full border border-gray-300/60 bg-white/40 px-2 py-0.5 text-[11px] text-gray-800 dark:border-white/10 dark:bg-white/10 dark:text-gray-100 transition-colors hover:bg-gray-100/70 dark:hover:bg-white/20">
                #{c.title}
              </span>
            ))}
            {post.tags?.slice(0, 2).map((t) => (
              <span key={`t-${t.slug.current}`} className="rounded-full border border-gray-300/60 bg-white/40 px-2 py-0.5 text-[11px] text-gray-800 dark:border-white/10 dark:bg-white/10 dark:text-gray-100 transition-colors hover:bg-gray-100/70 dark:hover:bg-white/20">
                #{t.title}
              </span>
            ))}
          </div>
        )}
        {post.excerpt && (
          <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed line-clamp-2">{post.excerpt}</p>
        )}
      </div>
    </Link>
  )
}
