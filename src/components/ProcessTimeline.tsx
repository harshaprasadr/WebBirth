import { useRef, useState, type RefObject } from 'react'
import { processSteps } from '@/data/site'
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap'
import { prefersReducedMotion } from '@/lib/env'
import { registerReveals } from '@/animations/reveal'
import { cn } from '@/lib/cn'
import { SectionHeader } from './SectionHeader'

/**
 * Scroll-driven process. The left column sticks while steps pass a reading
 * line at 55% of the viewport; a hairline fills as you progress and the big
 * counter rolls to the active stage.
 */
export function ProcessTimeline() {
  const scope = useRef<HTMLElement>(null)
  const listRef = useRef<HTMLOListElement>(null)
  const fillRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<SVGCircleElement>(null)
  const [active, setActive] = useState(0)

  useGSAP(
    () => {
      registerReveals(scope.current!)

      gsap.fromTo(
        fillRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: listRef.current,
            start: 'top 55%',
            end: 'bottom 55%',
            scrub: 0.4,
            onUpdate: (self) => {
              if (ringRef.current) ringRef.current.style.strokeDashoffset = String(1 - self.progress)
            },
          },
        },
      )

      gsap.utils.toArray<HTMLElement>('[data-step]', listRef.current).forEach((step, i) => {
        ScrollTrigger.create({
          trigger: step,
          start: 'top 50%',
          end: 'bottom 50%',
          onToggle: (self) => self.isActive && setActive(i),
        })
      })
    },
    { scope },
  )

  return (
    <section
      ref={scope}
      aria-labelledby="process-title"
      data-nav-theme="dark"
      className="gutter relative bg-ink section-y text-paper"
    >
      <SectionHeader
        id="process-title"
        label="Process"
        title={['From idea', 'to impact.']}
        aside="(06 stages)"
        intro="A clear, collaborative path from the first conversation to a product that keeps improving after launch."
        dark
        titleClassName="uppercase"
      />

      <div className="section-gap grid gap-12 lg:grid-cols-12">
        {/* sticky counter */}
        <div className="hidden lg:col-span-5 lg:block">
          <div className="sticky top-[22vh]">
            <div className="flex items-start gap-6">
              <Odometer value={active + 1} />
              <div className="mt-3 flex flex-col items-center gap-3">
                <ProgressRing progressRef={ringRef} />
                <span className="type-meta text-muted-dark">/ 0{processSteps.length}</span>
              </div>
            </div>
            <div className="type-meta mt-8 flex items-center gap-2 text-muted-dark" aria-live="polite">
              <span>Stage —</span>
              <span className="relative inline-block h-[1.3em] overflow-clip">
                <span
                  className="flex flex-col transition-transform duration-[900ms] ease-[var(--ease-expo)]"
                  style={{ transform: `translateY(${(-active * 100) / processSteps.length}%)` }}
                >
                  {processSteps.map((st) => (
                    <span key={st.title} className="h-[1.3em] leading-[1.3em] text-paper">
                      {st.title}
                    </span>
                  ))}
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* steps */}
        <div className="relative lg:col-span-7">
        {/* phones / tablets: sticky stage indicator */}
        <div className="sticky top-16 z-10 -mx-[clamp(1rem,3.2vw,3rem)] mb-2 border-b border-line-dark bg-ink px-[clamp(1rem,3.2vw,3rem)] py-3 before:absolute before:inset-x-0 before:bottom-full before:h-16 before:bg-ink lg:hidden">
          <div className="type-meta flex items-center justify-between" aria-hidden="true">
            <span className="tabular-nums">
              <span className="text-accent-2">{String(active + 1).padStart(2, '0')}</span>
              <span className="text-muted-dark"> / {String(processSteps.length).padStart(2, '0')}</span>
            </span>
            <span className="text-paper">{processSteps[active].title}</span>
          </div>
          <div className="mt-2.5 flex gap-1" aria-hidden="true">
            {processSteps.map((step, i) => (
              <span
                key={step.title}
                className={cn('h-0.5 flex-1 transition-colors duration-500', i <= active ? 'bg-accent-2' : 'bg-line-dark')}
              />
            ))}
          </div>
        </div>
        <ol ref={listRef} className="relative">
          <div className="absolute bottom-0 left-0 top-0 w-px bg-line-dark" aria-hidden="true">
            <div ref={fillRef} className="h-full origin-top bg-accent-2" />
          </div>
          {processSteps.map((step, i) => (
            <li
              key={step.title}
              data-step
              className={cn(
                'relative py-9 pl-8 transition-opacity duration-700 sm:pl-[clamp(2rem,5vw,4.5rem)] lg:py-[clamp(2rem,6vh,4rem)]',
                active === i ? 'opacity-100' : 'opacity-40',
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  'absolute left-0 top-[3.15rem] size-2.5 lg:top-[calc(clamp(2rem,6vh,4rem)+0.9rem)] -translate-x-1/2 rounded-full border transition-colors duration-500',
                  active >= i ? 'border-accent-2 bg-accent-2' : 'border-line-dark bg-ink',
                )}
              />
              <span className="type-meta text-muted-dark">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="mt-2 text-[clamp(2.2rem,6vw,5.75rem)] sm:mt-3 font-semibold uppercase leading-[0.9] tracking-[-0.05em]">
                {step.title}
              </h3>
              <p className="type-lead mt-3 max-w-md text-paper/65 sm:mt-5">{step.description}</p>
            </li>
          ))}
        </ol>
        </div>
      </div>
    </section>
  )
}

