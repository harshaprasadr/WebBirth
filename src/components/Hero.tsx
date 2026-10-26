import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ArrowDown, ArrowRight, ArrowUpRight } from 'lucide-react'
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap'
import { hasWebGL, sceneState, useNearViewport } from '@/lib/webgl'
import { prefersReducedMotion } from '@/lib/env'
import { useReducedMotion } from '@/hooks/useMediaQuery'
import { cn } from '@/lib/cn'
import { Magnetic } from './Magnetic'
import { usePageTransition } from './PageTransition'
import { useSmoothScroll } from './SmoothScroll'
import { RollText } from './ui'

const HeroScene = lazy(() => import('./three/HeroScene'))

const disciplines = ['Strategy', 'Design', 'Engineering', 'Growth']

/**
 * Home hero — a dark full-bleed stage. A giant editorial headline spans the
 * width; the WebBirth mark floats over it in liquid glass and refracts it
 * (see three/HeroScene). The DOM headline is the source of truth for layout
 * and accessibility; the WebGL stage repaints it pixel-for-pixel, then the
 * DOM copy cross-fades out so only the refracted version is seen.
 */
export function Hero() {
  const scope = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const { introDone } = usePageTransition()
  const { scrollTo } = useSmoothScroll()
  const reduced = useReducedMotion()
  const webgl = useMemo(() => hasWebGL(), [])
  const near = useNearViewport(scope, '0px')

  // WebGL mounts after the preloader hands off (shader compiles never stall it).
  const [glMount, setGlMount] = useState(false)
  const [glReady, setGlReady] = useState(false)
  useEffect(() => {
    if (!introDone || !webgl) return
    const id = window.setTimeout(() => setGlMount(true), 500)
    return () => window.clearTimeout(id)
  }, [introDone, webgl])
  const onGlReady = useCallback(() => setGlReady(true), [])

  useGSAP(
    () => {
      const q = gsap.utils.selector(scope)
      const intro = q('[data-hero-in]')
      const lines = q('[data-line]')

      ScrollTrigger.create({
        trigger: scope.current,
        start: 'top top',
        end: 'bottom top',
        onUpdate: (self) => void (sceneState.heroScroll = self.progress),
      })

      if (!introDone) {
        gsap.set(intro, { autoAlpha: 0 })
        gsap.set(lines, { yPercent: 112 })
        return
      }
      if (prefersReducedMotion()) {
        gsap.set(lines, { yPercent: 0 })
        gsap.fromTo(intro, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6, ease: 'none' })
        return
      }
      gsap
        .timeline({ defaults: { ease: 'expo.out' } })
        .fromTo(q('[data-hero-top] > *'), { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1, stagger: 0.08 }, 0)
        .fromTo(lines, { yPercent: 112 }, { yPercent: 0, duration: 1.4, stagger: 0.12 }, 0.05)
        .fromTo(q('[data-hero-copy]'), { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1.1 }, 0.55)
        .fromTo(q('[data-hero-cta]'), { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1 }, 0.65)
                .fromTo(q('[data-hero-rail]'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 1 }, 0.9)

      // Scroll-out: UI fades and lifts while the glass pushes toward the camera.
      gsap.to(q('[data-hero-ui]'), {
        y: -60,
        autoAlpha: 0,
        ease: 'none',
        scrollTrigger: { trigger: scope.current, start: 'top top', end: '55% top', scrub: 0.5 },
      })
    },
    { scope, dependencies: [introDone], revertOnUpdate: true },
  )

  return (
    <section
      ref={scope}
      id="home"
      aria-labelledby="hero-title"
      data-nav-theme="dark"
      className="relative isolate h-[100svh] min-h-[620px] overflow-clip bg-[#080605] text-paper"
    >
      {/* stage glow — identical to the GL backdrop so the hand-off is seamless */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_50vmax_at_70%_48%,rgba(255,120,50,0.55)_0%,rgba(242,87,28,0.18)_30%,rgba(242,87,28,0)_100%)] portrait:bg-[radial-gradient(circle_50vmax_at_50%_58%,rgba(255,120,50,0.55)_0%,rgba(242,87,28,0.18)_30%,rgba(242,87,28,0)_100%)]"
      />

      {/* WebGL stage */}
      {webgl && glMount && (
        <Suspense fallback={null}>
          <div
            aria-hidden="true"
            className={cn('absolute inset-0 transition-opacity duration-[1400ms] ease-out', glReady ? 'opacity-100' : 'opacity-0')}
          >
            <HeroScene stageRef={scope} active={near} reduced={reduced} play={glReady} onReady={onGlReady} />
          </div>
        </Suspense>
      )}
      {!webgl && (
        <img
          src="/brand/webbirth-mark-lg.webp?v=2"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute right-[8%] top-1/2 w-[min(38vw,34rem)] -translate-y-1/2 opacity-90 max-md:left-1/2 max-md:right-auto max-md:top-1/2 max-md:w-[55vw] max-md:-translate-x-1/2"
        />
      )}

      {/* film grain */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 opacity-[0.045]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* UI layer — pointer events pass through to the canvas except on controls */}
      <div
        data-hero-ui
        className="gutter pointer-events-none relative z-20 flex h-full flex-col pb-4 pt-[5.75rem] lg:pt-[6.5rem]"
      >
        <div data-hero-top className="type-meta flex items-center justify-between gap-4 text-paper/55">
          <p className="flex items-center gap-3">
            <span className="relative flex size-2" aria-hidden="true">
              <span className="absolute inset-0 animate-ping rounded-full bg-accent/70 [animation-duration:2.4s]" />
              <span className="relative size-2 rounded-full bg-accent" />
            </span>
            <span>
              Digital products <span className="text-accent">·</span> Software <span className="text-accent">·</span>{' '}
              Technology
            </span>
          </p>
        </div>

        <div className="flex min-h-0 flex-1 flex-col justify-center max-md:justify-between max-md:pb-2 max-md:pt-4">
          <h1
            ref={titleRef}
            id="hero-title"
            className="font-semibold uppercase leading-[0.86] tracking-[-0.062em] text-[min(17.5vw,8.5svh)] md:text-[min(12.6vw,22svh)]"
          >
            <span className="line-mask">
              <span data-line data-gl-line className="block">
                <span data-seg="solid">We build</span>
              </span>
            </span>
            {/* wide screens: two lines */}
            <span className="line-mask max-md:hidden">
              <span data-line data-gl-line className="block">
                <span data-seg="outline" className="text-outline-light">What's </span>
                <span data-seg="solid">next</span>
              </span>
            </span>
            {/* phones: three lines */}
            <span className="line-mask md:hidden">
              <span data-line data-gl-line className="block">
                <span data-seg="outline" className="text-outline-light">What's</span>
              </span>
            </span>
            <span className="line-mask md:hidden">
              <span data-line data-gl-line className="block">
                <span data-seg="solid">Next</span>
              </span>
            </span>
          </h1>

          <div className="mt-8 md:mt-10 md:grid md:grid-cols-12 md:items-end md:gap-6">
            <div className="md:col-span-7 lg:col-span-6">
              <p data-hero-in data-hero-copy className="max-w-[31rem] text-[clamp(1rem,1.15vw,1.2rem)] leading-[1.55] text-paper/70">
                We combine innovative design, custom software development, and strategic digital marketing to build impactful digital experiences that move businesses forward
              </p>
              <div data-hero-in data-hero-cta className="pointer-events-auto mt-6 flex flex-wrap items-center gap-x-8 gap-y-3">
                <Magnetic strength={0.22}>
                  <button
                    type="button"
                    onClick={() => scrollTo('#contact')}
                    className="group relative inline-flex min-h-14 items-center gap-4 overflow-clip rounded-full bg-paper pl-7 pr-2 text-[0.82rem] font-medium uppercase tracking-[0.05em] text-ink transition-transform duration-500 ease-[var(--ease-expo)] hover:scale-[1.03] active:scale-[0.98]"
                  >
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 translate-y-full rounded-full bg-accent transition-transform duration-700 ease-[var(--ease-expo)] group-hover:translate-y-0 group-focus-visible:translate-y-0"
                    />
                    <span className="relative">
                      <RollText>Let's build something</RollText>
                    </span>
                    <span aria-hidden="true" className="relative flex size-10 items-center justify-center overflow-clip rounded-full bg-ink text-paper">
                      <ArrowUpRight
                        className="size-4 transition-transform duration-500 ease-[var(--ease-expo)] group-hover:-translate-y-[150%] group-hover:translate-x-[150%]"
                        strokeWidth={1.75}
                      />
                      <ArrowUpRight
                        className="absolute size-4 -translate-x-[150%] translate-y-[150%] transition-transform duration-500 ease-[var(--ease-expo)] group-hover:translate-x-0 group-hover:translate-y-0"
                        strokeWidth={1.75}
                      />
                    </span>
                  </button>
                </Magnetic>
                <button
                  type="button"
                  onClick={() => scrollTo('#work')}
                  className="group type-meta hidden min-h-11 items-center gap-2 text-paper sm:inline-flex"
                >
                  <span className="link-reveal">View our work</span>
                  <ArrowRight className="size-3.5 transition-transform duration-500 group-hover:translate-x-1" strokeWidth={1.75} aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div data-hero-in data-hero-rail className="type-meta flex items-center justify-between gap-6 border-t border-paper/10 pt-3 text-paper/55">
          <button type="button" onClick={() => scrollTo('#work')} className="group pointer-events-auto flex min-h-11 items-center gap-2 text-paper">
            Scroll to explore
            <ArrowDown className="size-3.5 transition-transform duration-500 group-hover:translate-y-1" strokeWidth={1.75} aria-hidden="true" />
          </button>
          <ul className="hidden items-center gap-x-[clamp(1rem,3vw,3rem)] sm:flex" aria-label="How we work">
            {disciplines.map((d, i) => (
              <li key={d} className="flex items-baseline gap-1.5">
                <span className="text-[0.68rem] text-accent">0{i + 1}</span>
                <span className="text-paper/80">{d}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
