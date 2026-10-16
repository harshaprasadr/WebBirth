import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/cn'

/** Text that rolls to a duplicate of itself on hover (needs a `group` ancestor). */
export function RollText({ children }: { children: string }) {
  return (
    <span className="roll">
      <span>{children}</span>
      <span aria-hidden="true">{children}</span>
    </span>
  )
}

type PillButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: string
  icon?: ReactNode
  tone?: 'ink' | 'paper' | 'accent'
}

/** Primary action — a full pill with a sliding fill and an arrow that exits/re-enters. */
export function PillButton({ children, icon, tone = 'ink', className, ...rest }: PillButtonProps) {
  return (
    <button
      {...rest}
      className={cn(
        'group relative inline-flex min-h-14 items-center gap-4 overflow-clip rounded-full pl-7 pr-2 text-sm font-medium uppercase tracking-[0.04em] transition-colors duration-500 disabled:opacity-50',
        tone === 'ink' && 'bg-ink text-paper',
        tone === 'paper' && 'bg-paper text-ink',
        tone === 'accent' && 'bg-accent text-on-accent',
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          'absolute inset-0 translate-y-full rounded-[inherit] transition-transform duration-700 ease-[var(--ease-expo)] group-hover:translate-y-0 group-focus-visible:translate-y-0',
          tone === 'paper' ? 'bg-accent' : tone === 'accent' ? 'bg-ink' : 'bg-accent',
        )}
      />
      <span
        className={cn(
          'relative transition-colors duration-500',
          tone === 'ink' && 'group-hover:text-on-accent group-focus-visible:text-on-accent',
          tone === 'accent' && 'group-hover:text-paper group-focus-visible:text-paper',
        )}
      >
        <RollText>{children}</RollText>
      </span>
      <ArrowBubble tone={tone} icon={icon} />
    </button>
  )
}

export function ArrowBubble({ tone = 'ink', icon }: { tone?: 'ink' | 'paper' | 'accent'; icon?: ReactNode }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'relative flex size-10 items-center justify-center overflow-clip rounded-full',
        tone === 'paper' ? 'bg-ink text-paper' : 'bg-paper text-ink',
      )}
    >
      <span className="flex transition-transform duration-500 ease-[var(--ease-expo)] group-hover:translate-x-[150%] group-hover:-translate-y-[150%]">
        {icon ?? <ArrowUpRight className="size-4" strokeWidth={1.75} />}
      </span>
      <span className="absolute flex -translate-x-[150%] translate-y-[150%] transition-transform duration-500 ease-[var(--ease-expo)] group-hover:translate-x-0 group-hover:translate-y-0">
        {icon ?? <ArrowUpRight className="size-4" strokeWidth={1.75} />}
      </span>
    </span>
  )
}
