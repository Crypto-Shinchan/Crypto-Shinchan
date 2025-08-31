'use client'

import { useEffect } from 'react'

const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID

export default function Analytics() {
  useEffect(() => {
    if (!GA_TRACKING_ID) return
    try {
      const s = document.createElement('script')
      s.async = true
      s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`
      document.head.appendChild(s)

      const w = window as any
      w.dataLayer = w.dataLayer || []
      w.gtag = (...args: any[]) => { w.dataLayer.push(args) }
      w.gtag('js', new Date())
      w.gtag('config', GA_TRACKING_ID, { page_path: window.location.pathname })

      return () => { s.parentNode?.removeChild(s) }
    } catch {}
  }, [])
  return null
}