/**
 * Slot-machine counter: each digit is its own 0–9 strip. On change the strips
 * roll with a staggered expo ease, motion blur and a slight stretch, an
 * outlined ghost trails for depth, and an accent line sweeps underneath.
 */
function Odometer({ value }: { value: number }) {
  const root = useRef<HTMLDivElement>(null)
  const digits = String(value).padStart(2, '0').split('').map(Number)

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      const strips = q('[data-strip]')
      const ghosts = q('[data-ghost]')
      if (prefersReducedMotion()) {
        strips.forEach((el, i) => gsap.set(el, { yPercent: -digits[i] * 10 }))
        ghosts.forEach((el, i) => gsap.set(el, { yPercent: -digits[i] * 10 }))
        return
      }
      strips.forEach((el, i) => {
        const to = -digits[i] * 10
        if (Math.abs((gsap.getProperty(el, 'yPercent') as number) - to) < 0.01) return
        gsap
          .timeline({ delay: i * 0.08 })
          .to(el, { yPercent: to, duration: 1.15, ease: 'expo.inOut' }, 0)
          .fromTo(el, { filter: 'blur(0px)', scaleY: 1 }, { filter: 'blur(7px)', scaleY: 1.14, duration: 0.42, ease: 'power2.in' }, 0)
          .to(el, { filter: 'blur(0px)', scaleY: 1, duration: 0.7, ease: 'expo.out' }, 0.42)
      })
      ghosts.forEach((el, i) => gsap.to(el, { yPercent: -digits[i] * 10, duration: 1.6, ease: 'expo.inOut', delay: 0.18 + i * 0.08 }))
      gsap.fromTo(
        q('[data-sweep]'),
        { scaleX: 0, transformOrigin: 'left center' },
        {
          keyframes: [
            { scaleX: 1, duration: 0.55, ease: 'power3.inOut' },
            { scaleX: 0, transformOrigin: 'right center', duration: 0.55, ease: 'power3.inOut' },
          ],
        },
      )
    },
    { scope: root, dependencies: [value] },
  )

  const column = (_digit: number, i: number, ghost?: boolean) => (
    <div key={i} className="relative h-full overflow-clip">
      <div {...{ [ghost ? 'data-ghost' : 'data-strip']: '' }} className="flex origin-top flex-col will-change-transform">
        {Array.from({ length: 10 }, (_, n) => (
          <span key={n} className="block h-[clamp(8rem,15vw,15rem)]">
            {n}
          </span>
        ))}
      </div>
    </div>
  )

  return (
    <div ref={root} className="relative" aria-hidden="true">
      {/* outlined ghost, offset for depth */}
      <div className="pointer-events-none absolute left-[0.06em] top-[0.05em] flex h-[clamp(8rem,15vw,15rem)] text-[clamp(8rem,15vw,15rem)] font-semibold leading-none tracking-[-0.07em] text-transparent [-webkit-text-stroke:1px_rgb(255_138_82_/_0.35)]">
        {digits.map((d, i) => column(d, i, true))}
      </div>
      <div className="relative flex h-[clamp(8rem,15vw,15rem)] text-[clamp(8rem,15vw,15rem)] font-semibold leading-none tracking-[-0.07em]">
        {digits.map((d, i) => column(d, i))}
      </div>
      <span data-sweep className="absolute -bottom-3 left-0 h-[2px] w-full scale-x-0 bg-accent-2" />
    </div>
  )
}

/** Thin ring that fills with overall progress through the process. */
function ProgressRing({ progressRef }: { progressRef: RefObject<SVGCircleElement | null> }) {
  return (
    <svg viewBox="0 0 40 40" className="size-10 -rotate-90" aria-hidden="true">
      <circle cx="20" cy="20" r="17" fill="none" stroke="rgb(243 242 238 / 0.14)" strokeWidth="1.5" />
      <circle
        ref={progressRef}
        cx="20"
        cy="20"
        r="17"
        fill="none"
        stroke="var(--color-accent-2)"
        strokeWidth="1.5"
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray="1"
        strokeDashoffset="1"
      />
    </svg>
  )
}
