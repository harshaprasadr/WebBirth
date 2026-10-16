import { lazy, Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState, type PointerEvent } from 'react'
import { technologies, techGroups } from '@/data/site'
import { gsap, useGSAP } from '@/lib/gsap'
import { registerReveals } from '@/animations/reveal'
import { prefersReducedMotion } from '@/lib/env'
import { cn } from '@/lib/cn'
import { useIsDesktop } from '@/hooks/useMediaQuery'
import { SectionHeader } from './SectionHeader'
import { hasWebGL, useNearViewport } from '@/lib/webgl'
import { useReducedMotion } from '@/hooks/useMediaQuery'
import type { DragState } from './three/TechScene'

const TechScene = lazy(() => import('./three/TechScene'))

const CENTER = { x: 50, y: 50 }

/**
 * Technologies orbiting a central WebBirth core. Every node is a real button
 * (hover, focus or tap) — the active node grows, its connections light up
 * and stream, and the caption describes how we use it.
 */
export function TechnologyNetwork() {
  const scope = useRef<HTMLElement>(null)
  const desktop = useIsDesktop()
  const [active, setActive] = useState<string | null>(null)
  const netRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ w: 0, h: 0 })
  const webgl = useMemo(() => hasWebGL(), [])
  const reduced = useReducedMotion()
  const near = useNearViewport(netRef, '200px')
  const [started, setStarted] = useState(false)
  const [glReady, setGlReady] = useState(false)
  const drag = useRef<DragState>({ vx: 0, dragging: false })
  const lastX = useRef(0)

  // Kick off the 3D entrance once the network is well into view.
  useEffect(() => {
    const el = netRef.current
    if (!el || started) return
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setStarted(true), { threshold: 0.35 })
    io.observe(el)
    return () => io.disconnect()
  }, [started])

  const onDragStart = (e: PointerEvent) => {
    drag.current.dragging = true
    lastX.current = e.clientX
  }
  const onDragMove = (e: PointerEvent) => {
    if (!drag.current.dragging) return
    drag.current.vx = (e.clientX - lastX.current) * 0.0035
    lastX.current = e.clientX
  }
  const onDragEnd = () => {
    drag.current.dragging = false
  }

  // Lines are drawn in pixel space so dashes stay crisp at any aspect ratio.
  useLayoutEffect(() => {
    const el = netRef.current
    if (!el) return
    const measure = () => setSize({ w: el.clientWidth, h: el.clientHeight })
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // Pull nodes inward on small screens so labels never clip.
  const pos = useMemo(() => {
    const mx = (v: number) => (desktop ? v : 13 + v * 0.74)
    const my = (v: number) => (desktop ? v : 4 + v * 0.92)
    return Object.fromEntries(technologies.map((t) => [t.id, { x: mx(t.x), y: my(t.y) }]))
  }, [desktop])

  const edges = useMemo(() => {
    const list: { a: string; b: string; core?: boolean }[] = technologies.map((t) => ({ a: 'core', b: t.id, core: true }))
    technologies.forEach((t) => t.links?.forEach((b) => list.push({ a: t.id, b })))
    return list
  }, [])

  const related = useMemo(() => {
    if (!active) return new Set<string>()
    const s = new Set<string>([active, 'core'])
    edges.forEach((e) => {
      if (e.a === active) s.add(e.b)
      if (e.b === active) s.add(e.a)
    })
    return s
  }, [active, edges])

  const point = (id: string) => {
    const p = id === 'core' ? CENTER : pos[id]
    return { x: (p.x / 100) * size.w, y: (p.y / 100) * size.h }
  }
  const current = technologies.find((t) => t.id === active)
  const ready = size.w > 0

  useGSAP(
    () => {
      if (!ready) return
      registerReveals(scope.current!)
      if (prefersReducedMotion() || webgl) return
      const tl = gsap.timeline({ scrollTrigger: { trigger: '[data-network]', start: 'top 75%', once: true } })
      tl.from('[data-edge]', { strokeDashoffset: 1, duration: 1.6, ease: 'expo.inOut', stagger: 0.02 })
        .from('[data-core]', { scale: 0, duration: 1.2, ease: 'expo.out' }, 0.1)
        .from('[data-node]', { scale: 0, autoAlpha: 0, duration: 1, ease: 'expo.out', stagger: 0.04 }, 0.3)
    },
    { scope, dependencies: [ready, webgl] },
  )

  return (
    <section
      ref={scope}
      aria-labelledby="tech-title"
      data-nav-theme="dark"
      className="gutter relative overflow-clip bg-ink section-pb text-paper"
    >
      <div className="pt-[clamp(3rem,5vw,4.5rem)]">
        <SectionHeader
          id="tech-title"
          label="Technology"
          title={['Built with', 'purpose.']}
          aside={`(${technologies.length})`}
          intro="We choose tools for the problem, not the trend — a modern, proven stack across web, mobile, server, data, cloud and AI."
          dark
          titleClassName="uppercase"
        />
      </div>

      <div className="section-gap grid gap-10 lg:grid-cols-12 lg:items-end">
        {/* caption */}
        <div className="order-2 lg:order-1 lg:col-span-3" aria-live="polite">
          <div className="border-t border-line-dark pt-5">
            <p className="type-meta text-muted-dark">{current ? techGroups[current.group] : 'Ecosystem'}</p>
            <p className="mt-3 text-[clamp(1.8rem,3vw,2.8rem)] font-semibold leading-none tracking-[-0.04em]">
              {current ? current.label : 'WebBirth core'}
            </p>
            <p className="type-body mt-4 max-w-xs text-paper/60">
              {current
                ? current.description
                : 'Hover or tap a technology to see where it fits in the products we build.'}
            </p>
          </div>
          <ul className="type-meta mt-8 flex flex-wrap gap-x-4 gap-y-2 text-muted-dark">
            {Object.entries(techGroups).map(([k, v]) => (
              <li key={k} className={cn('transition-colors', current?.group === k && 'text-accent-2')}>
                {v}
              </li>
            ))}
          </ul>
        </div>

        {/* network */}
        <div
          ref={netRef}
          data-network
          className="relative order-1 aspect-[4/5] w-full sm:aspect-square lg:order-2 lg:col-span-9 lg:aspect-[16/10]"
          onPointerLeave={() => setActive(null)}
        >
          {webgl ? (
            <div
              className="absolute inset-[-8%] touch-pan-y select-none"
              data-cursor="drag"
              data-cursor-label="Drag"
              onPointerDown={onDragStart}
              onPointerMove={onDragMove}
              onPointerUp={onDragEnd}
              onPointerCancel={onDragEnd}
              onPointerLeave={onDragEnd}
            >
              <Suspense fallback={null}>
                <div className={cn('absolute inset-0 transition-opacity duration-1000', glReady ? 'opacity-100' : 'opacity-0')}>
                  <TechScene
                    active={active}
                    onActive={setActive}
                    reduced={reduced}
                    started={started}
                    drag={drag}
                    running={near}
                    onReady={() => setGlReady(true)}
                  />
                </div>
              </Suspense>
              <p className="type-meta pointer-events-none absolute bottom-[9%] right-[9%] hidden text-muted-dark lg:block">
                Drag to explore ↔
              </p>
            </div>
          ) : (
          <>
          <svg className="absolute inset-0 size-full" viewBox={`0 0 ${size.w || 1} ${size.h || 1}`} aria-hidden="true">
            {size.w > 0 && edges.map((e) => {
              const A = point(e.a)
              const B = point(e.b)
              const lit = active !== null && related.has(e.a) && related.has(e.b) && (e.a === active || e.b === active)
              return (
                <g key={`${e.a}-${e.b}`}>
                  <line
                    data-edge
                    x1={A.x}
                    y1={A.y}
                    x2={B.x}
                    y2={B.y}
                    pathLength={1}
                    strokeDasharray={1}
                    strokeWidth={1}
                    className={cn(
                      'transition-[stroke,opacity] duration-500',
                      lit ? 'stroke-accent-2/40' : e.core ? 'stroke-paper/15' : 'stroke-paper/10',
                      active && !lit && 'opacity-30',
                    )}
                  />
                  {lit && (
                    <line
                      x1={A.x}
                      y1={A.y}
                      x2={B.x}
                      y2={B.y}
                      strokeWidth={1.75}
                      strokeLinecap="round"
                      className="anim-flow stroke-accent-2"
                    />
                  )}
                </g>
              )
            })}
          </svg>

          {/* core */}
          <div
            data-core
            className="absolute left-1/2 top-1/2 flex size-[clamp(5.5rem,11vw,9rem)] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-ink ring-1 ring-accent/50"
          >
            <svg className="absolute -inset-3 size-[calc(100%+1.5rem)] animate-[spin_40s_linear_infinite]" viewBox="0 0 100 100" aria-hidden="true">
              <circle cx="50" cy="50" r="49" fill="none" stroke="rgb(255 138 82 / 0.5)" strokeDasharray="1 3" />
            </svg>
            <img src="/brand/webbirth-mark-lg.webp?v=2" alt="WebBirth" className="relative w-[62%]" width={656} height={480} />
            <span className="absolute inset-0 animate-ping rounded-full bg-accent/30 [animation-duration:3s]" aria-hidden="true" />
          </div>

          {technologies.map((t, i) => {
            const p = pos[t.id]
            const isActive = active === t.id
            const dim = active !== null && !related.has(t.id)
            return (
              <button
                key={t.id}
                type="button"
                data-node
                aria-pressed={isActive}
                aria-label={`${t.label}: ${t.description}`}
                onPointerEnter={(e) => e.pointerType === 'mouse' && setActive(t.id)}
                onFocus={() => setActive(t.id)}
                onBlur={() => setActive(null)}
                onClick={() => setActive(t.id)}
                className="absolute -translate-x-1/2 -translate-y-1/2 p-2 lg:p-1"
                style={{ left: `${p.x}%`, top: `${p.y}%` }}
              >
                <span
                  className={cn(
                    'flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-[0.7rem] sm:gap-2 sm:px-3 sm:py-1.5 sm:text-[clamp(0.72rem,1vw,0.9rem)] font-medium tracking-tight transition-all duration-500 ease-[var(--ease-expo)]',
                    isActive
                      ? 'scale-[1.18] border-accent-2 bg-accent-2 text-ink'
                      : related.has(t.id)
                        ? 'border-accent-2/70 bg-ink text-paper'
                        : 'border-line-dark bg-ink text-paper/85',
                    dim && 'opacity-35',
                  )}
                  style={{ animation: `float-y ${5 + (i % 4)}s ease-in-out ${-i * 0.7}s infinite` }}
                >
                  <span className={cn('size-1.5 rounded-full', isActive ? 'bg-ink' : 'bg-accent-2')} aria-hidden="true" />
                  {t.label}
                </span>
              </button>
            )
          })}
          </>
          )}
        </div>
      </div>
    </section>
  )
}
