import { useRef } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { useGSAP } from '@/lib/gsap'
import { registerReveals } from '@/animations/reveal'
import { TransitionLink } from './PageTransition'
import { Magnetic } from './Magnetic'

/**
 * Homepage Careers teaser section — clean editorial section
 * inviting prospective talent to explore /careers.
 */
export function CareersSection() {
  const scope = useRef<HTMLElement>(null)
  useGSAP(() => registerReveals(scope.current!), { scope })

  return (
    <section
      ref={scope}
      id="careers"
      aria-labelledby="careers-section-title"
      className="gutter relative bg-paper section-y border-t border-line overflow-hidden"
    >
      {/* Top meta rail */}
      <div className="type-meta flex items-center gap-4 text-muted">
        <span data-reveal="fade">Careers</span>
        <span className="flex-1" aria-hidden="true" />
        <span data-reveal="fade" className="flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-accent" />
          Talent & Culture
        </span>
      </div>

      {/* Main Grid: Title on left, reduced copy + button on right */}
      <div className="mt-[clamp(1.5rem,3vw,3rem)] grid gap-8 lg:grid-cols-12 lg:items-end">
        <h2
          id="careers-section-title"
          data-reveal="lines"
          className="type-display uppercase lg:col-span-8"
        >
          <span className="block">Join the</span>
          <span className="block">
            journey<span className="text-accent">.</span>
          </span>
        </h2>

        <div className="flex flex-col justify-end items-start gap-6 lg:col-span-4 lg:col-start-9 lg:pb-3">
          <p data-reveal="fade" className="type-lead text-ink/75 max-w-md">
            Building digital products with care. We’re always open to exceptional talent.
          </p>

          <div data-reveal="fade">
            <Magnetic strength={0.3}>
              <TransitionLink
                to="/careers"
                className="group relative inline-flex items-center gap-3.5 rounded-full bg-ink px-7 py-3.5 font-mono text-[0.78rem] font-semibold uppercase tracking-[0.1em] text-paper shadow-[0_4px_24px_rgba(12,12,13,0.12)] transition-all duration-300 hover:bg-accent hover:text-on-accent hover:shadow-[0_6px_28px_rgba(242,87,28,0.35)]"
              >
                <span>View Careers Page</span>
                <ArrowUpRight
                  className="size-4 transition-transform duration-300 group-hover:rotate-45"
                  strokeWidth={2}
                />
              </TransitionLink>
            </Magnetic>
          </div>
        </div>
      </div>
    </section>
  )
}
