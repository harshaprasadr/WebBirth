import { useRef } from 'react'
import { company } from '@/data/site'
import { gsap, useGSAP } from '@/lib/gsap'
import { registerParallax, registerReveals } from '@/animations/reveal'
import { prefersReducedMotion } from '@/lib/env'

const facts = [
  { k: 'Founder', v: 'Darshan M R' },
  { k: 'Studio', v: `${company.city}, ${company.country}` },
  { k: 'Reach', v: '15+ countries' },
  { k: 'Focus', v: 'Software · Products · Technology' },
]

export function AboutSection() {
  const scope = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      registerReveals(scope.current!)
      registerParallax(scope.current!)
      if (prefersReducedMotion()) return
      // Phone badge: ring winds and the mark breathes with scroll.
      const st = { trigger: '[data-about-visual]', start: 'top bottom', end: 'bottom top', scrub: true }
      gsap.fromTo('[data-radar-text]', { rotate: -40 }, { rotate: 80, ease: 'none', scrollTrigger: st })
      gsap.fromTo('[data-radar-mark]', { scale: 0.86 }, { scale: 1.06, ease: 'none', scrollTrigger: st })
      // Oversized wordmark slides against the scroll direction.
      gsap.fromTo(
        '[data-about-marquee]',
        { xPercent: 4 },
        {
          xPercent: -28,
          ease: 'none',
          scrollTrigger: { trigger: '[data-about-visual]', start: 'top bottom', end: 'bottom top', scrub: true },
        },
      )
    },
    { scope },
  )

  return (
    <section ref={scope} id="about" aria-labelledby="about-title" className="gutter relative bg-paper section-y">
      <div className="type-meta flex items-center gap-4 text-muted">
        <span data-reveal="fade">About</span>
        <span className="flex-1" aria-hidden="true" />
        <span data-reveal="fade">Since {company.founded}</span>
      </div>

      <div className="mt-[clamp(1.5rem,3vw,3rem)] grid gap-12 lg:grid-cols-12">
        <h2 id="about-title" data-reveal="lines" className="type-display uppercase lg:col-span-8">
          <span className="block">We build</span>
          <span className="block text-muted">digital products</span>
          <span className="block">
            that matter<span className="text-accent">.</span>
          </span>
        </h2>

        <div className="flex flex-col justify-end gap-6 lg:col-span-4">
          <p data-reveal="fade" className="type-lead text-ink">
            WebBirth is a software development company focused on designing, building and evolving digital products
            that solve real business problems.
          </p>
          <p data-reveal="fade" data-delay="0.1" className="type-body text-ink/65">
            We combine design, engineering and technology to create scalable digital experiences for modern
            businesses — in India and across 15+ countries.
          </p>
          <dl className="mt-4 border-t border-line">
            {facts.map((f, i) => (
              <div
                key={f.k}
                data-reveal="fade"
                data-delay={String(0.15 + i * 0.05)}
                className="type-meta flex justify-between gap-4 border-b border-line py-3"
              >
                <dt className="text-muted">{f.k}</dt>
                <dd className="text-right">{f.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* abstract visual */}
      <div
        data-about-visual
        data-reveal="clip"
        className="relative section-gap aspect-[4/5] overflow-clip bg-ink text-paper sm:aspect-[16/10] lg:aspect-[21/9]"
        aria-hidden="true"
      >
        <div data-reveal-inner className="absolute inset-0">
          <div data-parallax="0.25" className="absolute inset-[-12%]">
            <div className="absolute left-[58%] top-1/2 size-[90%] -translate-x-1/2 -translate-y-1/2 rounded-full glow opacity-50" />
            <div className="absolute left-[30%] top-[70%] size-[40%] rounded-full glow opacity-80 [--glow:var(--color-accent-deep)]" />
            <div
              className="absolute inset-0 opacity-50"
              style={{
                backgroundImage:
                  'linear-gradient(to right, rgb(243 242 238 / 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgb(243 242 238 / 0.08) 1px, transparent 1px)',
                backgroundSize: '64px 64px',
              }}
            />
            <svg viewBox="0 0 800 800" className="absolute left-[58%] top-1/2 size-[85%] -translate-x-1/2 -translate-y-1/2 max-sm:hidden">
              {[380, 300, 220, 140].map((r, i) => (
                <circle
                  key={r}
                  cx="400"
                  cy="400"
                  r={r}
                  fill="none"
                  stroke="rgb(243 242 238 / 0.2)"
                  strokeDasharray={i % 2 ? '2 10' : undefined}
                />
              ))}
              <path d="M20 400H780M400 20V780" stroke="rgb(243 242 238 / 0.12)" />
            </svg>
          </div>
        </div>

        <StudioRadar />
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 whitespace-nowrap max-sm:hidden">
          <div
            data-about-marquee
            className="text-[clamp(6rem,22vw,22rem)] font-semibold uppercase leading-none tracking-[-0.07em] text-transparent [-webkit-text-stroke:1px_rgb(243_242_238_/_0.55)]"
          >
            WebBirth — Software — Products — Technology
          </div>
        </div>

        <div className="type-meta absolute inset-x-0 top-0 flex justify-between p-[clamp(1rem,2.5vw,2rem)] text-paper/60">
          <span>WebBirth® / Studio</span>
          <span>12.97° N, 77.59° E</span>
        </div>
        <div className="type-meta absolute inset-x-0 bottom-0 flex items-end justify-between p-[clamp(1rem,2.5vw,2rem)] text-paper/60">
          <span>
            {company.city}
            <br />
            {company.country}
          </span>
          <span className="text-right">
            Design · Engineering
            <br />
            Technology
          </span>
        </div>
      </div>
    </section>
  )
}

const RING_TEXT = 'WEBBIRTH · SOFTWARE · PRODUCTS · TECHNOLOGY · BENGALURU · '

/**
 * Phone-only "studio radar": the mark floats at the centre of a radar —
 * a sweeping beam, location pings radiating out, a rotating type ring and
 * orbiting signals. Pure SVG/CSS so it stays light on mobile.
 */
function StudioRadar() {
  return (
    <div className="absolute inset-0 flex items-center justify-center sm:hidden">
      <div className="relative aspect-square w-[88%]">
        {/* radar sweep */}
        <div
          className="absolute inset-[8%] animate-[spin_6s_linear_infinite] rounded-full"
          style={{ background: 'conic-gradient(from 0deg, rgb(242 87 28 / 0) 0deg, rgb(242 87 28 / 0) 290deg, rgb(255 138 82 / 0.38) 360deg)' }}
        />
        {/* location pings */}
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="radar-ping absolute inset-[8%] rounded-full border border-accent-2/60"
            style={{ animationDelay: `${i * 1.1}s` }}
          />
        ))}
        <svg viewBox="0 0 400 400" className="absolute inset-0 size-full overflow-visible">
          <defs>
            <path id="radar-ring" d="M200,200 m-160,0 a160,160 0 1,1 320,0 a160,160 0 1,1 -320,0" />
          </defs>
          {/* range rings + crosshair */}
          {[172, 120, 72].map((r, i) => (
            <circle key={r} cx="200" cy="200" r={r} fill="none" stroke="rgb(243 242 238 / 0.14)" strokeDasharray={i === 1 ? '2 6' : undefined} />
          ))}
          <path d="M200 24V376M24 200H376" stroke="rgb(243 242 238 / 0.08)" />
          {/* rotating type ring */}
          <g data-radar-text style={{ transformOrigin: '200px 200px' }}>
            <g className="origin-center animate-[spin_40s_linear_infinite]" style={{ transformBox: 'view-box' }}>
              <text className="fill-paper/55 font-mono text-[10px] uppercase" >
                <textPath href="#radar-ring" textLength={1000} lengthAdjust="spacing">
                  {RING_TEXT.repeat(2)}
                </textPath>
              </text>
            </g>
          </g>
          {/* tick ring (counter-rotating) */}
          <g className="origin-center animate-[spin_70s_linear_infinite_reverse]" style={{ transformBox: 'view-box' }}>
            {Array.from({ length: 72 }, (_, i) => {
              const a = (i / 72) * Math.PI * 2
              const long = i % 6 === 0
              return (
                <line
                  key={i}
                  x1={200 + Math.cos(a) * 192}
                  y1={200 + Math.sin(a) * 192}
                  x2={200 + Math.cos(a) * (long ? 184 : 188)}
                  y2={200 + Math.sin(a) * (long ? 184 : 188)}
                  stroke={i === 0 ? '#f2571c' : `rgb(243 242 238 / ${long ? 0.45 : 0.2})`}
                  strokeWidth={long ? 1.4 : 1}
                />
              )
            })}
          </g>
          {/* orbiting signals */}
          {[
            { r: 120, d: '9s', c: '#ff8a52' },
            { r: 168, d: '15s', c: '#f2571c' },
            { r: 72, d: '6s', c: '#ffd2b5' },
          ].map((o, i) => (
            <g key={i} className="origin-center" style={{ transformBox: 'view-box', animation: `spin ${o.d} linear infinite${i % 2 ? ' reverse' : ''}` }}>
              <circle cx={200 + o.r} cy="200" r="4" fill={o.c} />
              <circle cx={200 + o.r} cy="200" r="10" fill={o.c} opacity="0.25" />
            </g>
          ))}
        </svg>
        {/* the mark */}
        <div data-radar-mark className="absolute inset-[27%] flex items-center justify-center">
          <img
            src="/brand/webbirth-mark-lg.webp?v=2"
            alt=""
            className="w-full animate-[float-y_5s_ease-in-out_infinite] drop-shadow-[0_18px_30px_rgba(242,87,28,0.55)]"
          />
        </div>
      </div>
    </div>
  )
}
