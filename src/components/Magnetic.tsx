import { useEffect, useRef, type ReactNode } from 'react'
import { gsap } from '@/lib/gsap'
import { useFinePointer, useReducedMotion } from '@/hooks/useMediaQuery'
import { cn } from '@/lib/cn'

type MagneticProps = {
  children: ReactNode
  /** 0–1: how far the element follows the pointer. */
  strength?: number
  className?: string
}

/** Pulls its child toward the pointer while hovered. No-op on touch / reduced motion. */
export function Magnetic({ children, strength = 0.3, className }: MagneticProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const fine = useFinePointer()
  const reduced = useReducedMotion()

  useEffect(() => {
    const el = ref.current
    if (!el || !fine || reduced) return
    const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3.out' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' })

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      xTo((e.clientX - (r.left + r.width / 2)) * strength)
      yTo((e.clientY - (r.top + r.height / 2)) * strength)
    }
    const onLeave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.4)', overwrite: true })
    }
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    return () => {
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
      gsap.set(el, { x: 0, y: 0 })
    }
  }, [fine, reduced, strength])

  return (
    <span ref={ref} className={cn('inline-block will-change-transform', className)}>
      {children}
    </span>
  )
}
