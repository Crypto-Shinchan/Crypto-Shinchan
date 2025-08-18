import imageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'
import { projectId, dataset } from './sanity.client'

const builder = imageUrlBuilder({
  projectId: projectId || '',
  dataset: dataset || '',
})

export default function urlFor(source: SanityImageSource) {
  return builder.image(source)
}
