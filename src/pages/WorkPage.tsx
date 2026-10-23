import { useEffect, useRef, useState } from 'react'
import { ArrowDown } from 'lucide-react'
import { featuredProjects } from '@/data/projects'
import { gsap, SplitText, useGSAP } from '@/lib/gsap'
import { registerReveals } from '@/animations/reveal'
import { prefersReducedMotion } from '@/lib/env'
import { cn } from '@/lib/cn'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useOffscreenPause } from '@/hooks/useOffscreenPause'
import { useReducedMotion } from '@/hooks/useMediaQuery'
import { WorkScenes } from '@/components/WorkScenes'
import { WorkCategories } from '@/components/WorkCategories'
import { ProjectMedia } from '@/components/ProjectMedia'
import { TransitionLink } from '@/components/PageTransition'
import { useSmoothScroll } from '@/components/SmoothScroll'

const figures = [
  { k: 'Delivered', v: '1000+' },
  { k: 'Countries', v: '15+' },
  { k: 'Since', v: '2020' },
]

/** /work — editorial header, the featured project scenes, then the category list. */
export function WorkPage() {
  useOffscreenPause()
  useDocumentTitle('Work — WebBirth')
  const scope = useRef<HTMLElement>(null)
  const { scrollTo } = useSmoothScroll()

  useGSAP(
    () => {
      const main = scope.current?.closest('main')
      if (main) registerReveals(main)
      if (prefersReducedMotion()) return
      const split = SplitText.create('[data-work-title]', { type: 'words,chars', mask: 'chars' })
      gsap
        .timeline({ defaults: { ease: 'expo.out' }, delay: 0.15 })
        .from('[data-work-serif]', { yPercent: 80, autoAlpha: 0, duration: 1.3 }, 0)
        .from(split.chars, { yPercent: 115, duration: 1.3, stagger: 0.05 }, 0.1)
        .from('[data-work-deck]', { autoAlpha: 0, y: 60, rotate: 6, duration: 1.6 }, 0.35)
        .from('[data-work-meta] > *', { y: 20, autoAlpha: 0, duration: 1, stagger: 0.08 }, 0.7)
    },
    { scope },
  )

  return (
    <main id="main" className="bg-paper">
      <section ref={scope} aria-labelledby="work-page-title" className="gutter relative overflow-clip pb-[clamp(2.5rem,5vw,4.5rem)] pt-28 lg:pt-36">
        {/* soft warm light behind the deck */}
        <div aria-hidden="true" className="pointer-events-none absolute -right-[10%] top-[10%] size-[min(60vw,48rem)] rounded-full glow opacity-[0.09]" />

        {/* top rail */}
        <div className="type-meta relative flex items-center justify-between gap-4 text-muted">
          <p className="flex items-center gap-3">
            <span className="size-2 shrink-0 rounded-full bg-accent" aria-hidden="true" />
            <span>
              Portfolio <span className="max-sm:hidden">— curated from 1000+ delivered projects</span>
            </span>
          </p>
          <button type="button" onClick={() => scrollTo('#categories')} className="group inline-flex min-h-11 shrink-0 items-center gap-2 text-ink">
            Browse categories
            <ArrowDown className="size-3.5 transition-transform group-hover:translate-y-1" strokeWidth={1.75} />
          </button>
        </div>

        <div className="relative mt-8 grid grid-cols-[minmax(0,1fr)] items-end gap-10 lg:mt-12 lg:grid-cols-12">
          {/* title */}
          <h1 id="work-page-title" className="lg:col-span-8">
            <span
              data-work-serif
              className="block font-serif text-[clamp(3rem,13vw,10.5rem)] lg:text-[min(8vw,10.5rem)] italic leading-[0.85] tracking-[-0.03em] text-accent"
            >
              Selected
            </span>
            <span className="relative -mt-[0.06em] flex items-start">
              <span
                data-work-title
                className="block whitespace-nowrap text-[clamp(5.5rem,27vw,22rem)] font-semibold uppercase leading-[0.8] tracking-[-0.07em] lg:text-[min(16.5vw,22rem)]"
              >
                Work
              </span>
            </span>
          </h1>

          {/* fanned deck of real projects */}
          <div className="lg:col-span-4 lg:pb-6">
            <ProjectDeck />
          </div>
        </div>

        {/* intro + figures */}
        <div data-work-meta className="relative mt-12 grid gap-8 border-t border-line pt-6 md:grid-cols-12 md:items-end">
          <p className="type-lead max-w-[36rem] text-ink/70 md:col-span-7">
            A curated showcase of our best work — standout platforms and digital experiences
            handpicked from 1000+ projects delivered since 2020.
          </p>
          <dl className="grid grid-cols-3 gap-6 md:col-span-5 md:justify-items-end">
            {figures.map((f) => (
              <div key={f.k} className="md:text-right">
                <dt className="type-meta text-muted">{f.k}</dt>
                <dd className="mt-2 text-[clamp(1.8rem,3vw,2.6rem)] font-semibold leading-none tracking-[-0.04em] text-ink">{f.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <WorkScenes />

      <WorkCategories />
    </main>
  )
}

/** Three cards fanned out; the front card cycles through the featured projects. */
function ProjectDeck() {
  const reduced = useReducedMotion()
  const [front, setFront] = useState(0)
  const n = featuredProjects.length

  useEffect(() => {
    if (reduced || n < 2) return
    const id = window.setInterval(() => setFront((f) => (f + 1) % n), 2800)
    return () => window.clearInterval(id)
  }, [reduced, n])

  const slots = [
    { rot: -9, x: '-14%', y: '6%', z: 1, scale: 0.88, dim: 'brightness-[0.7]' },
    { rot: 7, x: '14%', y: '3%', z: 2, scale: 0.93, dim: 'brightness-[0.85]' },
    { rot: -1.5, x: '0%', y: '0%', z: 3, scale: 1, dim: '' },
  ]
  const order = [2, 1, 0].map((k) => featuredProjects[(front + k) % n])
  const current = featuredProjects[front]

  return (
    <div data-work-deck className="mx-auto w-[86%] max-w-[26rem] sm:w-full">
      <div className="relative aspect-[4/3]">
        {order.map((p, i) => {
          const s = slots[i]
          return (
            <TransitionLink
              key={p.slug}
              to={`/work/${p.slug}`}
              tabIndex={i === 2 ? 0 : -1}
              aria-hidden={i !== 2}
              aria-label={i === 2 ? `View ${p.name}` : undefined}
              data-cursor="view"
              data-cursor-label="View"
              className={cn(
                'absolute inset-0 overflow-clip rounded-lg bg-ink shadow-[0_30px_60px_-25px_rgba(12,12,13,0.55)] ring-1 ring-black/10 transition-all duration-[900ms] ease-[var(--ease-expo)]',
                s.dim,
                i !== 2 && 'pointer-events-none',
              )}
              style={{ transform: `translate(${s.x}, ${s.y}) rotate(${s.rot}deg) scale(${s.scale})`, zIndex: s.z }}
            >
              <span aria-hidden="true" className="contents">
                <ProjectMedia project={p} sizes="26rem" variant="compact" />
              </span>
            </TransitionLink>
          )
        })}
      </div>
      <div className="type-meta mt-6 flex items-center justify-between gap-4 text-muted" aria-live="polite">
        <span className="truncate">
          <span className="text-accent">{String(front + 1).padStart(2, '0')}</span> / {String(n).padStart(2, '0')} —{' '}
          <span className="text-ink">{current.name}</span>
        </span>
        <span className="flex shrink-0 gap-1" aria-hidden="true">
          {featuredProjects.map((p, i) => (
            <span key={p.slug} className={cn('h-0.5 w-4 transition-colors duration-500', i === front ? 'bg-accent' : 'bg-line')} />
          ))}
        </span>
      </div>
    </div>
  )
}
