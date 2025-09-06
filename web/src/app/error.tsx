'use client'

import Link from 'next/link'

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }, reset: () => void }) {
  return (
    <main className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">エラーが発生しました</h1>
      <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">予期しないエラーが発生しました。お手数ですが再試行してください。</p>
      <div className="flex items-center justify-center gap-4">
        <button onClick={reset} className="px-4 py-2 rounded bg-blue-600 text-white hover:opacity-90">再試行</button>
        <Link href="/" className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:underline">ホームへ戻る</Link>
      </div>
    </main>
  )
}
