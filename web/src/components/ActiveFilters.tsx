"use client"

import { usePathname, useRouter, useSearchParams } from 'next/navigation'

export default function ActiveFilters() {
  const router = useRouter()
  const pathname = usePathname() || '/blog'
  const sp = useSearchParams()
  const category = sp.get('category') || ''
  const tag = sp.get('tag') || ''

  if (!category && !tag) return null

  const removeParam = (key: 'category' | 'tag') => {
    const next = new URLSearchParams(sp?.toString())
    next.delete(key)
    const base = pathname.startsWith('/blog/page/') ? '/blog' : pathname
    const qs = next.toString()
    router.push(qs ? `${base}?${qs}` : base)
  }

  const clearAll = () => {
    const base = pathname.startsWith('/blog/page/') ? '/blog' : pathname
    router.push(base)
  }

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2 text-sm">
      <span className="text-gray-500">適用中のフィルター:</span>
      {category && (
        <button
          onClick={() => removeParam('category')}
          className="inline-flex items-center gap-1 rounded-full border border-gray-300 bg-white px-3 py-1 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
        >
          <span className="text-gray-700 dark:text-gray-200">カテゴリー: {category}</span>
          <span aria-hidden>×</span>
        </button>
      )}
      {tag && (
        <button
          onClick={() => removeParam('tag')}
          className="inline-flex items-center gap-1 rounded-full border border-gray-300 bg-white px-3 py-1 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
        >
          <span className="text-gray-700 dark:text-gray-200">タグ: {tag}</span>
          <span aria-hidden>×</span>
        </button>
      )}
      {(category && tag) && (
        <button
          onClick={clearAll}
          className="ml-2 inline-flex items-center gap-1 rounded border border-gray-300 bg-white px-2 py-1 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
        >
          すべてクリア
        </button>
      )}
    </div>
  )
}
