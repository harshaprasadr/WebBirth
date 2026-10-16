import { useRef } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { featuredProjects, type Project } from '@/data/projects'
import { showcase, showcaseSrc } from '@/data/showcase'
import { gsap, mq, useGSAP } from '@/lib/gsap'
import { TransitionLink } from './PageTransition'

/** Web-only products: the browser stands alone, the phone is kept for projects with a mobile app. */
const HIDE_PHONE = new Set(['swa-adhyay'])
/** Cap (in % of the capture) for sites whose capture has unloaded sections further down. */
const MAX_TRAVEL: Record<string, number> = { 'swa-adhyay': 22 }

/** Mixes a hex colour toward another by t (0–1). */
function mix(a: string, b: string, t: number) {
  const pa = parseInt(a.slice(1), 16)
  const pb = parseInt(b.slice(1), 16)
  const ch = (s: number) => Math.round(((pa >> s) & 255) * (1 - t) + ((pb >> s) & 255) * t)
  return `rgb(${ch(16)} ${ch(8)} ${ch(0)})`
}

const domain = (url?: string) => (url ? url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '') : '')
const FRAME_ASPECT = 10 / 16

/**
 * Selected Work as a deck of full-screen cinematic scenes.
 *
 *  · each scene is sticky; the next slides up over it while it recedes
 *    (scale + darken + rounded corners) — pure CSS stacking, GSAP-scrubbed
 *  · the client's real website scrolls inside a browser frame (and the
 *    mobile build inside a phone) in step with the page
 *  · devices tilt in 3D toward the pointer; an outlined project name drifts behind
 *
 * Reduced motion: scenes stack normally, no scrubbing or tilt.
 */
export function WorkScenes() {
  const scope = useRef<HTMLDivElement>(null)
  const total = featuredProjects.length

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(mq.motion, () => {
        const scenes = gsap.utils.toArray<HTMLElement>('[data-scene]', scope.current)
        scenes.forEach((scene, i) => {
          const inner = scene.querySelector<HTMLElement>('[data-scene-inner]')
          const shade = scene.querySelector<HTMLElement>('[data-scene-shade]')
          const ghost = scene.querySelector<HTMLElement>('[data-scene-ghost]')

          // Recede while the next scene slides over (not for the last one).
          if (i < scenes.length - 1) {
            gsap
              .timeline({ scrollTrigger: { trigger: scene, start: 'top top', end: 'bottom top', scrub: true } })
              .to(inner, { scale: 0.9, borderRadius: 28, yPercent: -2, ease: 'none' }, 0)
              .to(shade, { opacity: 0.65, ease: 'none' }, 0)
          }

          // Real site scrolls inside the frames while the scene is on stage.
          const st = { trigger: scene, start: 'top 75%', end: 'bottom top', scrub: 0.6 }
          scene.querySelectorAll<HTMLElement>('[data-scroll-shot]').forEach((img) => {
            const travel = Number(img.dataset.travel || 0)
            if (travel > 0) gsap.fromTo(img, { yPercent: 0 }, { yPercent: -travel, ease: 'none', scrollTrigger: st })
          })
          if (ghost) gsap.fromTo(ghost, { xPercent: 6 }, { xPercent: -16, ease: 'none', scrollTrigger: st })

          // Entrance: copy rises as the scene arrives.
          gsap.from(scene.querySelectorAll('[data-scene-copy] > *'), {
            y: 50,
            autoAlpha: 0,
            stagger: 0.07,
            duration: 1.1,
            ease: 'expo.out',
            scrollTrigger: { trigger: scene, start: 'top 55%', toggleActions: 'play none none reverse' },
          })
          gsap.from(scene.querySelector('[data-devices]'), {
            y: 120,
            rotateX: 18,
            autoAlpha: 0,
            duration: 1.5,
            ease: 'expo.out',
            scrollTrigger: { trigger: scene, start: 'top 60%', toggleActions: 'play none none reverse' },
          })
        })
      })

      // 3D tilt toward the pointer (mouse only).
      mm.add('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
        const offs: (() => void)[] = []
        gsap.utils.toArray<HTMLElement>('[data-scene]', scope.current).forEach((scene) => {
          const rig = scene.querySelector<HTMLElement>('[data-tilt]')
          if (!rig) return
          const rx = gsap.quickTo(rig, 'rotateX', { duration: 0.9, ease: 'power3.out' })
          const ry = gsap.quickTo(rig, 'rotateY', { duration: 0.9, ease: 'power3.out' })
          const move = (e: PointerEvent) => {
            const r = scene.getBoundingClientRect()
            ry(((e.clientX - r.left) / r.width - 0.5) * 14 - 8)
            rx(-((e.clientY - r.top) / r.height - 0.5) * 10 + 4)
          }
          scene.addEventListener('pointermove', move)
          offs.push(() => scene.removeEventListener('pointermove', move))
        })
        return () => offs.forEach((f) => f())
      })
      return () => mm.revert()
    },
    { scope },
  )

  return (
    <div ref={scope} className="relative">
      {featuredProjects.map((p, i) => (
        <Scene key={p.slug} project={p} index={i} total={total} />
      ))}
    </div>
  )
}

