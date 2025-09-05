import { client } from '@/lib/sanity.client'
import { globalSettingsQuery } from '@/lib/queries'

export default async function Footer() {
  const year = new Date().getFullYear()
  let settings: any = null
  try {
    settings = await client.fetch(globalSettingsQuery, {}, { next: { tags: ['layout'] } })
  } catch (e) {
    // offline or cms error → fallback below
  }
  const links: { label: string; href: string; external?: boolean }[] = [
    { label: 'RSS', href: '/rss' },
    { label: 'サイトマップ', href: '/sitemap.xml' },
    ...((settings?.socialLinks || []).map((s: any) => ({ label: s.platform, href: s.url, external: true })) as any[]),
  ]
  const footerText: string | undefined = settings?.footer
  const siteTitle: string = settings?.siteTitle || 'Crypto Shinchan Blog'

  return (
    <footer className="bg-black/30 backdrop-blur-sm p-6 text-sm text-center">
      <div className="container mx-auto flex flex-col items-center gap-2">
        <nav className="flex items-center gap-4">
          {links.map((l) => (
            <a key={l.label} href={l.href} target={l.external ? '_blank' : undefined} rel={l.external ? 'noopener noreferrer' : undefined} className="hover:underline">
              {l.label}
            </a>
          ))}
        </nav>
        {footerText ? (
          <p className="text-gray-400">{footerText}</p>
        ) : null}
        <p className="text-gray-300">&copy; {year} {siteTitle}. All rights reserved.</p>
      </div>
    </footer>
  )
}
