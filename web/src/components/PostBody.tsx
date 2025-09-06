import { PortableText, PortableTextComponents, type PortableTextComponentProps } from '@portabletext/react'
import type { PortableTextBlock } from '@portabletext/types'
import Image from 'next/image'
import urlFor from '@/lib/urlFor'
import Slugger from 'github-slugger'
import { getSiteUrl } from '@/lib/site'

const slugger = new Slugger()

const components: PortableTextComponents = {
  types: {
      image: ({ value }: { value: any }) => {
        const clamp = (s?: string, max = 120) => {
          const t = (s || '').toString().trim()
          return t.length > max ? t.slice(0, max - 1) + '…' : (t || 'Blog Post Image')
        }
        const altText = clamp(value?.alt || value?.caption)
        const caption = (value?.caption || '').toString().trim()
        return (
          <figure className="my-8">
            <div className="relative w-full h-96">
              <Image
                className="object-contain"
                src={urlFor(value).url()}
                alt={altText}
                fill
                sizes="(min-width: 1024px) 768px, 100vw"
                loading="lazy"
                decoding="async"
              />
            </div>
            {caption && (
              <figcaption className="mt-2 text-sm text-gray-600 dark:text-gray-400">{caption}</figcaption>
            )}
          </figure>
        )
      },
      code: ({ value }: { value: any }) => {
        const lang = (value?.language || '').toString()
        return (
          <div className="relative my-6">
            {lang && (
              <span className="absolute right-2 top-2 z-[1] rounded bg-black/50 text-white text-[10px] px-2 py-0.5 tracking-wide">
                {lang.toUpperCase()}
              </span>
            )}
            <pre className="overflow-x-auto">
              <code>{value?.code || ''}</code>
            </pre>
          </div>
        )
      },
  },
  marks: {
    link: ({ value, children }: any) => {
      const href: string = value?.href || ''
      const site = getSiteUrl()
      let isExternal = false
      try {
        const base = new URL(site)
        const u = new URL(href, base)
        isExternal = (u.origin !== base.origin) && (u.protocol === 'http:' || u.protocol === 'https:')
      } catch {
        isExternal = /^https?:\/\//.test(href) && !href.startsWith(site)
      }
      const label = isExternal ? `外部リンク: ${href}` : undefined
      return (
        <a
          href={href}
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noopener noreferrer' : undefined}
          title={href}
          aria-label={label}
          className="underline text-blue-600 dark:text-blue-400"
        >
          {children}
        </a>
      )
    },
  },
  block: {
    h1: (props: PortableTextComponentProps<PortableTextBlock>) => {
      const { children } = props as any
      slugger.reset()
      const id = slugger.slug(children?.toString() ?? '')
      return <h1 id={id} aria-label={`セクション: ${children?.toString?.() ?? ''}`} className="text-4xl font-bold my-4">{children}</h1>
    },
    h2: (props: PortableTextComponentProps<PortableTextBlock>) => {
      const { children } = props as any
      slugger.reset()
      const id = slugger.slug(children?.toString() ?? '')
      return (
        <h2 id={id} aria-label={`セクション: ${children?.toString?.() ?? ''}`} className="group text-3xl font-bold my-4">
          <a href={`#${id}`} className="no-underline inline-flex items-center gap-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded" aria-label="この見出しへのリンク" title="この見出しへのリンク">
            <span>{children}</span>
            <svg className="w-4 h-4 text-blue-500 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M10 13a5 5 0 0 1 0-7l1-1a5 5 0 1 1 7 7l-1 1"/>
              <path d="M14 11a5 5 0 0 1 0 7l-1 1a5 5 0 1 1-7-7l1-1"/>
            </svg>
          </a>
        </h2>
      )
    },
    h3: (props: PortableTextComponentProps<PortableTextBlock>) => {
      const { children } = props as any
      slugger.reset()
      const id = slugger.slug(children?.toString() ?? '')
      return (
        <h3 id={id} aria-label={`セクション: ${children?.toString?.() ?? ''}`} className="group text-2xl font-bold my-4">
          <a href={`#${id}`} className="no-underline inline-flex items-center gap-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded" aria-label="この見出しへのリンク" title="この見出しへのリンク">
            <span>{children}</span>
            <svg className="w-4 h-4 text-blue-500 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M10 13a5 5 0 0 1 0-7l1-1a5 5 0 1 1 7 7l-1 1"/>
              <path d="M14 11a5 5 0 0 1 0 7l-1 1a5 5 0 1 1-7-7l1-1"/>
            </svg>
          </a>
        </h3>
      )
    },
    h4: (props: PortableTextComponentProps<PortableTextBlock>) => {
      const { children } = props as any
      slugger.reset()
      const id = slugger.slug(children?.toString() ?? '')
      return (
        <h4 id={id} aria-label={`セクション: ${children?.toString?.() ?? ''}`} className="group text-xl font-bold my-4">
          <a href={`#${id}`} className="no-underline inline-flex items-center gap-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded" aria-label="この見出しへのリンク" title="この見出しへのリンク">
            <span>{children}</span>
            <svg className="w-4 h-4 text-blue-500 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M10 13a5 5 0 0 1 0-7l1-1a5 5 0 1 1 7 7l-1 1"/>
              <path d="M14 11a5 5 0 0 1 0 7l-1 1a5 5 0 1 1-7-7l1-1"/>
            </svg>
          </a>
        </h4>
      )
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
