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

export function coverImageUrl(source: SanityImageSource, width = 1200, height = 675, quality = 80) {
  try {
    return builder
      .image(source)
      .width(width)
      .height(height)
      .fit('crop')
      .format('webp')
      .quality(quality)
      .url()
  } catch {
    return ''
  }
}
