import { useRef, type PointerEvent, type ReactNode } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion'
import { ArrowRight, ArrowUpRight, BadgeCheck, CalendarRange, Check, Cpu, Layers, Sparkles, Target, type LucideIcon } from 'lucide-react'
import type { CaseStudy } from '@/data/caseStudies'
import { gsap, mq, ScrollTrigger, SplitText, useGSAP } from '@/lib/gsap'
import { cn } from '@/lib/cn'
import { prefersReducedMotion } from '@/lib/env'
import { useFinePointer } from '@/hooks/useMediaQuery'
import { useSmoothScroll } from './SmoothScroll'

type Stage = { id: string; a: string; b?: string }

const STAGES: Stage[] = [
  { id: 'tech', a: 'Tech', b: 'Resources' },
  { id: 'timeline', a: 'Timeline', b: 'Problem Statement' },
  { id: 'resolved', a: 'Resolved' },
  { id: 'use-cases', a: 'Use Cases' },
]

/** Flow map nodes, laid out like the original sketch (viewBox 100 x 140). */
type LabelPos = 'below' | 'above' | 'above-end' | 'right'
const NODES: { label: string; x: number; y: number; stage: number; icon: LucideIcon; pos: LabelPos }[] = [
  { label: 'Tech', x: 20, y: 14, stage: 0, icon: Cpu, pos: 'below' },
  { label: 'Resources', x: 76, y: 14, stage: 0, icon: Layers, pos: 'above' },
  { label: 'Timeline', x: 20, y: 52, stage: 1, icon: CalendarRange, pos: 'below' },
  { label: 'Problem Statement', x: 72, y: 52, stage: 1, icon: Target, pos: 'above-end' },
  { label: 'Resolved', x: 44, y: 90, stage: 2, icon: BadgeCheck, pos: 'right' },
  { label: 'Use Cases', x: 44, y: 122, stage: 3, icon: Sparkles, pos: 'below' },
]
const SEGMENTS = [
  'M20 14 L76 14',
  'M76 14 C76 36 20 30 20 52',
  'M20 52 L72 52',
  'M72 52 C72 74 44 68 44 90',
  'M44 90 L44 122',
]

const pad = (n: number) => String(n).padStart(2, '0')
const stageLabel = (s: Stage) => (s.b ? `${s.a} → ${s.b}` : s.a)

function gantt(timeline: CaseStudy['timeline']) {
  const weeks = timeline.map((s) => {
    const m = s.duration?.match(/(\d+)\s*week/i)
    return m ? Number(m[1]) : null
  })
  const known = weeks.every((w) => w !== null)
  const spans = known ? (weeks as number[]) : timeline.map(() => 1)
  const total = spans.reduce((a, b) => a + b, 0)
  let acc = 0
  const rows = timeline.map((s, i) => {
    const left = (acc / total) * 100
    acc += spans[i]
    return { ...s, left, width: (spans[i] / total) * 100 }
  })
  const ticks = known ? [0, 1, 2, 3, 4].map((k) => Math.round((total * k) / 4)) : []
  return { rows, total: known ? total : null, ticks }
}

