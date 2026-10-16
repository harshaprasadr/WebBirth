import { useRef, useState, useCallback } from 'react'
import { useParams, Navigate } from 'react-router'
import { ArrowLeft, ArrowUpRight, Smartphone, Sparkles } from 'lucide-react'

import { getCategoryBySlug } from '@/data/categories'
import { projects, type Project } from '@/data/projects'
import { showcase, showcaseSrc } from '@/data/showcase'
import { TransitionLink } from '@/components/PageTransition'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useOffscreenPause } from '@/hooks/useOffscreenPause'
import { gsap, SplitText, useGSAP } from '@/lib/gsap'
import { prefersReducedMotion } from '@/lib/env'
import { cn } from '@/lib/cn'

export function WorkCategoryPage() {
  const { categorySlug } = useParams<{ categorySlug: string }>()
  const category = categorySlug ? getCategoryBySlug(categorySlug) : undefined
  const heroRef = useRef<HTMLDivElement>(null)

  useOffscreenPause()
  useDocumentTitle(
    category ? `${category.title} — Portfolio | WebBirth` : 'Portfolio Categories — WebBirth',
  )

  // Hero-only GSAP — scoped tightly to heroRef, never touches the list
  useGSAP(
    () => {
      if (prefersReducedMotion() || !heroRef.current) return
      const split = SplitText.create('[data-cat-title]', { type: 'words,chars', mask: 'chars' })
      gsap
        .timeline({ defaults: { ease: 'expo.out' }, delay: 0.1 })
        .from('[data-cat-badge]',  { autoAlpha: 0, y: 20, duration: 0.9 }, 0)
        .from('[data-cat-serif]',  { yPercent: 80, autoAlpha: 0, duration: 1.2 }, 0.05)
        .from(split.chars,         { yPercent: 120, duration: 1.3, stagger: 0.035 }, 0.12)
        .from('[data-cat-desc]',   { autoAlpha: 0, y: 28, duration: 1.1 }, 0.45)
        .from('[data-cat-meta]',   { autoAlpha: 0, y: 16, duration: 0.9 }, 0.55)
    },
    { scope: heroRef },
  )

  if (!category) return <Navigate to="/work" replace />

  const categoryProjects = category.projectSlugs
    .map((slug) => projects.find((p) => p.slug === slug))
    .filter(Boolean) as Project[]

  return (
    <main id="main" className="bg-paper min-h-screen pb-28">
      {/* ── Hero ─────────────────────────────────────────── */}
      <div ref={heroRef} className="gutter pt-28 sm:pt-36 pb-12 sm:pb-16">

        {/* top nav rail */}
        <div className="flex items-center justify-between gap-4 pb-6 border-b border-line">
          <TransitionLink
            to="/work"
            className="group inline-flex items-center gap-1.5 font-mono text-[0.68rem] uppercase tracking-widest text-muted hover:text-ink transition-colors duration-300"
          >
            <ArrowLeft className="size-3 transition-transform group-hover:-translate-x-0.5" />
            All Categories
          </TransitionLink>
          <span className="font-mono text-[0.68rem] uppercase tracking-widest text-muted">
            {category.number} / 06
          </span>
        </div>

        {/* Hero title block — full width, display scale */}
        <div className="mt-10 sm:mt-14">
          <p
            data-cat-badge
            className="font-mono text-[0.68rem] uppercase tracking-widest text-accent mb-5"
          >
            {category.isAppCategory
              ? 'Mobile Applications'
              : category.isComingSoon
              ? 'Coming Soon'
              : `${categoryProjects.length} Verified Works`}
          </p>

          <h1
            data-cat-title
            className="text-[clamp(2.8rem,5vw,6.2rem)] font-extrabold leading-[0.9] tracking-[-0.05em] text-ink break-normal [text-wrap:balance]"
            style={{ hyphens: 'none', wordBreak: 'normal', overflowWrap: 'normal' }}
          >
            {category.title}
          </h1>
        </div>

        {/* Footer row: decorative number + description */}
        <div className="mt-8 sm:mt-10 pt-6 border-t border-line flex flex-wrap items-start justify-between gap-6">
          <span
            data-cat-serif
            className="font-serif italic text-[clamp(2.5rem,4.5vw,5rem)] leading-none text-ink/10 select-none"
          >
            {category.number}
          </span>
          <p
            data-cat-desc
            className="text-sm sm:text-[0.9rem] text-ink/55 leading-relaxed max-w-lg"
          >
            {category.description}
          </p>
        </div>
      </div>

      {/* ── Works ─────────────────────────────────────────── */}
      <div className="gutter">
        {category.isComingSoon ? (
          <ComingSoonState />
        ) : category.isAppCategory ? (
          <MobileAppsGallery projects={categoryProjects} />
        ) : (
          <ProjectIndexList projects={categoryProjects} />
        )}
      </div>
    </main>
  )
}