function Scene({ project, index, total }: { project: Project; index: number; total: number }) {
  const asset = showcase[project.slug]
  const isApp = asset?.kind === 'app'
  const num = String(index + 1).padStart(2, '0')
  const glow = mix(project.tone, '#ffffff', 0.22)
  const tags = project.deliverables?.slice(0, 3) ?? [project.discipline]

  return (
    <section
      data-scene
      data-hides-cta
      data-nav-theme="dark"
      aria-label={`${project.name} — ${project.discipline}`}
      className="relative h-[100svh] motion-safe:sticky motion-safe:top-0"
      style={{ zIndex: index + 1 }}
    >
      <div
        data-scene-inner
        className="relative flex h-full flex-col overflow-clip text-paper will-change-transform"
        style={{
          background: `radial-gradient(110% 85% at 74% 38%, ${glow} 0%, ${project.tone} 42%, #050505 100%)`,
        }}
      >
        {/* outlined name drifting behind */}
        <div
          data-scene-ghost
          aria-hidden="true"
          className="pointer-events-none absolute bottom-[-3%] left-0 whitespace-nowrap will-change-transform text-[clamp(7rem,22vw,24rem)] font-semibold uppercase leading-none tracking-[-0.06em] text-transparent [-webkit-text-stroke:1px_rgb(255_255_255/0.09)]"
        >
          {project.name} — {project.name}
        </div>
        {/* soft light from the top-right */}
        <div aria-hidden="true" className="pointer-events-none absolute -right-[10%] -top-[20%] size-[60vw] rounded-full glow opacity-[0.04] [--glow:#fff]" />

        <div className="gutter relative z-10 grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)] grid-rows-[minmax(0,1fr)_auto] gap-6 pb-[clamp(1.25rem,3vw,2.5rem)] pt-[5.25rem] lg:grid-cols-12 lg:grid-rows-1 lg:items-center lg:gap-10 lg:pt-24">
          {/* copy */}
          <div data-scene-copy className="order-2 flex min-w-0 flex-col lg:order-1 lg:col-span-5">
            <p className="type-meta flex items-center gap-3 whitespace-nowrap text-paper/55">
              <span className="text-accent-2">({num})</span>
              <span>/ {String(total).padStart(2, '0')}</span>
              <span className="h-px w-8 bg-paper/25" />
              <span className="min-w-0 truncate">{project.industry}</span>
            </p>
            <h3 className="mt-3 text-[clamp(2.6rem,6.4vw,7.25rem)] font-semibold leading-[0.88] tracking-[-0.055em] lg:mt-5">
              {project.name}
            </h3>
            <p className="type-lead mt-3 max-w-[30rem] text-paper/70 max-lg:line-clamp-2 lg:mt-6">{project.summary}</p>
            <ul className="mt-4 flex flex-wrap gap-2 max-sm:hidden lg:mt-7">
              {tags.map((t) => (
                <li key={t} className="type-meta rounded-full border border-paper/15 bg-paper/[0.04] px-3 py-1.5 text-paper/75">
                  {t}
                </li>
              ))}
            </ul>
            <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3 lg:mt-10">
              <TransitionLink
                to={`/work/${project.slug}`}
                className="group relative inline-flex min-h-12 items-center gap-3 overflow-clip rounded-full bg-paper pl-6 pr-1.5 text-[0.8rem] font-medium uppercase tracking-[0.05em] text-ink"
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-0 translate-y-full rounded-full bg-accent transition-transform duration-700 ease-[var(--ease-expo)] group-hover:translate-y-0"
                />
                <span className="relative">View case study</span>
                <span className="relative flex size-9 items-center justify-center rounded-full bg-ink text-paper">
                  <ArrowUpRight
                    className="size-4 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    strokeWidth={1.75}
                  />
                </span>
              </TransitionLink>
              {project.url && (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noreferrer"
                  className="type-meta group inline-flex min-h-11 items-center gap-1.5 text-paper/80 hover:text-paper"
                >
                  <span className="link-reveal">Visit live site</span>
                  <ArrowUpRight className="size-3.5" strokeWidth={1.75} aria-hidden="true" />
                </a>
              )}
            </div>
          </div>

          {/* devices */}
          <div className="order-1 min-h-0 [container-type:size] lg:order-2 lg:col-span-7 lg:h-[min(72svh,46rem)]" style={{ perspective: '1800px' }}>
            <div data-devices className="flex size-full items-center justify-center">
              <div
                data-tilt
                className="relative"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: 'rotateY(-8deg) rotateX(4deg)',
                  width: isApp ? 'min(100cqw, calc(100cqh * 0.46))' : 'min(92cqw, calc(100cqh * 1.38))',
                }}
              >
                {isApp ? <AppStage project={project} /> : <WebStage project={project} hidePhone={HIDE_PHONE.has(project.slug)} />}
              </div>
            </div>
          </div>
        </div>

        <div data-scene-shade aria-hidden="true" className="pointer-events-none absolute inset-0 z-20 bg-black opacity-0" />
      </div>
    </section>
  )
}

