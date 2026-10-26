import type { CSSProperties } from 'react'
import type { Project } from '@/data/projects'
import { showcase, showcaseSrc } from '@/data/showcase'
import { cn } from '@/lib/cn'

type ProjectMediaProps = {
  project: Project
  className?: string
  /** CSS sizes hint for the browser's srcset choice. */
  sizes?: string
  priority?: boolean
  /** 'compact' drops secondary devices and type for small previews. */
  variant?: 'card' | 'compact'
}

/** Lighten / darken a hex colour (amount −1…1). */
function shade(hex: string, amount: number) {
  const n = parseInt(hex.slice(1), 16)
  const ch = (v: number) => Math.round(amount > 0 ? v + (255 - v) * amount : v * (1 + amount))
  const r = ch((n >> 16) & 255)
  const g = ch((n >> 8) & 255)
  const b = ch(n & 255)
  return `rgb(${r} ${g} ${b})`
}

const host = (url?: string) => (url ? new URL(url).host.replace(/^www\./, '') : undefined)

/**
 * Art-directed project visual. Composes real captures of the client's site
 * (or the screen cut from the portfolio mockup) into a browser window and
 * phone on a brand-tinted stage. Hover (via the card's `group`): devices
 * straighten out of their 3D tilt and the full page scrolls inside the window.
 */