/* ── Editorial Index List ─────────────────────────────────────────────── */

function ProjectIndexList({ projects }: { projects: Project[] }) {
  const previewRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number>(0)
  const [previewSrc, setPreviewSrc] = useState<string | null>(null)

  // GSAP used only for cursor-following preview position — no initial state changes
  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!previewRef.current) return
    cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(() => {
      gsap.to(previewRef.current, {
        x: e.clientX + 24,
        y: e.clientY - 80,
        duration: 0.4,
        ease: 'power2.out',
        overwrite: 'auto',
      })
    })
  }, [])

  return (
    <div className="relative" onMouseMove={onMouseMove}>
      {/* Floating hover preview */}
      <div
        ref={previewRef}
        className={cn(
          'pointer-events-none fixed top-0 left-0 z-50 w-[22rem] overflow-hidden rounded-xl shadow-2xl border border-black/10 transition-opacity duration-200',
          previewSrc ? 'opacity-100' : 'opacity-0',
        )}
        style={{ willChange: 'transform' }}
      >
        {previewSrc && (
          <img
            src={previewSrc}
            alt=""
            className="w-full h-auto max-h-56 object-cover object-top block"
          />
        )}
      </div>

      {/* Column header */}
      <div className="grid grid-cols-[3rem_1fr_minmax(0,18rem)_minmax(0,16rem)_2rem] items-center gap-x-4 border-b border-line pb-3 font-mono text-[0.68rem] uppercase tracking-widest text-muted max-md:hidden">
        <span>No.</span>
        <span>Client</span>
        <span>Industry</span>
        <span>Work</span>
        <span />
      </div>

      {/* Rows — always visible; CSS animation is progressive enhancement only */}
      {projects.map((project, index) => {
        const asset = showcase[project.slug]
        const src =
          project.image ||
          (asset?.desktop ? showcaseSrc(project.slug, 'desktop', true) : null) ||
          null

        return (
          <IndexRow
            key={project.slug}
            project={project}
            index={index}
            previewSrc={src}
            onEnter={src ? setPreviewSrc : undefined}
            onLeave={() => setPreviewSrc(null)}
          />
        )
      })}
    </div>
  )
}

