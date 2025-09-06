'use client'

import { useState, useEffect, useRef } from 'react'
import PostGrid from '@/components/PostGrid'

interface Post {
  _id: string
  title: string
  slug: { current: string }
  excerpt?: string
  publishedAt: string
  coverImage?: any
}

export default function ClientSearch({ initialQuery }: { initialQuery: string }) {
  const [query, setQuery] = useState(initialQuery || '')
  const [results, setResults] = useState<Post[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  async function runSearch(q: string) {
    if (abortRef.current) abortRef.current.abort()
    const ac = new AbortController()
    abortRef.current = ac
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, { signal: ac.signal })
      const data = await res.json()
      setResults(data.results || [])
    } catch (e: any) {
      if (e?.name !== 'AbortError') setError('Failed to search')
    } finally {
      setLoading(false)
    }
  }

  // initial
  useEffect(() => {
    if (query.trim().length >= 2) runSearch(query)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // input change (debounced)
  useEffect(() => {
    if (!query || query.trim().length < 2) { setResults([]); return }
    const t = setTimeout(() => runSearch(query), 250)
    return () => clearTimeout(t)
  }, [query])

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight text-center text-gray-100 sm:text-4xl mb-4">
          記事を検索
        </h1>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="例: ビットコイン、DeFi、NFT…"
          className="w-full px-4 py-2 text-lg border rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-gray-800 border-gray-600 placeholder-gray-400 text-white"
        />
        {loading && <p className="mt-2 text-sm text-gray-400">検索中…</p>}
        {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
      </div>

      {query && results.length > 0 && (
        <PostGrid posts={results} />
      )}

      {query && !loading && results.length === 0 && query.trim().length >= 2 && (
        <div className="text-center text-gray-300">
          <p>「{query}」に一致する結果はありませんでした。</p>
          <p className="mt-2 text-sm">キーワードを変えて再検索するか、<a href="/blog" className="underline">すべての記事</a>から探してみてください。</p>
        </div>
      )}
    </main>
  )
}
