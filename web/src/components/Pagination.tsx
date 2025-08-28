import Link from 'next/link'

interface Props {
  currentPage: number
  totalPages: number
  basePath?: string // default: '/blog'
}

export default function Pagination({ currentPage, totalPages, basePath = '/blog' }: Props) {
  if (totalPages <= 1) return null

  const prevHref = currentPage <= 2 ? `${basePath}` : `${basePath}/page/${currentPage - 1}`
  const nextHref = `${basePath}/page/${currentPage + 1}`

  const pages: number[] = []
  const maxButtons = 5
  const start = Math.max(1, currentPage - Math.floor(maxButtons / 2))
  const end = Math.min(totalPages, start + maxButtons - 1)
  for (let p = start; p <= end; p++) pages.push(p)

  return (
    <nav className="mt-10 flex items-center justify-center gap-2" aria-label="Pagination">
      <Link
        href={prevHref}
        className={`px-3 py-1 rounded border text-sm ${currentPage === 1 ? 'pointer-events-none opacity-50' : ''}`}
        aria-disabled={currentPage === 1}
      >
        Prev
      </Link>

      {start > 1 && (
        <Link href={basePath} className="px-3 py-1 rounded border text-sm">1</Link>
      )}
      {start > 2 && <span className="px-2">…</span>}

      {pages.map((p) => (
        <Link
          key={p}
          href={p === 1 ? basePath : `${basePath}/page/${p}`}
          className={`px-3 py-1 rounded border text-sm ${p === currentPage ? 'bg-gray-200/60 dark:bg-white/10' : ''}`}
          aria-current={p === currentPage ? 'page' : undefined}
        >
          {p}
        </Link>
      ))}

      {end < totalPages - 1 && <span className="px-2">…</span>}
      {end < totalPages && (
        <Link href={`${basePath}/page/${totalPages}`} className="px-3 py-1 rounded border text-sm">{totalPages}</Link>
      )}

      <Link
        href={currentPage === totalPages ? '#' : nextHref}
        className={`px-3 py-1 rounded border text-sm ${currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}`}
        aria-disabled={currentPage === totalPages}
      >
        Next
      </Link>
    </nav>
  )
}

