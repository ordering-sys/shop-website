'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'

/**
 * Scroll and pointer motion for the public marketing pages.
 *
 * Everything here is progressive enhancement: without JavaScript, or with reduced motion,
 * the content renders fully visible in its natural layout. Hooks are plain data attributes:
 *
 *  - data-reveal           Fades/rises in when it enters the viewport and back out when it
 *                          leaves, from below while scrolling down and from above while
 *                          scrolling up. `style="--reveal-i: n"` staggers siblings.
 *  - data-progress         Writes `--p` (0 → 1) as the element moves through the viewport.
 *                          "pin" measures progress across a tall sticky section instead.
 *  - data-speed="0.2"      Parallax: translates the element relative to its parent.
 *  - data-hscroll          Pinned section whose `[data-hscroll-track]` scrolls sideways.
 *  - data-marquee          Endless band; speeds up with scroll velocity, follows direction.
 *  - data-tilt             Card tilts toward a fine pointer and tracks a soft highlight.
 *  - data-pointer-scene    Writes `--mx`/`--my` (-1 → 1) for 3D scenes that follow the pointer.
 */
export function MarketingMotion({ pathname }: { pathname: string }) {
  useEffect(() => {
    const site = document.querySelector<HTMLElement>('.marketing-site')
    if (!site) return
    const root = document.documentElement
    const reducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const fineQuery = window.matchMedia('(hover: hover) and (pointer: fine)')
    const wideQuery = window.matchMedia('(min-width: 901px)')
    const header = site.querySelector<HTMLElement>('.ms-header')
    const progressBar = site.querySelector<HTMLElement>('.ms-scroll-progress')

    let disposed = false
    let raf = 0
    let dirty = true
    let lastY = window.scrollY
    let direction: 'up' | 'down' = 'down'
    let lastTime = 0
    let rescanFrame = 0
    let hashFrame = 0
    let hashRetry = 0

    let reveals: HTMLElement[] = []
    let progressEls: HTMLElement[] = []
    let parallaxEls: HTMLElement[] = []
    let hscrolls: { section: HTMLElement; track: HTMLElement; distance: number }[] = []
    let marquees: { el: HTMLElement; track: HTMLElement; width: number; x: number; visible: boolean }[] = []
    let tiltEl: HTMLElement | null = null
    let pointerScene: HTMLElement | null = null
    let pointer = { x: 0, y: 0, pending: false }
    const easedStates = new Map<HTMLElement, { current: number; target: number; written?: number }>()

    const motionAllowed = () => !reducedQuery.matches
    const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value))
    const easeInOut = (t: number) => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

    root.dataset.scrollDir = direction
    if (motionAllowed()) root.classList.add('ms-motion')

    const lenis = new Lenis({
      autoRaf: false,
      anchors: false,
      stopInertiaOnNavigate: true,
      respectReducedMotion: true,
      smoothWheel: true,
      syncTouch: false,
      lerp: 0.075,
      wheelMultiplier: 0.9,
    })

    // Hold smooth scrolling while the boot loader covers the page.
    const onReady = () => { lenis.start(); dirty = true }
    if (root.classList.contains('ms-loading')) {
      lenis.stop()
      window.addEventListener('ms:ready', onReady, { once: true })
    }

    /* ── Reveal on enter, hide on leave, in both scroll directions ── */
    const revealObserver = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
      for (const entry of entries) {
        const el = entry.target as HTMLElement
        if (entry.isIntersecting) {
          el.dataset.inview = 'true'
        } else {
          el.dataset.from = entry.boundingClientRect.top > 0 ? 'below' : 'above'
          el.dataset.inview = 'false'
        }
      }
    }, { rootMargin: '0px 0px -7% 0px', threshold: 0 }) : null

    const marqueeObserver = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
      for (const entry of entries) {
        const item = marquees.find(marquee => marquee.el === entry.target)
        if (item) item.visible = entry.isIntersecting
      }
    }) : null

    /* ── Measurements (on load, resize, and DOM changes such as switching language) ── */
    function measure() {
      // Read every width first. The track's width does not depend on the section height, so
      // the pinned height is never cleared mid-measure (that could clamp the scroll position).
      const enabled = wideQuery.matches && motionAllowed()
      const next = Array.from(site!.querySelectorAll<HTMLElement>('[data-hscroll]')).flatMap(section => {
        const track = section.querySelector<HTMLElement>('[data-hscroll-track]')
        if (!track || !enabled) return []
        return [{ section, track, distance: Math.max(0, track.scrollWidth - track.clientWidth) }]
      })
      for (const item of hscrolls) {
        if (next.some(candidate => candidate.section === item.section)) continue
        item.section.style.removeProperty('height')
        item.track.style.removeProperty('transform')
      }
      for (const item of next) item.section.style.height = `${Math.round(window.innerHeight + item.distance)}px`
      hscrolls = next

      // Horizontal distance from the hero scene's resting centre to the viewport centre.
      // Measured on the untransformed stage, so its own scroll transform never feeds back.
      const scene = site!.querySelector<HTMLElement>('[data-center-scene]')
      const sceneHost = scene?.closest<HTMLElement>('[data-progress]')
      if (scene && sceneHost) {
        if (enabled) {
          const rect = scene.getBoundingClientRect()
          const offset = document.documentElement.clientWidth / 2 - (rect.left + rect.width / 2)
          sceneHost.style.setProperty('--center-x', `${Math.round(offset)}px`)
        } else {
          sceneHost.style.removeProperty('--center-x')
        }
      }
      for (const marquee of marquees) {
        marquee.width = marquee.track.scrollWidth / 2
      }
      dirty = true
    }

    function scan() {
      rescanFrame = 0
      const nextReveals = Array.from(site!.querySelectorAll<HTMLElement>('[data-reveal]'))
      for (const el of nextReveals) {
        if (!reveals.includes(el)) revealObserver?.observe(el)
      }
      for (const el of reveals) {
        if (!nextReveals.includes(el)) revealObserver?.unobserve(el)
      }
      reveals = nextReveals
      progressEls = Array.from(site!.querySelectorAll<HTMLElement>('[data-progress]'))
      const nextParallax = Array.from(site!.querySelectorAll<HTMLElement>('[data-speed]'))
      for (const el of parallaxEls) {
        if (!nextParallax.includes(el)) el.style.removeProperty('transform')
      }
      parallaxEls = nextParallax
      const marqueeEls = Array.from(site!.querySelectorAll<HTMLElement>('[data-marquee]'))
      const nextMarquees = marqueeEls.flatMap(el => {
        const track = el.querySelector<HTMLElement>('[data-marquee-track]')
        if (!track) return []
        const existing = marquees.find(marquee => marquee.el === el && marquee.track === track)
        if (!existing) marqueeObserver?.observe(el)
        return [existing ?? { el, track, width: 0, x: 0, visible: true }]
      })
      for (const marquee of marquees) if (!marqueeEls.includes(marquee.el)) marqueeObserver?.unobserve(marquee.el)
      marquees = nextMarquees
      pointerScene = site!.querySelector<HTMLElement>('[data-pointer-scene]')
      measure()
    }

    const mutationObserver = new MutationObserver(() => {
      if (!rescanFrame) rescanFrame = requestAnimationFrame(scan)
    })
    mutationObserver.observe(site, { childList: true, subtree: true })

    /* ── Scroll-driven values, batched: all reads first, then all writes ── */
    function updateScroll() {
      dirty = false
      const y = window.scrollY
      const viewport = window.innerHeight
      if (Math.abs(y - lastY) > 3) {
        const next = y > lastY ? 'down' : 'up'
        if (next !== direction) {
          direction = next
          root.dataset.scrollDir = direction
        }
        lastY = y
      }

      const maxScroll = Math.max(1, document.documentElement.scrollHeight - viewport)
      const menuOpen = !!header?.querySelector('.ms-mobile-nav:not([hidden])')
      const focusInHeader = !!header?.contains(document.activeElement) && document.activeElement !== document.body
      const hideHeader = direction === 'down' && y > 220 && !menuOpen && !focusInHeader

      const progressReads = progressEls.map(el => {
        const rect = el.getBoundingClientRect()
        if (el.dataset.progress === 'pin') {
          const span = rect.height - viewport > 120 ? rect.height - viewport : rect.height
          return clamp(-rect.top / Math.max(span, 1))
        }
        return clamp((viewport - rect.top) / (viewport + rect.height))
      })
      const allowMotion = motionAllowed()
      const parallaxReads = allowMotion ? parallaxEls.map(el => {
        const parent = el.parentElement
        if (!parent) return null
        const rect = parent.getBoundingClientRect()
        if (rect.bottom < -viewport * .5 || rect.top > viewport * 1.5) return null
        const speed = Number.parseFloat(el.dataset.speed ?? '0') * (wideQuery.matches ? 1 : .5)
        return (rect.top + rect.height / 2 - viewport / 2) * -speed
      }) : []
      const hscrollReads = hscrolls.map(item => clamp(-item.section.getBoundingClientRect().top / Math.max(item.distance, 1)))

      if (progressBar) progressBar.style.transform = `scaleX(${(y / maxScroll).toFixed(4)})`
      header?.classList.toggle('is-hidden', hideHeader)
      header?.classList.toggle('is-scrolled', y > 8)
      progressEls.forEach((el, index) => {
        const progress = progressReads[index]
        el.style.setProperty('--p', progress.toFixed(4))
        // data-progress-ease="0.65": an eased 0 → 1 value over the first 65% of the progress,
        // which then holds at 1 (used to glide the hero scene to centre and lock it there).
        // The value is not written here: updateEased() glides toward it frame by frame.
        const span = Number.parseFloat(el.dataset.progressEase ?? '')
        if (span > 0) {
          const target = easeInOut(clamp(progress / span))
          const state = easedStates.get(el)
          if (state) state.target = target
          else easedStates.set(el, { current: target, target })
        }
      })
      parallaxEls.forEach((el, index) => {
        const offset = parallaxReads[index]
        if (offset == null) return
        el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`
      })
      hscrolls.forEach((item, index) => {
        const progress = hscrollReads[index]
        item.track.style.transform = `translate3d(${(-progress * item.distance).toFixed(1)}px, 0, 0)`
        item.section.style.setProperty('--h', progress.toFixed(4))
      })
    }

    /* ── Marquee: constant drift that follows scroll direction and velocity ── */
    function updateMarquees(delta: number) {
      if (!marquees.length || !motionAllowed()) return
      const sign = direction === 'down' ? -1 : 1
      const boost = Math.min(Math.abs(lenis.velocity || 0), 60) * 0.9
      for (const marquee of marquees) {
        if (!marquee.visible || marquee.width <= 0) continue
        marquee.x += sign * (0.045 * delta + boost * delta * 0.03)
        if (marquee.x <= -marquee.width) marquee.x += marquee.width
        if (marquee.x > 0) marquee.x -= marquee.width
        marquee.track.style.transform = `translate3d(${marquee.x.toFixed(2)}px, 0, 0)`
      }
    }

    /* ── Eased scroll values: exponential follow, frame-rate independent ──
       Each frame closes ~a fixed share of the gap to the scroll target (time constant
       EASE_MS), so wheel steps blend into one continuous glide instead of jumping. */
    const EASE_MS = 260
    function updateEased(delta: number) {
      if (!easedStates.size) return
      const follow = motionAllowed() ? 1 - Math.exp(-delta / EASE_MS) : 1
      for (const [el, state] of easedStates) {
        if (!el.isConnected) { easedStates.delete(el); continue }
        const gap = state.target - state.current
        if (Math.abs(gap) < 0.0004 && state.written === state.target) continue
        state.current = Math.abs(gap) < 0.0004 ? state.target : state.current + gap * follow
        state.written = state.current
        el.style.setProperty('--pe', state.current.toFixed(4))
        const locked = state.current > .8
        if ((el.dataset.locked === 'true') !== locked) el.dataset.locked = String(locked)
      }
    }

    function updatePointer() {
      pointer.pending = false
      if (!pointerScene) return
      pointerScene.style.setProperty('--mx', (pointer.x / window.innerWidth * 2 - 1).toFixed(3))
      pointerScene.style.setProperty('--my', (pointer.y / window.innerHeight * 2 - 1).toFixed(3))
    }

    function tick(time: number) {
      const delta = lastTime ? Math.min(64, time - lastTime) : 16
      lastTime = time
      lenis.raf(time)
      if (dirty) updateScroll()
      updateEased(delta)
      updateMarquees(delta)
      if (pointer.pending) updatePointer()
      raf = requestAnimationFrame(tick)
    }

    const markDirty = () => { dirty = true }
    lenis.on('scroll', markDirty)
    window.addEventListener('scroll', markDirty, { passive: true })

    let resizeTimer = 0
    const onResize = () => {
      window.clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(measure, 120)
      dirty = true
    }
    window.addEventListener('resize', onResize)

    /* ── Pointer: 3D scene and card tilt (fine pointers only) ── */
    const resetTilt = (el: HTMLElement | null) => {
      if (!el) return
      el.style.removeProperty('--tilt-x')
      el.style.removeProperty('--tilt-y')
      el.removeAttribute('data-tilting')
    }
    const onPointerMove = (event: PointerEvent) => {
      if (!fineQuery.matches || !motionAllowed() || event.pointerType !== 'mouse') return
      pointer = { x: event.clientX, y: event.clientY, pending: true }
      const target = event.target instanceof Element ? event.target.closest<HTMLElement>('[data-tilt]') : null
      if (target !== tiltEl) {
        resetTilt(tiltEl)
        tiltEl = target
      }
      if (!tiltEl) return
      const rect = tiltEl.getBoundingClientRect()
      const px = clamp((event.clientX - rect.left) / rect.width)
      const py = clamp((event.clientY - rect.top) / rect.height)
      tiltEl.dataset.tilting = 'true'
      tiltEl.style.setProperty('--tilt-x', ((0.5 - py) * 9).toFixed(2))
      tiltEl.style.setProperty('--tilt-y', ((px - 0.5) * 11).toFixed(2))
      tiltEl.style.setProperty('--gx', `${(px * 100).toFixed(1)}%`)
      tiltEl.style.setProperty('--gy', `${(py * 100).toFixed(1)}%`)
    }
    const onPointerLeave = () => { resetTilt(tiltEl); tiltEl = null }
    site.addEventListener('pointermove', onPointerMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', onPointerLeave)

    const onReducedChange = () => {
      root.classList.toggle('ms-motion', motionAllowed())
      if (!motionAllowed()) {
        parallaxEls.forEach(el => el.style.removeProperty('transform'))
        marquees.forEach(marquee => marquee.track.style.removeProperty('transform'))
        resetTilt(tiltEl)
      }
      measure()
    }
    reducedQuery.addEventListener('change', onReducedChange)
    wideQuery.addEventListener('change', measure)

    /* ── In-page anchors: smooth Lenis scroll, safe same-page targets only ── */
    const targetForHash = (hash: string) => {
      try { return document.getElementById(decodeURIComponent(hash.slice(1))) }
      catch { return null }
    }
    const alignCurrentHash = () => {
      if (pathname !== '/') return true
      if (!location.hash) return true
      const target = targetForHash(location.hash)
      if (!target) return false
      lenis.scrollTo(target, { immediate: true, force: true })
      return true
    }
    const alignWithRetry = (attempt = 0) => {
      if (disposed || alignCurrentHash() || attempt >= 30) return
      hashRetry = window.setTimeout(() => alignWithRetry(attempt + 1), 100)
    }
    const onLocationChange = () => {
      if (hashFrame) cancelAnimationFrame(hashFrame)
      if (hashRetry) window.clearTimeout(hashRetry)
      hashFrame = requestAnimationFrame(() => { hashFrame = 0; alignWithRetry() })
    }
    if (pathname === '/') {
      window.addEventListener('popstate', onLocationChange)
      window.addEventListener('hashchange', onLocationChange)
    }
    const onAnchorClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      if (!(event.target instanceof Element)) return
      const link = event.target.closest<HTMLAnchorElement>('.marketing-site a[href]')
      if (!link || link.classList.contains('ms-skip') || (link.target && link.target !== '_self')) return
      let destination: URL
      try { destination = new URL(link.href) } catch { return }
      if (destination.origin !== location.origin || destination.pathname !== location.pathname || !destination.hash) return
      const target = targetForHash(destination.hash)
      if (!target) return
      event.preventDefault()
      if (location.hash !== destination.hash) history.pushState(null, '', destination.hash)
      const distance = Math.abs(target.getBoundingClientRect().top)
      lenis.scrollTo(target, {
        lerp: 0,
        force: true,
        duration: Math.min(1.9, Math.max(0.7, distance / 2400)),
        easing: progress => 1 - Math.pow(1 - progress, 4),
        onComplete: () => {
          if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1')
          target.focus({ preventScroll: true })
        },
      })
    }
    document.addEventListener('click', onAnchorClick, { capture: true })

    scan()
    raf = requestAnimationFrame(tick)
    if (pathname === '/' && location.hash) hashFrame = requestAnimationFrame(() => { hashFrame = 0; alignWithRetry() })

    return () => {
      disposed = true
      cancelAnimationFrame(raf)
      if (rescanFrame) cancelAnimationFrame(rescanFrame)
      if (hashFrame) cancelAnimationFrame(hashFrame)
      if (hashRetry) window.clearTimeout(hashRetry)
      window.clearTimeout(resizeTimer)
      revealObserver?.disconnect()
      marqueeObserver?.disconnect()
      mutationObserver.disconnect()
      window.removeEventListener('ms:ready', onReady)
      lenis.off('scroll', markDirty)
      window.removeEventListener('scroll', markDirty)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('popstate', onLocationChange)
      window.removeEventListener('hashchange', onLocationChange)
      document.removeEventListener('click', onAnchorClick, { capture: true })
      site.removeEventListener('pointermove', onPointerMove)
      document.documentElement.removeEventListener('pointerleave', onPointerLeave)
      reducedQuery.removeEventListener('change', onReducedChange)
      wideQuery.removeEventListener('change', measure)
      lenis.destroy()
      root.classList.remove('ms-motion')
      delete root.dataset.scrollDir
      for (const el of progressEls) { el.style.removeProperty('--p'); el.style.removeProperty('--pe'); el.style.removeProperty('--center-x'); delete el.dataset.locked }
      progressBar?.style.removeProperty('transform')
      header?.classList.remove('is-hidden', 'is-scrolled')
      for (const el of reveals) { delete el.dataset.inview; delete el.dataset.from }
      for (const el of parallaxEls) el.style.removeProperty('transform')
      for (const item of hscrolls) { item.section.style.removeProperty('height'); item.track.style.removeProperty('transform') }
      for (const marquee of marquees) marquee.track.style.removeProperty('transform')
      resetTilt(tiltEl)
    }
  }, [pathname])

  return null
}
