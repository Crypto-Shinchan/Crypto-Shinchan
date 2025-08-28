import Link from 'next/link'

interface AdjacentPost {
  title: string
  slug: { current: string }
}

export default function PostNav({ newer, older }: { newer?: AdjacentPost | null, older?: AdjacentPost | null }) {
  if (!newer && !older) return null
  return (
    <nav className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2" aria-label="Adjacent posts">
      <div className="sm:justify-self-start">
        {older && (
          <Link
            href={`/blog/${older.slug.current}`}
            className="group block rounded-md border border-gray-200/60 p-4 backdrop-blur-sm hover:bg-white/50 dark:border-white/10 dark:hover:bg-white/5"
            aria-label={`Older: ${older.title}`}
          >
            <div className="text-xs text-gray-500 dark:text-gray-400">← Older</div>
            <div className="mt-1 font-medium text-gray-900 dark:text-gray-100 group-hover:underline">{older.title}</div>
          </Link>
        )}
      </div>
      <div className="sm:justify-self-end">
        {newer && (
          <Link
            href={`/blog/${newer.slug.current}`}
            className="group block rounded-md border border-gray-200/60 p-4 backdrop-blur-sm hover:bg-white/50 dark:border-white/10 dark:hover:bg-white/5"
            aria-label={`Newer: ${newer.title}`}
          >
            <div className="text-right text-xs text-gray-500 dark:text-gray-400">Newer →</div>
            <div className="mt-1 text-right font-medium text-gray-900 dark:text-gray-100 group-hover:underline">{newer.title}</div>
          </Link>
        )}
      </div>
    </nav>
  )
}

