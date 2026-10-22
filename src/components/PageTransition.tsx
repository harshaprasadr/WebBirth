import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type AnchorHTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from 'react'
import { useLocation, useNavigate } from 'react-router'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { useReducedMotion } from '@/hooks/useMediaQuery'
import { useSmoothScroll } from './SmoothScroll'
import { Preloader } from './Preloader'
import { getProject } from '@/data/projects'

type TransitionApi = {
  /** Navigate with the curtain transition. Same-page hashes just scroll. */
  go: (to: string) => void
  /** True once the first-load intro curtain has lifted. */
  introDone: boolean
}

const TransitionContext = createContext<TransitionApi | null>(null)

const COVER = 'inset(100% 0% 0% 0%)'
const FULL = 'inset(0% 0% 0% 0%)'
const LIFT = 'inset(0% 0% 100% 0%)'

const labelFor = (path: string) => {
  if (path === '/') return 'WebBirth'
  const slug = path.split('/').filter(Boolean).pop() ?? ''
  if (path.startsWith('/work/')) return getProject(slug)?.name ?? 'Work'
  return slug.replace(/-/g, ' ')
}

const splitTo = (to: string) => {
  const [path, hash = ''] = to.split('#')
  return { path: path || '/', hash: hash ? `#${hash}` : '' }
}

