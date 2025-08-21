'use client';

import { useState, useEffect } from 'react';
// Removed: import { useSearchParams } from 'next/navigation';
import { client } from '@/lib/sanity.client';
import { postsQuery } from '@/lib/queries';
import PostGrid from '@/components/PostGrid';
import Fuse from 'fuse.js';

// Define the type for a single post
interface Post {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
  publishedAt: string;
  coverImage?: any;
}

const fuseOptions = {
  keys: ['title', 'excerpt'],
  includeScore: true,
  threshold: 0.4,
};

// Changed: export default function ClientSearch({ initialQuery }: { initialQuery: string })
export default function ClientSearch({ initialQuery }: { initialQuery: string }) {
  // Removed: const searchParams = useSearchParams();
  // Removed: const initialQuery = searchParams.get('q') || '';

  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [fuse, setFuse] = useState<Fuse<Post> | null>(null);
  const [query, setQuery] = useState(initialQuery); // Use prop directly
  const [results, setResults] = useState<Post[]>([]);

  useEffect(() => {
    const fetchAllPosts = async () => {
      const posts = await client.fetch<Post[]>(postsQuery);
      setAllPosts(posts);
      const fuseInstance = new Fuse(posts, fuseOptions);
      setFuse(fuseInstance);

      if (initialQuery.trim() !== '') {
        const searchResults = fuseInstance.search(initialQuery).map(result => result.item);
        setResults(searchResults);
      }
    };
    fetchAllPosts();
  }, [initialQuery]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);

    if (fuse && newQuery.trim() !== '') {
      const searchResults = fuse.search(newQuery).map(result => result.item);
      setResults(searchResults);
    } else {
      setResults([]);
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight text-center text-gray-100 sm:text-4xl mb-4">
          Search Posts
        </h1>
        <input
          type="search"
          value={query}
          onChange={handleSearch}
          placeholder="e.g. TypeScript, Sanity, Next.js..."
          className="w-full px-4 py-2 text-lg border rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-gray-800 border-gray-600 placeholder-gray-400 text-white"
        />
      </div>

      {query && results.length > 0 && (
        <PostGrid posts={results} />
      )}

      {query && results.length === 0 && (
        <p className="text-center">No results found for &quot;{query}&quot;.</p>
      )}
    </main>
  );
}