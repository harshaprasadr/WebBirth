import { useRef } from 'react'
import { projects } from '@/data/projects'
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap'
import { prefersReducedMotion } from '@/lib/env'
import { cn } from '@/lib/cn'

const names = projects.map((p) => p.name)

/**
 * Band of real client names between the hero and the work. Drifts slowly,
 * speeds up with scroll velocity and follows the scroll direction.
 */
export function ClientMarquee() {
  const scope = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const track = trackRef.current
      if (!track || prefersReducedMotion()) return

      let x = 0
      let direction = -1
      let boost = 0
      const base = 0.025 // % of track width per frame at 60fps

      const tick = (_t: number, delta: number) => {
        const frames = delta / 16.67
        x += direction * (base + boost) * frames
        boost *= 0.92
        // The track holds two identical halves; wrap at -50% for a seamless loop.
        if (x <= -50) x += 50
        if (x > 0) x -= 50
        gsap.set(track, { xPercent: x })
      }
      gsap.ticker.add(tick)

      const st = ScrollTrigger.create({
        trigger: scope.current,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
          direction = self.direction === 1 ? -1 : 1
          boost = Math.min(0.6, Math.abs(self.getVelocity()) / 9000)
        },
      })

      return () => {
        gsap.ticker.remove(tick)
        st.kill()
      }
    },
    { scope },
  )

  return (
    <section ref={scope} aria-label="Selected clients" className="relative overflow-clip bg-paper py-5 sm:py-7">
      <h2 className="sr-only">Clients</h2>
      <ul className="sr-only">
        {names.map((n) => (
          <li key={n}>{n}</li>
        ))}
      </ul>
      <div ref={trackRef} aria-hidden="true" className="flex w-max motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:gap-y-2 motion-reduce:px-4">
        {[0, 1].map((copy) => (
          <div key={copy} className={cn('flex shrink-0 items-center motion-reduce:flex-wrap', copy === 1 && 'motion-reduce:hidden')}>
            {names.map((n) => (
              <span key={n} className="flex items-center">
                <span className="whitespace-nowrap px-[clamp(1rem,2.4vw,2.25rem)] text-[clamp(1.35rem,3vw,2.6rem)] font-medium tracking-[-0.04em]">
                  {n}
                </span>
                <span className="size-1.5 rounded-full bg-accent sm:size-2" />
              </span>
            ))}
          </div>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-paper to-transparent sm:w-24" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-paper to-transparent sm:w-24" aria-hidden="true" />
    </section>
  )
}
