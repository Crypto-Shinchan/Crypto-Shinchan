import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="container mx-auto px-4 py-8 text-center">
      <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">ページが見つかりません（404）</h1>
      <p className="text-lg mb-8 text-gray-700 dark:text-gray-300">お探しのページは存在しないか、移動した可能性があります。</p>
      <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline">
        ホームへ戻る
      </Link>
    </main>
  );
}
