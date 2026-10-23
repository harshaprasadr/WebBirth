import { useRef, type CSSProperties, type PointerEvent, type ReactNode } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion'
import type { Project } from '@/data/projects'
import { showcase, showcaseSrc } from '@/data/showcase'
import { gsap, mq, useGSAP } from '@/lib/gsap'
import { useFinePointer } from '@/hooks/useMediaQuery'
import { cn } from '@/lib/cn'
import { platformOf } from './CaseHero'

function shade(hex: string, amount: number) {
  const n = parseInt(hex.slice(1), 16)
  const ch = (v: number) => Math.round(amount > 0 ? v + (255 - v) * amount : v * (1 + amount))
  return `rgb(${ch((n >> 16) & 255)} ${ch((n >> 8) & 255)} ${ch(n & 255)})`
}

const host = (url?: string) => (url ? new URL(url).host.replace(/^www\./, '') : undefined)

export function CaseShowcase({ project }: { project: Project }) {
  const root = useRef<HTMLElement>(null)
  const asset = showcase[project.slug]
  const isAppOnly = !!project.isAppOnly
  const hasBoth = !!project.hasBothWebAndMobile

  const desktopSrc = asset?.desktop ? showcaseSrc(project.slug, 'desktop') : project.image
  const appsSrc = asset?.apps ? showcaseSrc(project.slug, 'apps') : undefined
  const showWeb = !isAppOnly && !!desktopSrc
  const showPhone = !isAppOnly && hasBoth && !!asset?.mobile
  const showAppsHero = false
  const showAppsBlock = (hasBoth || isAppOnly) && !!appsSrc
  const isCrop = asset?.kind === 'crop'
  const scrollable = asset?.kind === 'live' && !!asset.desktop && asset.desktop.h / asset.desktop.w > 0.9

  const tone = project.tone
  const stageBg = `radial-gradient(120% 95% at 72% 8%, ${shade(tone, 0.3)} 0%, ${tone} 45%, #060606 100%)`

  useGSAP(
    () => {
      const el = root.current
      if (!el) return
      const one = (sel: string) => el.querySelector<HTMLElement>(sel)
      const mm = gsap.matchMedia()

      mm.add(mq.motion, () => {
        const pin = one('[data-sc-pin]')
        const stage = one('[data-sc-stage]')
        const device = one('[data-sc-device]')
        const page = one('[data-sc-page]')
        const viewport = one('[data-sc-viewport]')
        const phone = one('[data-sc-phone]')
        const phonePage = one('[data-sc-phone-page]')
        const phoneViewport = one('[data-sc-phone-viewport]')
        if (pin && stage && device) {
          const length = scrollable ? 2.4 : 1.4
          const tl = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: pin,
              start: 'top top',
              end: () => `+=${window.innerHeight * length}`,
              pin: true,
              scrub: 0.8,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          })
          tl.fromTo(
            stage,
            { clipPath: 'inset(6% 3.5% 6% 3.5% round 36px)' },
            { clipPath: 'inset(0% 0% 0% 0% round 0px)', duration: 1, ease: 'power2.inOut' },
            0,
          )
            .fromTo(
              device,
              { rotateX: 30, scale: 0.74, yPercent: 16, transformPerspective: 1400, transformOrigin: '50% 100%' },
              { rotateX: 0, scale: 1, yPercent: 0, duration: 1.1, ease: 'power2.out' },
              0,
            )
            .fromTo(one('[data-sc-name]'), { xPercent: 6 }, { xPercent: -38, duration: length + 0.6 }, 0)
            .fromTo(one('[data-sc-progress]'), { scaleX: 0 }, { scaleX: 1, duration: length + 0.6 }, 0)
            .from(one('[data-sc-caption]'), { autoAlpha: 0, y: 20, duration: 0.4 }, 0.6)

          if (page && viewport) {
            if (scrollable) {
              tl.to(page, { y: () => -(page.offsetHeight - viewport.offsetHeight), duration: 1.9, ease: 'power1.inOut' }, 1.0)
            } else {
              tl.fromTo(page, { scale: 1 }, { scale: 1.07, duration: 0.9 }, 1.0)
            }
          }
          if (phone) {
            tl.fromTo(
              phone,
              { yPercent: 80, rotate: 12, autoAlpha: 0 },
              { yPercent: 0, rotate: -5, autoAlpha: 1, duration: 0.9, ease: 'power3.out' },
              0.7,
            )
            if (phonePage && phoneViewport) {
              tl.to(phonePage, { y: () => -(phonePage.offsetHeight - phoneViewport.offsetHeight), duration: 1.5, ease: 'power1.inOut' }, 1.3)
            }
          }
        }

        // app screens block (web + mobile projects)
        const card = one('[data-apps-card]')
        const img = one('[data-apps-img]')
        if (card && img) {
          const st = { trigger: card, start: 'top 95%', end: 'top 25%', scrub: 0.6 }
          gsap.fromTo(
            card,
            { clipPath: 'inset(18% 12% 18% 12% round 64px)' },
            { clipPath: 'inset(0% 0% 0% 0% round 32px)', ease: 'none', scrollTrigger: st },
          )
          gsap.fromTo(img, { scale: 1.3, yPercent: 6 }, { scale: 1, yPercent: 0, ease: 'none', scrollTrigger: st })
          gsap.from(one('[data-apps-head]'), { autoAlpha: 0, y: 24, scrollTrigger: { trigger: card, start: 'top 90%', once: true } })
        }
      })

      return () => mm.revert()
    },
    { scope: root },
  )

  if (!showWeb && !showAppsHero && !showAppsBlock) return null

  return (
    <section ref={root} aria-label={`${project.name} showcase`}>
      {(showWeb || showAppsHero) && <div data-sc-pin className="relative h-[100svh] overflow-clip" data-nav-theme="dark">
        <div data-sc-stage className="absolute inset-0 overflow-clip" style={{ background: stageBg }}>
          {/* texture */}
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-[0.16]"
            style={{
              backgroundImage:
                'linear-gradient(to right, rgb(255 255 255 / 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgb(255 255 255 / 0.1) 1px, transparent 1px)',
              backgroundSize: '64px 64px',
              maskImage: 'radial-gradient(ellipse at 55% 40%, black 0%, transparent 72%)',
              WebkitMaskImage: 'radial-gradient(ellipse at 55% 40%, black 0%, transparent 72%)',
            }}
          />
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-[42%] aspect-square w-[60vw] -translate-x-1/2 -translate-y-1/2 rounded-full glow opacity-40"
            style={{ '--glow': shade(tone, 0.5) } as CSSProperties}
          />
          <span
            data-sc-name
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-[3vw] left-0 select-none whitespace-nowrap will-change-transform text-[22vw] font-semibold uppercase leading-none tracking-[-0.06em] text-transparent [-webkit-text-stroke:1.5px_rgb(255_255_255_/_0.3)]"
          >
            {project.name} — {project.name}
          </span>

          {/* device */}
          <div className="absolute inset-0 flex items-center justify-center pb-16 pt-20 sm:pb-20">
            <Tilt>
              {showWeb ? (
                <div
                  data-sc-device
                  className={cn(
                    'relative overflow-clip rounded-xl bg-white shadow-[0_60px_120px_-30px_rgb(0_0_0_/_0.75),0_0_0_1px_rgb(255_255_255_/_0.1)] sm:aspect-[16/10] sm:w-[min(1120px,86vw,calc((100svh-12rem)*1.6))] sm:rounded-2xl',
                    scrollable ? 'aspect-[4/5] w-[min(88vw,calc((100svh-12rem)*0.8))]' : 'aspect-[16/10] w-[90vw]',
                  )}
                >
                  <div className="flex h-8 items-center gap-1.5 border-b border-black/[0.07] bg-[#f6f5f2] px-3.5 sm:h-10 sm:gap-2 sm:px-4">
                    {['#ff5f57', '#febc2e', '#28c840'].map((c) => (
                      <span key={c} className="size-2.5 rounded-full sm:size-3" style={{ background: c }} />
                    ))}
                    <span className="mx-auto flex h-5 w-1/2 items-center justify-center truncate rounded-full bg-black/[0.05] px-3 font-mono text-[0.66rem] text-black/50 sm:h-6 sm:text-[0.7rem]">
                      {host(project.url) ?? project.name.toLowerCase().replace(/\s+/g, '')}
                    </span>
                  </div>
                  <div data-sc-viewport className="relative h-[calc(100%-2rem)] overflow-clip bg-white sm:h-[calc(100%-2.5rem)]">
                    <img
                      data-sc-page
                      src={desktopSrc}
                      srcSet={
                        asset?.kind === 'live'
                          ? `${showcaseSrc(project.slug, 'desktop', true)} 640w, ${showcaseSrc(project.slug, 'desktop')} 1200w`
                          : undefined
                      }
                      sizes="(min-width: 640px) 86vw, 88vw"
                      width={asset?.desktop?.w}
                      height={asset?.desktop?.h}
                      alt={`${project.name} website`}
                      decoding="async"
                      className={
                        scrollable || isCrop ? 'block h-auto w-full' : 'block size-full origin-top object-cover object-top'
                      }
                    />
                  </div>
                </div>
              ) : (
                <div
                  data-sc-device
                  className="relative aspect-[4/5] w-[min(88vw,calc((100svh-12rem)*0.8))] overflow-clip rounded-2xl sm:aspect-[4/3] sm:w-[min(88vw,1040px,calc((100svh-12rem)*1.33))] shadow-[0_60px_120px_-30px_rgb(0_0_0_/_0.75),0_0_0_1px_rgb(255_255_255_/_0.1)] sm:rounded-[2rem]"
                >
                  <img
                    data-sc-page
                    src={appsSrc}
                    width={asset?.apps?.w}
                    height={asset?.apps?.h}
                    alt={`${project.name} app screens`}
                    decoding="async"
                    className="block size-full origin-center object-cover"
                  />
                  <span data-sc-viewport className="hidden" />
                </div>
              )}
            </Tilt>
          </div>

          {showPhone && (
            <div
              data-sc-phone
              className="absolute bottom-[12%] right-[5%] aspect-[9/19.5] w-[clamp(96px,15vw,230px)] rounded-[1.6rem] bg-[#0b0b0c] p-[5px] shadow-[0_40px_80px_-20px_rgb(0_0_0_/_0.8),inset_0_0_0_1px_rgb(255_255_255_/_0.14)] sm:rounded-[2.2rem] sm:p-[7px]"
            >
              <div data-sc-phone-viewport className="relative size-full overflow-clip rounded-[1.3rem] bg-white sm:rounded-[1.8rem]">
                <img
                  data-sc-phone-page
                  src={showcaseSrc(project.slug, 'mobile')}
                  width={asset?.mobile?.w}
                  height={asset?.mobile?.h}
                  alt={`${project.name} mobile view`}
                  decoding="async"
                  className="block h-auto w-full"
                />
                <span className="absolute left-1/2 top-[1.8%] h-[3%] w-[32%] -translate-x-1/2 rounded-full bg-black" />
              </div>
            </div>
          )}

          {/* caption */}
          <div
            data-sc-caption
            className="gutter absolute inset-x-0 bottom-0 flex items-center justify-between gap-6 pb-6 font-mono text-[0.68rem] uppercase tracking-widest text-paper/65 sm:pb-8"
          >
            <span className="truncate">{host(project.url) ?? project.name}</span>
            <span className="relative hidden h-px w-40 overflow-clip bg-paper/15 sm:block">
              <span data-sc-progress className="absolute inset-0 origin-left bg-accent" />
            </span>
            <span className="shrink-0">{isAppOnly ? 'App View' : showPhone ? 'Web + Mobile View' : 'Web View'}</span>
          </div>
        </div>
      </div>}

      {showAppsBlock && (
        <div className="gutter pb-6 pt-20 sm:pt-28">
          <div data-apps-head className="mb-8 flex items-end justify-between gap-6 sm:mb-10">
            <div>
              <p className="font-mono text-[0.68rem] uppercase tracking-widest text-muted">Mobile App</p>
              <h2 className="mt-3 text-[clamp(1.8rem,4vw,3.25rem)] font-semibold leading-[0.95] tracking-[-0.04em]">
                App Screens
              </h2>
            </div>
            <p className="hidden font-mono text-[0.68rem] uppercase tracking-widest text-muted sm:block">
              {platformOf(project)}
            </p>
          </div>
          <div data-apps-card className="relative overflow-clip rounded-[2rem]" style={{ background: stageBg }}>
            <img
              data-apps-img
              src={appsSrc}
              width={asset?.apps?.w}
              height={asset?.apps?.h}
              alt={`${project.name} app screens`}
              loading="lazy"
              decoding="async"
              className="block h-auto w-full"
            />
          </div>
        </div>
      )}
    </section>
  )
}

/** Pointer-driven 3D tilt (fine pointers only), layered on top of the scroll animation. */
function Tilt({ children }: { children: ReactNode }) {
  const fine = useFinePointer()
  const reduced = useReducedMotion()
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const rx = useSpring(useTransform(py, [-0.5, 0.5], [5, -5]), { stiffness: 120, damping: 20 })
  const ry = useSpring(useTransform(px, [-0.5, 0.5], [-6, 6]), { stiffness: 120, damping: 20 })
  const active = fine && !reduced

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!active) return
    const r = e.currentTarget.getBoundingClientRect()
    px.set((e.clientX - r.left) / r.width - 0.5)
    py.set((e.clientY - r.top) / r.height - 0.5)
  }
  const onLeave = () => {
    px.set(0)
    py.set(0)
  }

  return (
    <motion.div
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={active ? { rotateX: rx, rotateY: ry, transformPerspective: 1600 } : undefined}
    >
      {children}
    </motion.div>
  )
}
