import type { CSSProperties, ReactElement } from 'react'
import type { ServiceKind } from '@/data/site'
import { cn } from '@/lib/cn'

const INK = '#0c0c0d'
const ACCENT = '#f2571c'
const LINE = 'rgba(12,12,13,0.16)'
const FILL = 'rgba(12,12,13,0.06)'

const d = (s: number): CSSProperties => ({ animationDelay: `${s}s` })

/** Small, quiet animated scenes — one per service. 320×240 viewBox. */
const scenes: Record<ServiceKind, () => ReactElement> = {
  web: () => (
    <>
      <rect x="20" y="22" width="280" height="196" rx="10" fill="#fff" stroke={LINE} strokeWidth="0.75" />
      <path d="M20 48h280" stroke={LINE} strokeWidth="0.5" />
      {[36, 46, 56].map((x) => (
        <circle key={x} cx={x} cy="35" r="3.5" fill={LINE} />
      ))}
      <rect x="120" y="29" width="80" height="12" rx="6" fill={FILL} />
      <rect x="42" y="66" width="140" height="12" rx="3" fill={INK} className="anim-grow-x" />
      <rect x="42" y="84" width="100" height="12" rx="3" fill={INK} className="anim-grow-x" style={d(0.15)} />
      <rect x="42" y="108" width="160" height="4" rx="2" fill={LINE} className="anim-grow-x" style={d(0.3)} />
      <rect x="42" y="118" width="130" height="4" rx="2" fill={LINE} className="anim-grow-x" style={d(0.4)} />
      <rect x="42" y="136" width="56" height="18" rx="9" fill={ACCENT} className="anim-pulse" />
      {[42, 134, 226].map((x, i) => (
        <rect key={x} x={x} y="170" width="78" height="34" rx="6" fill={FILL} className="anim-rise" style={d(i * 0.2)} />
      ))}
    </>
  ),
  software: () => (
    <>
      <rect x="20" y="22" width="280" height="196" rx="10" fill="#fff" stroke={LINE} strokeWidth="0.75" />
      <rect x="20" y="22" width="56" height="196" rx="10" fill={FILL} />
      <rect x="76" y="22" width="1" height="196" fill={LINE} />
      {[46, 66, 86, 106].map((y, i) => (
        <rect key={y} x="34" y={y} width={i === 1 ? 30 : 22} height="5" rx="2.5" fill={i === 1 ? ACCENT : LINE} />
      ))}
      {[0, 1, 2, 3, 4, 5, 6].map((i) => {
        const heights = [50, 62, 58, 70, 80, 74, 90]
        return (
          <rect
            key={i}
            x={100 + i * 25}
            y={142 - heights[i]}
            width="14"
            height={heights[i]}
            rx="3"
            fill={i === 4 ? ACCENT : INK}
            className="anim-grow-y"
            style={d(i * 0.12)}
          />
        )
      })}
      <path d="M92 146h200" stroke={LINE} strokeWidth="0.5" />
      {[158, 174, 190].map((y, i) => (
        <g key={y}>
          <rect x="96" y={y} width="56" height="5" rx="2.5" fill={LINE} />
          <rect x="172" y={y} width="36" height="5" rx="2.5" fill={FILL} />
          <rect x="250" y={y} width="34" height="5" rx="2.5" fill={i === 0 ? ACCENT : LINE} />
        </g>
      ))}
    </>
  ),
  design: () => (
    <>
      <defs>
        <pattern id="sp-grid" width="16" height="16" patternUnits="userSpaceOnUse">
          <path d="M16 0H0V16" fill="none" stroke="rgba(12,12,13,0.05)" />
        </pattern>
      </defs>
      <rect x="20" y="22" width="280" height="196" rx="10" fill="url(#sp-grid)" stroke={LINE} strokeWidth="0.75" />
      <rect x="44" y="46" width="96" height="140" rx="12" fill="#fff" stroke={INK} strokeWidth="0.75" />
      <rect x="56" y="62" width="72" height="44" rx="6" fill={ACCENT} />
      <rect x="56" y="116" width="52" height="5" rx="2.5" fill={INK} />
      <rect x="56" y="126" width="64" height="4" rx="2" fill={LINE} />
      <path
        d="M170 170 C 190 70, 260 70, 276 150"
        fill="none"
        stroke={ACCENT}
        strokeWidth="1.5"
        className="anim-draw"
        style={{ ['--len' as string]: 220 }}
      />
      {[[170, 170], [276, 150]].map(([x, y]) => (
        <rect key={x} x={x - 4} y={y - 4} width="8" height="8" rx="2" fill="#fff" stroke={ACCENT} strokeWidth="1.5" />
      ))}
      {[INK, ACCENT, '#ff8a52', '#e8e6e0'].map((c, i) => (
        <circle key={c} cx={184 + i * 22} cy="52" r="8" fill={c} stroke="#fff" strokeWidth="1.5" />
      ))}
      <g className="anim-wander">
        <path d="M180 92 l0 18 l5 -5 l4 9 l3 -1.5 l-4 -9 l7 0 z" fill={INK} />
      </g>
    </>
  ),
  mobile: () => (
    <>
      <rect x="112" y="14" width="96" height="212" rx="20" fill="#fff" stroke={INK} strokeWidth="1" />
      <rect x="146" y="22" width="28" height="5" rx="2.5" fill={INK} />
      <rect x="124" y="40" width="50" height="7" rx="2" fill={INK} />
      <rect x="124" y="54" width="72" height="44" rx="8" fill={ACCENT} className="anim-pulse" style={{ animationDuration: '3.5s' }} />
      {[108, 134, 160].map((y, i) => (
        <g key={y} className="anim-rise" style={d(i * 0.25)}>
          <circle cx="132" cy={y + 9} r="7" fill={FILL} stroke={LINE} strokeWidth="0.75" />
          <rect x="146" y={y + 4} width="48" height="5" rx="2.5" fill={INK} />
          <rect x="146" y={y + 12} width="34" height="4" rx="2" fill={LINE} />
        </g>
      ))}
      <rect x="124" y="196" width="72" height="16" rx="8" fill={INK} />
      <rect x="48" y="70" width="44" height="28" rx="8" fill="#fff" stroke={LINE} strokeWidth="0.75" className="anim-rise" style={d(0.6)} />
      <rect x="228" y="130" width="48" height="30" rx="8" fill="#fff" stroke={LINE} strokeWidth="0.75" className="anim-rise" style={d(1.1)} />
    </>
  ),
  commerce: () => (
    <>
      {[0, 1, 2, 3].map((i) => {
        const x = 40 + (i % 2) * 110
        const y = 26 + Math.floor(i / 2) * 100
        return (
          <g key={i}>
            <rect x={x} y={y} width="96" height="88" rx="8" fill="#fff" stroke={LINE} strokeWidth="0.75" />
            <rect x={x + 8} y={y + 8} width="80" height="48" rx="6" fill={i === 1 ? ACCENT : FILL} />
            <rect x={x + 8} y={y + 64} width="44" height="5" rx="2.5" fill={INK} />
            <rect x={x + 8} y={y + 74} width="26" height="4" rx="2" fill={LINE} />
          </g>
        )
      })}
      <g transform="translate(262 40)">
        <rect x="-14" y="-12" width="40" height="34" rx="8" fill={INK} />
        <path d="M-4 -2h20l-3 12h-14z" fill="none" stroke="#fff" strokeWidth="1.5" />
        <circle cx="24" cy="-12" r="8" fill={ACCENT} className="anim-pulse" />
      </g>
      <rect x="250" y="150" width="54" height="22" rx="11" fill={ACCENT} className="anim-rise" />
    </>
  ),
  ai: () => {
    const layers = [
      [60, 90, 120, 150, 180],
      [75, 105, 135, 165],
      [90, 120, 150],
    ]
    const xs = [70, 160, 250]
    return (
      <>
        {layers.slice(0, -1).map((ys, l) =>
          ys.flatMap((y1) =>
            layers[l + 1].map((y2) => (
              <path
                key={`${l}-${y1}-${y2}`}
                d={`M${xs[l]} ${y1} L${xs[l + 1]} ${y2}`}
                stroke={(y1 + y2) % 60 === 0 ? ACCENT : LINE}
                className={(y1 + y2) % 60 === 0 ? 'anim-flow' : undefined}
              />
            )),
          ),
        )}
        {layers.map((ys, l) =>
          ys.map((y, i) => (
            <circle
              key={`${l}-${y}`}
              cx={xs[l]}
              cy={y}
              r={l === 2 && i === 1 ? 9 : 6}
              fill={l === 2 && i === 1 ? ACCENT : '#fff'}
              stroke={INK}
              className="anim-pulse"
              style={d((l * 5 + i) * 0.18)}
            />
          )),
        )}
      </>
    )
  },
  cloud: () => {
    const nodes = [
      [60, 60], [260, 60], [40, 170], [280, 170], [160, 206],
    ]
    return (
      <>
        {nodes.map(([x, y], i) => (
          <path key={i} d={`M160 118 L${x} ${y}`} stroke={i % 2 ? LINE : ACCENT} strokeWidth="0.75" className="anim-flow" style={d(i * 0.2)} />
        ))}
        <path d="M60 60 L260 60" stroke={LINE} strokeWidth="0.5" strokeDasharray="2 6" />
        {nodes.map(([x, y], i) => (
          <g key={i} transform={`translate(${x - 22} ${y - 14})`}>
            <rect width="44" height="28" rx="6" fill="#fff" stroke={INK} strokeWidth="0.75" />
            <rect x="7" y="8" width="20" height="3" rx="1.5" fill={LINE} />
            <rect x="7" y="16" width="14" height="3" rx="1.5" fill={LINE} />
            <circle cx="35" cy="14" r="3" fill={ACCENT} className="anim-pulse" style={d(i * 0.3)} />
          </g>
        ))}
        <circle cx="160" cy="118" r="26" fill={INK} />
        <path d="M148 122a8 8 0 0 1 2-15 11 11 0 0 1 21 3 7 7 0 0 1 -1 12z" fill="none" stroke="#fff" strokeWidth="1.5" />
      </>
    )
  },
  marketing: () => (
    <>
      {[60, 100, 140, 180].map((y) => (
        <path key={y} d={`M30 ${y}H290`} stroke="rgba(12,12,13,0.05)" />
      ))}
      <path
        d="M30 190 L80 168 L120 176 L170 130 L210 140 L250 84 L290 56"
        fill="none"
        stroke={INK}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="anim-draw"
        style={{ ['--len' as string]: 330 }}
      />
      <path
        d="M30 200 L80 192 L120 194 L170 170 L210 176 L250 150 L290 136"
        fill="none"
        stroke={ACCENT}
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeDasharray="3 5"
      />
      <circle cx="290" cy="56" r="5" fill={ACCENT} className="anim-pulse" />
      <rect x="196" y="30" width="72" height="24" rx="8" fill="#fff" stroke={LINE} strokeWidth="0.75" className="anim-rise" />
      <rect x="206" y="40" width="34" height="4" rx="2" fill={INK} className="anim-rise" />
    </>
  ),
}

