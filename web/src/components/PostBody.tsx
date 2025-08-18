import { PortableText } from '@portabletext/react'
import type { PortableTextBlock } from '@portabletext/types'
import Image from 'next/image'
import urlFor from '@/lib/urlFor'

const components = {
  types: {
    image: ({ value }: { value: any }) => {
      return (
        <div className="relative w-full h-96 my-8">
          <Image
            className="object-contain"
            src={urlFor(value).url()}
            alt={value.alt || 'Blog Post Image'}
            fill
          />
        </div>
      )
    },
  },
  // You can add custom components for lists, blockquotes, etc. if needed
}

export default function PostBody({ body }: { body: PortableTextBlock[] }) {
  return (
    <div className="prose dark:prose-invert max-w-none">
      <PortableText value={body} components={components} />
    </div>
  )
}
