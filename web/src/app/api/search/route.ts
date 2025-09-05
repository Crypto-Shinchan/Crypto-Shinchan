import { NextResponse } from 'next/server'
import { groq } from 'next-sanity'
import { client } from '@/lib/sanity.client'

export const revalidate = 0

const searchQuery = groq`*[_type == "post" && defined(slug.current) && state == 'published' && (
  title match $qs ||
  excerpt match $qs ||
  pt::text(body) match $qs
)] | order(publishedAt desc)[0...50]{
  _id,
  title,
  slug,
  "coverImage": coverImage{
    "alt": alt,
    "asset": asset->{
      _ref,
      url,
      "metadata": metadata{ lqip }
    }
  },
  excerpt,
  publishedAt,
  categories[]->{title, slug},
  tags[]->{title, slug}
}`

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const q = (searchParams.get('q') || '').trim()
  if (!q || q.length < 2) {
    return NextResponse.json({ ok: true, q, results: [] }, { headers: { 'Cache-Control': 'no-store' } })
  }
  const qs = `*${q}*`
  try {
    const results = await client.fetch(searchQuery, { qs })
    return NextResponse.json({ ok: true, q, results }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (e) {
    // Offline/failed CMS: return empty for resilience
    return NextResponse.json({ ok: true, q, results: [] }, { headers: { 'Cache-Control': 'no-store' } })
  }
}

