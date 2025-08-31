import { NextResponse } from 'next/server'
import { getSiteUrl } from '@/lib/site'

export const revalidate = 0

export async function GET() {
  // Do not expose secrets. Only presence booleans.
  const siteUrl = getSiteUrl()
  const vercelEnv = process.env.VERCEL_ENV || 'unknown'
  const nodeEnv = process.env.NODE_ENV || 'development'
  const sanityProject = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ? true : false
  const sanityDataset = process.env.NEXT_PUBLIC_SANITY_DATASET ? true : false

  return NextResponse.json(
    {
      ok: true,
      siteUrl,
      env: { vercel: vercelEnv, node: nodeEnv },
      sanity: { projectIdSet: sanityProject, datasetSet: sanityDataset },
      time: new Date().toISOString(),
    },
    { headers: { 'Cache-Control': 'no-store' } },
  )
}

