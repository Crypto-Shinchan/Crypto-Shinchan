export default function Head() {
  return (
    <>
      {/* UI polish for mobile address bar color */}
      <meta name="theme-color" content="#f7f7f8" media="(prefers-color-scheme: light)" />
      <meta name="theme-color" content="#0f1115" media="(prefers-color-scheme: dark)" />
      {/* Performance hints */}
      <link rel="preconnect" href="https://cdn.sanity.io" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="//cdn.sanity.io" />
      <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="//www.googletagmanager.com" />
      <link rel="preconnect" href="https://www.google-analytics.com" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
    </>
  )
}
