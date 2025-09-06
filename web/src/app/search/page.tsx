// apps/web/app/search/page.tsx（動的importでバンドル分割）
import dynamic from 'next/dynamic'
import type { Metadata } from 'next'
import { getSiteUrl } from '@/lib/site'

export async function generateMetadata({ searchParams }: { searchParams?: { q?: string } }): Promise<Metadata> {
  const q = (searchParams?.q || '').trim()
  const siteUrl = getSiteUrl()
  const title = q ? `検索: ${q}` : '検索'
  const description = q
    ? `「${q}」の検索結果ページです。該当がない場合はキーワードを変えて再検索できます。`
    : 'ブログ内検索ページです。キーワードを入力して記事を探せます。'
  return {
    title,
    description,
    robots: { index: false, follow: true },
    alternates: { canonical: `${siteUrl}/search${q ? `?q=${encodeURIComponent(q)}` : ''}` },
  }
}

const ClientSearch = dynamic(() => import('@/components/search/ClientSearch'), {
  ssr: false,
  loading: () => <main className="container mx-auto px-4 py-8"><p>読み込み中…</p></main>,
})

export default function Page({ searchParams }: { searchParams: { q?: string } }) {
  const q = (searchParams?.q || '').trim()
  const siteUrl = getSiteUrl()
  const ld = q
    ? {
        '@context': 'https://schema.org',
        '@type': 'SearchResultsPage',
        name: `検索: ${q}`,
        mainEntity: {
          '@type': 'SearchAction',
          target: `${siteUrl}/search?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      }
    : null
  return (
    <>
      {ld && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      )}
      <ClientSearch initialQuery={q} />
    </>
  )
}