export function ProjectMedia({ project, className, sizes = '(min-width: 1024px) 60vw, 100vw', priority, variant = 'card' }: ProjectMediaProps) {
  const asset = showcase[project.slug]
  const compact = variant === 'compact'
  const tone = project.tone
  const stage: CSSProperties = {
    background: `radial-gradient(120% 95% at 72% 8%, ${shade(tone, 0.32)} 0%, ${tone} 42%, #060606 100%)`,
  }
  const loading = priority ? 'eager' : 'lazy'

  // No asset entry — show project.image if available, otherwise nothing.
  if (!asset) {
    if (!project.image) return null
    return (
      <img
        src={project.image}
        alt=""
        loading={loading}
        decoding="async"
        className={cn('size-full object-cover', className)}
        style={{ backgroundColor: tone }}
      />
    )
  }

  const alt = `${project.name} — ${project.discipline.toLowerCase()} by WebBirth`
  const hasPhone = !compact && asset.kind === 'live' && !!asset.mobile
  const isApp = asset.kind === 'app'

  // How far the page must travel so its bottom lands at the window's bottom.
  // Window content box is 72% × (76% − bar) of a 16:10 stage → aspect ≈ 0.62.
  const contentAspect = compact ? 0.66 : 0.62
  const pageAspect = asset.desktop ? asset.desktop.h / asset.desktop.w : 0
  const scrollable = asset.kind === 'live' && pageAspect > contentAspect + 0.05
  const travel = scrollable ? -(1 - contentAspect / pageAspect) * 100 : 0

  return (
    <div className={cn('relative size-full overflow-clip [container-type:inline-size]', className)} style={stage}>
      {/* stage texture */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgb(255 255 255 / 0.09) 1px, transparent 1px), linear-gradient(to bottom, rgb(255 255 255 / 0.09) 1px, transparent 1px)',
          backgroundSize: '6.25cqw 6.25cqw',
          maskImage: 'radial-gradient(ellipse at 60% 40%, black 0%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse at 60% 40%, black 0%, transparent 75%)',
        }}
      />
      {!compact && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-[2.5cqw] left-[3cqw] whitespace-nowrap text-[15cqw] font-semibold uppercase leading-none tracking-[-0.06em] text-transparent [-webkit-text-stroke:1px_rgb(255_255_255_/_0.12)]"
        >
          {project.name}
        </span>
      )}
      <div
        aria-hidden="true"
        className="absolute left-[55%] top-[45%] size-[55cqw] -translate-x-1/2 -translate-y-1/2 rounded-full glow"
        style={{ '--glow': shade(tone, 0.45), opacity: 0.35 } as CSSProperties}
      />

      <div className="absolute inset-0 [perspective:1800px]">
        {/* ── browser window ── */}
        {asset.desktop && (
          <div
            className={cn(
              'absolute overflow-clip rounded-[0.9cqw] bg-white shadow-[0_4cqw_8cqw_-2cqw_rgb(0_0_0_/_0.65),0_0_0_1px_rgb(255_255_255_/_0.08)] transition-transform duration-[1.2s] ease-[var(--ease-expo)] motion-reduce:transition-none',
              compact
                ? 'left-[8%] top-[10%] h-[80%] w-[84%]'
                : asset.kind === 'live'
                  ? 'left-[7%] top-[11%] h-[76%] w-[72%] [transform:rotateY(14deg)_rotateX(5deg)_translateZ(0)] group-hover:[transform:rotateY(4deg)_rotateX(1deg)_translateZ(40px)] motion-reduce:[transform:none]'
                  : 'left-[12%] top-[11%] h-[78%] w-[76%] [transform:rotateY(10deg)_rotateX(4deg)] group-hover:[transform:rotateY(2deg)_rotateX(1deg)_translateZ(30px)] motion-reduce:[transform:none]',
            )}
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* chrome */}
            <div className="flex h-[6%] min-h-3 items-center gap-[0.6cqw] border-b border-black/[0.07] bg-[#f6f5f2] px-[1.2cqw]">
              {['#ff5f57', '#febc2e', '#28c840'].map((c) => (
                <span key={c} className="size-[0.75cqw] min-h-1 min-w-1 rounded-full" style={{ background: c }} />
              ))}
              <span className="mx-auto flex h-[60%] w-[46%] items-center justify-center rounded-full bg-black/[0.05] font-mono text-[1cqw] leading-none text-black/50">
                {host(project.url) ?? project.name.toLowerCase().replace(/\s+/g, '')}
              </span>
            </div>
            {/* page */}
            <div className="relative h-[94%] overflow-clip bg-white">
              <img
                src={showcaseSrc(project.slug, 'desktop')}
                srcSet={
                  asset.kind === 'live'
                    ? `${showcaseSrc(project.slug, 'desktop', true)} 640w, ${showcaseSrc(project.slug, 'desktop')} 1200w`
                    : undefined
                }
                sizes={sizes}
                alt={alt}
                width={asset.desktop.w}
                height={asset.desktop.h}
                loading={loading}
                decoding="async"
                className={cn(
                  'block w-full',
                  scrollable
                    ? 'h-auto transition-transform duration-[7s] ease-[cubic-bezier(0.45,0,0.2,1)] group-hover:[transform:translateY(var(--travel))] motion-reduce:transition-none'
                    : asset.kind === 'crop'
                      ? 'h-auto'
                      : 'h-full object-cover object-top transition-transform duration-[1.4s] ease-[var(--ease-expo)] group-hover:scale-[1.04]',
                )}
                style={scrollable ? ({ '--travel': `${travel}%` } as CSSProperties) : undefined}
              />
            </div>
          </div>
        )}

        {/* ── phone (live sites: overlaps the window; apps: hero device) ── */}
        {(hasPhone || isApp) && asset.mobile && (
          <div
            className={cn(
              'absolute rounded-[3.2cqw] bg-[#0b0b0c] p-[0.55cqw] shadow-[0_4cqw_7cqw_-1.5cqw_rgb(0_0_0_/_0.7),inset_0_0_0_1px_rgb(255_255_255_/_0.12)] transition-transform duration-[1.2s] ease-[var(--ease-expo)] motion-reduce:transition-none',
              isApp
                ? compact
                  ? 'left-1/2 top-[8%] h-[84%] -translate-x-1/2 aspect-[386/872]'
                  : 'left-1/2 top-[7%] h-[86%] aspect-[386/872] [transform:translateX(-50%)_rotateY(-16deg)_rotateZ(-2deg)] group-hover:[transform:translateX(-50%)_rotateY(-4deg)_rotateZ(0deg)_translateZ(40px)] motion-reduce:[transform:translateX(-50%)]'
                : 'bottom-[7%] right-[7%] h-[64%] aspect-[9/19.5] [transform:rotateY(-12deg)_translateZ(60px)] group-hover:[transform:rotateY(-3deg)_translateZ(90px)_translateY(-2%)] motion-reduce:[transform:none]',
            )}
          >
            <div className="relative size-full overflow-clip rounded-[2.7cqw] bg-white">
              <img
                src={showcaseSrc(project.slug, 'mobile')}
                alt={isApp ? alt : ''}
                width={asset.mobile.w}
                height={asset.mobile.h}
                loading={loading}
                decoding="async"
                className="size-full object-cover object-top"
              />
              {!isApp && <span className="absolute left-1/2 top-[1.6%] h-[3.4%] w-[32%] -translate-x-1/2 rounded-full bg-black" />}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