/**
 * Full-screen curtain between routes:
 *  1. current page dims and drifts up while the curtain rises (~420ms)
 *  2. route swaps under the curtain, ScrollTrigger refreshes
 *  3. curtain lifts and the new page settles in (~480ms)
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { scrollTo, stop, start, resetTop } = useSmoothScroll()
  const reduced = useReducedMotion()

  const overlayRef = useRef<HTMLDivElement>(null)
  const brandRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)
  const activeLabelRef = useRef<HTMLElement | null>(null)
  const pageRef = useRef<HTMLDivElement>(null)
  const busy = useRef(false)
  const pending = useRef<{ hash: string } | null>(null)
  const [introDone, setIntroDone] = useState(false)

  // First load is handled by <Preloader>, which flips introDone as its curtain lifts.
  const onReveal = useCallback(() => setIntroDone(true), [])

  const go = useCallback(
    (to: string) => {
      const { path, hash } = splitTo(to)
      if (path === location.pathname) {
        if (hash) scrollTo(hash)
        else scrollTo(0)
        if (to !== location.pathname + location.hash) history.replaceState(null, '', to)
        return
      }
      if (busy.current) return
      busy.current = true

      const overlay = overlayRef.current
      const page = pageRef.current
      if (!overlay || !page || reduced) {
        pending.current = { hash }
        resetTop()
        navigate(path)
        return
      }

      stop()
      const isBrand = path === '/'
      if (isBrand) {
        if (brandRef.current) brandRef.current.style.display = 'flex'
        if (labelRef.current) labelRef.current.style.display = 'none'
        activeLabelRef.current = brandRef.current
      } else {
        if (brandRef.current) brandRef.current.style.display = 'none'
        if (labelRef.current) {
          labelRef.current.style.display = 'block'
          labelRef.current.textContent = labelFor(path)
        }
        activeLabelRef.current = labelRef.current
      }

      const activeEl = activeLabelRef.current || (isBrand ? brandRef.current : labelRef.current)

      const tl = gsap
        .timeline({
          onComplete: () => {
            pending.current = { hash }
            // Reset while the curtain covers the screen, so the next page's scroll animations
            // are created at the top instead of at the old page's scroll position.
            resetTop()
            navigate(path)
          },
        })
        .set(overlay, { visibility: 'visible', clipPath: COVER, autoAlpha: 1, force3D: true })
        .to(overlay, { clipPath: FULL, duration: 0.42, ease: 'power4.inOut' })
        .to(page, { y: -60, opacity: 0.4, duration: 0.42, ease: 'power3.in', force3D: true }, 0)

      if (activeEl) {
        tl.fromTo(activeEl, { yPercent: 110 }, { yPercent: 0, duration: 0.5, ease: 'expo.out' }, 0.2)
      }
      tl.fromTo(overlay.querySelector('[data-intro-bar]'), { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: 'power3.inOut' }, 0.15)
    },
    [location.pathname, location.hash, navigate, reduced, resetTop, scrollTo, start, stop],
  )

  // After any route change: reset scroll, refresh triggers, lift the curtain.
  useLayoutEffect(() => {
    const ours = pending.current
    pending.current = null
    const hash = ours ? ours.hash : location.hash

    scrollTo(0, { immediate: true })
    window.scrollTo(0, 0)

    const raf = requestAnimationFrame(() => {
      ScrollTrigger.refresh()
      if (hash) scrollTo(hash, { immediate: true })

      const overlay = overlayRef.current
      const page = pageRef.current
      if (!ours || !overlay || !page) {
        busy.current = false
        return
      }
      if (reduced) {
        busy.current = false
        start()
        return
      }

      const activeEl = activeLabelRef.current || (location.pathname === '/' ? brandRef.current : labelRef.current)

      const tl = gsap
        .timeline({
          onComplete: () => {
            gsap.set(overlay, { visibility: 'hidden' })
            gsap.set(page, { clearProps: 'transform,opacity' })
            if (brandRef.current) gsap.set(brandRef.current, { clearProps: 'transform' })
            if (labelRef.current) gsap.set(labelRef.current, { clearProps: 'transform' })
            busy.current = false
            start()
          },
        })

      if (activeEl) {
        tl.to(activeEl, { yPercent: -110, duration: 0.3, ease: 'power3.in' })
      }
      tl.to(overlay, { clipPath: LIFT, duration: 0.5, ease: 'power4.inOut' }, 0.08)
        .fromTo(page, { y: 80, opacity: 1 }, { y: 0, duration: 0.9, ease: 'expo.out', force3D: true }, 0.22)
    })
    return () => cancelAnimationFrame(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.key])

  const api = useMemo(() => ({ go, introDone }), [go, introDone])

  return (
    <TransitionContext.Provider value={api}>
      <div ref={pageRef}>
        <RouteScrollReset />
        {children}
      </div>
      <Preloader onReveal={onReveal} stopScroll={stop} startScroll={start} />
      <div
        ref={overlayRef}
        aria-hidden="true"
        className="fixed inset-0 z-[90] flex flex-col items-center justify-center bg-ink px-5 text-paper"
        style={{ clipPath: COVER, visibility: 'hidden' }}
      >
        {/* Name and bar stack in one column, so a 2–3 line project name pushes the bar down
            instead of running into it. */}
        <div className="block max-w-[min(100%,60rem)] overflow-clip pb-[0.08em]">
          <div
            ref={brandRef}
            className="flex items-center justify-center gap-[clamp(0.7rem,2.6vw,1.5rem)]"
            style={{ display: 'none' }}
          >
            <img
              src="/brand/webbirth-mark-lg.webp?v=2"
              alt=""
              width={656}
              height={480}
              className="block h-[clamp(2.3rem,10.5vw,5.5rem)] w-auto sm:h-[clamp(2.2rem,6.5vw,5.5rem)]"
            />
            <span className="flex items-start text-[clamp(2.3rem,10.5vw,6.5rem)] font-semibold uppercase leading-[0.95] tracking-[-0.055em] sm:text-[clamp(2.2rem,7vw,6.5rem)]">
              WEBBIRTH
              <span className="ml-[0.1em] mt-[0.06em] align-baseline text-[0.32em] font-semibold leading-none tracking-normal">®</span>
            </span>
          </div>
          <span
            ref={labelRef}
            className="block text-center text-[clamp(2.3rem,10.5vw,6.5rem)] font-semibold uppercase leading-[0.95] tracking-[-0.055em] [text-wrap:balance] sm:text-[clamp(2.2rem,7vw,6.5rem)]"
          />
        </div>
        <div className="mt-[clamp(1.75rem,5vw,3rem)] h-px w-40 overflow-clip bg-line-dark">
          <div data-intro-bar className="h-full origin-left bg-accent-2" />
        </div>
        <span className="type-meta absolute bottom-[max(2rem,calc(env(safe-area-inset-bottom)+1rem))] left-1/2 -translate-x-1/2 whitespace-nowrap text-muted-dark">
          Building what&rsquo;s next
        </span>
      </div>
    </TransitionContext.Provider>
  )
}

/**
 * Rendered before the routes so its layout effect runs before any page's effects: every new
 * page (including browser back/forward) builds its ScrollTriggers at scroll 0. Built at a stale
 * deep offset, `once` triggers fire and kill themselves mid-setup, which crashed GSAP and blanked the app.
 */
function RouteScrollReset() {
  const location = useLocation()
  const { resetTop } = useSmoothScroll()
  const first = useRef(true)
  useLayoutEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    resetTop()
  }, [location.key, resetTop])
  return null
}

export function usePageTransition() {
  const ctx = useContext(TransitionContext)
  if (!ctx) throw new Error('usePageTransition must be used inside <PageTransition>')
  return ctx
}

type TransitionLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & { to: string }

/** Anchor that routes through the page transition (falls back to native behaviour for new-tab clicks). */
export function TransitionLink({ to, onClick, children, ...rest }: TransitionLinkProps) {
  const { go } = usePageTransition()
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e)
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    e.preventDefault()
    go(to)
  }
  return (
    <a href={to} onClick={handle} {...rest}>
      {children}
    </a>
  )
}
