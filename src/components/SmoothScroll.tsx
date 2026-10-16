import Lenis from 'lenis'
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, type ReactNode } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { useReducedMotion } from '@/hooks/useMediaQuery'

type ScrollTarget = string | number | HTMLElement

type SmoothScrollApi = {
  scrollTo: (target: ScrollTarget, opts?: { immediate?: boolean; offset?: number }) => void
  stop: () => void
  start: () => void
  /** Jump to the very top immediately, even while scrolling is stopped. */
  resetTop: () => void
  lenis: () => Lenis | null
}

const SmoothScrollContext = createContext<SmoothScrollApi | null>(null)

const NAV_OFFSET = 0

/**
 * Lenis smooth scrolling, driven by GSAP's ticker so ScrollTrigger and Lenis
 * share one clock. Disabled entirely when the user prefers reduced motion.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion()
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    if (reduced) return

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.4,
    })
    lenisRef.current = lenis

    lenis.on('scroll', ScrollTrigger.update)
    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [reduced])

  const scrollTo = useCallback<SmoothScrollApi['scrollTo']>((target, opts = {}) => {
    const offset = opts.offset ?? NAV_OFFSET
    const lenis = lenisRef.current
    const el = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target
    if (el === null) return

    if (lenis) {
      // Route changes alter page height; refresh Lenis' cached limit before jumping.
      if (opts.immediate) lenis.resize()
      lenis.scrollTo(el, {
        offset,
        immediate: opts.immediate,
        force: true,
        duration: 1.6,
        easing: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
      })
      return
    }

    const top = typeof el === 'number' ? el : el.getBoundingClientRect().top + window.scrollY + offset
    window.scrollTo({ top, behavior: opts.immediate || reduced ? 'auto' : 'smooth' })
  }, [reduced])

  const resetTop = useCallback(() => {
    const lenis = lenisRef.current
    // A stopped Lenis puts overflow:clip on <html>, and Safari then ignores programmatic scrolling.
    const wasStopped = !!lenis?.isStopped
    if (wasStopped) lenis!.start()
    lenis?.scrollTo(0, { immediate: true, force: true })
    window.scrollTo(0, 0)
    if (wasStopped) lenis!.stop()
  }, [])

  const api = useMemo<SmoothScrollApi>(
    () => ({
      scrollTo,
      stop: () => lenisRef.current?.stop(),
      start: () => lenisRef.current?.start(),
      resetTop,
      lenis: () => lenisRef.current,
    }),
    [scrollTo, resetTop],
  )

  return <SmoothScrollContext.Provider value={api}>{children}</SmoothScrollContext.Provider>
}

export function useSmoothScroll() {
  const ctx = useContext(SmoothScrollContext)
  if (!ctx) throw new Error('useSmoothScroll must be used inside <SmoothScroll>')
  return ctx
}
