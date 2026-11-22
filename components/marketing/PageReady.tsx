'use client'

import { useEffect } from 'react'

/** Minimum time the loader stays up after navigation starts, so it never flickers. */
const MIN_VISIBLE_MS = 650
/** Never wait on web fonts longer than this. */
const FONT_TIMEOUT_MS = 1600

/**
 * Lifts the boot loader once the themed app has rendered and fonts are ready.
 * The loader itself is server-rendered in the root layout, so it shows on the very
 * first paint; an inline failsafe in the layout also lifts it if scripts fail.
 */
export function PageReady() {
  useEffect(() => {
    const root = document.documentElement
    if (root.classList.contains('ms-ready')) return
    let cancelled = false
    let timer = 0

    const fontsReady = 'fonts' in document
      ? Promise.race([document.fonts.ready, new Promise(resolve => setTimeout(resolve, FONT_TIMEOUT_MS))])
      : Promise.resolve()

    void fontsReady.then(() => {
      if (cancelled) return
      const wait = Math.max(0, MIN_VISIBLE_MS - performance.now())
      timer = window.setTimeout(() => {
        // Two frames: the first paints the final layout under the loader, the second starts the exit.
        requestAnimationFrame(() => requestAnimationFrame(() => {
          if (cancelled) return
          root.classList.remove('ms-loading')
          root.classList.add('ms-ready')
          window.dispatchEvent(new Event('ms:ready'))
        }))
      }, wait)
    })

    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [])

  return null
}