/** Desktop browser frame (+ optional phone) with the real site scrolling inside. */
function WebStage({ project, hidePhone }: { project: Project; hidePhone: boolean }) {
  const asset = showcase[project.slug]
  const d = asset?.desktop
  const m = !hidePhone ? asset?.mobile : undefined
  const desktopTravel = d
    ? Math.min(MAX_TRAVEL[project.slug] ?? 100, Math.max(0, (1 - FRAME_ASPECT / (d.h / d.w)) * 100))
    : 0
  const mobileTravel = m ? Math.max(0, (1 - (19 / 9) / (m.h / m.w)) * 100) : 0
  const live = asset?.kind === 'live'
  // Static screenshots wider than 16:10 (app dashboards) get a matching frame instead of a blank strip.
  const frameAspect = d && !live ? Math.max(1 / FRAME_ASPECT, d.w / d.h) : 1 / FRAME_ASPECT

  return (
    <div className="relative" style={{ transformStyle: 'preserve-3d' }}>
      {/* browser */}
      <div className="overflow-clip rounded-[clamp(0.5rem,1vw,0.9rem)] bg-[#18181a] shadow-[0_50px_120px_-30px_rgba(0,0,0,0.75),0_0_0_1px_rgba(255,255,255,0.08)]">
        <div className="flex h-[clamp(1.5rem,2.4cqw,2.2rem)] items-center gap-[0.45em] px-[0.9em] text-[clamp(0.5rem,1.1cqw,0.7rem)]">
          <span className="size-[0.85em] rounded-full bg-[#ff5f57]" />
          <span className="size-[0.85em] rounded-full bg-[#febc2e]" />
          <span className="size-[0.85em] rounded-full bg-[#28c840]" />
          <span className="mx-auto flex h-[1.9em] w-[46%] items-center justify-center gap-1.5 rounded-md bg-white/[0.07] font-mono text-white/55">
            <span className="text-[0.85em]">🔒</span>
            {domain(project.url) || project.slug}
          </span>
        </div>
        <div className="relative overflow-clip bg-white" style={{ aspectRatio: String(frameAspect) }}>
          {d ? (
            <img
              data-scroll-shot
              data-travel={live ? desktopTravel.toFixed(2) : 0}
              src={showcaseSrc(project.slug, 'desktop')}
              srcSet={live ? `${showcaseSrc(project.slug, 'desktop', true)} 640w, ${showcaseSrc(project.slug, 'desktop')} 1200w` : undefined}
              sizes="(min-width: 1024px) 50vw, 92vw"
              alt={`${project.name} website`}
              width={d.w}
              height={d.h}
              loading="lazy"
              decoding="async"
              className="absolute inset-x-0 top-0 w-full"
            />
          ) : null}
        </div>
      </div>

      {/* phone */}
      {m && (
        <div
          className="absolute -bottom-[9%] -left-[7%] w-[23%]"
          style={{ transform: 'translateZ(90px)', transformStyle: 'preserve-3d' }}
        >
          <Phone src={showcaseSrc(project.slug, 'mobile')} w={m.w} h={m.h} travel={mobileTravel} alt={`${project.name} mobile site`} />
        </div>
      )}
    </div>
  )
}

/** App projects: hero phone with soft orbit rings. */
function AppStage({ project }: { project: Project }) {
  const m = showcase[project.slug]?.mobile
  if (!m) return null
  return (
    <div className="relative" style={{ transformStyle: 'preserve-3d' }}>
      <div aria-hidden="true" className="absolute left-1/2 top-1/2 size-[190%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />
      <div aria-hidden="true" className="absolute left-1/2 top-1/2 size-[140%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/10 motion-safe:animate-[spin_60s_linear_infinite]" />
      <div aria-hidden="true" className="absolute left-1/2 top-1/2 size-[120%] -translate-x-1/2 -translate-y-1/2 rounded-full glow opacity-20" />
      <div style={{ transform: 'translateZ(40px)' }}>
        <Phone src={showcaseSrc(project.slug, 'mobile')} w={m.w} h={m.h} travel={Math.max(0, (1 - (19 / 9) / (m.h / m.w)) * 100)} alt={`${project.name} app`} />
      </div>
    </div>
  )
}

function Phone({ src, w, h, travel, alt }: { src: string; w: number; h: number; travel: number; alt: string }) {
  return (
    <div className="rounded-[18%/8.5%] bg-[#0b0b0c] p-[4.5%] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.12)]">
      <div className="relative overflow-clip rounded-[14%/6.6%] bg-white" style={{ aspectRatio: '9 / 19' }}>
        <img
          data-scroll-shot
          data-travel={travel.toFixed(2)}
          src={src}
          alt={alt}
          width={w}
          height={h}
          loading="lazy"
          decoding="async"
          className="absolute inset-x-0 top-0 w-full"
        />
        <span aria-hidden="true" className="absolute left-1/2 top-[1.6%] h-[3.2%] w-[30%] -translate-x-1/2 rounded-full bg-[#0b0b0c]" />
      </div>
    </div>
  )
}

