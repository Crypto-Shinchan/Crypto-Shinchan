import Link from 'next/link'

export type Crumb = { name: string; href?: string }

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  if (!items?.length) return null
  return (
    <nav className="mb-6 text-sm text-gray-500 dark:text-gray-400" aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1
          return (
            <li key={idx} className="flex items-center gap-1">
              {item.href && !isLast ? (
                <Link href={item.href} className="hover:underline text-gray-600 dark:text-gray-300">
                  {item.name}
                </Link>
              ) : (
                <span className="text-gray-500 dark:text-gray-400">{item.name}</span>
              )}
              {!isLast && <span className="opacity-60">/</span>}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

