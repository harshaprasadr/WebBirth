import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, ArrowUpRight, Quote } from 'lucide-react'
import { googleRating, ratingStats, testimonials } from '@/data/testimonials'
import { useGSAP } from '@/lib/gsap'
import { registerReveals } from '@/animations/reveal'
import { useReducedMotion } from '@/hooks/useMediaQuery'
import { cn } from '@/lib/cn'
import { SectionHeader } from './SectionHeader'
import { TransitionLink } from './PageTransition'
import { Avatar, CountUp, SourceBadge, Stars } from './TestimonialBits'

const AUTO_MS = 6500
const ease = [0.19, 1, 0.22, 1] as const

/** Ordered so the featured review opens the slider. */
const slides = [...testimonials].sort((a, b) => Number(!!b.featured) - Number(!!a.featured))

/**
 * Home social-proof section — a dark, cinematic testimonial slider.
 * Left: the aggregate 5.0 rating and sources. Right: one dominant quote
 * that auto-advances, with arrows, dots, drag (touch/mouse) and ← → keys.
 * All content is sourced (see src/data/testimonials.ts).
 */
export function TestimonialsSection() {
  const scope = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const [[index, dir], setState] = useState<[number, number]>([0, 0])
  const [paused, setPaused] = useState(false)
  const count = slides.length
  const active = slides[index]

  useGSAP(() => registerReveals(scope.current!), { scope })

  const go = useCallback(
    (step: number) => setState(([i]) => [(i + step + count) % count, step]),
    [count],
  )
  const jump = (to: number) => setState(([i]) => [to, to > i ? 1 : -1])

  // Auto-advance, paused on hover/focus and under reduced motion.
  useEffect(() => {
    if (reduced || paused || count < 2) return
    const id = window.setTimeout(() => go(1), AUTO_MS)
    return () => window.clearTimeout(id)
  }, [index, paused, reduced, count, go])

  // Keyboard ← → when the section is in focus.
  useEffect(() => {
    const el = scope.current
    if (!el) return
    const onKey = (e: KeyboardEvent) => {
      if (!el.contains(document.activeElement)) return
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go])

  return (
    <section
      ref={scope}
      id="reviews"
      aria-labelledby="reviews-title"
      data-nav-theme="dark"
      className="gutter relative overflow-clip bg-ink text-paper section-y"
    >
      {/* warm ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-[12%] top-[8%] size-[min(55vw,40rem)] rounded-full glow opacity-[0.08]"
      />

      <SectionHeader
        id="reviews-title"
        index="05"
        label="Testimonials"
        title={['Loved by', 'the clients.']}
        titleClassName="uppercase"
        dark
        aside={
          <span className="inline-flex items-center gap-1.5">
            <Stars value={5} dark className="text-[0.8rem]" />
            <span>{googleRating.score} / 5</span>
          </span>
        }
        intro="Real, verified reviews from the people we build for — rated 4.9 on Google and 5.0 on Justdial."
      />

      <div className="relative mt-[clamp(3rem,6vw,5rem)] grid gap-10 lg:grid-cols-12 lg:gap-14">
        {/* rating rail */}
        <div data-reveal="fade" className="flex flex-col gap-8 lg:col-span-4">
          <div>
            <div className="flex items-end gap-3">
              <CountUp to={googleRating.score} decimals={1} className="text-[clamp(3.5rem,7vw,6rem)] font-semibold leading-[0.8] tracking-[-0.05em]" />
              <Stars value={5} dark className="mb-2 text-[1.4rem]" />
            </div>
            <p className="type-body mt-4 max-w-xs text-paper/60">
              Rated <CountUp to={googleRating.score} decimals={1} /> across Google reviews and verified partners. Here’s what a few of them said.
            </p>
          </div>

          <ul className="flex flex-col divide-y divide-line-dark border-y border-line-dark">
            {ratingStats.map((r) => (
              <li key={r.source} className="flex items-center justify-between gap-3 py-3.5">
                <SourceBadge source={r.source} dark className="shrink-0" />
                <div className="flex items-center gap-2.5 sm:gap-3 w-[165px] sm:w-[185px] shrink-0 justify-start">
                  <span className="w-6 shrink-0 font-semibold text-sm sm:text-base leading-none text-paper tabular-nums">
                    {r.score}
                  </span>
                  <span className="font-sans text-xs sm:text-[0.8rem] text-paper/65 leading-none">
                    {r.detail}
                  </span>
                </div>
              </li>
            ))}
          </ul>

          <TransitionLink
            to="/testimonials"
            className="group inline-flex items-center gap-2 self-start text-[0.82rem] font-medium uppercase tracking-[0.05em]"
          >
            <span className="link-reveal">Read all reviews</span>
            <ArrowUpRight
              className="size-4 transition-transform duration-500 ease-[var(--ease-expo)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
              strokeWidth={1.75}
            />
          </TransitionLink>
        </div>

        {/* quote stage — hidden on mobile view as requested */}
        <div
          data-reveal="fade"
          data-delay="0.1"
          className="relative lg:col-span-8 max-md:hidden"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
        >
          <Quote
            aria-hidden="true"
            className="pointer-events-none absolute -left-2 -top-14 size-[clamp(3rem,6vw,5.5rem)] rotate-180 fill-accent/15 text-accent/15 lg:-top-16"
            strokeWidth={1}
          />

          <div
            className="relative mt-6 min-h-[18rem] sm:min-h-[16rem] lg:mt-0"
            aria-roledescription="carousel"
            aria-live="polite"
          >
            <AnimatePresence mode="wait" custom={dir} initial={false}>
              <motion.figure
                key={index}
                custom={dir}
                drag={count > 1 ? 'x' : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.14}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -60) go(1)
                  else if (info.offset.x > 60) go(-1)
                }}
                initial={{ opacity: 0, x: dir >= 0 ? 60 : -60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: dir >= 0 ? -60 : 60 }}
                transition={{ duration: reduced ? 0.2 : 0.65, ease }}
                className={cn('relative', count > 1 && 'cursor-grab active:cursor-grabbing')}
              >
                <Stars value={active.rating} dark className="text-[1.15rem]" />
                <blockquote className="mt-6 text-[clamp(1.5rem,3vw,2.6rem)] font-medium leading-[1.18] tracking-[-0.025em]">
                  <span className="text-accent">“</span>
                  {active.highlight}
                  <span className="text-accent">”</span>
                </blockquote>
                {active.quote !== active.highlight && (
                  <p className="type-body mt-5 max-w-2xl text-paper/55">{active.quote}</p>
                )}

                <figcaption className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-4">
                  <Avatar name={active.name} color={active.avatarColor} image={active.avatarImg} dark className="size-12 text-lg" />
                  <div className="min-w-0">
                    <p className="font-semibold leading-tight">{active.name}</p>
                    <p className="type-meta mt-1 text-paper/55">{active.role}</p>
                  </div>
                  <span className="ml-auto">
                    <SourceBadge source={active.source} dark />
                  </span>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>

          {/* controls */}
          <div className={cn('mt-10 flex items-center justify-between gap-6 border-t border-line-dark pt-6', count < 2 && 'hidden')}>
            <div className="flex items-center gap-4">
              <span className="type-meta tabular-nums text-paper/50">
                <span className="text-paper">{String(index + 1).padStart(2, '0')}</span> / {String(count).padStart(2, '0')}
              </span>
              <div className="flex flex-wrap" role="tablist" aria-label="Choose testimonial">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    role="tab"
                    aria-selected={i === index}
                    aria-label={`Testimonial ${i + 1}`}
                    onClick={() => jump(i)}
                    className="group/dot flex h-6 min-w-6 items-center justify-center"
                  >
                    <span
                      className={cn(
                        'block h-1.5 rounded-full transition-all duration-500 ease-[var(--ease-expo)]',
                        i === index ? 'w-7 bg-accent' : 'w-1.5 bg-paper/25 group-hover/dot:bg-paper/50',
                      )}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              {[
                { step: -1, label: 'Previous testimonial', Icon: ArrowLeft },
                { step: 1, label: 'Next testimonial', Icon: ArrowRight },
              ].map(({ step, label, Icon }) => (
                <button
                  key={step}
                  type="button"
                  onClick={() => go(step)}
                  aria-label={label}
                  className="flex size-12 items-center justify-center rounded-full border border-line-dark text-paper transition-colors duration-500 hover:border-accent hover:bg-accent hover:text-on-accent"
                >
                  <Icon className="size-5" strokeWidth={1.5} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