type ServicePreviewProps = {
  kind: ServiceKind
  title?: string
  className?: string
  /** Render all scenes stacked and cross-fade to `kind` (for the floating desktop preview). */
  crossfade?: boolean
}

export function ServicePreview({ kind, title, className, crossfade }: ServicePreviewProps) {
  const kinds = crossfade ? (Object.keys(scenes) as ServiceKind[]) : [kind]
  return (
    <div className={cn('relative overflow-clip rounded-2xl bg-gradient-to-br from-paper-2/80 to-paper-2 shadow-[0_2px_20px_-6px_rgba(12,12,13,0.08)]', className)} aria-hidden="true">
      <div className="relative aspect-[4/3]">
        {kinds.map((k) => {
          const Scene = scenes[k]
          return (
            <svg
              key={k}
              viewBox="0 0 320 240"
              fill="none"
              className={cn(
                'absolute inset-0 size-full transition-[opacity,transform] duration-700 ease-[var(--ease-expo)]',
                k === kind ? 'scale-100 opacity-100' : 'scale-95 opacity-0',
              )}
            >
              {k === kind || !crossfade ? <Scene /> : null}
            </svg>
          )
        })}
      </div>
      {title && (
        <div className="type-meta flex items-center justify-between border-t border-line/50 bg-paper/60 px-5 py-3.5 backdrop-blur-sm">
          <span className="tracking-wide">{title}</span>
          <span className="size-2 rounded-full bg-accent shadow-[0_0_6px_rgba(242,87,28,0.4)]" />
        </div>
      )}
    </div>
  )
}
