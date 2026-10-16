import { useEffect, useRef, useState } from 'react'
import { gsap } from '@/lib/gsap'
import { useFinePointer } from '@/hooks/useMediaQuery'
import { cn } from '@/lib/cn'

type Mode = 'default' | 'link' | 'button' | 'view' | 'drag' | 'text' | 'hidden'

const INTERACTIVE = 'a, button, [role="button"], summary, label, select'
const TEXT = 'input:not([type="checkbox"]):not([type="radio"]):not([type="submit"]), textarea'

/**
 * Desktop-only cursor. Opt-in states via attributes on any element:
 *   data-cursor="view" | "drag" | "hidden"     data-cursor-label="View project"
 * Links and buttons are detected automatically.
 */
export function CustomCursor() {
  const fine = useFinePointer()
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const [mode, setMode] = useState<Mode>('default')
  const [label, setLabel] = useState('')
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!fine) return
    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    document.documentElement.classList.add('has-cursor')
    gsap.set([dot, ring], { xPercent: -50, yPercent: -50 })

    const dotX = gsap.quickTo(dot, 'x', { duration: 0.12, ease: 'power3.out' })
    const dotY = gsap.quickTo(dot, 'y', { duration: 0.12, ease: 'power3.out' })
    const ringX = gsap.quickTo(ring, 'x', { duration: 0.5, ease: 'power3.out' })
    const ringY = gsap.quickTo(ring, 'y', { duration: 0.5, ease: 'power3.out' })

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      dotX(e.clientX)
      dotY(e.clientY)
      ringX(e.clientX)
      ringY(e.clientY)
      setVisible(true)
    }

    const resolve = (target: EventTarget | null) => {
      const el = target instanceof Element ? target : null
      const explicit = el?.closest<HTMLElement>('[data-cursor]')
      if (explicit) {
        setMode((explicit.dataset.cursor as Mode) ?? 'default')
        setLabel(explicit.dataset.cursorLabel ?? (explicit.dataset.cursor === 'drag' ? 'Drag' : 'View'))
        return
      }
      if (el?.closest(TEXT)) return setMode('text')
      const interactive = el?.closest<HTMLElement>(INTERACTIVE)
      if (interactive) return setMode(interactive.matches('button, [role="button"]') ? 'button' : 'link')
      setMode('default')
    }

    const onOver = (e: PointerEvent) => resolve(e.target)
    const onLeaveWindow = () => setVisible(false)
    const onDown = () => gsap.to(ring, { scale: 0.85, duration: 0.2 })
    const onUp = () => gsap.to(ring, { scale: 1, duration: 0.5, ease: 'elastic.out(1, 0.5)' })

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerover', onOver, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeaveWindow)
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)

    return () => {
      document.documentElement.classList.remove('has-cursor')
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerover', onOver)
      document.documentElement.removeEventListener('pointerleave', onLeaveWindow)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
    }
  }, [fine])

  if (!fine) return null

  const labelled = mode === 'view' || mode === 'drag'

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[100]">
      <div
        ref={ringRef}
        className={cn(
          'absolute left-0 top-0 flex items-center justify-center rounded-full transition-[width,height,background-color,border-color,opacity] duration-500 ease-[var(--ease-expo)]',
          !labelled && 'border border-white mix-blend-difference',
          labelled && 'bg-accent text-on-accent',
          mode === 'default' && 'size-9',
          mode === 'link' && 'size-12 bg-white',
          mode === 'button' && 'size-[4.5rem]',
          mode === 'text' && 'size-2 opacity-0',
          mode === 'view' && 'size-28',
          mode === 'drag' && 'size-24',
          (mode === 'hidden' || !visible) && 'opacity-0',
        )}
      >
        <span
          className={cn(
            'type-meta whitespace-nowrap text-[0.62rem] transition-[opacity,transform] duration-300',
            labelled ? 'scale-100 opacity-100 delay-100' : 'scale-50 opacity-0',
          )}
        >
          {mode === 'drag' ? `← ${label} →` : label}
        </span>
      </div>
      <div
        ref={dotRef}
        className={cn(
          'absolute left-0 top-0 size-1.5 rounded-full bg-white mix-blend-difference transition-opacity duration-300',
          (mode !== 'default' || !visible) && 'opacity-0',
        )}
      />
    </div>
  )
}
