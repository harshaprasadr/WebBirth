import { lazy, Suspense, useMemo, useRef, useState } from 'react'
import { gsap, mq, ScrollTrigger, useGSAP } from '@/lib/gsap'
import { hasWebGL, sceneState, useNearViewport } from '@/lib/webgl'
import { useReducedMotion } from '@/hooks/useMediaQuery'
import { cn } from '@/lib/cn'
import { usePageTransition } from './PageTransition'

const MorphScene = lazy(() => import('./three/MorphScene'))

const chapters = [
  {
    key: 'Spark',
    title: ['Every product', 'starts as a spark.'],
    body: 'A question, a sketch, a problem worth solving. We start by understanding your business, your users, your goals.',
  },
  {
    key: 'Shape',
    title: ['We give it form', 'and identity.'],
    body: 'Strategy and design turn raw ideas into a brand and an experience people recognise and trust.',
  },
  {
    key: 'System',
    title: ['Then engineer it', 'to scale.'],
    body: 'Robust software, cloud and APIs, a living system that performs today and grows with you tomorrow.',
  },
]

/**
 * Scroll progress (0–1) → morph value (0 galaxy · 1 logo · 2 system) with
 * holds on each shape so every chapter gets a beat to breathe.
 */
const toMorph = (p: number) => {
  if (p < 0.12) return 0
  if (p < 0.42) return (p - 0.12) / 0.3
  if (p < 0.58) return 1
  if (p < 0.88) return 1 + (p - 0.58) / 0.3
  return 2
}
const toChapter = (p: number) => (p < 0.3 ? 0 : p < 0.74 ? 1 : 2)

/**
 * "From spark to system" — a pinned, scroll-scrubbed WebGL sequence where
 * ~15k particles travel from a galaxy, into the WebBirth mark, into a living
 * grid. Reduced motion: no pin, the mark is shown formed and chapters stack.
 */
