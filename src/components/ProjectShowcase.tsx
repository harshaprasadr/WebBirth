import { useRef, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { projects } from '@/data/projects'
import { useGSAP } from '@/lib/gsap'
import { registerReveals } from '@/animations/reveal'
import { cn } from '@/lib/cn'
import { useFinePointer } from '@/hooks/useMediaQuery'
import { useFollowPointer } from '@/hooks/useFollowPointer'
import { SectionHeader } from './SectionHeader'
import { ProjectMedia } from './ProjectMedia'
import { TransitionLink } from './PageTransition'
import { WorkScenes } from './WorkScenes'

/**
 * 01 — Selected work: header, the cinematic project scenes, then the full index.
 */
export function ProjectShowcase() {
  const scope = useRef<HTMLElement>(null)
  useGSAP(() => registerReveals(scope.current!), { scope })

  return (
    <section ref={scope} id="work" aria-labelledby="work-title" className="relative bg-paper">
      <div className="gutter pb-[clamp(2.5rem,5vw,4.5rem)] section-pt">
        <SectionHeader
          id="work-title"
          index="01"
          label="Projects"
          aside="Since 2020"
          title={['Selected', 'Work']}
          intro="Digital products, platforms and experiences built by WebBirth — shown live, as they run today."
          titleClassName="uppercase"
        />
      </div>

      <WorkScenes />

      <ViewAllWork />
    </section>
  )
}

const EXCLUDED_REEL_SLUGS = new Set([
  'itransfer',
  'sanchara-mitra-mechanic',
  'generation-purple',
  'worth-and-right',
])

/** "View more" — a drifting reel of every client that opens the full Work page. */
function ViewAllWork() {
  const reelProjects = projects.filter((p) => !EXCLUDED_REEL_SLUGS.has(p.slug))
  const reel = [...reelProjects, ...reelProjects]
  return (
    <div className="relative overflow-clip bg-paper section-y">
      <div className="gutter">
        <div className="type-meta flex items-center gap-4 text-muted">
          <span data-reveal="fade">Index — Projects</span>
          <span className="flex-1" aria-hidden="true" />
          <span data-reveal="fade">Since 2020</span>
        </div>

        <div className="mt-8 flex flex-col gap-6 sm:mt-12 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h3 className="text-[clamp(2.4rem,7vw,6.5rem)] font-semibold uppercase leading-[0.9] tracking-[-0.05em]">
              There&rsquo;s{' '}
              <span className="font-serif font-normal normal-case italic tracking-[-0.02em] text-accent">more</span>
              <br />
              to explore.
            </h3>
          </div>
          <TransitionLink
            to="/work"
            className="group relative inline-flex min-h-14 shrink-0 items-center gap-4 self-start overflow-clip rounded-full bg-ink pl-7 pr-2 text-[0.82rem] font-medium uppercase tracking-[0.05em] text-paper sm:self-end"
          >
            <span
              aria-hidden="true"
              className="absolute inset-0 translate-y-full rounded-full bg-accent transition-transform duration-700 ease-[var(--ease-expo)] group-hover:translate-y-0"
            />
            <span className="relative transition-colors duration-500 group-hover:text-on-accent">View all projects</span>
            <span className="relative flex size-10 items-center justify-center rounded-full bg-paper text-ink">
              <ArrowUpRight className="size-4 transition-transform duration-500 group-hover:rotate-45" strokeWidth={1.75} />
            </span>
          </TransitionLink>
        </div>
      </div>

      {/* drifting reel of curated projects */}
      <div className="mt-[clamp(2.5rem,5vw,4rem)] overflow-clip">
        <div className="flex w-max animate-[marquee_80s_linear_infinite] gap-4 hover:[animation-play-state:paused] motion-reduce:animate-none sm:gap-6">
          {reel.map((p, i) => (
            <figure key={`${p.slug}-${i}`} className="group w-[15rem] shrink-0 sm:w-[19rem]" aria-hidden={i >= reelProjects.length}>
              <div className="relative aspect-[4/3] overflow-clip rounded-sm bg-ink">
                <div className="absolute inset-0 transition-transform duration-700 ease-[var(--ease-expo)] group-hover:scale-[1.04]">
                  <ProjectMedia project={p} sizes="19rem" variant="compact" />
                </div>
              </div>
              <figcaption className="mt-3 flex items-baseline justify-between gap-3">
                <span className="truncate text-lg font-medium tracking-[-0.02em]">{p.name}</span>
                <span className="type-meta shrink-0 text-muted">{String((i % reelProjects.length) + 1).padStart(2, '0')}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </div>
  )
}

/** Every project as a dense editorial table; hovering a row floats its image. */
export function ProjectIndex() {
  const fine = useFinePointer()
  const previewRef = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState<number | null>(null)
  useFollowPointer(previewRef, fine)

  return (
    <div id="index" className="gutter section-pb pt-[clamp(3.5rem,6vw,6rem)]">
      <div className="type-meta flex items-center gap-4 text-muted">
        <span data-reveal="fade">Index — All projects</span>
        <span className="flex-1" aria-hidden="true" />
        <span data-reveal="fade">Bengaluru → {projects.length} brands</span>
      </div>

      <div className="type-meta mt-10 hidden grid-cols-12 gap-4 pb-3 text-muted lg:grid">
        <span className="col-span-1">No.</span>
        <span className="col-span-5">Client</span>
        <span className="col-span-3">Industry</span>
        <span className="col-span-3">Work</span>
      </div>

      <ul className="border-t border-line" onPointerLeave={() => setHovered(null)}>
        {projects.map((p, i) => (
          <li key={p.slug} data-reveal="fade" data-start="top 96%" className="border-b border-line">
            <TransitionLink
              to={`/work/${p.slug}`}
              onPointerEnter={() => setHovered(i)}
              onFocus={() => setHovered(i)}
              onBlur={() => setHovered(null)}
              data-cursor="view"
              data-cursor-label="View"
              className={cn(
                'group grid grid-cols-[2.5rem_1fr_auto] items-baseline gap-4 py-5 transition-[opacity,padding] duration-500 lg:grid-cols-12 lg:py-6',
                hovered !== null && hovered !== i && 'lg:opacity-35',
              )}
            >
              <span className="type-meta text-muted lg:col-span-1">{String(i + 1).padStart(2, '0')}</span>
              <span className="flex flex-col gap-1.5 transition-transform duration-700 ease-[var(--ease-expo)] group-hover:translate-x-3 lg:col-span-5">
                <span className="text-[clamp(1.5rem,3vw,2.6rem)] font-medium leading-none tracking-[-0.04em]">{p.name}</span>
                <span className="type-meta text-muted lg:hidden">{p.industry}</span>
              </span>
              <span className="type-meta hidden text-muted lg:col-span-3 lg:block">{p.industry}</span>
              <span className="type-meta flex items-center justify-between gap-3 text-muted lg:col-span-3">
                <span className="hidden lg:inline">{p.discipline}</span>
                <ArrowUpRight
                  aria-hidden="true"
                  className="size-5 text-ink transition-transform duration-700 ease-[var(--ease-expo)] group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-accent"
                  strokeWidth={1.25}
                />
              </span>
            </TransitionLink>
          </li>
        ))}
      </ul>

      {fine && (
        <div
          ref={previewRef}
          aria-hidden="true"
          className={cn(
            'pointer-events-none fixed left-0 top-0 z-30 aspect-[4/3] w-[22rem] overflow-clip transition-[opacity,clip-path] duration-500 ease-[var(--ease-expo)]',
            hovered === null ? 'opacity-0 [clip-path:inset(50%_50%_50%_50%)]' : 'opacity-100 [clip-path:inset(0%_0%_0%_0%)]',
          )}
        >
          {projects.map((p, i) => (
            <div
              key={p.slug}
              className={cn(
                'absolute inset-0 transition-[opacity,transform] duration-700 ease-[var(--ease-expo)]',
                hovered === i ? 'scale-100 opacity-100' : 'scale-110 opacity-0',
              )}
            >
              <ProjectMedia project={p} sizes="22rem" variant="compact" />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

