import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

type SectionHeaderProps = {
  /** e.g. "01" — omit for unnumbered sections. */
  index?: string
  label: string
  /** Each entry renders on its own line. */
  title: string[]
  intro?: ReactNode
  /** Right-aligned metadata on the label row, e.g. a count. */
  aside?: ReactNode
  dark?: boolean
  className?: string
  titleClassName?: string
  id?: string
}

/**
 * Editorial section opener: numbered label row with a hairline, an oversized
 * multi-line title, and an offset intro paragraph.
 */
export function SectionHeader({
  index: _index,
  label,
  title,
  intro,
  aside,
  dark,
  className,
  titleClassName,
  id,
}: SectionHeaderProps) {
  return (
    <header className={cn('flex flex-col', className)}>
      <div className={cn('type-meta flex items-center gap-4', dark ? 'text-muted-dark' : 'text-muted')}>
        <span data-reveal="fade" className="shrink-0">
          {label}
        </span>
        <span className="flex-1" aria-hidden="true" />
        {aside && (
          <span data-reveal="fade" className="shrink-0">
            {aside}
          </span>
        )}
      </div>

      <div className="mt-[clamp(1.5rem,3vw,3rem)] grid gap-8 lg:grid-cols-12 lg:items-end">
        <h2 id={id} data-reveal="lines" className={cn('type-display lg:col-span-8', titleClassName)}>
          {title.map((line, i) => (
            <span key={i} className="block">
              {line}
            </span>
          ))}
        </h2>
        {intro && (
          <p
            data-reveal="fade"
            data-delay="0.2"
            className={cn(
              'type-lead max-w-md lg:col-span-4 lg:col-start-9 lg:pb-3',
              dark ? 'text-paper/70' : 'text-ink/70',
            )}
          >
            {intro}
          </p>
        )}
      </div>
    </header>
  )
}
