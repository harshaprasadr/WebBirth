import { useEffect, useRef, useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Star,
} from 'lucide-react'
import {
  clientMentions,
  googleRating,
  justdialRating,
  proofPoints,
  sourceMeta,
  testimonials,
  type Testimonial,
} from '@/data/testimonials'
import { gsap, SplitText, useGSAP } from '@/lib/gsap'
import { registerReveals } from '@/animations/reveal'
import { prefersReducedMotion } from '@/lib/env'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useOffscreenPause } from '@/hooks/useOffscreenPause'
import { Avatar, CountUp, Stars } from '@/components/TestimonialBits'
import { TransitionLink } from '@/components/PageTransition'
import { cn } from '@/lib/cn'

/** Clean, authentic Google review card matching the real reviews verbatim. */
function ReviewCard({ t }: { t: Testimonial }) {
  return (
    <article className="group relative flex w-[85vw] sm:w-[380px] md:w-[410px] lg:w-[430px] shrink-0 snap-start flex-col justify-between overflow-hidden rounded-3xl border border-line/80 bg-paper-2/40 backdrop-blur-sm transition-all duration-500 hover:border-ink/15 hover:shadow-[0_20px_50px_-16px_rgba(12,12,13,0.10)]">
      <div className="relative z-10 p-7 sm:p-8">
        {/* Reviewer Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-4">
            <Avatar
              name={t.name}
              color={t.avatarColor}
              image={t.avatarImg}
              className="size-11 text-sm font-semibold ring-2 ring-paper ring-offset-1 ring-offset-paper-2"
            />
            <div className="min-w-0">
              <p className="truncate text-[0.98rem] font-semibold leading-tight text-ink">{t.name}</p>
              <p className="type-meta mt-1.5 text-muted/80">{t.reviewInfo}</p>
            </div>
          </div>

          <a
            href={sourceMeta.google.href}
            target="_blank"
            rel="noreferrer"
            aria-label="View on Google"
            className="shrink-0 rounded-full border border-line/60 bg-paper/60 p-2 text-muted/70 transition-all duration-300 hover:border-accent/40 hover:bg-accent/8 hover:text-accent hover:scale-105"
          >
            <ArrowUpRight className="size-3.5" strokeWidth={2.2} />
          </a>
        </div>

        {/* Rating Stars & Relative Date */}
        <div className="mt-5 flex items-center gap-3">
          <span role="img" className="inline-flex items-center gap-0.5" aria-label={`${t.rating} out of 5 stars`}>
            {Array.from({ length: 5 }, (_, i) => (
              <Star
                key={i}
                className={cn(
                  'size-[1.1rem]',
                  i < t.rating ? 'fill-amber-400 text-amber-400' : 'text-line fill-paper-2',
                )}
                strokeWidth={0.5}
              />
            ))}
          </span>
          <span className="h-3 w-px bg-line/80" />
          <span className="type-meta text-muted/70">{t.timeAgo}</span>
        </div>

        {/* Verbatim Review Quote */}
        <p className="mt-5 text-[0.98rem] sm:text-[1.02rem] font-normal leading-[1.75] text-ink/80">
          {t.quote}
        </p>
      </div>

      {/* Subtle accent glow on hover */}
      <div className="pointer-events-none absolute -bottom-8 -right-8 size-32 rounded-full bg-accent/[0.03] blur-2xl transition-all duration-500 group-hover:bg-accent/[0.07] group-hover:scale-150" />
    </article>
  )
}

