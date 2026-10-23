import { useRef } from 'react'
import { Star } from 'lucide-react'
import { sourceMeta, type Source, type Testimonial } from '@/data/testimonials'
import { gsap, useGSAP } from '@/lib/gsap'
import { prefersReducedMotion } from '@/lib/env'
import { cn } from '@/lib/cn'

/** Number that counts up from 0 when it scrolls into view. */
export function CountUp({
  to,
  decimals = 0,
  suffix = '',
  className,
}: {
  to: number
  decimals?: number
  suffix?: string
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const fmt = (v: number) => v.toFixed(decimals)
  useGSAP(
    () => {
      const el = ref.current
      if (!el) return
      if (prefersReducedMotion()) {
        el.textContent = fmt(to) + suffix
        return
      }
      const c = { v: 0 }
      el.textContent = fmt(0) + suffix
      gsap.to(c, {
        v: to,
        duration: 1.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 90%', once: true },
        onUpdate: () => (el.textContent = fmt(c.v) + suffix),
      })
    },
    { dependencies: [to, decimals, suffix] },
  )
  return (
    <span ref={ref} className={cn('tabular-nums', className)}>
      {fmt(to)}
      {suffix}
    </span>
  )
}

/** Row of five stars; filled up to `value`. */
export function Stars({ value, className, dark }: { value: number; className?: string; dark?: boolean }) {
  return (
    <span role="img" className={cn('inline-flex items-center gap-0.5', className)} aria-label={`${value} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={cn('size-[1em]', i < value ? 'fill-accent text-accent' : dark ? 'text-paper/20' : 'text-ink/15')}
          strokeWidth={1.5}
          aria-hidden="true"
        />
      ))}
    </span>
  )
}

/** Little "G" Google glyph in brand orange — used on the Google badge. */
function GoogleGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="size-[0.95em]" aria-hidden="true">
      <path
        fill="currentColor"
        d="M21.6 12.23c0-.73-.07-1.43-.2-2.1H12v3.97h5.38a4.6 4.6 0 0 1-2 3.02v2.5h3.23c1.89-1.74 2.99-4.3 2.99-7.39Z"
      />
      <path
        fill="currentColor"
        d="M12 22c2.7 0 4.96-.9 6.62-2.42l-3.23-2.5c-.9.6-2.05.95-3.39.95-2.6 0-4.8-1.76-5.59-4.12H3.07v2.58A10 10 0 0 0 12 22Z"
        opacity="0.75"
      />
      <path
        fill="currentColor"
        d="M6.41 13.91a6 6 0 0 1 0-3.82V7.51H3.07a10 10 0 0 0 0 8.98l3.34-2.58Z"
        opacity="0.5"
      />
      <path
        fill="currentColor"
        d="M12 5.98c1.47 0 2.78.5 3.82 1.5l2.86-2.86A9.6 9.6 0 0 0 12 2a10 10 0 0 0-8.93 5.51l3.34 2.58C7.2 7.74 9.4 5.98 12 5.98Z"
        opacity="0.9"
      />
    </svg>
  )
}

export function SourceBadge({ source, className, dark }: { source: Source; className?: string; dark?: boolean }) {
  const meta = sourceMeta[source]
  return (
    <a
      href={meta.href}
      target="_blank"
      rel="noreferrer"
      onClick={(e) => e.stopPropagation()}
      className={cn(
        'type-meta inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 leading-none transition-colors duration-300',
        dark
          ? 'border-paper/15 text-paper/70 hover:border-accent hover:text-accent'
          : 'border-line text-muted hover:border-accent hover:text-accent',
        className,
      )}
    >
      {source === 'google' && <span className="text-accent flex items-center leading-none"><GoogleGlyph /></span>}
      <span className="leading-none">{meta.label}</span>
      <span aria-hidden="true" className="leading-none text-[0.85em]">↗</span>
    </a>
  )
}

/** Monogram avatar or image avatar — matching authentic Google review aesthetics. */
export function Avatar({
  name,
  className,
  dark,
  color,
  image,
}: {
  name: string
  className?: string
  dark?: boolean
  color?: string
  image?: string
}) {
  if (image) {
    return (
      <img
        src={image}
        alt={name}
        className={cn('shrink-0 rounded-full object-cover', className)}
        onError={(e) => {
          e.currentTarget.style.display = 'none'
        }}
      />
    )
  }

  const initial = name.replace(/^(Director,?\s*)/i, '').trim().charAt(0).toUpperCase() || 'W'
  return (
    <span
      aria-hidden="true"
      style={color ? { backgroundColor: color } : undefined}
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full font-semibold',
        color ? 'text-white shadow-sm' : dark ? 'bg-accent text-on-accent' : 'bg-ink text-paper',
        className,
      )}
    >
      {initial}
    </span>
  )
}

/** First-name display for tight spots (drops "Director," prefixes). */
export const displayName = (t: Testimonial) => t.name
