"use client";

import Link from 'next/link'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

type NavLink = { title: string; url: string }

export default function HeaderBasic({ navLinks, siteTitle }: { navLinks?: NavLink[]; siteTitle?: string }) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const links: NavLink[] = (navLinks && navLinks.length)
    ? navLinks
    : [
        { title: 'ホーム', url: '/' },
        { title: 'ブログ', url: '/blog' },
        { title: 'プロフィール', url: '/profile' },
        { title: 'お問い合わせ', url: '/contact' },
      ]

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200/60 bg-white/70 text-gray-900 backdrop-blur-sm dark:border-white/10 dark:bg-black/30 dark:text-gray-100">
      <div className="container mx-auto flex items-center justify-between p-4">
        <Link href="/" className="text-2xl font-bold">
          {siteTitle || 'Crypto Shinchan Blog'}
        </Link>
        <nav className="flex items-center gap-4">
          {links.map((l) => {
            const isInternal = l.url.startsWith('/')
            const isActive = isInternal && (pathname === l.url || (l.url !== '/' && pathname?.startsWith(l.url)))
            const cls = isActive
              ? 'font-semibold underline underline-offset-4'
              : 'hover:underline'
            return isInternal ? (
              <Link key={l.title} href={l.url} aria-current={isActive ? 'page' : undefined} className={cls}>
                {l.title}
              </Link>
            ) : (
              <a key={l.title} href={l.url} target="_blank" rel="noopener noreferrer" className={cls}>
                {l.title}
              </a>
            )
          })}
          <Link
            href="/search"
            className="px-3 py-1 rounded-md border border-gray-300 bg-gray-50 text-gray-800 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            aria-label="検索を開く"
          >
            検索
          </Link>
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="px-3 py-1 rounded-md border border-gray-300 bg-gray-50 text-gray-800 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            aria-label="テーマを切り替え"
          >
            {theme === 'dark' ? 'ライト' : 'ダーク'}
          </button>
        </nav>
      </div>
    </header>
  )
}
