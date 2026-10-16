import { ArrowUpRight } from 'lucide-react'
import type { Project } from '@/data/projects'
import { cn } from '@/lib/cn'
import { ProjectMedia } from './ProjectMedia'
import { TransitionLink } from './PageTransition'

type ProjectCardProps = {
  project: Project
  index: number
  className?: string
  /** "panel" for the pinned horizontal track, "stack" for vertical layouts. */
  variant?: 'panel' | 'stack'
  priority?: boolean
}

export function ProjectCard({ project, index, className, variant = 'stack', priority }: ProjectCardProps) {
  const number = String(index + 1).padStart(2, '0')
  const meta = [project.industry, project.discipline, project.year].filter(Boolean)

  return (
    <article data-project-card className={cn('group relative flex flex-col', className)}>
      <TransitionLink
        to={`/work/${project.slug}`}
        aria-label={`View project: ${project.name}`}
        data-cursor="view"
        data-cursor-label="View project"
        className={cn(
          'relative block overflow-clip',
          variant === 'panel' ? 'aspect-[16/10] w-full' : 'aspect-[3/2] w-full md:aspect-[16/10]',
        )}
      >
        <div data-reveal-clip className="absolute inset-0 overflow-clip">
          <div
            data-card-media
            className="absolute inset-0 scale-[1.07]"
          >
            <ProjectMedia project={project} priority={priority} />
          </div>
          {/* hover overlay */}
          <div
            aria-hidden="true"
            className="absolute inset-0 flex items-end justify-between p-[clamp(1rem,2vw,1.75rem)] opacity-0 transition-opacity duration-700 group-hover:opacity-100"
            style={{ background: `linear-gradient(to top, ${project.tone}cc 0%, transparent 28%)` }}
          >
            <span className="type-meta translate-y-3 text-paper transition-transform duration-700 ease-[var(--ease-expo)] group-hover:translate-y-0">
              View case
            </span>
            <span className="flex size-12 translate-y-3 items-center justify-center rounded-full bg-paper text-ink transition-transform duration-700 ease-[var(--ease-expo)] group-hover:translate-y-0">
              <ArrowUpRight className="size-5" strokeWidth={1.5} />
            </span>
          </div>
        </div>
        <span className="type-meta absolute left-[clamp(1rem,2vw,1.75rem)] top-[clamp(1rem,2vw,1.75rem)] text-paper mix-blend-difference">
          ({number})
        </span>
      </TransitionLink>

      <div
        data-card-meta
        className={cn(
          'grid grid-cols-[auto_1fr_auto] items-start gap-x-4 border-t border-line',
          variant === 'panel' ? 'mt-4 pt-3.5' : 'mt-5 pt-4',
        )}
      >
        <span className="type-meta pt-[0.45em] text-muted">{number}</span>
        <div className="min-w-0">
          <h3 className="type-h3 transition-transform duration-700 ease-[var(--ease-expo)] group-hover:translate-x-3">
            <TransitionLink to={`/work/${project.slug}`} tabIndex={-1}>
              {project.name}
            </TransitionLink>
          </h3>
          <p className={cn('type-body max-w-[36rem] text-ink/65', variant === 'panel' ? 'mt-2 line-clamp-2' : 'mt-3')}>
            {project.summary}
          </p>
          <ul className={cn('type-meta flex flex-wrap gap-x-4 gap-y-1 text-muted', variant === 'panel' ? 'mt-3' : 'mt-4')}>
            {meta.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        </div>
        <ArrowUpRight
          aria-hidden="true"
          className="mt-1 size-6 transition-transform duration-700 ease-[var(--ease-expo)] group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-accent"
          strokeWidth={1.25}
        />
      </div>
    </article>
  )
}
