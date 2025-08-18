import { createClient } from 'next-sanity'

export const projectId = 'uq18sufb'
export const dataset = 'production'
// The API version is required to ensure consistent behavior across different versions of the Sanity API.
// For more information, see https://www.sanity.io/docs/api-versioning
export const apiVersion = '2025-08-10' 

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  // set useCdn to false if you're using ISR or only static generation at build time
  // and want to guarantee no stale data.
  // set it to true if you want to leverage the CDN for faster response times.
  useCdn: process.env.NODE_ENV === 'production',
})