/** /testimonials — Clean, classy, side-scrolling real Google & Justdial reviews. */
export function TestimonialsPage() {
  useOffscreenPause()
  useDocumentTitle('Testimonials — WebBirth')
  const scope = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [current, setCurrent] = useState(1)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  useGSAP(
    () => {
      const main = scope.current?.closest('main')
      if (main) registerReveals(main)
      if (prefersReducedMotion()) return
      const split = SplitText.create('[data-tt-title]', { type: 'words,chars', mask: 'chars' })
      gsap
        .timeline({ defaults: { ease: 'expo.out' }, delay: 0.15 })
        .from(split.chars, { yPercent: 115, duration: 1.3, stagger: 0.03 }, 0)
        .from('[data-tt-serif]', { yPercent: 70, autoAlpha: 0, duration: 1.2 }, 0.2)
        .from('[data-tt-meta] > *', { y: 20, autoAlpha: 0, duration: 1, stagger: 0.07 }, 0.5)
    },
    { scope },
  )

  // Track horizontal scroll state & progress
  const updateScrollState = () => {
    const el = trackRef.current
    if (!el) return
    const maxScroll = el.scrollWidth - el.clientWidth
    const n = testimonials.length
    // Only the visible card number matters, so state changes per card, not per scroll pixel.
    const toIndex = (p: number) => Math.min(n, Math.max(1, Math.round(p * (n - 1)) + 1))
    if (maxScroll <= 0) {
      setCurrent(toIndex(1))
      setCanScrollLeft(false)
      setCanScrollRight(false)
      return
    }
    const current = el.scrollLeft
    setCurrent(toIndex(Math.min(1, Math.max(0, current / maxScroll))))
    setCanScrollLeft(current > 8)
    setCanScrollRight(current < maxScroll - 8)
  }

  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    let frame = 0
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(() => ((frame = 0), updateScrollState()))
    }
    updateScrollState()
    el.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      el.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  const total = testimonials.length

  const scroll = (direction: 'left' | 'right') => {
    const el = trackRef.current
    if (!el) return
    const cardWidth = el.querySelector('article')?.clientWidth || 400
    const scrollAmount = cardWidth + 24
    el.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    })
  }

  // Mouse drag-to-scroll support for desktop
  const isDragging = useRef(false)
  const startX = useRef(0)
  const scrollLeftStart = useRef(0)

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = trackRef.current
    if (!el) return
    isDragging.current = true
    startX.current = e.pageX - el.offsetLeft
    scrollLeftStart.current = el.scrollLeft
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging.current) return
    const el = trackRef.current
    if (!el) return
    e.preventDefault()
    const x = e.pageX - el.offsetLeft
    const walk = (x - startX.current) * 1.5
    el.scrollLeft = scrollLeftStart.current - walk
  }

  const handleMouseUpOrLeave = () => {
    isDragging.current = false
  }

  return (
    <main id="main" className="bg-paper overflow-x-hidden">
      {/* ── HEADER ── */}
      <section
        ref={scope}
        aria-labelledby="tt-title"
        className="gutter relative overflow-clip pb-[clamp(3rem,6vw,5rem)] pt-28 lg:pt-36"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-[8%] top-[4%] size-[min(55vw,42rem)] rounded-full glow opacity-10"
        />

        <div className="relative flex items-center justify-between gap-2 sm:gap-4">
          <p className="type-meta flex shrink-0 items-center gap-2 sm:gap-3 text-muted">
            <span className="size-1.5 sm:size-2 rounded-full bg-accent" aria-hidden="true" />
            <span>Testimonials</span>
          </p>

        </div>

        <h1 id="tt-title" className="relative mt-7">
          <span
            data-tt-title
            className="block text-[clamp(3.4rem,13vw,11rem)] font-semibold uppercase leading-[0.85] tracking-[-0.06em]"
          >
            Client love.
          </span>
          <span
            data-tt-serif
            className="mt-2 block font-serif text-[clamp(2rem,7vw,5rem)] italic leading-[1] tracking-[-0.02em] text-accent"
          >
            in their own words.
          </span>
        </h1>

        <div
          data-tt-meta
          className="mt-10 flex flex-col justify-between gap-x-12 gap-y-8 border-t border-line pt-8 md:flex-row md:items-end"
        >
          <p className="type-lead max-w-lg text-ink/75 leading-relaxed">
            Rated <span className="font-semibold text-ink"><CountUp to={googleRating.score} decimals={1} /></span> on Google and <span className="font-semibold text-ink">5.0</span> on Justdial — every rating here is real and publicly verifiable.
          </p>
          <dl className="flex shrink-0 items-end gap-12 sm:gap-16">
            {proofPoints.map((p) => (
              <div key={p.label} className="flex flex-col">
                <dd className="text-[clamp(2.4rem,4.2vw,3.6rem)] font-semibold leading-none tracking-[-0.04em] text-ink">
                  <CountUp to={p.value} decimals={p.decimals} suffix={p.suffix} />
                </dd>
                <dt className="type-meta mt-2.5 text-muted">{p.label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── RATING TILES ── */}
      <section aria-label="Ratings" className="gutter">
        <div className="grid gap-6 sm:grid-cols-2">
          {/* Google */}
          <a
            href={sourceMeta.google.href}
            target="_blank"
            rel="noreferrer"
            data-reveal="fade"
            className="group relative flex flex-col justify-between overflow-clip rounded-2xl bg-accent p-8 text-on-accent transition-transform duration-500 ease-[var(--ease-expo)] hover:-translate-y-1 sm:p-10"
          >
            <div className="flex items-center justify-between">
              <span className="type-meta font-semibold">Google</span>
              <Stars value={5} className="text-[1.1rem] [&_svg]:fill-ink [&_svg]:text-ink" />
            </div>
            <div className="mt-10 flex items-end gap-4">
              <CountUp
                to={googleRating.score}
                decimals={1}
                className="text-[clamp(4rem,9vw,6.5rem)] font-semibold leading-[0.78] tracking-[-0.05em]"
              />
              <p className="mb-2 text-sm font-medium leading-tight">
                out of 5
                <br />
                <span className="inline-flex items-center gap-1 underline decoration-ink/30 underline-offset-2 group-hover:decoration-ink">
                  Google reviews ↗
                </span>
              </p>
            </div>
          </a>

          {/* Justdial */}
          <a
            href={sourceMeta.justdial.href}
            target="_blank"
            rel="noreferrer"
            data-reveal="fade"
            className="group relative flex flex-col justify-between overflow-clip rounded-2xl bg-ink p-8 text-paper transition-transform duration-500 ease-[var(--ease-expo)] hover:-translate-y-1 sm:p-10"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-[15%] -top-[20%] size-[60%] rounded-full glow opacity-15"
            />
            <div className="relative flex items-center justify-between">
              <span className="type-meta font-semibold">Justdial</span>
              <Stars value={5} dark className="text-[1.1rem]" />
            </div>
            <div className="relative mt-10 flex items-end gap-4">
              <CountUp
                to={justdialRating.score}
                decimals={1}
                className="text-[clamp(4rem,9vw,6.5rem)] font-semibold leading-[0.78] tracking-[-0.05em]"
              />
              <p className="mb-2 text-sm font-medium leading-tight text-paper/70">
                out of 5
                <br />
                <span className="inline-flex items-center gap-1 text-paper underline decoration-paper/30 underline-offset-2 group-hover:decoration-paper">
                  justdial reviews ↗
                </span>
              </p>
            </div>
          </a>
        </div>
      </section>

      {/* ── CLIENT REVIEWS SECTION WITH SIDE SCROLLING ── */}
      <section aria-labelledby="client-reviews-title" className="section-y">
        {/* Header: oversized title, lead copy, progress rule and controls */}
        <div className="gutter">
          <div data-reveal="fade">
            <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
              <h2
                id="client-reviews-title"
                className="font-sans text-[clamp(3rem,7.6vw,7rem)] font-semibold leading-[0.9] tracking-[-0.055em] text-ink lg:col-span-8"
              >
                Real words
                <br />
                from real clients<span className="text-accent">.</span>
              </h2>
              <p className="type-body max-w-md text-muted leading-relaxed lg:col-span-4 lg:justify-self-end">
                Every testimonial below is sourced verbatim from our public Google profile.{' '}
                <span className="text-ink">Unedited, authentic, and shared by verified partners.</span>
              </p>
            </div>

            {/* progress rule */}
            <div className="relative mt-[clamp(2rem,4vw,3.5rem)] h-px w-full bg-line">
              <div
                className="absolute -top-px left-0 h-[3px] rounded-full bg-accent transition-[width] duration-300 ease-[var(--ease-expo)]"
                style={{ width: `${(current / total) * 100}%` }}
              />
            </div>

            <div className="mt-6 flex items-center justify-between gap-4">
              <p className="text-sm text-muted sm:text-base">
                <span className="font-semibold text-ink tabular-nums">{String(current).padStart(2, '0')}</span> of {total} reviews
                <span className="ml-4 hidden text-muted/70 sm:inline">Drag or use the arrows</span>
              </p>
              <div className="flex items-center gap-2.5">
                {(
                  [
                    { dir: 'left', label: 'Scroll left', Icon: ArrowLeft, enabled: canScrollLeft },
                    { dir: 'right', label: 'Scroll right', Icon: ArrowRight, enabled: canScrollRight },
                  ] as const
                ).map(({ dir, label, Icon, enabled }) => (
                  <button
                    key={dir}
                    type="button"
                    onClick={() => scroll(dir)}
                    disabled={!enabled}
                    aria-label={label}
                    className={cn(
                      'flex size-12 items-center justify-center rounded-full border border-line text-ink transition-all duration-300 sm:size-[3.4rem]',
                      enabled
                        ? 'hover:border-accent hover:bg-accent hover:text-on-accent active:scale-95'
                        : 'cursor-not-allowed opacity-30',
                    )}
                  >
                    <Icon className="size-4" strokeWidth={1.75} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Horizontal Side-Scrolling Track */}
        <div
          ref={trackRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
          className="mt-10 flex gap-6 overflow-x-auto px-[clamp(1.25rem,4vw,3.5rem)] pb-4 pt-2 scroll-smooth snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden cursor-grab active:cursor-grabbing select-none"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {testimonials.map((t) => (
            <ReviewCard key={t.id} t={t} />
          ))}
        </div>
      </section>

      {/* ── WHAT CLIENTS MENTION MOST ── */}
      <section aria-labelledby="tt-mentions" className="gutter section-pb">
        <div className="grid gap-8 border-t border-line pt-10 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-4">
            <h2
              id="tt-mentions"
              data-reveal="fade"
              className="text-[clamp(1.8rem,3vw,2.6rem)] font-semibold uppercase leading-[0.95] tracking-[-0.04em]"
            >
              What clients
              <br />
              mention most<span className="text-accent">.</span>
            </h2>
            <p data-reveal="fade" className="type-meta mt-4 text-muted">
              Based on verified client feedback
            </p>
          </div>
          <ul className="flex flex-wrap gap-3 lg:col-span-8">
            {clientMentions.map((m, i) => (
              <li
                key={m}
                data-reveal="fade"
                data-start="top 97%"
                data-delay={String(0.04 * i)}
                className="rounded-full border border-line bg-paper-2/40 px-5 py-3 text-[clamp(0.95rem,1.3vw,1.15rem)] font-medium tracking-[-0.01em] transition-colors duration-300 hover:border-accent hover:text-accent"
              >
                {m}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── CTA ── */}
      <section
        aria-labelledby="tt-cta"
        data-nav-theme="dark"
        className="gutter relative overflow-clip bg-ink text-paper section-y"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 size-[min(70vw,48rem)] -translate-x-1/2 -translate-y-1/2 rounded-full glow opacity-10"
        />
        <div className="relative grid items-end gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <h2 id="tt-cta" data-reveal="lines" className="type-h2 uppercase">
              OUR SUCCESS
              <br />
              IN <span className="text-accent">THEIR WORDS.</span>
            </h2>
            <p data-reveal="fade" className="type-lead mt-6 max-w-lg text-paper/65">
              Tell us what you’re building — and join the clients rating us 4.9 on Google.
            </p>
          </div>
          <div data-reveal="fade" className="flex flex-col items-start gap-4 lg:col-span-4 lg:items-end">
            <TransitionLink
              to="/#contact"
              className="group relative inline-flex min-h-14 items-center gap-4 overflow-clip rounded-full bg-paper pl-7 pr-2 font-mono text-[0.82rem] font-semibold uppercase tracking-[0.08em] text-[#0f0f10] shadow-[0_4px_24px_rgba(255,255,255,0.08)] transition-all duration-300 hover:bg-white hover:-translate-y-0.5 self-start lg:self-auto"
            >
              <span
                aria-hidden="true"
                className="absolute inset-0 translate-y-full rounded-full bg-accent transition-transform duration-700 ease-[var(--ease-expo)] group-hover:translate-y-0"
              />
              <span className="relative z-10 text-[#0f0f10] transition-colors duration-300 group-hover:text-on-accent">
                Start a project
              </span>
              <span className="relative z-10 flex size-10 items-center justify-center rounded-full bg-ink text-paper transition-all duration-300 group-hover:bg-paper group-hover:text-ink">
                <ArrowUpRight
                  className="size-4 transition-transform duration-500 group-hover:rotate-45"
                  strokeWidth={2}
                />
              </span>
            </TransitionLink>
            <a
              href={sourceMeta.google.href}
              target="_blank"
              rel="noreferrer"
              className="group type-meta hidden md:inline-flex min-h-11 items-center gap-2 text-paper/70 hover:text-paper"
            >
              <span className="link-reveal">Read all reviews on Google</span>
              <ArrowUpRight className="size-3.5" strokeWidth={1.75} aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
