import { useRef } from 'react'
import { ArrowUpRight, Sparkles } from 'lucide-react'
import { company } from '@/data/site'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useOffscreenPause } from '@/hooks/useOffscreenPause'
import { gsap, useGSAP } from '@/lib/gsap'
import { registerReveals } from '@/animations/reveal'
import { prefersReducedMotion } from '@/lib/env'
import { TransitionLink } from '@/components/PageTransition'
import { Magnetic } from '@/components/Magnetic'

export function CareersPage() {
  useOffscreenPause()
  useDocumentTitle('Careers — WebBirth')
  const scope = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (scope.current) registerReveals(scope.current)
      if (prefersReducedMotion()) return

      gsap
        .timeline({ defaults: { ease: 'expo.out' }, delay: 0.15 })
        .from('[data-cr-title]', { y: 40, autoAlpha: 0, duration: 1.2 }, 0)
        .from('[data-cr-sub]', { y: 25, autoAlpha: 0, duration: 1 }, 0.2)
        .from('[data-cr-arch]', { y: 80, duration: 1.4, stagger: 0.1 }, 0.25)

      const glow = scope.current?.querySelector('[data-work-cta-glow]')
      if (glow) {
        gsap.to(glow, {
          scale: 1.15,
          opacity: 0.35,
          duration: 4.5,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
          scrollTrigger: { trigger: glow, start: 'top bottom', end: 'bottom top', toggleActions: 'play pause resume pause' },
        })
      }
    },
    { scope },
  )

  return (
    <main id="main" ref={scope} className="min-h-screen bg-[#ded8d6] text-[#0f0f10]">
      {/* ── HERO BANNER MATCHING IMAGE 2 EXACTLY (WITHOUT GET IN TOUCH BUTTON) ── */}
      <section
        aria-labelledby="careers-title"
        className="relative flex min-h-[88vh] sm:min-h-[92vh] flex-col items-center justify-center overflow-hidden px-6 pb-[250px] pt-32 sm:pb-[310px] sm:pt-40 md:pb-[370px] text-center"
      >
        <div className="relative z-10 max-w-4xl mx-auto">
          {/* Main Headline verbatim from Image 2 */}
          <h1
            id="careers-title"
            data-cr-title
            className="text-[clamp(2.4rem,6.8vw,5.6rem)] font-bold tracking-[-0.04em] leading-[1.06] text-[#0f0f10]"
          >
            We are <span className="text-[#77716e] font-semibold">not hiring</span> at the moment.
          </h1>

          {/* Body description text in upright serif typography verbatim from Image 2 */}
          <div data-cr-sub className="mx-auto mt-7 max-w-2xl space-y-4">
            <p className="text-[clamp(1.02rem,1.28vw,1.18rem)] leading-relaxed text-[#2c2b2a]">
              Thank you for your interest in joining the Webbirth team. We don't have any open
              positions right now, but we're always happy to hear from talented people.
            </p>
            <p className="text-[clamp(1.02rem,1.28vw,1.18rem)] leading-relaxed text-[#2c2b2a]">
              Mail us or message us at{' '}
              <a
                href={`mailto:${company.email}`}
                className="font-bold text-[#0f0f10] transition-colors hover:text-black hover:decoration-black"
              >
                {company.email}
              </a>{' '}
              we'll review and let you know.
            </p>
          </div>
        </div>

        {/* ── TERRACOTTA ARCHES MATCHING IMAGE 2 (WITHOUT THE BUTTON) ── */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[220px] sm:h-[280px] md:h-[340px] overflow-hidden"
        >
          {/* Left arch */}
          <div
            data-cr-arch
            className="absolute -left-[10%] sm:-left-[6%] bottom-[-20%] w-[42vw] max-w-[420px] aspect-square rounded-full bg-[#df5c32]"
          />
          {/* Center arch */}
          <div
            data-cr-arch
            className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[45vw] max-w-[440px] h-[75%] rounded-t-full bg-[#df5c32]"
          />
          {/* Right arch */}
          <div
            data-cr-arch
            className="absolute -right-[10%] sm:-right-[6%] bottom-[-20%] w-[42vw] max-w-[420px] aspect-square rounded-full bg-[#df5c32]"
          />
        </div>
      </section>

      {/* ── VALUES & CULTURE SECTION ── */}
      <section className="gutter bg-paper text-ink section-y border-t border-line">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-line pb-8 mb-12">
            <div>
              <p className="type-meta flex items-center gap-2 text-muted uppercase tracking-wider">
                <Sparkles className="size-3.5 text-ink/70" />
                Working at WebBirth
              </p>
              <h2 className="mt-2.5 text-[clamp(2rem,3.8vw,3.2rem)] font-semibold uppercase tracking-[-0.04em]">
                What we stand for<span className="text-accent">.</span>
              </h2>
            </div>
            <p className="type-body text-muted max-w-md text-sm sm:text-base leading-relaxed">
              When positions open up, we look for individuals who take craft seriously and love building digital products that make clients proud.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                index: '01',
                title: 'High Craftsmanship',
                description:
                  'We take pride in typography, micro-interactions, smooth framer animations, and clean architectures that last.',
              },
              {
                index: '02',
                title: 'Autonomous Ownership',
                description:
                  'No micro-management. Every team member has the freedom to lead initiatives, explore new tech, and deliver excellence.',
              },
              {
                index: '03',
                title: 'Genuine Client Impact',
                description:
                  'We build websites and web applications that directly drive revenue, leads, and pride for real businesses.',
              },
            ].map((card) => (
              <div
                key={card.index}
                data-reveal="fade"
                className="flex flex-col justify-between rounded-2xl border border-line bg-paper-2/45 p-7 transition-all duration-300 hover:border-ink/25 hover:bg-paper-2/70"
              >
                <div>
                  <h3 className="text-xl font-semibold text-ink">{card.title}</h3>
                  <p className="type-body mt-3 text-sm text-muted leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WORK CTA (COOL AGENCY STYLING) ── */}
      <section
        aria-labelledby="careers-work-cta"
        data-nav-theme="dark"
        className="gutter relative isolate overflow-hidden bg-[#09090b] text-paper py-20 sm:py-28"
      >
        {/* Ambient atmospheric lighting & tech grid */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          {/* Breathing warm terracotta glow on left */}
          <div
            data-work-cta-glow
            className="absolute -left-20 top-1/2 -translate-y-1/2 size-[420px] rounded-full glow opacity-[0.14] will-change-transform"
          />
          {/* Subtle amber/warm backlight on right */}
          <div className="absolute -right-20 top-1/2 -translate-y-1/2 size-[380px] rounded-full glow opacity-10 [--glow:#f48c06]" />
          {/* Subtle architectural dot grid */}
          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.07)_1px,transparent_1px)] [background-size:28px_28px] [mask-image:radial-gradient(ellipse_65%_60%_at_50%_50%,#000_40%,transparent_100%)]" />
          {/* Luminous hairline top border with glowing neon accent beam */}
          <div className="absolute top-0 inset-x-0 h-px bg-white/[0.08]" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-3/4 max-w-2xl bg-gradient-to-r from-transparent via-accent/70 to-transparent" />
          {/* Hairline bottom border */}
          <div className="absolute bottom-0 inset-x-0 h-px bg-white/[0.06]" />
        </div>

        <div className="relative mx-auto max-w-6xl">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-center">
            <div className="max-w-2xl">
              {/* Clean meta text header (no button pill wrapper) */}
              <p
                data-reveal="fade"
                className="mb-4 flex items-center gap-2.5 font-mono text-xs uppercase tracking-[0.18em] text-paper/60"
              >
                <span className="size-1.5 rounded-full bg-accent" />
                <span>Selected Work & Case Studies</span>
              </p>

              {/* Bold agency headline with signature terracotta question mark */}
              <h2
                id="careers-work-cta"
                data-reveal="lines"
                className="font-sans font-bold text-[clamp(2.1rem,4.4vw,3.5rem)] uppercase tracking-[-0.035em] leading-[1.04] text-white"
              >
                Curious about what we build<span className="text-accent ml-0.5">?</span>
              </h2>

              {/* Subtitle with updated clean font style */}
              <p
                data-reveal="fade"
                className="mt-3.5 max-w-xl font-sans text-base sm:text-[1.12rem] font-normal text-paper/75 leading-relaxed"
              >
                Explore our latest client projects, design case studies, and engineering feats.
              </p>
            </div>

            {/* Magnetic Button with rotating circular badge and luminous halo */}
            <div data-reveal="fade" className="flex shrink-0 items-center">
              <Magnetic strength={0.35}>
                <TransitionLink
                  to="/work"
                  className="group relative inline-flex items-center gap-4 rounded-full bg-white pl-7 pr-2.5 py-2.5 font-mono text-xs font-bold uppercase tracking-[0.12em] text-[#09090b] shadow-[0_0_35px_rgba(255,255,255,0.12)] transition-all duration-300 hover:shadow-[0_0_45px_rgba(223,92,50,0.35)] hover:-translate-y-0.5 active:translate-y-0"
                >
                  <span>View our work</span>
                  <span className="flex size-9 items-center justify-center rounded-full bg-[#09090b] text-white transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:bg-accent group-hover:text-white group-hover:rotate-45">
                    <ArrowUpRight className="size-4" strokeWidth={2.4} />
                  </span>
                </TransitionLink>
              </Magnetic>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
