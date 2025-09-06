import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="container mx-auto px-4 py-8 text-center">
      <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">404 - Page Not Found</h1>
      <p className="text-lg mb-8 text-gray-700 dark:text-gray-300">The page you are looking for does not exist.</p>
      <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline">
        Go back to Home
      </Link>
    </main>
  );
}