export function CaseStudyFlow({ cs, resources }: { cs: CaseStudy; resources: string[] }) {
  const root = useRef<HTMLElement>(null)
  const { scrollTo } = useSmoothScroll()
  const plan = gantt(cs.timeline)

  useGSAP(
    () => {
      const el = root.current!
      const all = (sel: string, from: ParentNode = el) => Array.from(from.querySelectorAll<HTMLElement>(sel))
      const one = (sel: string, from: ParentNode = el) => from.querySelector<HTMLElement>(sel)

      const wraps = all('[data-card-wrap]')
      const cards = all('[data-stage]')
      const odo = one('[data-odo]')
      const hudLabel = one('[data-hud-label]')
      const pillNum = one('[data-pill-num]')
      const pillLabel = one('[data-pill-label]')
      let current = 0

      // ── active stage → HUD odometer, label scramble, mobile pill ──
      const setActive = (i: number) => {
        if (i === current) return
        current = i
        if (odo) gsap.to(odo, { yPercent: -25 * i, duration: 0.9, ease: 'expo.out', overwrite: true })
        if (hudLabel)
          gsap.to(hudLabel, {
            duration: 0.7,
            overwrite: true,
            scrambleText: { text: stageLabel(STAGES[i]), chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', speed: 0.6 },
          })
        if (pillNum) pillNum.textContent = `${pad(i + 1)}/${pad(STAGES.length)}`
        if (pillLabel) pillLabel.textContent = stageLabel(STAGES[i])
      }
      wraps.forEach((wrap, i) =>
        ScrollTrigger.create({
          trigger: wrap,
          start: 'top 55%',
          end: 'bottom 55%',
          onToggle: (self) => self.isActive && setActive(i),
        }),
      )

      // ── overall progress (percent + mobile ring) ──
      const pct = one('[data-hud-pct]')
      const progress = { trigger: one('[data-stack]'), start: 'top 70%', end: 'bottom bottom' }
      ScrollTrigger.create({
        ...progress,
        onUpdate: (self) => {
          if (pct) pct.textContent = String(Math.round(self.progress * 100))
        },
      })
      gsap.fromTo('[data-pill-ring]', { drawSVG: '0%' }, { drawSVG: '100%', ease: 'none', scrollTrigger: { ...progress, scrub: 0.5 } })

      const mm = gsap.matchMedia()

      // ── map nodes: ignite when the comet arrives ──
      const mapNodes = all('[data-map-node]')
      const spot = one('[data-spot]')
      const sparks = (host: HTMLElement, count: number, big: boolean) => {
        const colors = ['var(--color-accent)', 'var(--color-accent-2)', 'var(--color-ink)']
        for (let k = 0; k < count; k++) {
          const bit = document.createElement('span')
          const size = big ? gsap.utils.random(4, 8) : gsap.utils.random(3, 5)
          const chip = big && k % 2 === 1
          bit.style.cssText = `position:absolute;left:0;top:0;width:${size}px;height:${chip ? size / 2 : size}px;margin:${-size / 2}px 0 0 ${-size / 2}px;border-radius:${chip ? '1px' : '999px'};background:${colors[big ? k % 3 : k % 2]}`
          host.appendChild(bit)
          gsap.to(bit, {
            duration: gsap.utils.random(0.8, big ? 1.8 : 1.1),
            physics2D: { velocity: gsap.utils.random(big ? 90 : 40, big ? 230 : 110), angle: gsap.utils.random(0, 360), gravity: big ? 320 : 160 },
            rotation: gsap.utils.random(-360, 360),
            autoAlpha: 0,
            ease: 'power1.in',
            onComplete: () => bit.remove(),
          })
        }
      }
      const syncCurrent = () => {
        let last = -1
        mapNodes.forEach((n, i) => n.dataset.on === 'true' && (last = i))
        mapNodes.forEach((n, i) =>
          n.setAttribute('data-state', i === last ? 'current' : n.dataset.on === 'true' ? 'done' : 'idle'),
        )
        const target = mapNodes[Math.max(last, 0)]
        if (spot && target)
          gsap.to(spot, {
            x: target.offsetLeft,
            y: target.offsetTop,
            autoAlpha: last >= 0 ? 1 : 0,
            duration: prefersReducedMotion() ? 0 : 1.1,
            ease: 'expo.out',
            overwrite: true,
          })
      }
      const observer = new MutationObserver((records) => {
        for (const r of records) {
          const node = r.target as HTMLElement
          if (node.dataset.on !== 'true' || r.oldValue === 'true' || prefersReducedMotion()) continue
          const finale = node === mapNodes[mapNodes.length - 1]
          gsap.fromTo(one('[data-node-btn]', node), { scale: 0.55 }, { scale: 1, duration: 1.1, ease: 'elastic.out(1.1, 0.4)', overwrite: true })
          gsap.fromTo(
            one('[data-ripple]', node),
            { scale: 1, opacity: 1 },
            { scale: finale ? 3.2 : 2.3, opacity: 0, duration: 1.2, ease: 'expo.out', overwrite: true },
          )
          const label = one('[data-node-label]', node)
          if (label)
            gsap.to(label, {
              duration: 0.8,
              overwrite: true,
              scrambleText: { text: label.dataset.text ?? '', chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', speed: 0.7 },
            })
          const host = one('[data-spark]', node)
          if (host) sparks(host, finale ? 32 : 8, finale)
        }
        syncCurrent()
      })
      mapNodes.forEach((n) => observer.observe(n, { attributes: true, attributeFilter: ['data-on'], attributeOldValue: true }))

      mm.add(mq.reduced, () => {
        mapNodes.forEach((n) => n.setAttribute('data-on', 'true'))
        gsap.set('[data-comet], [data-streak]', { autoAlpha: 0 })
      })

      // ── flow map: path draws, a light streak + comet race along it, steps ignite; deck stacks ──
      mm.add(mq.desktop, () => {
        const segs = all('[data-seg]')
        const glows = all('[data-seg-glow]')
        const streaks = all('[data-streak]')
        const flows = all('[data-flow]')
        const comet = one('[data-comet]')
        const tl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { ...progress, scrub: 0.7 } })
        tl.set(mapNodes[0], { attr: { 'data-on': 'true' } }, 0)
        // segments 1–2 span stage 1, 3–4 stage 2, 5 stage 3, then hold through stage 4
        const durations = [0.5, 0.5, 0.5, 0.5, 1]
        let t = 0
        segs.forEach((seg, i) => {
          const d = durations[i]
          tl.fromTo([seg, glows[i]], { drawSVG: '0%' }, { drawSVG: '100%', duration: d }, t)
            .fromTo(streaks[i], { drawSVG: '0% 0%' }, { drawSVG: '68% 100%', duration: d }, t)
            .to(streaks[i], { drawSVG: '100% 100%', duration: 0.12 }, t + d)
            .fromTo(flows[i], { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.05 }, t + d)
          const path = seg as unknown as SVGPathElement
          if (comet) tl.to(comet, { motionPath: { path, align: path, alignOrigin: [0.5, 0.5] as [number, number] }, duration: d }, t)
          t += d
          tl.set(mapNodes[i + 1], { attr: { 'data-on': 'true' } }, t)
        })
        tl.to({}, { duration: 0.8 }, t)

        // stick each card as high as possible, but never with its bottom below the fold
        const placeCards = () => {
          wraps.forEach((w, i) => {
            const ideal = 88 + i * 16
            const fit = window.innerHeight - w.offsetHeight - 20
            w.style.top = `${Math.min(ideal, fit)}px`
          })
        }
        placeCards()
        ScrollTrigger.addEventListener('refreshInit', placeCards)

        cards.forEach((card, i) => {
          const nextWrap = wraps[i + 1]
          if (!nextWrap) return
          gsap.to(card, {
            scale: 0.92,
            transformOrigin: '50% 0%',
            ease: 'none',
            scrollTrigger: { trigger: nextWrap, start: 'top 85%', end: 'top 20%', scrub: 0.6 },
          })
        })

        return () => {
          ScrollTrigger.removeEventListener('refreshInit', placeCards)
          wraps.forEach((w) => (w.style.top = ''))
        }
      })

      // ── per-card entrances ──
      mm.add(mq.motion, () => {
        const draw = (tl: gsap.core.Timeline, arrow: HTMLElement | null, at: gsap.Position) => {
          if (!arrow) return
          tl.fromTo(all('[data-draw]', arrow), { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.6, ease: 'power2.inOut' }, at).from(
            all('[data-head]', arrow),
            { autoAlpha: 0, scale: 0.3, transformOrigin: '50% 50%', duration: 0.4, ease: 'back.out(3)' },
            '>-0.1',
          )
        }

        cards.forEach((card, i) => {
          const tl = gsap.timeline({ defaults: { ease: 'case' }, scrollTrigger: { trigger: wraps[i], start: 'top 72%', once: true } })
          const title = SplitText.create(one('[data-card-title]', card), { type: 'words,chars', mask: 'chars' })
          tl.from(one('[data-card-badge]', card), { scale: 0, rotate: -140, duration: 0.9, ease: 'back.out(2)' }, 0)
            .from(one('[data-card-meta]', card), { autoAlpha: 0, x: -12, duration: 0.7 }, 0.15)
            .from(title.chars, { yPercent: 115, rotate: 6, duration: 1.1, stagger: 0.022 }, 0.1)
            .from(one('[data-card-num]', card), { yPercent: 40, autoAlpha: 0, duration: 1.6 }, 0)
          const arrow = one('[data-card-arrow]', card)
          if (arrow) tl.from(arrow, { autoAlpha: 0, x: -24, duration: 0.7 }, 0.4)

          const id = card.dataset.stage

          if (id === 'tech') {
            tl.from(
              all('[data-tile]', card),
              {
                autoAlpha: 0,
                rotateX: -85,
                y: 18,
                transformPerspective: 700,
                transformOrigin: '50% 0%',
                duration: 0.9,
                stagger: { each: 0.06, grid: 'auto', from: 'start' },
              },
              0.45,
            )
            draw(tl, one('[data-flow-arrow]', card), '>-0.4')
            tl.from(all('[data-res-row]', card), { autoAlpha: 0, x: -20, duration: 0.7, stagger: 0.1 }, '>-0.3').from(
              all('[data-res-rule]', card),
              { scaleX: 0, transformOrigin: 'left center', duration: 0.9, ease: 'expo.inOut', stagger: 0.1 },
              '<',
            )
          }

          if (id === 'timeline') {
            const bars = all('[data-bar]', card)
            const sweep = 0.22 * bars.length + 0.6
            tl.from(all('[data-gantt-label]', card), { autoAlpha: 0, x: -14, duration: 0.6, stagger: 0.08 }, 0.45)
              .from(all('[data-tick]', card), { autoAlpha: 0, y: -6, duration: 0.5, stagger: 0.05 }, 0.45)
              .from(bars, { scaleX: 0, transformOrigin: 'left center', duration: 0.8, stagger: 0.22 }, 0.7)
              .fromTo(one('[data-playhead]', card), { left: '0%', autoAlpha: 1 }, { left: '100%', duration: sweep, ease: 'none' }, 0.7)
              .to(one('[data-playhead]', card), { autoAlpha: 0, duration: 0.3 })
            const total = one('[data-total]', card)
            if (total) {
              const counter = { v: 0 }
              tl.to(
                counter,
                {
                  v: Number(total.dataset.total),
                  duration: sweep,
                  ease: 'power2.out',
                  onUpdate: () => {
                    total.textContent = String(Math.round(counter.v))
                  },
                },
                0.7,
              )
            }
            draw(tl, one('[data-flow-arrow]', card), 1.0)
            tl.fromTo(
              one('[data-problem]', card),
              { clipPath: 'inset(0% 0% 100% 0% round 24px)' },
              { clipPath: 'inset(0% 0% 0% 0% round 24px)', duration: 1.2, ease: 'expo.inOut' },
              1.1,
            ).from(one('[data-quote-mark]', card), { autoAlpha: 0, y: 50, scale: 0.5, duration: 1.1 }, 1.6)
            const quote = one('[data-problem-text]', card)
            if (quote) {
              const split = SplitText.create(quote, { type: 'words' })
              tl.fromTo(split.words, { opacity: 0.12 }, { opacity: 1, duration: 0.5, ease: 'none', stagger: 0.035 }, 1.7)
            }
          }

          if (id === 'resolved') {
            tl.from(one('[data-medal]', card), { scale: 0, rotate: -180, duration: 1.2, ease: 'back.out(1.6)' }, 0.4)
              .fromTo(one('[data-check]', card), { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.7, ease: 'power2.out' }, 1.1)
              .from(one('[data-medal-label]', card), { autoAlpha: 0, y: 10, duration: 0.6 }, 1.2)
            const text = one('[data-resolved-text]', card)
            if (text) {
              const split = SplitText.create(text, { type: 'words', mask: 'words' })
              tl.from(split.words, { yPercent: 100, duration: 0.9, stagger: 0.016 }, 0.6)
            }
          }

          if (id === 'use-cases') {
            tl.from(
              all('[data-uc]', card),
              { autoAlpha: 0, y: 70, rotateX: -16, transformPerspective: 900, transformOrigin: '50% 0%', duration: 1, stagger: 0.12 },
              0.4,
            ).from(all('[data-uc-num]', card), { yPercent: 80, duration: 0.9, stagger: 0.12 }, 0.6)
          }
        })

        const heading = SplitText.create(one('[data-flow-title]'), { type: 'words,chars', mask: 'chars' })
        gsap
          .timeline({ defaults: { ease: 'case' }, scrollTrigger: { trigger: one('[data-flow-head]'), start: 'top 80%', once: true } })
          .from(one('[data-flow-eyebrow]'), { autoAlpha: 0, y: 10, duration: 0.7 }, 0)
          .from(heading.chars, { yPercent: 115, rotate: 6, duration: 1.2, stagger: 0.02 }, 0.1)
          .from(all('[data-node-in]'), { autoAlpha: 0, scale: 0.6, duration: 0.7, ease: 'back.out(2)', stagger: 0.08 }, 0.4)
          .from(one('[data-hud]'), { autoAlpha: 0, y: 20, duration: 0.8 }, 0.8)
      })

      return () => {
        observer.disconnect()
        mm.revert()
      }
    },
    { scope: root },
  )

  const goTo = (i: number) => scrollTo(`#cs-${STAGES[i].id}`, { offset: -110 })

  return (
    <section ref={root} data-hides-cta className="relative border-t border-line" aria-label="Case study">
      <div className="gutter py-20 sm:py-28 lg:py-32">
        {/* ── header ─────────────────────────────────────── */}
        <header data-flow-head className="mb-14 lg:mb-20">
          <p data-flow-eyebrow className="flex items-center gap-2.5 font-mono text-[0.68rem] uppercase tracking-widest text-muted">
            <span className="size-1.5 rounded-full bg-accent" />
            Case study · {pad(STAGES.length)} stages
          </p>
          <h2
            data-flow-title
            className="mt-5 max-w-5xl text-[clamp(2.6rem,7vw,7rem)] font-semibold uppercase leading-[0.88] tracking-[-0.055em]"
          >
            From Tech to <span className="text-accent">Use Cases</span>
          </h2>
        </header>

        <div className="lg:grid lg:grid-cols-12 lg:gap-10 xl:gap-14">
          {/* ── flow map (desktop) ─────────────────────────── */}
          <aside className="hidden lg:col-span-4 lg:block">
            <div className="sticky top-[5.5rem]">
              <FlowMap onGo={goTo} />

              <div data-hud className="mt-6 flex items-end justify-between border-t border-line pt-5">
                <div className="min-w-0">
                  <p className="font-mono text-[0.66rem] uppercase tracking-widest text-muted">Stage</p>
                  <div className="mt-2 flex items-baseline gap-1.5">
                    <span className="block h-[2.6rem] overflow-clip text-[2.6rem] font-semibold leading-none tracking-[-0.05em] tabular-nums">
                      <span data-odo className="flex flex-col">
                        {STAGES.map((_, i) => (
                          <span key={i} className="block h-[2.6rem]">
                            {pad(i + 1)}
                          </span>
                        ))}
                      </span>
                    </span>
                    <span className="text-lg font-medium text-muted">/{pad(STAGES.length)}</span>
                  </div>
                  <p data-hud-label className="mt-2 truncate font-mono text-[0.68rem] uppercase tracking-widest text-accent">
                    {stageLabel(STAGES[0])}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-[0.66rem] uppercase tracking-widest text-muted">Progress</p>
                  <p className="mt-2 text-2xl font-semibold tabular-nums tracking-tight">
                    <span data-hud-pct>0</span>
                    <span className="text-muted">%</span>
                  </p>
                </div>
              </div>
            </div>
          </aside>

          {/* ── card deck ──────────────────────────────────── */}
          <div data-stack className="lg:col-span-8">
            <DeckCard index={0} tone="paper">
              <div className="grid items-stretch gap-0 xl:grid-cols-[minmax(0,1.55fr)_auto_minmax(0,1fr)]">
                <div>
                  <Label>Tech</Label>
                  <ul className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 2xl:grid-cols-4">
                    {cs.tech.map((t, i) => (
                      <li key={t} data-tile>
                        <div className="group flex min-h-[4.6rem] flex-col justify-between gap-2 rounded-2xl border border-line bg-paper-2/60 p-3.5 transition-colors duration-300 hover:border-accent hover:bg-accent">
                          <span className="font-mono text-[0.66rem] tracking-widest text-muted transition-colors group-hover:text-on-accent/70">
                            T/{pad(i + 1)}
                          </span>
                          <span className="text-[0.88rem] font-semibold leading-tight tracking-tight transition-colors group-hover:text-on-accent">
                            {t}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                {resources.length > 0 && (
                  <>
                    <FlowArrow />
                    <div>
                      <Label>Resources</Label>
                      <ul className="mt-3">
                        {resources.map((r, i) => (
                          <li key={r} data-res-row className="relative flex items-baseline gap-4 py-3.5">
                            <span className="w-8 shrink-0 text-xl font-semibold leading-none tracking-tight text-accent tabular-nums">
                              {pad(i + 1)}
                            </span>
                            <span className="text-[1rem] font-medium leading-snug tracking-tight">{r}</span>
                            <span data-res-rule className="absolute inset-x-0 bottom-0 h-px bg-line" />
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}
              </div>
            </DeckCard>

            <DeckCard index={1} tone="paper">
              <div className="grid items-stretch gap-0 xl:grid-cols-[minmax(0,1.25fr)_auto_minmax(0,1fr)]">
                <div>
                  <div className="flex items-center justify-between">
                    <Label>Timeline</Label>
                    {plan.total !== null && (
                      <p className="text-sm font-medium text-muted">
                        <span data-total={plan.total} className="text-xl font-semibold tracking-tight text-ink tabular-nums">
                          {plan.total}
                        </span>{' '}
                        weeks
                      </p>
                    )}
                  </div>
                  <div className="mt-4 grid grid-cols-[minmax(0,8.5rem)_minmax(0,1fr)] gap-x-4">
                    <div className="h-6" />
                    <div className="relative h-6">
                      {plan.ticks.map((w, i) => (
                        <span
                          key={i}
                          data-tick
                          className={cn(
                            'absolute top-0 font-mono text-[0.66rem] uppercase tracking-wider text-muted',
                            i === 0 ? '' : i === plan.ticks.length - 1 ? '-translate-x-full' : '-translate-x-1/2',
                          )}
                          style={{ left: `${i * 25}%` }}
                        >
                          W{w}
                        </span>
                      ))}
                    </div>
                    <ul>
                      {plan.rows.map((r) => (
                        <li key={r.phase} data-gantt-label className="flex h-[3.25rem] flex-col justify-center">
                          <p className="line-clamp-2 text-[0.82rem] font-semibold leading-tight tracking-tight">{r.phase}</p>
                          {r.duration && <p className="mt-0.5 font-mono text-[0.66rem] uppercase tracking-wider text-muted">{r.duration}</p>}
                        </li>
                      ))}
                    </ul>
                    <div className="relative">
                      {[25, 50, 75].map((p) => (
                        <span key={p} aria-hidden="true" className="absolute inset-y-0 w-px bg-line" style={{ left: `${p}%` }} />
                      ))}
                      {plan.rows.map((r) => (
                        <div key={r.phase} className="relative flex h-[3.25rem] items-center">
                          <div className="absolute inset-x-0 h-7 rounded-full bg-ink/[0.035]" />
                          <div
                            data-bar
                            className="absolute h-7 rounded-full bg-accent shadow-[0_8px_20px_-10px_rgb(242_87_28_/_0.7)]"
                            style={{ left: `${r.left}%`, width: `${r.width}%` }}
                          />
                        </div>
                      ))}
                      <span data-playhead aria-hidden="true" className="absolute -top-1 bottom-0 w-px bg-ink opacity-0" style={{ left: '0%' }}>
                        <span className="absolute -left-[3px] -top-1 size-[7px] rounded-full bg-ink" />
                      </span>
                    </div>
                  </div>
                </div>

                <FlowArrow />

                <div data-problem className="relative flex flex-col overflow-clip rounded-3xl bg-ink p-6 text-paper sm:p-8">
                  <span
                    data-quote-mark
                    aria-hidden="true"
                    className="pointer-events-none absolute right-6 top-4 select-none font-serif text-[8rem] leading-[0.75] text-accent/30"
                  >
                    &rdquo;
                  </span>
                  <Label dark>Problem Statement</Label>
                  <blockquote
                    data-problem-text
                    className="relative mt-auto pt-8 font-serif text-[clamp(1.2rem,1.65vw,1.6rem)] italic leading-[1.3] [text-wrap:pretty]"
                  >
                    {cs.problemStatement}
                  </blockquote>
                </div>
              </div>
            </DeckCard>

            <DeckCard index={2} tone="orange">
              <div className="grid items-center gap-10 md:grid-cols-[auto_minmax(0,1fr)] md:gap-14">
                <div className="flex flex-col items-start">
                  <div data-medal className="relative size-32 sm:size-40">
                    <svg
                      viewBox="0 0 160 160"
                      className="absolute inset-0 size-full animate-[spin_24s_linear_infinite] motion-reduce:animate-none"
                      aria-hidden="true"
                    >
                      <circle cx="80" cy="80" r="76" fill="none" stroke="var(--color-ink)" strokeOpacity={0.35} strokeWidth="1.5" strokeDasharray="3 7" />
                    </svg>
                    <svg viewBox="0 0 160 160" className="absolute inset-0 size-full" aria-hidden="true">
                      <circle cx="80" cy="80" r="62" fill="var(--color-ink)" />
                      <path
                        data-check
                        d="M54 82 L72 100 L108 62"
                        fill="none"
                        stroke="var(--color-accent)"
                        strokeWidth="9"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <p data-medal-label className="mt-5 font-mono text-[0.68rem] uppercase tracking-widest text-on-accent/70">
                    Solution delivered
                  </p>
                </div>
                <p
                  data-resolved-text
                  className="text-[clamp(1.25rem,2.2vw,2.1rem)] font-semibold leading-[1.22] tracking-[-0.025em] text-on-accent [text-wrap:pretty]"
                >
                  {cs.resolved}
                </p>
              </div>
            </DeckCard>

            <DeckCard index={3} tone="dark" last>
              <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
                {cs.useCases.map((uc, i) => (
                  <UseCase key={uc.title} n={i + 1} title={uc.title} description={uc.description} />
                ))}
              </div>
            </DeckCard>
          </div>
        </div>

        {/* ── stage pill (phones / tablets) ──────────────────── */}
        <div className="pointer-events-none sticky bottom-[max(1rem,env(safe-area-inset-bottom))] z-20 mt-12 flex lg:hidden">
          <div className="mx-auto flex max-w-full items-center gap-3 rounded-full bg-ink/92 py-2 pl-2 pr-4 text-paper shadow-[0_12px_40px_-12px_rgba(12,12,13,0.55)] backdrop-blur">
            <svg viewBox="0 0 32 32" className="size-8 shrink-0 -rotate-90" aria-hidden="true">
              <circle cx="16" cy="16" r="13" fill="none" stroke="rgb(243 242 238 / 0.15)" strokeWidth="2.5" />
              <circle data-pill-ring cx="16" cy="16" r="13" fill="none" stroke="var(--color-accent)" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            <span data-pill-num className="font-mono text-[0.68rem] tracking-widest text-paper/60">
              01/{pad(STAGES.length)}
            </span>
            <span data-pill-label className="truncate text-[0.8rem] font-medium">
              {stageLabel(STAGES[0])}
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

const TONES = {
  paper: 'border-line bg-paper text-ink',
  orange: 'border-transparent bg-accent text-on-accent',
  dark: 'border-transparent bg-ink text-paper',
} as const

function DeckCard({ index, tone, last, children }: { index: number; tone: keyof typeof TONES; last?: boolean; children: ReactNode }) {
  const stage = STAGES[index]
  const onDark = tone === 'dark'
  const onOrange = tone === 'orange'
  return (
    <div data-card-wrap className={cn('lg:sticky lg:top-[5.5rem]', !last && 'mb-6 lg:mb-[38vh]')}>
      <article
        id={`cs-${stage.id}`}
        data-stage={stage.id}
        className={cn(
          'relative flex flex-col overflow-clip rounded-[2rem] border p-6 shadow-[0_30px_80px_-40px_rgb(12_12_13_/_0.35)] sm:p-8 lg:min-h-[min(calc(100svh-7.5rem),38rem)] lg:will-change-transform xl:p-10',
          TONES[tone],
        )}
      >
        <span
          data-card-num
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute -right-3 -top-6 select-none text-[clamp(7rem,12vw,12rem)] font-semibold leading-none tracking-[-0.06em] text-transparent',
            onDark
              ? '[-webkit-text-stroke:1px_rgb(243_242_238_/_0.12)]'
              : onOrange
                ? '[-webkit-text-stroke:1px_rgb(12_12_13_/_0.18)]'
                : '[-webkit-text-stroke:1px_rgb(12_12_13_/_0.08)]',
          )}
        >
          {pad(index + 1)}
        </span>

        <header className="relative">
          <div className="flex items-center gap-3">
            <span
              data-card-badge
              className={cn(
                'flex size-9 items-center justify-center rounded-full font-mono text-[0.68rem]',
                onDark ? 'bg-accent text-on-accent' : 'bg-ink text-paper',
              )}
            >
              {pad(index + 1)}
            </span>
            <span
              data-card-meta
              className={cn(
                'font-mono text-[0.68rem] uppercase tracking-widest',
                onDark ? 'text-paper/50' : onOrange ? 'text-on-accent/65' : 'text-muted',
              )}
            >
              Stage {pad(index + 1)} / {pad(STAGES.length)}
            </span>
          </div>
          <h3 className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-[clamp(1.7rem,3vw,3rem)] font-semibold leading-[0.95] tracking-[-0.045em]">
            <span data-card-title>{stage.a}</span>
            {stage.b && (
              <>
                <ArrowRight
                  data-card-arrow
                  className={cn('size-[0.7em] shrink-0', onOrange ? 'text-on-accent' : 'text-accent')}
                  strokeWidth={1.5}
                  aria-label="to"
                />
                <span>{stage.b}</span>
              </>
            )}
          </h3>
        </header>

        <div className="relative mt-6 flex flex-1 flex-col justify-center sm:mt-8">{children}</div>
      </article>
    </div>
  )
}

function Label({ children, dark }: { children: ReactNode; dark?: boolean }) {
  return (
    <p className={cn('relative flex items-center gap-2.5 font-mono text-[0.68rem] uppercase tracking-widest', dark ? 'text-paper/55' : 'text-muted')}>
      <span className="size-1.5 rounded-full bg-accent" />
      {children}
    </p>
  )
}

/** Arrow linking the two halves of a stage: vertical when stacked, horizontal side by side. */
function FlowArrow() {
  const stroke = { stroke: 'var(--color-accent)', strokeWidth: 1.5, strokeLinecap: 'round' as const, fill: 'none' }
  return (
    <div data-flow-arrow aria-hidden="true" className="flex items-center justify-center py-5 xl:px-4 xl:py-0">
      <svg viewBox="0 0 16 48" className="h-12 w-4 xl:hidden">
        <path data-draw d="M8 2 V44" {...stroke} />
        <path data-head d="M2.5 38.5 L8 45 L13.5 38.5" {...stroke} />
      </svg>
      <svg viewBox="0 0 64 16" className="hidden h-4 w-14 xl:block">
        <path data-draw d="M2 8 H60" {...stroke} />
        <path data-head d="M54.5 2.5 L61 8 L54.5 13.5" {...stroke} />
      </svg>
    </div>
  )
}

function UseCase({ n, title, description }: { n: number; title: string; description: string }) {
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
    e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
  }
  return (
    <div data-uc className="flex">
      <div
        onPointerMove={onMove}
        className="group relative flex min-h-[11rem] w-full flex-col overflow-clip rounded-3xl border border-paper/10 bg-paper/[0.035] p-5 transition-colors duration-500 hover:border-accent/60 sm:p-7"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: 'radial-gradient(260px circle at var(--mx, 50%) var(--my, 50%), rgb(242 87 28 / 0.2), transparent 70%)' }}
        />
        <div className="relative flex items-start justify-between">
          <span className="block overflow-clip">
            <span
              data-uc-num
              className="block text-[2.6rem] font-semibold leading-none tracking-[-0.05em] text-transparent transition-[-webkit-text-stroke-color] duration-500 [-webkit-text-stroke:1px_rgb(243_242_238_/_0.35)] group-hover:[-webkit-text-stroke-color:var(--color-accent)]"
            >
              {pad(n)}
            </span>
          </span>
          <span className="flex size-10 items-center justify-center rounded-full border border-paper/20 transition-colors duration-500 group-hover:border-accent group-hover:bg-accent group-hover:text-on-accent">
            <ArrowUpRight className="size-4 transition-transform duration-500 group-hover:rotate-45" strokeWidth={1.5} />
          </span>
        </div>
        <h4 className="relative mt-auto pt-5 text-lg font-semibold leading-snug tracking-tight">{title}</h4>
        <p className="relative mt-2 text-[0.88rem] leading-relaxed text-paper/60">{description}</p>
      </div>
    </div>
  )
}

/** The sketch, live: orbs on a glowing route, a light streak + comet racing along it, spotlight on the current step. */
function FlowMap({ onGo }: { onGo: (stage: number) => void }) {
  const fine = useFinePointer()
  const reduced = useReducedMotion()
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const rx = useSpring(useTransform(py, [-0.5, 0.5], [9, -9]), { stiffness: 110, damping: 18 })
  const ry = useSpring(useTransform(px, [-0.5, 0.5], [-11, 11]), { stiffness: 110, damping: 18 })
  const tilt = fine && !reduced

  const onMove = (e: PointerEvent<HTMLElement>) => {
    if (!tilt) return
    const r = e.currentTarget.getBoundingClientRect()
    px.set((e.clientX - r.left) / r.width - 0.5)
    py.set((e.clientY - r.top) / r.height - 0.5)
  }
  const onLeave = () => {
    px.set(0)
    py.set(0)
  }

  return (
    <motion.nav
      aria-label="Case study stages"
      data-flow-map
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={tilt ? { rotateX: rx, rotateY: ry, transformPerspective: 900, transformStyle: 'preserve-3d' } : undefined}
      className="relative mx-auto aspect-[100/140] w-full max-w-[min(320px,calc((100svh-15.5rem)/1.4))]"
    >
      {/* dotted backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-8 opacity-70"
        style={{
          backgroundImage: 'radial-gradient(rgb(12 12 13 / 0.12) 1px, transparent 1px)',
          backgroundSize: '14px 14px',
          maskImage: 'radial-gradient(ellipse at 50% 50%, black 20%, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(ellipse at 50% 50%, black 20%, transparent 70%)',
        }}
      />
      {/* spotlight that glides to the current step */}
      <div
        data-spot
        aria-hidden="true"
        className="pointer-events-none invisible absolute left-0 top-0 size-44 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0"
        style={{ background: 'radial-gradient(circle, rgb(242 87 28 / 0.12) 0%, rgb(242 87 28 / 0.04) 40%, transparent 70%)' }}
      />

      <svg viewBox="0 0 100 140" className="absolute inset-0 size-full overflow-visible" aria-hidden="true">
        <defs>
          <radialGradient id="cs-comet-halo">
            <stop offset="0%" stopColor="var(--color-accent)" stopOpacity={0.55} />
            <stop offset="100%" stopColor="var(--color-accent)" stopOpacity={0} />
          </radialGradient>
        </defs>
        {SEGMENTS.map((d) => (
          <path key={`base-${d}`} d={d} fill="none" stroke="var(--color-ink)" strokeOpacity={0.16} strokeWidth={0.45} strokeDasharray="1 1.2" />
        ))}
        {SEGMENTS.map((d) => (
          <path key={`glow-${d}`} data-seg-glow d={d} fill="none" stroke="var(--color-accent)" strokeOpacity={0.08} strokeWidth={2.6} strokeLinecap="round" />
        ))}
        {SEGMENTS.map((d) => (
          <path key={d} data-seg d={d} fill="none" stroke="var(--color-accent)" strokeWidth={0.7} strokeLinecap="round" />
        ))}
        {SEGMENTS.map((d) => (
          <path
            key={`flow-${d}`}
            data-flow
            d={d}
            fill="none"
            stroke="var(--color-paper)"
            strokeWidth={0.45}
            strokeLinecap="round"
            strokeDasharray="0.4 3.6"
            className="animate-[flow-dash_0.9s_linear_infinite]"
          />
        ))}
        {SEGMENTS.map((d) => (
          <path key={`streak-${d}`} data-streak d={d} fill="none" stroke="var(--color-accent-2)" strokeWidth={1.6} />
        ))}
        <g data-comet transform="translate(20 14)">
          <circle r={7} fill="url(#cs-comet-halo)" />
          <circle r={2.4} fill="var(--color-accent)" />
          <circle r={1.1} fill="var(--color-paper)" />
        </g>
      </svg>

      {NODES.map((n) => {
        const Icon = n.icon
        return (
          <div
            key={n.label}
            data-map-node
            data-on="false"
            data-state="idle"
            className="group/node absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${n.x}%`, top: `${(n.y / 140) * 100}%`, transform: tilt ? 'translateZ(36px)' : undefined }}
          >
            <div data-node-in className="relative">
              <span data-spark aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 z-10" />
              <span data-ripple aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-full border-2 border-accent opacity-0" />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-full border border-accent opacity-0 group-data-[state=current]/node:animate-[orb-halo_2s_ease-out_infinite]"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -inset-[5px] animate-[spin_2.4s_linear_infinite] rounded-full opacity-0 transition-opacity duration-500 group-data-[state=current]/node:opacity-100 motion-reduce:animate-none"
                style={{
                  background: 'conic-gradient(from 0deg, var(--color-accent), transparent 55%, var(--color-accent-2))',
                  WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 2px))',
                  mask: 'radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 2px))',
                }}
              />
              <button
                type="button"
                data-node-btn
                aria-label={n.label}
                onClick={() => onGo(n.stage)}
                className="relative grid size-11 place-items-center rounded-full border border-ink/15 bg-paper text-ink/40 shadow-[0_6px_18px_-10px_rgb(12_12_13_/_0.4)] transition-[background-color,border-color,color,box-shadow] duration-500 hover:border-ink/40 hover:text-ink group-data-[state=done]/node:border-accent/35 group-data-[state=done]/node:bg-accent-soft group-data-[state=done]/node:text-accent group-data-[state=done]/node:shadow-none group-data-[state=current]/node:border-accent group-data-[state=current]/node:bg-accent group-data-[state=current]/node:text-paper group-data-[state=current]/node:shadow-[0_10px_24px_-10px_rgb(242_87_28_/_0.55)]"
              >
                <Icon className="size-[18px]" strokeWidth={1.75} />
                <span className="absolute -right-1 -top-1 grid size-[18px] scale-0 place-items-center rounded-full bg-accent text-paper ring-2 ring-paper transition-transform duration-500 ease-[var(--ease-expo)] group-data-[state=done]/node:scale-100">
                  <Check className="size-2.5" strokeWidth={3.5} />
                </span>
              </button>
              <span
                className={cn(
                  'pointer-events-none absolute',
                  n.pos === 'below' && 'left-1/2 top-full mt-2.5 -translate-x-1/2 whitespace-nowrap text-center',
                  n.pos === 'above' && 'bottom-full left-1/2 mb-2.5 -translate-x-1/2 whitespace-nowrap text-center',
                  n.pos === 'above-end' && 'bottom-full right-0 mb-2 w-[5.5rem] text-right leading-[1.15]',
                  n.pos === 'right' && 'left-full top-1/2 ml-3 -translate-y-1/2 whitespace-nowrap',
                )}
              >
                <span
                  data-node-label
                  data-text={n.label}
                  className="block text-[0.78rem] font-medium tracking-tight text-ink/40 transition-colors duration-500 group-data-[state=done]/node:text-ink/70 group-data-[state=current]/node:font-semibold group-data-[state=current]/node:text-ink"
                >
                  {n.label}
                </span>
              </span>
            </div>
          </div>
        )
      })}
    </motion.nav>
  )
}
