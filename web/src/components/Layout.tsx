import HeaderBasic from './HeaderBasic'
import Footer from './Footer'
import { client } from '@/lib/sanity.client'
import { globalSettingsQuery } from '@/lib/queries'

export default async function Layout({ children }: { children: React.ReactNode }) {
  let settings: any = null
  try {
    settings = await client.fetch(globalSettingsQuery, {}, { next: { tags: ['layout'] } })
  } catch (e) {}

  const navLinks = (settings?.nav || []).map((n: any) => ({ title: n.title, url: n.url }))
  const siteTitle = settings?.siteTitle || 'Crypto Shinchan Blog'

  return (
    <div className="flex flex-col min-h-screen">
      <a href="#content" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-md focus:bg-white focus:px-3 focus:py-2 focus:text-sm focus:text-gray-900 dark:focus:bg-gray-800 dark:focus:text-gray-100 shadow">
        本文へスキップ
      </a>
      <HeaderBasic navLinks={navLinks} siteTitle={siteTitle} />
      <main id="content" className="flex-grow container mx-auto p-4 md:p-6 max-w-5xl rounded-lg border border-gray-200/60 bg-white/70 text-gray-900 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-black/30 dark:text-gray-100">
        {children}
      </main>
      <Footer />
    </div>
  )
}
