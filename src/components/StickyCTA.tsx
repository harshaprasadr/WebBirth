import { useEffect, useState } from 'react'
import { useLocation } from 'react-router'
import { ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/cn'
import { ScrollTrigger } from '@/lib/gsap'
import { usePageTransition } from './PageTransition'

/**
 * Phones / tablets only: a compact "Let's talk" pill that appears once the
 * hero has scrolled away and steps aside whenever a section that already
 * offers contact (CTA, contact form, footer — marked data-hides-cta) is visible.
 */
export function StickyCTA() {
  const { go, introDone } = usePageTransition()
  const location = useLocation()
  const [pastHero, setPastHero] = useState(false)
  const [blocked, setBlocked] = useState(false)
  const [reading, setReading] = useState(false)

  useEffect(() => {
    let lastY = window.scrollY
    let idle = 0
    const update = (y: number) => {
      setPastHero(y > window.innerHeight * 0.85)
      // Step aside while the visitor reads downward; return on scroll-up or a pause.
      if (y - lastY > 4) setReading(true)
      else if (lastY - y > 4) setReading(false)
      lastY = y
      window.clearTimeout(idle)
      idle = window.setTimeout(() => setReading(false), 900)
    }
    // Uses ScrollTrigger's shared scroll read instead of its own listener + layout read.
    const st = ScrollTrigger.create({ start: 0, end: 'max', onUpdate: (self) => update(self.scroll()) })
    update(window.scrollY)

    const visible = new Set<Element>()
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target)))
        setBlocked(visible.size > 0)
      },
      { rootMargin: '0px 0px -12% 0px' },
    )
    // Wait a frame so the new route's sections are in the DOM.
    const raf = requestAnimationFrame(() => document.querySelectorAll('[data-hides-cta]').forEach((el) => io.observe(el)))

    return () => {
      st.kill()
      cancelAnimationFrame(raf)
      window.clearTimeout(idle)
      io.disconnect()
    }
  }, [location.key])

  const show = introDone && pastHero && !blocked && !reading

  return (
    <div
      className={cn(
        'pointer-events-none fixed inset-x-0 bottom-0 z-30 flex justify-end px-4 pb-[max(1rem,env(safe-area-inset-bottom))] transition-[opacity,transform] duration-500 ease-[var(--ease-expo)] lg:hidden',
        show ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0',
      )}
    >
      <button
        type="button"
        tabIndex={show ? 0 : -1}
        aria-hidden={!show}
        onClick={() => go('/#contact')}
        className={cn(
          'flex min-h-12 items-center gap-3 rounded-full bg-ink py-1.5 pl-5 pr-1.5 text-[0.78rem] font-medium uppercase tracking-[0.05em] text-paper shadow-[0_12px_40px_-12px_rgba(12,12,13,0.55)]',
          show && 'pointer-events-auto',
        )}
      >
        Let&rsquo;s talk
        <span className="flex size-9 items-center justify-center rounded-full bg-accent text-on-accent" aria-hidden="true">
          <ArrowUpRight className="size-4" strokeWidth={1.75} />
        </span>
      </button>
    </div>
  )
}
