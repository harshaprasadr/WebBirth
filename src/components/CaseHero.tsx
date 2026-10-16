import { useEffect, useRef, type PointerEvent } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import { ArrowLeft, ArrowUpRight, Play } from 'lucide-react'
import type { Project } from '@/data/projects'
import { gsap, mq, SplitText, useGSAP } from '@/lib/gsap'
import { useFinePointer } from '@/hooks/useMediaQuery'
import { TransitionLink, usePageTransition } from './PageTransition'
import { Magnetic } from './Magnetic'

const pad = (n: number) => String(n).padStart(2, '0')
const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/#'

export const platformOf = (p: Project) =>
  p.isAppOnly ? 'Mobile App' : p.hasBothWebAndMobile ? 'Web + Mobile' : 'Web Application'

export function CaseHero({ project, index, total }: { project: Project; index: number; total: number }) {
  const root = useRef<HTMLElement>(null)
  const intro = useRef<gsap.core.Timeline | null>(null)
  const { introDone } = usePageTransition()
  const introDoneRef = useRef(introDone)
  const fine = useFinePointer()
  const reduced = useReducedMotion()
  const mx = useMotionValue(-400)
  const my = useMotionValue(-400)
  const gx = useSpring(mx, { stiffness: 60, damping: 18, mass: 0.6 })
  const gy = useSpring(my, { stiffness: 60, damping: 18, mass: 0.6 })

  const onMove = (e: PointerEvent<HTMLElement>) => {
    if (!fine || reduced) return
    const r = e.currentTarget.getBoundingClientRect()
    mx.set(e.clientX - r.left)
    my.set(e.clientY - r.top)
  }

  // Cap the title so its longest word always fits on one line (e.g. ASHTALAKSHMI on a 320px phone).
  const em = (c: string) => ('WM'.includes(c) ? 0.92 : 'IJ1'.includes(c) ? 0.32 : 0.64)
  const longest = Math.max(...project.name.toUpperCase().split(/\s+/).map((w) => [...w].reduce((n, c) => n + em(c), 0)))
  const titleSize = `min(clamp(3.1rem, 11.5vw, 12.5rem), calc(90vw / ${longest.toFixed(2)}))`

  const meta = [
    { k: 'Industry', v: project.industry },
    { k: 'Work', v: project.discipline },
    { k: 'Platform', v: platformOf(project) },
  ]

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(mq.motion, () => {
        const q = gsap.utils.selector(root)
        const title = SplitText.create(q('[data-hero-title]'), { type: 'words,chars', mask: 'chars' })
        const summary = SplitText.create(q('[data-hero-summary]'), { type: 'words', mask: 'words' })
        const scrambles = q('[data-scramble]') as HTMLElement[]
        gsap.set(scrambles, { autoAlpha: 0 })

        // Built paused: on first load the preloader covers the page until introDone.
        const tl = gsap.timeline({ paused: true, delay: 0.15, defaults: { ease: 'case' } })
        intro.current = tl
        if (introDoneRef.current) tl.play()
        tl.from(q('[data-hero-col]'), { scaleY: 0, transformOrigin: 'top center', duration: 1.8, ease: 'expo.inOut', stagger: 0.035 }, 0)
          .from(q('[data-hero-glow]'), { autoAlpha: 0, scale: 0.5, duration: 2.6, ease: 'expo.out' }, 0)
          .from(q('[data-hero-rail] > *'), { autoAlpha: 0, y: -14, duration: 0.9, stagger: 0.08 }, 0.2)
          .from(q('[data-hero-dot]'), { scale: 0, duration: 0.7, ease: 'back.out(3)' }, 0.35)
          .from(title.chars, { yPercent: 118, rotate: 8, duration: 1.4, stagger: 0.028 }, 0.35)
          .from(q('[data-hero-rule]'), { scaleX: 0, transformOrigin: 'left center', duration: 1.2, ease: 'expo.inOut', stagger: 0.1 }, 0.7)
          .from(q('[data-hero-label]'), { autoAlpha: 0, y: 8, duration: 0.7, stagger: 0.08 }, 0.9)

        scrambles.forEach((el, i) => {
          tl.set(el, { autoAlpha: 1 }, 0.4 + i * 0.12).to(
            el,
            { duration: 1.1, ease: 'none', scrambleText: { text: el.dataset.scramble ?? '', chars: SCRAMBLE_CHARS, speed: 0.5, revealDelay: 0.25 } },
            0.4 + i * 0.12,
          )
        })

        tl.from(summary.words, { yPercent: 105, duration: 1.1, stagger: 0.012 }, 1.0)
          .from(q('[data-hero-chip]'), { autoAlpha: 0, scale: 0.7, y: 10, duration: 0.7, ease: 'back.out(2)', stagger: 0.05 }, 1.15)
          .from(q('[data-hero-cta]'), { autoAlpha: 0, y: 24, duration: 0.9, stagger: 0.1 }, 1.3)
          .from(q('[data-hero-cue]'), { autoAlpha: 0, duration: 0.8 }, 1.6)

        // scroll-out: title drifts up, glow sinks, content fades
        const out = { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true }
        gsap.to(q('[data-hero-title-wrap]'), { yPercent: -22, ease: 'none', scrollTrigger: out })
        gsap.to(q('[data-hero-glow]'), { yPercent: 35, ease: 'none', scrollTrigger: out })
        gsap.to(q('[data-hero-bottom]'), { autoAlpha: 0.15, y: -40, ease: 'none', scrollTrigger: { ...out, start: 'top -10%' } })
      })
      return () => {
        intro.current = null
        mm.revert()
      }
    },
    { scope: root },
  )

  useEffect(() => {
    introDoneRef.current = introDone
    if (introDone) intro.current?.play()
  }, [introDone])

  return (
    <section
      ref={root}
      onPointerMove={onMove}
      aria-labelledby="case-title"
      className="relative isolate flex flex-col overflow-clip pt-24 sm:min-h-[100svh] lg:pt-28"
    >
      {/* ── backdrop ─────────────────────────────────── */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div data-hero-glow className="absolute inset-0">
          <div
            className="absolute -right-[12%] -top-[28%] aspect-square w-[70vw] max-w-[1100px] rounded-full opacity-30"
            style={{ background: 'radial-gradient(circle, var(--color-accent) 0%, transparent 62%)' }}
          />
          <div
            className="absolute -right-[4%] top-[18%] aspect-square w-[38vw] max-w-[620px] rounded-full opacity-25"
            style={{ background: 'radial-gradient(circle, var(--color-accent-2) 0%, transparent 65%)' }}
          />
        </div>
        <motion.div
          className="absolute left-0 top-0 size-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full glow opacity-[0.12]"
          style={{ x: gx, y: gy }}
        />
        <div className="gutter absolute inset-0 hidden grid-cols-12 lg:grid">
          {Array.from({ length: 12 }, (_, i) => (
            <div key={i} data-hero-col className="border-l border-ink/[0.06] last:border-r" />
          ))}
        </div>
      </div>

      {/* ── top rail ─────────────────────────────────── */}
      <div
        data-hero-rail
        className="gutter flex items-center justify-between gap-4 font-mono text-[0.68rem] uppercase tracking-widest text-muted"
      >
        <TransitionLink to="/work" className="group inline-flex items-center gap-2 transition-colors hover:text-ink">
          <ArrowLeft className="size-3.5 transition-transform duration-500 group-hover:-translate-x-1" />
          All work
        </TransitionLink>
        <span className="hidden items-center gap-2 sm:inline-flex">
          <span className="size-1 rounded-full bg-ink/40" />
          Case Study
          <span className="size-1 rounded-full bg-ink/40" />
        </span>
        <span className="tabular-nums">
          No. <span data-scramble={pad(index + 1)}>{pad(index + 1)}</span>
          <span className="text-ink/30"> / {pad(total)}</span>
        </span>
      </div>

      {/* ── title ────────────────────────────────────── */}
      <div className="gutter flex flex-col pb-8 pt-12 sm:flex-1 sm:justify-center sm:py-14">
        <div data-hero-title-wrap>
          <p className="flex items-center gap-3 font-mono text-[0.7rem] uppercase tracking-widest text-muted">
            <span data-hero-dot className="relative flex size-2">
              <span className="absolute inset-0 animate-ping rounded-full bg-accent/60" />
              <span className="relative size-2 rounded-full bg-accent" />
            </span>
            <span data-scramble={project.discipline}>{project.discipline}</span>
          </p>
          <h1
            id="case-title"
            data-hero-title
            className="mt-6 font-semibold uppercase leading-[0.86] tracking-[-0.06em] text-ink [text-wrap:balance]"
            style={{ fontSize: titleSize }}
          >
            {project.name}
          </h1>
        </div>
      </div>

      {/* ── meta + summary ───────────────────────────── */}
      <div data-hero-bottom className="gutter grid gap-9 pb-12 lg:grid-cols-12 lg:gap-8 lg:pb-14">
        <div className="order-2 lg:order-none lg:col-span-7">
          <div className="overflow-clip rounded-2xl border border-ink/[0.07] bg-gradient-to-b from-ink/[0.025] to-transparent backdrop-blur-sm">
            <dl className="grid grid-cols-1 sm:grid-cols-3">
              {meta.map((m, i) => (
                <div
                  key={m.k}
                  className={`relative px-6 py-6 sm:px-7 sm:py-7 ${i > 0 ? 'max-sm:border-t max-sm:border-ink/[0.07] sm:border-l sm:border-ink/[0.07]' : ''}`}
                >
                  <span data-hero-rule aria-hidden="true" className={`absolute inset-x-0 top-0 h-px bg-ink/[0.07] ${i === 0 ? '' : 'sm:hidden'}`} />
                  <dt data-hero-label className="flex items-center gap-3 text-muted">
                    <span className="font-mono text-[0.6rem] tabular-nums tracking-widest text-accent">{pad(i + 1)}</span>
                    <span className="font-mono text-[0.62rem] uppercase tracking-[0.16em]">{m.k}</span>
                  </dt>
                  <dd className="mt-3 text-[1.05rem] font-semibold leading-snug tracking-[-0.02em] sm:text-[1.15rem]">
                    <span data-scramble={m.v}>{m.v}</span>
                  </dd>
                </div>
              ))}
            </dl>
            {project.deliverables && (
              <div className="border-t border-ink/[0.07] px-6 py-5 sm:px-7">
                <ul className="flex flex-wrap items-center gap-2.5" aria-label="Deliverables">
                  <li className="mr-1 font-mono text-[0.6rem] uppercase tracking-[0.16em] text-muted">Scope</li>
                  {project.deliverables.map((d) => (
                    <li
                      key={d}
                      data-hero-chip
                      className="rounded-full border border-ink/[0.08] px-3.5 py-1.5 text-[0.7rem] font-medium text-ink/55"
                    >
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="order-1 flex flex-col lg:order-none lg:col-span-4 lg:col-start-9">
          <p data-hero-summary className="text-[1.08rem] leading-relaxed text-ink/75 sm:text-xl [text-wrap:pretty]">
            {project.summary}
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3 sm:mt-8">
            {project.url && (
              <span data-hero-cta>
                <Magnetic strength={0.25}>
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noreferrer"
                    className="group relative inline-flex items-center gap-3 overflow-clip rounded-full bg-ink py-1.5 pl-5 pr-1.5 text-[0.78rem] font-medium uppercase tracking-[0.06em] text-paper"
                  >
                    <span className="absolute inset-0 origin-left scale-x-0 bg-accent transition-transform duration-700 ease-[var(--ease-expo)] group-hover:scale-x-100" />
                    <span className="relative transition-colors duration-500 group-hover:text-on-accent">Visit live site</span>
                    <span className="relative flex size-9 items-center justify-center rounded-full bg-accent text-on-accent transition-all duration-500 group-hover:rotate-45 group-hover:bg-ink group-hover:text-paper">
                      <ArrowUpRight className="size-4" strokeWidth={1.75} />
                    </span>
                  </a>
                </Magnetic>
              </span>
            )}
            {project.playStore && (
              <a
                data-hero-cta
                href={project.playStore}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex min-h-12 items-center gap-2.5 rounded-full border border-ink/15 px-5 text-[0.78rem] font-medium uppercase tracking-[0.06em] transition-colors duration-300 hover:border-ink"
              >
                <Play className="size-3.5 fill-current" strokeWidth={0} />
                Get the app
              </a>
            )}
          </div>
          <div data-hero-cue className="mt-10 hidden items-center gap-3 font-mono text-[0.68rem] uppercase tracking-widest text-muted lg:flex">
            <span className="relative h-8 w-px overflow-clip bg-ink/15">
              <span className="absolute inset-x-0 top-0 h-1/2 animate-[scroll-cue_1.8s_var(--ease-quart)_infinite] bg-accent" />
            </span>
            Scroll to explore
          </div>
        </div>
      </div>
    </section>
  )
}
