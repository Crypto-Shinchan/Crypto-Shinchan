export function normalizeSiteUrl(input?: string) {
  const raw = (input || '').trim()
  if (!raw) return 'https://example.com'
  // Prepend https:// when protocol is missing
  const withProto = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`
  try {
    const u = new URL(withProto)
    // Normalize to origin (strip paths if any)
    return u.origin
  } catch {
    return 'https://example.com'
  }
}

export function getSiteUrl() {
  return normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com')
}