function IndexRow({
  project,
  index,
  previewSrc,
  onEnter,
  onLeave,
}: {
  project: Project
  index: number
  previewSrc: string | null
  onEnter?: (src: string) => void
  onLeave: () => void
}) {
  return (
    <TransitionLink
      to={`/work/${project.slug}`}
      className="group grid grid-cols-[3rem_1fr] md:grid-cols-[3rem_1fr_minmax(0,18rem)_minmax(0,16rem)_2rem] items-center gap-x-4 border-b border-line py-6 sm:py-8 transition-colors duration-300 hover:bg-paper-2/60 -mx-4 px-4 sm:-mx-6 sm:px-6 rounded-lg"
      style={{
        animation: `fadeSlideIn 0.6s cubic-bezier(0.16,1,0.3,1) ${0.05 * index}s both`,
      }}
      onMouseEnter={() => previewSrc && onEnter?.(previewSrc)}
      onMouseLeave={onLeave}
    >
      {/* Number */}
      <span className="font-mono text-xs text-muted group-hover:text-accent transition-colors duration-300 self-start mt-2 md:mt-0">
        {String(index + 1).padStart(2, '0')}
      </span>

      {/* Client name */}
      <div className="flex flex-col gap-1 min-w-0">
        <span className="flex items-center gap-3 flex-wrap text-[clamp(1.7rem,3.6vw,3rem)] font-semibold tracking-[-0.04em] leading-[1.05] transition-colors duration-300 group-hover:text-accent">
          {project.name}
          {project.hasBothWebAndMobile && (
            <span className="inline-flex items-center gap-1.5 self-center rounded-full bg-amber-500 px-3 py-1 font-mono text-[0.68rem] font-bold uppercase tracking-widest text-white shrink-0 shadow-sm">
              <Smartphone className="size-2.5" />
              Web + App
            </span>
          )}
        </span>

        {/* Mobile-only: industry + discipline below the name */}
        <div className="md:hidden flex flex-wrap gap-x-4 gap-y-0.5 mt-1">
          <span className="font-mono text-[0.68rem] uppercase tracking-widest text-muted">
            {project.industry}
          </span>
          <span className="font-mono text-[0.68rem] uppercase tracking-widest text-muted/60">
            {project.discipline}
          </span>
        </div>
      </div>

      {/* Industry */}
      <span className="font-mono text-[0.72rem] uppercase tracking-widest text-muted max-md:hidden">
        {project.industry}
      </span>

      {/* Discipline */}
      <span className="font-mono text-[0.72rem] uppercase tracking-widest text-muted/70 max-md:hidden">
        {project.discipline}
      </span>

      {/* Arrow */}
      <span className="hidden md:flex items-center justify-end text-muted group-hover:text-accent transition-colors duration-300">
        <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </span>
    </TransitionLink>
  )
}

/* ── Apps Gallery ─────────────────────────────────────────────────────── */

