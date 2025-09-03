"use client"

import { useEffect, useMemo, useState } from 'react'

interface Heading {
  level: number;
  text: string;
  id: string;
}

interface Props {
  headings: Heading[];
}

const Toc = ({ headings }: Props) => {
  const [activeId, setActiveId] = useState<string | null>(null)

  const ids = useMemo(() => (headings || []).map(h => h.id), [headings])

  useEffect(() => {
    if (!ids.length) return
    const observers: IntersectionObserver[] = []
    const onIntersect: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id)
        }
      })
    }
    const rootMarginTop = 88 // ~ sticky header + spacing
    const options: IntersectionObserverInit = { root: null, rootMargin: `-${rootMarginTop}px 0px -70% 0px`, threshold: [0, 1] }
    const io = typeof window !== 'undefined' ? new IntersectionObserver(onIntersect, options) : null
    if (io) {
      ids.forEach((id) => {
        const el = document.getElementById(id)
        if (el) io.observe(el)
      })
      observers.push(io)
    }
    return () => observers.forEach(o => o.disconnect())
  }, [ids])

  if (!headings || headings.length === 0) return null

  return (
    <nav className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
      <h2 className="text-lg font-bold mb-2">目次</h2>
      <ul>
        {headings.map((heading) => {
          const isActive = activeId === heading.id
          return (
            <li key={heading.id} style={{ marginLeft: `${(heading.level - 1) * 1}rem` }}>
              <a
                href={`#${heading.id}`}
                className={
                  isActive
                    ? 'text-blue-500 dark:text-blue-400 font-medium underline'
                    : 'hover:underline text-gray-700 dark:text-gray-300'
                }
                aria-current={isActive ? 'location' : undefined}
              >
                {heading.text}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export default Toc;
