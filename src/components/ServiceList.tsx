import { useRef, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { services } from '@/data/site'
import { useGSAP } from '@/lib/gsap'
import { registerReveals } from '@/animations/reveal'
import { cn } from '@/lib/cn'
import { useFinePointer } from '@/hooks/useMediaQuery'
import { useFollowPointer } from '@/hooks/useFollowPointer'
import { SectionHeader } from './SectionHeader'
import { ServicePreview } from './ServicePreview'

/**
 * 02 — Services as oversized rows. Desktop: hover expands a row and floats a
 * live preview beside the cursor. Touch: rows are disclosure buttons that
 * expand inline with the preview.
 */
export function ServiceList() {
  const scope = useRef<HTMLElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const fine = useFinePointer()
  const [active, setActive] = useState<number | null>(null)
  // Preview rides in the gap left of the arrow column so it never covers a title.
  useFollowPointer(previewRef, fine, 0.8, () => window.innerWidth - Math.min(window.innerWidth * 0.032, 48) - 300)

  useGSAP(() => registerReveals(scope.current!), { scope })

  return (
    <section ref={scope} id="services" aria-labelledby="services-title" className="gutter relative bg-paper section-y">
      <SectionHeader
        id="services-title"
        index="02"
        label="Services"
        title={['Design.', 'Development.', 'Technology.']}
        intro="From concept to launch, WebBirth combines strategy, design and engineering to create digital products that perform."
        titleClassName="uppercase"
        aside={`(${String(services.length).padStart(2, '0')})`}
      />

      <ul className="section-gap border-t border-line" onPointerLeave={() => fine && setActive(null)}>
        {services.map((s, i) => {
          const open = active === i
          const number = String(i + 1).padStart(2, '0')
          return (
            <li key={s.kind} data-reveal="fade" data-start="top 95%" className="relative border-b border-line">
              {/* hover background */}
              <span
                aria-hidden="true"
                className={cn(
                  'absolute inset-x-[calc(clamp(1rem,3.2vw,3rem)*-1)] inset-y-0 origin-bottom bg-paper-2 transition-transform duration-700 ease-[var(--ease-expo)]',
                  open ? 'scale-y-100' : 'scale-y-0',
                )}
              />
              <button
                type="button"
                aria-expanded={open}
                aria-controls={`service-${s.kind}`}
                onPointerEnter={() => fine && setActive(i)}
                onFocus={() => fine && setActive(i)}
                onClick={() => !fine && setActive(open ? null : i)}
                className={cn(
                  'relative grid w-full grid-cols-[2.25rem_minmax(0,1fr)_auto] items-center gap-x-3 text-left transition-[padding] duration-700 ease-[var(--ease-expo)] md:grid-cols-[5rem_1fr_auto]',
                  open ? 'py-[clamp(1.5rem,3vw,2.75rem)]' : 'py-[clamp(1.1rem,2.2vw,2rem)]',
                )}
              >
                <span className="type-meta self-start pt-[0.6em] text-muted">{number}</span>
                <span
                  className={cn(
                    'text-[clamp(min(1.75rem,7.6vw),5.4vw,5.5rem)] lg:text-[clamp(3rem,4.25vw,4.75rem)] font-semibold uppercase leading-[0.92] tracking-[-0.05em] transition-[transform,color] duration-700 ease-[var(--ease-expo)]',
                    open && 'md:translate-x-4',
                  )}
                >
                  {s.title}
                </span>
                <span
                  className={cn(
                    'flex size-11 items-center justify-center rounded-full border transition-all duration-700 ease-[var(--ease-expo)] md:size-16',
                    open ? 'rotate-45 border-ink bg-ink text-paper' : 'border-line',
                  )}
                  aria-hidden="true"
                >
                  <ArrowUpRight className="size-5 md:size-6" strokeWidth={1.25} />
                </span>
              </button>

              <div
                id={`service-${s.kind}`}
                className={cn(
                  'relative grid transition-[grid-template-rows,opacity] duration-700 ease-[var(--ease-expo)]',
                  open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
                )}
              >
                <div className="min-h-0 overflow-hidden">
                  <div className="grid gap-6 pb-8 pl-[calc(2.25rem+0.75rem)] md:grid-cols-12 md:pl-[calc(5rem+0.75rem)]">
                    <p className="type-lead max-w-xl text-ink/70 md:col-span-6">{s.description}</p>
                    <ul className="type-meta flex flex-wrap content-start gap-2 md:col-span-6 md:justify-end lg:col-span-6 lg:col-start-1 lg:justify-start">
                      {s.tags.map((t) => (
                        <li key={t} className="rounded-full border border-line px-3 py-1.5 text-muted">
                          {t}
                        </li>
                      ))}
                    </ul>
                    {!fine && <ServicePreview kind={s.kind} className="md:col-span-8" />}
                  </div>
                </div>
              </div>
            </li>
          )
        })}
      </ul>

      {fine && (
        <div
          ref={previewRef}
          aria-hidden="true"
          className={cn(
            'pointer-events-none fixed left-0 top-0 z-30 w-[17rem] shadow-[0_30px_80px_-30px_rgba(12,12,13,0.35)] transition-[opacity,clip-path] duration-500 ease-[var(--ease-expo)]',
            active === null
              ? 'opacity-0 [clip-path:inset(50%_50%_50%_50%)]'
              : 'opacity-100 [clip-path:inset(0%_0%_0%_0%)]',
          )}
        >
          <ServicePreview
            kind={services[active ?? 0].kind}
            title={services[active ?? 0].title}
            crossfade
            className="border border-line"
          />
        </div>
      )}
    </section>
  )
}