export function SparkToSystem() {
  const scope = useRef<HTMLElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const barRef = useRef<HTMLDivElement>(null)
  const [chapter, setChapter] = useState(0)
  const [glReady, setGlReady] = useState(false)
  const reduced = useReducedMotion()
  const webgl = useMemo(() => hasWebGL(), [])
  const near = useNearViewport(stage, '0px')
  const { introDone } = usePageTransition()

  useGSAP(
    () => {
      sceneState.morph = 0
      const mm = gsap.matchMedia()
      mm.add(mq.motion, () => {
        let last = 0
        ScrollTrigger.create({
          trigger: stage.current,
          start: 'top top',
          end: () => `+=${window.innerHeight * (window.innerWidth < 768 ? 2.4 : 2.8)}`,
          pin: true,
          scrub: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            sceneState.morph = toMorph(self.progress)
            if (barRef.current) barRef.current.style.transform = `scaleY(${self.progress})`
            const c = toChapter(self.progress)
            if (c !== last) {
              last = c
              setChapter(c)
            }
          },
        })
        // Title block drifts in as the stage arrives.
        gsap.fromTo(
          '[data-sts-intro]',
          { y: 60, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: stage.current, start: 'top 70%', once: true } },
        )
      })
      mm.add(mq.reduced, () => {
        sceneState.morph = 1
      })
      return () => mm.revert()
    },
    { scope },
  )

  return (
    <section
      ref={scope}
      aria-labelledby="sts-title"
      data-hides-cta
      data-nav-theme="dark"
      className="relative bg-[#060606] text-paper"
    >
      <div ref={stage} className={cn('relative overflow-clip', reduced ? 'min-h-[100svh]' : 'h-[100svh]')}>
        {/* atmosphere */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 size-[min(90vw,900px)] -translate-x-1/2 -translate-y-1/2 rounded-full glow opacity-[0.08]"
        />

        {/* WebGL */}
        {webgl && introDone && (
          <Suspense fallback={null}>
            <div
              className={cn(
                'absolute inset-x-0 top-0 transition-opacity duration-[1600ms]',
                reduced ? 'h-[100svh]' : 'bottom-0',
                glReady ? (reduced ? 'opacity-40' : 'opacity-100') : 'opacity-0',
              )}
              aria-hidden="true"
            >
              <MorphScene active={near} reduced={reduced} onReady={() => setGlReady(true)} />
            </div>
          </Suspense>
        )}
        {!webgl && (
          <img
            src="/brand/webbirth-mark-lg.webp?v=2"
            alt=""
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 w-[min(60vw,28rem)] -translate-x-1/2 -translate-y-1/2 opacity-90"
          />
        )}

        {/* legibility scrims behind text */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[30%] bg-gradient-to-b from-[#060606] via-[#060606]/50 to-transparent sm:h-[22%]" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-[50%] bg-gradient-to-t from-[#060606] via-[#060606]/60 to-transparent sm:h-[38%]" />

        {/* overlay UI */}
        <div
          className={cn(
            'gutter pointer-events-none flex flex-col justify-between pb-[clamp(1.5rem,4vw,3rem)] pt-24 lg:pt-28',
            reduced ? 'relative min-h-[100svh] gap-16' : 'absolute inset-0',
          )}
        >
          <div className="contents">
          <div data-sts-intro className="flex items-start justify-between gap-6">
            <div>
              <p className="type-meta text-muted-dark">In motion</p>
              <h2 id="sts-title" className="mt-3 text-[clamp(1.6rem,3.2vw,3rem)] font-semibold uppercase leading-[0.92] tracking-[-0.045em]">
                From spark
                <br />
                to system<span className="text-accent">.</span>
              </h2>
            </div>
            <p className="type-meta tabular-nums text-muted-dark" aria-hidden="true">
              <span className="text-paper">{String(chapter + 1).padStart(2, '0')}</span> / 03
            </p>
          </div>

          <div className="flex items-end justify-between gap-8">
            {/* chapters */}
            <div className="relative min-h-[14rem] w-full max-w-[40rem] sm:min-h-[15rem]" aria-live="polite">
              {chapters.map((c, i) => (
                <div
                  key={c.key}
                  aria-hidden={reduced ? undefined : i !== chapter}
                  className={cn(
                    'bottom-0 left-0 w-full',
                    reduced ? 'relative mb-8' : 'absolute',
                  )}
                >
                  <p
                    className={cn(
                      'type-meta flex items-center gap-3 text-accent-2 transition-all duration-700 ease-[var(--ease-expo)]',
                      reduced || i === chapter ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0',
                    )}
                  >
                    <span>0{i + 1}</span>
                    <span className="h-px w-8 bg-accent-2/60" />
                    <span>{c.key}</span>
                  </p>
                  <h3 className="mt-4 text-[clamp(2rem,5.2vw,4.8rem)] font-semibold uppercase leading-[0.9] tracking-[-0.05em]">
                    {c.title.map((line, li) => (
                      <span key={line} className="block overflow-clip pb-[0.06em]">
                        <span
                          className="block transition-transform duration-[900ms] ease-[var(--ease-expo)]"
                          style={{
                            transform: reduced || i === chapter ? 'translateY(0)' : i < chapter ? 'translateY(-110%)' : 'translateY(110%)',
                            transitionDelay: i === chapter ? `${120 + li * 70}ms` : '0ms',
                          }}
                        >
                          {line}
                        </span>
                      </span>
                    ))}
                  </h3>
                  <p
                    className={cn(
                      'type-body mt-5 max-w-md text-paper/60 transition-all duration-700 ease-[var(--ease-expo)]',
                      reduced || i === chapter ? 'translate-y-0 opacity-100 delay-300' : 'translate-y-4 opacity-0',
                    )}
                  >
                    {c.body}
                  </p>
                </div>
              ))}
            </div>

            {/* progress rail */}
            {!reduced && (
              <div className="hidden h-40 flex-col items-center gap-3 sm:flex" aria-hidden="true">
                <span className="type-meta text-muted-dark">Scroll</span>
                <div className="relative w-px flex-1 bg-white/15">
                  <div ref={barRef} className="absolute inset-0 origin-top scale-y-0 bg-accent" />
                  {[0, 0.5, 1].map((p, i) => (
                    <span
                      key={p}
                      className={cn(
                        'absolute left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full border transition-colors duration-500',
                        i <= chapter ? 'border-accent bg-accent' : 'border-white/30 bg-[#060606]',
                      )}
                      style={{ top: `${p * 100}%` }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
          </div>
        </div>
      </div>
    </section>
  )
}
