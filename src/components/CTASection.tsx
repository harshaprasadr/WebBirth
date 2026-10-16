import { useRef } from 'react'
import { ArrowRight } from 'lucide-react'
import { gsap, useGSAP } from '@/lib/gsap'
import { registerReveals } from '@/animations/reveal'
import { prefersReducedMotion } from '@/lib/env'
import { Magnetic } from './Magnetic'
import { useSmoothScroll } from './SmoothScroll'

/** Final call to action — opposing type drift, slow light, magnetic button. */
export function CTASection() {
  const scope = useRef<HTMLElement>(null)
  const { scrollTo } = useSmoothScroll()

  useGSAP(
    () => {
      registerReveals(scope.current!)
      if (prefersReducedMotion()) return
      const st = { trigger: scope.current, start: 'top bottom', end: 'bottom top', scrub: true }
      gsap.fromTo('[data-cta-a]', { xPercent: -3 }, { xPercent: 3, ease: 'none', scrollTrigger: st })
      gsap.fromTo('[data-cta-b]', { xPercent: 3 }, { xPercent: -3, ease: 'none', scrollTrigger: st })
      gsap.to('[data-cta-glow]', {
        xPercent: 30,
        yPercent: -20,
        duration: 9,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        stagger: 2,
        // only drift while the section is on screen
        scrollTrigger: { trigger: scope.current, start: 'top bottom', end: 'bottom top', toggleActions: 'play pause resume pause' },
      })
    },
    { scope },
  )

  return (
    <section
      ref={scope}
      aria-labelledby="cta-title"
      data-hides-cta
      data-nav-theme="dark"
      className="gutter relative isolate overflow-clip bg-ink py-[clamp(5rem,9vw,8.5rem)] text-paper"
    >
      {/* animated light */}
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div data-cta-glow className="absolute -left-[10%] top-[10%] size-[90vw] sm:size-[50vw] rounded-full glow opacity-35" />
        <div data-cta-glow className="absolute bottom-[-20%] right-[0%] size-[80vw] sm:size-[40vw] rounded-full glow opacity-60 [--glow:var(--color-accent-deep)]" />
      </div>

      <p data-reveal="fade" className="type-meta flex items-center gap-4 text-muted-dark">
        <span>Next step</span>
        <span className="flex-1" aria-hidden="true" />
        <span>Bengaluru — Working globally</span>
      </p>

      <h2 id="cta-title" className="type-display mt-[clamp(2rem,4.5vw,4rem)] uppercase max-sm:text-[16.5vw] max-sm:leading-[0.86]">
        <span data-cta-a className="block text-paper/40">
          <span data-reveal="lines" className="block">
            Have an idea?
          </span>
        </span>
        <span data-cta-b className="block text-right">
          <span data-reveal="lines" data-delay="0.1" className="block">
            Let&rsquo;s build it<span className="text-accent-2">.</span>
          </span>
        </span>
      </h2>

      <div className="mt-[clamp(2rem,4.5vw,4rem)] grid items-center gap-10 md:grid-cols-12">
        <p data-reveal="fade" className="type-lead max-w-md text-paper/65 md:col-span-5">
          Tell us what you&rsquo;re building and let&rsquo;s turn the idea into a digital product.
        </p>
        <div className="flex md:col-span-7 md:justify-end">
          <Magnetic strength={0.4}>
            <button
              type="button"
              onClick={() => scrollTo('#contact')}
              className="group relative flex size-[clamp(10rem,18vw,15rem)] flex-col items-center justify-center gap-3 overflow-clip rounded-full bg-accent text-on-accent"
            >
              <span
                aria-hidden="true"
                className="absolute inset-0 translate-y-full rounded-full bg-paper transition-transform duration-700 ease-[var(--ease-expo)] group-hover:translate-y-0 group-focus-visible:translate-y-0"
              />
              <span className="relative text-center text-sm font-medium uppercase leading-tight tracking-[0.06em]">
                Start a
                <br />
                project
              </span>
              <ArrowRight
                className="relative size-6 transition-[transform,color] duration-700 ease-[var(--ease-expo)] group-hover:translate-x-2"
                strokeWidth={1.5}
              />
            </button>
          </Magnetic>
        </div>
      </div>
    </section>
  )
}
