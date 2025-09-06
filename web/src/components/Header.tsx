"use client";

import Link from 'next/link'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export default function Header() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <header className="bg-gray-100 dark:bg-gray-800">
      <div className="container mx-auto flex items-center justify-between p-4">
        <Link href="/" className="text-2xl font-bold">
          Crypto Shinchan Blog
        </Link>
        <nav className="flex items-center">
          <Link href="/blog" className="mr-4">Blog</Link>
          <Link href="/search" className="mr-4">Search</Link> {/* Added search link */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            aria-label="テーマを切り替え"
          >
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </button>
        </nav>
      </div>
    </header>
  )
}
