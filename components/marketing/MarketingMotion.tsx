'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'

/** Motion is progressive enhancement: content stays visible if scripts fail. */
export function MarketingMotion({ pathname }: { pathname: string }) {
  useEffect(() => {
    let disposed = false
    let observer: IntersectionObserver | undefined
    let lenis: Lenis | undefined
    let handleAnchorClick: ((event: MouseEvent) => void) | undefined
    let handleLocationChange: (() => void) | undefined
    let hashFrame = 0
    let hashRetry = 0
    let hero: HTMLElement | null = null
    let progressBar: HTMLElement | null = null
    let lastScroll = 0
    let lastHeroStep = -1
    let scrollDirection: 'up' | 'down' = 'down'

    async function start() {
      if (disposed) return
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
      hero = document.querySelector<HTMLElement>('.ms-hero')
      progressBar = document.querySelector<HTMLElement>('.ms-scroll-progress')
      lenis = new Lenis({
        autoRaf: true,
        anchors: false,
        stopInertiaOnNavigate: true,
        respectReducedMotion: true,
        smoothWheel: true,
        lerp: 0.09,
      })
      const targetForHash = (hash: string) => {
        try { return document.getElementById(decodeURIComponent(hash.slice(1))) }
        catch { return null }
      }
      const alignCurrentHash = () => {
        if (pathname !== '/') return true
        if (!location.hash) {
          lenis?.scrollTo(0, { immediate: true })
          return true
        }
        const target = targetForHash(location.hash)
        if (!target) return false
        lenis?.scrollTo(target, { immediate: true })
        return true
      }
      const alignWithRetry = (attempt = 0) => {
        if (disposed || alignCurrentHash() || attempt >= 30) return
        hashRetry = window.setTimeout(() => alignWithRetry(attempt + 1), 100)
      }
      handleLocationChange = () => {
        if (hashFrame) cancelAnimationFrame(hashFrame)
        if (hashRetry) window.clearTimeout(hashRetry)
        hashFrame = requestAnimationFrame(() => { hashFrame = 0; alignWithRetry() })
      }
      if (pathname === '/') {
        window.addEventListener('popstate', handleLocationChange)
        window.addEventListener('hashchange', handleLocationChange)
        if (location.hash) hashFrame = requestAnimationFrame(() => { hashFrame = 0; alignWithRetry() })
      }
      handleAnchorClick = event => {
        if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
        if (!(event.target instanceof Element)) return
        const link = event.target.closest<HTMLAnchorElement>('.marketing-site a[href]')
        if (!link || link.classList.contains('ms-skip') || (link.target && link.target !== '_self')) return
        const destination = new URL(link.href)
        if (destination.origin !== location.origin || destination.pathname !== location.pathname || !destination.hash) return
        const target = targetForHash(destination.hash)
        if (!target) return
        const scrollMargin = Number.parseFloat(getComputedStyle(target).scrollMarginTop)
        const distance = Math.abs(target.getBoundingClientRect().top - (Number.isNaN(scrollMargin) ? 0 : scrollMargin))
        event.preventDefault()
        if (location.hash !== destination.hash) history.pushState(null, '', destination.hash)
        lenis?.scrollTo(target, {
          lerp: 0,
          duration: Math.min(1.8, Math.max(0.65, distance / 2200)),
          easing: progress => 1 - Math.pow(1 - progress, 3),
        })
      }
      document.addEventListener('click', handleAnchorClick, { capture: true })
      lenis.on('scroll', ({ progress, scroll }) => {
        if (progressBar) progressBar.style.transform = `scaleX(${progress})`
        if (Math.abs(scroll - lastScroll) > 2) scrollDirection = scroll < lastScroll ? 'up' : 'down'
        lastScroll = scroll
        if (pathname === '/' && hero && !reducedMotion.matches) {
          const heroProgress = Math.min(Math.max(scroll, 0) / 680, 1)
          const heroStep = Math.round(heroProgress * 1000)
          if (heroStep === lastHeroStep) return
          lastHeroStep = heroStep
          hero.style.setProperty('--ms-float-y', `${Math.round(heroProgress * -48)}px`)
          hero.style.setProperty('--ms-demo-shift', `${Math.round(heroProgress * -32)}px`)
          hero.style.setProperty('--ms-demo-rotate', `${(heroProgress * 2.5).toFixed(2)}deg`)
          hero.style.setProperty('--ms-demo-scale', (1 - heroProgress * 0.035).toFixed(3))
          hero.style.setProperty('--ms-copy-shift', `${Math.round(heroProgress * 24)}px`)
          hero.style.setProperty('--ms-product-y', `${Math.round(heroProgress * -32)}px`)
          hero.style.setProperty('--ms-headline-y', `${Math.round(heroProgress * -12)}px`)
          hero.style.setProperty('--ms-field-y', `${Math.round(heroProgress * 62)}px`)
        }
      })

      if (reducedMotion.matches || !('IntersectionObserver' in window)) return

      const { animate } = await import('animejs')
      if (disposed) return

      const targets = Array.from(document.querySelectorAll<HTMLElement>(pathname === '/'
        ? '.ms-homepage .ms-capability-band .ms-container > span, .ms-homepage .ms-section-heading, .ms-homepage .ms-benefit-tilt, .ms-homepage .ms-process-step, .ms-homepage .ms-story-heading, .ms-homepage .ms-plan-card, .ms-homepage .ms-faq-section > div, .ms-homepage .ms-faq-item, .ms-homepage .ms-contact-card'
        : '.ms-pricing-heading, .ms-offer-group-heading, .ms-plan-card'))
      const seen = new WeakSet<Element>()
      const lastAnimatedAt = new WeakMap<Element, number>()

      observer = new IntersectionObserver(entries => {
        if (reducedMotion.matches) return
        for (const entry of entries) {
          if (!entry.isIntersecting || entry.intersectionRatio < 0.12) continue
          const element = entry.target as HTMLElement
          if (pathname === '/' && seen.has(element)) continue
          const now = performance.now()
          if (now - (lastAnimatedAt.get(element) ?? -Infinity) < 800) continue
          lastAnimatedAt.set(element, now)
          const firstVisit = !seen.has(element)
          seen.add(element)
          const keepTransform = element.matches('.ms-story-step, .ms-plan-card, .ms-faq-item')
          const card = element.matches('.ms-benefit-tilt, .ms-process-step, .ms-story-artboard, .ms-contact-card')
          const siblingIndex = element.parentElement ? Array.from(element.parentElement.children).indexOf(element) : 0
          const homepage = pathname === '/'
          const delay = homepage && firstVisit && card && window.innerWidth > 680 ? (siblingIndex % 4) * 70 : 0
          animate(element, {
            opacity: [homepage ? 0.78 : firstVisit ? 0.6 : 0.86, 1],
            ...(!keepTransform && { y: [homepage ? (scrollDirection === 'up' ? -18 : 18) : scrollDirection === 'up' ? (firstVisit ? -32 : -20) : (firstVisit ? 32 : 20), 0] }),
            ...(card && { scale: [firstVisit ? 0.985 : 0.995, 1] }),
            delay,
            duration: homepage ? 680 : firstVisit ? 740 : 480,
            ease: 'out(4)',
          })
          if (pathname === '/') observer?.unobserve(element)
        }
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 })

      targets.forEach(element => observer?.observe(element))
    }

    void start().catch(() => { /* Keep native scrolling and visible content. */ })

    return () => {
      disposed = true
      observer?.disconnect()
      if (hashFrame) cancelAnimationFrame(hashFrame)
      if (hashRetry) window.clearTimeout(hashRetry)
      if (handleLocationChange) {
        window.removeEventListener('popstate', handleLocationChange)
        window.removeEventListener('hashchange', handleLocationChange)
      }
      if (handleAnchorClick) document.removeEventListener('click', handleAnchorClick, { capture: true })
      lenis?.destroy()
      progressBar?.style.removeProperty('transform')
      hero?.style.removeProperty('--ms-float-y')
      hero?.style.removeProperty('--ms-demo-shift')
      hero?.style.removeProperty('--ms-demo-rotate')
      hero?.style.removeProperty('--ms-demo-scale')
      hero?.style.removeProperty('--ms-copy-shift')
      hero?.style.removeProperty('--ms-product-y')
      hero?.style.removeProperty('--ms-headline-y')
      hero?.style.removeProperty('--ms-field-y')
    }
  }, [pathname])

  return null
}
