"use client"

import { useRouter, useSearchParams, usePathname } from 'next/navigation'

type Item = { title: string; slug: { current: string } }

export default function FilterBar({ categories, tags }: { categories: Item[]; tags: Item[] }) {
  const router = useRouter()
  const pathname = usePathname()
  const sp = useSearchParams()
  const initialCategory = sp.get('category') || ''
  const initialTag = sp.get('tag') || ''

  function updateQuery(next: { category?: string; tag?: string }) {
    const params = new URLSearchParams(sp?.toString())
    if (next.category !== undefined) {
      if (next.category) params.set('category', next.category)
      else params.delete('category')
    }
    if (next.tag !== undefined) {
      if (next.tag) params.set('tag', next.tag)
      else params.delete('tag')
    }
    // Reset to first page if on paginated path
    const base = pathname?.startsWith('/blog/page/') ? '/blog' : pathname || '/blog'
    const qs = params.toString()
    router.push(qs ? `${base}?${qs}` : base)
  }

  return (
    <div className="mb-6 flex flex-wrap gap-3 items-center">
      <label className="text-sm text-gray-500">
        カテゴリー
        <select
          className="ml-2 rounded border border-gray-300 bg-white px-2 py-1 text-sm dark:border-gray-700 dark:bg-gray-800"
          defaultValue={initialCategory}
          onChange={(e) => updateQuery({ category: e.target.value })}
        >
          <option value="">すべて</option>
          {categories.map(c => (
            <option key={c.slug.current} value={c.slug.current}>{c.title}</option>
          ))}
        </select>
      </label>
      <label className="text-sm text-gray-500">
        タグ
        <select
          className="ml-2 rounded border border-gray-300 bg-white px-2 py-1 text-sm dark:border-gray-700 dark:bg-gray-800"
          defaultValue={initialTag}
          onChange={(e) => updateQuery({ tag: e.target.value })}
        >
          <option value="">すべて</option>
          {tags.map(t => (
            <option key={t.slug.current} value={t.slug.current}>{t.title}</option>
          ))}
        </select>
      </label>
    </div>
  )
}
