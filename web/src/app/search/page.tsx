// apps/web/app/search/page.tsx（動的importでバンドル分割）
import dynamic from 'next/dynamic'

export const metadata = {
  title: '検索',
  robots: { index: false, follow: true },
}

const ClientSearch = dynamic(() => import('@/components/search/ClientSearch'), {
  ssr: false,
  loading: () => <main className="container mx-auto px-4 py-8"><p>読み込み中…</p></main>,
})

export default function Page({ searchParams }: { searchParams: { q?: string } }) {
  const q = searchParams?.q ?? ''
  return <ClientSearch initialQuery={q} />
}
