import './globals.css';
import AuroraBackground from '@/components/AuroraBackground';
import Analytics from './_components/Analytics';
import { ThemeProvider } from '@/components/ThemeProvider';
import type { Metadata } from 'next';
import { client } from '@/lib/sanity.client';
import { globalSettingsQuery } from '@/lib/queries';

export async function generateMetadata(): Promise<Metadata> {
  let settings: any = null;
  try {
    settings = await client.fetch(globalSettingsQuery, {}, {
      next: { tags: ['layout'] },
    });
  } catch (e) {
    // In production (e.g., missing SANITY env or network), fall back to safe defaults
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';
  const siteName = settings?.siteTitle || 'Crypto Shinchan Blog';
  const description = settings?.siteDescription || 'Insights on crypto, markets, and technology.';

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: siteName,
      template: `%s | ${siteName}`,
    },
    description,
    alternates: {
      types: {
        'application/rss+xml': '/rss',
      },
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      type: 'website',
      url: siteUrl,
      siteName,
      title: siteName,
      description,
    },
    twitter: {
      card: 'summary_large_image',
      title: siteName,
      description,
    },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let settings: any = null;
  try {
    settings = await client.fetch(globalSettingsQuery, {}, {
      next: { tags: ['layout'] },
    });
  } catch (e) {
    // Gracefully degrade if Sanity is unreachable
  }
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';
  const siteName = settings?.siteTitle || 'Crypto Shinchan Blog';

  const websiteLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    url: siteUrl,
    name: siteName,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteUrl}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  const orgLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    url: siteUrl,
    name: siteName,
    logo: `${siteUrl}/logo.svg`,
  };

  return (
    <html lang="ja" suppressHydrationWarning>
      <body className="relative min-h-dvh">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteLd) }} />
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }} />
          <AuroraBackground />
          <main className="relative z-[2]">{children}</main>
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