function MobileAppsGallery({ projects }: { projects: Project[] }) {
  return (
    <div>
      {/* Editorial header */}
      <div className="flex flex-wrap items-end justify-between gap-6 pb-7 border-b border-line mb-10">
        <div>
          <p className="font-mono text-[0.68rem] uppercase tracking-widest text-accent mb-2.5 flex items-center gap-2">
            <Smartphone className="size-3" />
            Apps Developed
          </p>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-[-0.035em] text-ink">
            iOS & Android Applications
          </h2>
        </div>
        <p className="text-sm text-ink/50 leading-relaxed max-w-xs">
          Native mobile applications built and shipped by WebBirth for iOS and Android platforms.
        </p>
      </div>

      {/* Grid */}
      <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, index) => {
          const asset = showcase[project.slug]
          const appImage =
            (asset?.apps && `/projects/showcase/${project.slug}-apps.webp`) ||
            (asset?.mobile && showcaseSrc(project.slug, 'mobile', false)) ||
            project.image

          return (
            <TransitionLink
              key={project.slug}
              to={`/work/${project.slug}`}
              className="group flex flex-col"
              style={{
                animation: `fadeSlideIn 0.6s cubic-bezier(0.16,1,0.3,1) ${0.08 * index}s both`,
              }}
            >
              {/* Image container */}
              <div
                className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-[0_8px_32px_-8px_rgba(0,0,0,0.18)] transition-shadow duration-700 group-hover:shadow-[0_20px_48px_-8px_rgba(0,0,0,0.28)]"
                style={{
                  background: `radial-gradient(130% 100% at 50% 10%, ${project.tone}dd 0%, ${project.tone} 70%, #080808 100%)`,
                }}
              >
                {appImage ? (
                  <img
                    src={appImage}
                    alt={`${project.name} app`}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-contain transition-transform duration-700 ease-[var(--ease-expo)] group-hover:scale-[1.04]"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full gap-2 text-paper/50">
                    <Smartphone className="size-8" />
                    <p className="font-mono text-xs uppercase tracking-widest">{project.name}</p>
                  </div>
                )}

                {/* Case study button — top right, always visible */}
                <div className="absolute top-3 right-3 flex size-9 items-center justify-center rounded-full bg-paper/90 backdrop-blur-sm shadow-md transition-all duration-300 group-hover:bg-paper group-hover:shadow-lg group-hover:scale-110">
                  <ArrowUpRight className="size-4 text-ink" strokeWidth={2} />
                </div>

                {/* Play Store button — bottom right, on hover */}
                {project.playStore && (
                  <a
                    href={project.playStore}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-paper/95 backdrop-blur-sm shadow-lg px-3 py-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400 hover:bg-white"
                    aria-label={`${project.name} on Google Play`}
                  >
                    <svg viewBox="0 0 24 24" className="size-3.5 shrink-0" fill="currentColor">
                      <path d="M3.18 23.76c.3.18.65.2.96.06l12.56-7.27-2.72-2.72-10.8 9.93zM.75 1.5C.28 1.94 0 2.63 0 3.56v16.88c0 .93.28 1.62.76 2.06l.11.1 9.46-9.46v-.22L.86 3.46.75 1.5zM22.55 10.4l-2.68-1.55-3.05 3.05 3.05 3.05 2.7-1.56c.77-.44.77-1.55-.02-2zM3.18.24L13.98 10.1l-2.72 2.72L.96.3C.65.16.3.18 0 .36l3.18-.12z"/>
                    </svg>
                    <span className="font-mono text-[0.68rem] font-bold uppercase tracking-wider text-ink">
                      Play Store
                    </span>
                  </a>
                )}
              </div>

              {/* Project info */}
              <div className="mt-4 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="text-lg font-semibold text-ink tracking-tight leading-snug group-hover:text-accent transition-colors duration-300">
                    {project.name}
                  </h3>
                  <p className="font-mono text-[0.68rem] uppercase tracking-widest text-muted mt-0.5">
                    {project.industry}
                  </p>
                </div>
                <span className="shrink-0 font-mono text-[0.68rem] text-muted/40 mt-1">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>
            </TransitionLink>
          )
        })}
      </div>
    </div>
  )
}

/* ── Coming Soon ──────────────────────────────────────────────────────── */

function ComingSoonState() {
  return (
    <div className="rounded-3xl border border-dashed border-line bg-paper-2/40 p-10 sm:p-20 text-center flex flex-col items-center justify-center max-w-3xl mx-auto">
      <div className="size-16 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent mb-6">
        <Sparkles className="size-8" />
      </div>
      <h2 className="text-2xl sm:text-4xl font-semibold uppercase tracking-tight text-ink">
        Private Enterprise Archive
      </h2>
      <p className="mt-4 text-base sm:text-lg text-ink/70 leading-relaxed max-w-xl">
        We have built over 1000+ digital platforms, enterprise tools, and SaaS architectures since
        2020. Additional client case studies for this category are currently being curated and will
        be published here shortly.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3 font-mono text-xs text-muted">
        <span className="rounded-md border border-line bg-paper px-3 py-1.5">1000+ Delivered Works</span>
        <span className="rounded-md border border-line bg-paper px-3 py-1.5">15+ Countries</span>
        <span className="rounded-md border border-line bg-paper px-3 py-1.5">Private NDA Demos Available</span>
      </div>
      <TransitionLink
        to="/#contact"
        className="mt-10 inline-flex items-center gap-2 rounded-full bg-ink px-8 py-3.5 font-mono text-xs font-semibold uppercase tracking-wider text-paper shadow-md hover:bg-accent hover:text-on-accent transition-all duration-300"
      >
        Request Private Portfolio Demos
        <ArrowUpRight className="size-4" />
      </TransitionLink>
    </div>
  )
}
