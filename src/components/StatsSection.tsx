import { useRef } from 'react'
import { stats } from '@/data/site'
import { gsap, useGSAP } from '@/lib/gsap'
import { registerReveals } from '@/animations/reveal'
import { prefersReducedMotion } from '@/lib/env'
import { cn } from '@/lib/cn'

const fmt = (n: number, pad = 0) => String(Math.round(n)).padStart(pad, '0')

/** Verified figures only — see src/data/site.ts for sources. */
export function StatsSection() {
  const scope = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      registerReveals(scope.current!)
      const reduced = prefersReducedMotion()
      gsap.utils.toArray<HTMLElement>('[data-count]', scope.current).forEach((el) => {
        const target = Number(el.dataset.count)
        const pad = Number(el.dataset.pad ?? 0)
        if (reduced) return
        const counter = { v: 0 }
        el.textContent = fmt(0, pad)
        gsap.to(counter, {
          v: target,
          duration: 1.6,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
          onUpdate: () => (el.textContent = fmt(counter.v, pad)),
        })
      })
    },
    { scope },
  )

  return (
    <section ref={scope} aria-label="WebBirth in numbers" className="gutter relative bg-paper section-pb">
      <div className="type-meta flex items-center gap-4 text-muted">
        <span data-reveal="fade">In numbers</span>
        <span className="flex-1" aria-hidden="true" />
        <span data-reveal="fade" />
      </div>

      <dl className="grid grid-cols-1 sm:grid-cols-2">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className={cn(
              'flex flex-col justify-between gap-6 border-b border-line py-[clamp(1.75rem,4vw,3.25rem)]',
              i % 2 === 0 ? 'sm:border-r sm:pr-[clamp(1rem,3vw,3rem)]' : 'sm:pl-[clamp(1rem,3vw,3rem)]',
            )}
          >
            <dt className="type-meta order-2 flex items-center justify-between text-muted">
              <span>{s.label}</span>
              <span>{String(i + 1).padStart(2, '0')}</span>
            </dt>
            <dd data-reveal="fade" className="order-1 flex items-start text-[clamp(4rem,10vw,9rem)] font-semibold leading-[0.85] tracking-[-0.06em]">
              <span className="sr-only">
                {s.value}
                {s.suffix}
              </span>
              <span aria-hidden="true" data-count={s.value} data-pad={'pad' in s ? s.pad : 0} className="tabular-nums">
                {fmt(s.value, 'pad' in s ? s.pad : 0)}
              </span>
              {s.suffix && (
                <span aria-hidden="true" className="text-[0.45em] leading-none text-accent">
                  {s.suffix}
                </span>
              )}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
