import { PortableText, PortableTextComponents, type PortableTextComponentProps } from '@portabletext/react'
import type { PortableTextBlock } from '@portabletext/types'
import Image from 'next/image'
import urlFor from '@/lib/urlFor'
import Slugger from 'github-slugger'

const slugger = new Slugger()

const components: PortableTextComponents = {
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
  block: {
    h1: (props: PortableTextComponentProps<PortableTextBlock>) => {
      const { children } = props as any
      slugger.reset()
      const id = slugger.slug(children?.toString() ?? '')
      return <h1 id={id} className="text-4xl font-bold my-4">{children}</h1>
    },
    h2: (props: PortableTextComponentProps<PortableTextBlock>) => {
      const { children } = props as any
      slugger.reset()
      const id = slugger.slug(children?.toString() ?? '')
      return <h2 id={id} className="text-3xl font-bold my-4">{children}</h2>
    },
    h3: (props: PortableTextComponentProps<PortableTextBlock>) => {
      const { children } = props as any
      slugger.reset()
      const id = slugger.slug(children?.toString() ?? '')
      return <h3 id={id} className="text-2xl font-bold my-4">{children}</h3>
    },
    h4: (props: PortableTextComponentProps<PortableTextBlock>) => {
      const { children } = props as any
      slugger.reset()
      const id = slugger.slug(children?.toString() ?? '')
      return <h4 id={id} className="text-xl font-bold my-4">{children}</h4>
    },
  },
}

export default function PostBody({ body }: { body: PortableTextBlock[] }) {
  return (
    <div className="prose dark:prose-invert max-w-none">
      <PortableText value={body} components={components} />
    </div>
  )
}
