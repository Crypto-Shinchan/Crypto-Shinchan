import { createClient } from 'next-sanity'

// 環境変数が未設定の場合は既存の固定値にフォールバックします。
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'uq18sufb'
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
// The API version is required to ensure consistent behavior across different versions of the Sanity API.
// For more information, see https://www.sanity.io/docs/api-versioning
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-08-10'
const token = process.env.SANITY_READ_TOKEN

const offline = process.env.OFFLINE_BUILD === '1'

export const client = offline
  ? ({
      // During offline builds, any fetch will throw and should be caught by callers
      fetch: async () => {
        throw new Error('OFFLINE_BUILD')
      },
    } as unknown as ReturnType<typeof createClient>)
  : createClient({
      projectId,
      dataset,
      apiVersion,
      // set useCdn to false if you're using ISR or only static generation at build time
      // and want to guarantee no stale data.
      // set it to true if you want to leverage the CDN for faster response times.
      // If a token is provided (e.g., private dataset or to avoid cache), disable CDN for fresh data.
      useCdn: token ? false : process.env.NODE_ENV === 'production',
      token,
    })
