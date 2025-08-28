import Link from 'next/link'

type Taxonomy = { title: string; slug: { current: string } }

export default function MetaChips({
  categories = [],
  tags = [],
}: {
  categories?: Taxonomy[]
  tags?: Taxonomy[]
}) {
  const hasCats = categories?.length > 0
  const hasTags = tags?.length > 0
  if (!hasCats && !hasTags) return null

  return (
    <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
      {hasCats && (
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((c) => (
            <Link
              key={c.slug.current}
              href={`/blog/category/${c.slug.current}`}
              className="rounded-full border border-gray-300/60 bg-white/50 px-3 py-1 text-gray-800 hover:bg-white/80 dark:border-white/10 dark:bg-white/10 dark:text-gray-100 dark:hover:bg-white/20"
              aria-label={`Category: ${c.title}`}
            >
              #{c.title}
            </Link>
          ))}
        </div>
      )}
      {hasTags && (
        <div className="ml-2 flex flex-wrap items-center gap-2">
          {tags.map((t) => (
            <Link
              key={t.slug.current}
              href={`/blog/tag/${t.slug.current}`}
              className="rounded-full border border-gray-300/60 bg-white/50 px-3 py-1 text-gray-800 hover:bg-white/80 dark:border-white/10 dark:bg-white/10 dark:text-gray-100 dark:hover:bg-white/20"
              aria-label={`Tag: ${t.title}`}
            >
              #{t.title}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

