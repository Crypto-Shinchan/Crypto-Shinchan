// apps/web/app/search/page.tsx （Server側でqueryを受け取り、Clientへ渡す）
import ClientSearch from '@/components/search/ClientSearch';

export default function Page({ searchParams }: { searchParams: { q?: string } }) {
  const q = searchParams?.q ?? "";
  return <ClientSearch initialQuery={q} />;
}