import Link from 'next/link'
import Image from 'next/image'

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
}

export default function PostCard({ post }: { post: PostCardData }) {
  return (
    <Link href={`/blog/${post.slug.current}`} className="border rounded-lg overflow-hidden block hover:shadow-lg transition-shadow duration-200 dark:border-gray-700">
      {post.coverImage?.asset?.url && (
        <div className="relative h-48 w-full">
          <Image
            src={post.coverImage.asset.url}
            alt={post.coverImage.alt}
            layout="fill"
            objectFit="cover"
            placeholder="blur"
            blurDataURL={post.coverImage.asset.metadata.lqip}
          />
        </div>
      )}
      <div className="p-4">
        <h2 className="text-xl font-bold mb-2">{post.title}</h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
          {new Date(post.publishedAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
        <p className="text-gray-700 dark:text-gray-300">{post.excerpt}</p>
      </div>
    </Link>
  )
}
