import { useLayoutEffect, useRef, useState } from 'react'
import { gsap } from '@/lib/gsap'
import { prefersReducedMotion } from '@/lib/env'

type PreloaderProps = {
  /** Fired as the curtain starts lifting — the page begins its own reveal underneath. */
  onReveal: () => void
  stopScroll: () => void
  startScroll: () => void
}

/**
 * Cinematic first-load preloader (runs once per page load, ~2.3s).
 *
 *  0.00  black stage
 *  0.10  logo mark revealed through a clip-path mask while it glides in horizontally
 *  0.35  wordmark follows with the same masked slide
 *  0.10  orange accent line draws 0 → 100% with a synced counter
 *  1.45  content exits upward
 *  1.55  two-layer curtain wipes up (black, then a thin orange band) → page revealed
 *
 * Reduced motion: logo shown statically, then a short fade.
 */
const STAGE = '#050505'
const PAPER = '#f3f2ee'

export function Preloader({ onReveal, stopScroll, startScroll }: PreloaderProps) {
  const [done, setDone] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return
    const q = gsap.utils.selector(root)
    const html = document.documentElement
    stopScroll()
    html.style.overflow = 'hidden'
    document.getElementById('boot')?.remove()

    // Mobile browsers tint their bars with theme-color / the root background: keep them black
    // while the stage is up so there's no cream strip around it, then hand back as the page shows.
    const theme = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
    const setChrome = (dark: boolean) => {
      theme?.setAttribute('content', dark ? STAGE : PAPER)
      html.style.backgroundColor = dark ? STAGE : ''
    }
    setChrome(true)
    const reveal = () => {
      setChrome(false)
      onReveal()
    }

    const finish = () => {
      html.style.overflow = ''
      setChrome(false)
      startScroll()
      setDone(true)
    }

    const tl = gsap.timeline({ paused: true, onComplete: finish })

    if (prefersReducedMotion()) {
      gsap.set(q('[data-pl-clip]'), { clipPath: 'inset(0% 0% 0% 0%)' })
      gsap.set(q('[data-pl-bar]'), { scaleX: 1 })
      tl.to(root, { autoAlpha: 0, duration: 0.45, ease: 'none', delay: 0.5 }).call(reveal, undefined, 0.5)
    } else {
      const counter = { v: 0 }
      const num = q('[data-pl-count]')[0]
      tl
        // mark: mask opens left → right while the image glides in from the left
        .fromTo(q('[data-pl-mark-clip]'), { clipPath: 'inset(0% 100% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.0, ease: 'expo.inOut' }, 0.1)
        .fromTo(q('[data-pl-mark]'), { xPercent: -45 }, { xPercent: 0, duration: 1.15, ease: 'expo.out' }, 0.1)
        // wordmark: same language, slightly behind
        .fromTo(q('[data-pl-word-clip]'), { clipPath: 'inset(0% 100% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.9, ease: 'expo.inOut' }, 0.35)
        .fromTo(q('[data-pl-word]'), { xPercent: -25, letterSpacing: '0.12em' }, { xPercent: 0, letterSpacing: '-0.045em', duration: 1.1, ease: 'expo.out' }, 0.35)
        // accent line + counter
        .fromTo(q('[data-pl-bar]'), { scaleX: 0 }, { scaleX: 1, duration: 1.2, ease: 'power3.inOut' }, 0.1)
        .to(counter, {
          v: 100,
          duration: 1.2,
          ease: 'power3.inOut',
          onUpdate: () => {
            if (num) num.textContent = String(Math.round(counter.v)).padStart(3, '0')
          },
        }, 0.1)
        .fromTo(q('[data-pl-meta]'), { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power2.out', stagger: 0.08 }, 0.3)
        // exit: content rises out, curtain wipes up
        .to(q('[data-pl-content]'), { yPercent: -18, autoAlpha: 0, duration: 0.5, ease: 'power3.in' }, 1.45)
        .to(q('[data-pl-meta]'), { autoAlpha: 0, duration: 0.3, ease: 'none' }, 1.45)
        .to(q('[data-pl-black]'), { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.8, ease: 'expo.inOut' }, 1.55)
        .to(q('[data-pl-accent]'), { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.76, ease: 'expo.inOut' }, 1.6)
        .call(reveal, undefined, 1.75)
    }

    let cancelled = false
    const markImg = root.querySelector<HTMLImageElement>('[data-pl-mark]')
    const imgReady = markImg?.complete
      ? Promise.resolve()
      : new Promise<void>((r) => {
          markImg?.addEventListener('load', () => r(), { once: true })
          markImg?.addEventListener('error', () => r(), { once: true })
        })
    // Start once the webfont + logo image are in (or after 800ms) so nothing reflows mid-reveal.
    Promise.race([
      Promise.all([document.fonts.ready, imgReady]),
      new Promise((r) => setTimeout(r, 800)),
    ]).then(() => {
      if (!cancelled) tl.play()
    })

    return () => {
      cancelled = true
      tl.kill()
      html.style.overflow = ''
      setChrome(false)
    }
    // Runs once per page load by design.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (done) return null

  return (
    <div ref={rootRef} className="fixed inset-0 z-[95]" role="status" aria-label="Loading WebBirth">
      {/* curtain layers: orange band trails the black panel on exit */}
      <div data-pl-accent className="absolute inset-0 bg-accent" style={{ clipPath: 'inset(0% 0% 0% 0%)' }} />
      <div
        data-pl-black
        className="absolute inset-0 flex flex-col items-center justify-center bg-[#050505] text-paper"
        style={{ clipPath: 'inset(0% 0% 0% 0%)' }}
      >
        {/* faint grid for depth */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
            backgroundSize: '72px 72px',
            maskImage: 'radial-gradient(circle at 50% 50%, black 0%, transparent 65%)',
            WebkitMaskImage: 'radial-gradient(circle at 50% 50%, black 0%, transparent 65%)',
          }}
        />

        <div data-pl-content className="relative flex flex-col items-center">
          <div className="flex items-center gap-[clamp(0.7rem,2.6vw,1.5rem)]">
            <div data-pl-clip data-pl-mark-clip className="overflow-clip" style={{ clipPath: 'inset(0% 100% 0% 0%)' }}>
              <img
                data-pl-mark
                src="/brand/webbirth-mark-lg.webp?v=2"
                alt=""
                width={656}
                height={480}
                fetchPriority="high"
                className="block h-[clamp(3.25rem,14.5vw,5.5rem)] w-auto sm:h-[clamp(3.25rem,7vw,5.5rem)]"
              />
            </div>
            <div data-pl-clip data-pl-word-clip className="overflow-clip py-[0.08em] pr-[0.12em]" style={{ clipPath: 'inset(0% 100% 0% 0%)' }}>
              <span
                data-pl-word
                className="flex items-start text-[clamp(2rem,10.4vw,4.4rem)] font-semibold leading-none tracking-[-0.045em] sm:text-[clamp(2.1rem,5.4vw,4.4rem)]"
              >
                WEBBIRTH
                <span className="ml-[0.1em] mt-[0.06em] align-baseline text-[0.32em] font-semibold leading-none tracking-normal">®</span>
              </span>
            </div>
          </div>

          <div className="mt-7 h-px w-[min(22rem,80vw)] bg-white/10 sm:w-[min(22rem,64vw)]">
            <div data-pl-bar className="h-full origin-left scale-x-0 bg-accent" />
          </div>
        </div>

        <div className="type-meta absolute inset-x-0 bottom-0 flex items-end justify-between px-5 pb-[max(2rem,calc(env(safe-area-inset-bottom)+1rem))] pt-5 text-white/45 sm:p-[clamp(1rem,3vw,2.5rem)]">
          <span data-pl-meta className="hidden sm:inline">Software · Products · Technology</span>
          <span data-pl-meta className="absolute inset-x-0 bottom-[max(2rem,calc(env(safe-area-inset-bottom)+1rem))] text-center text-white/30 sm:bottom-[clamp(1rem,3vw,2.5rem)]">
            Passion meets profession
          </span>
          <span data-pl-meta className="hidden tabular-nums text-white sm:inline">
            <span data-pl-count>000</span>
          </span>
        </div>
      </div>
    </div>
  )
}
