import { useEffect, type RefObject } from 'react'
import { gsap } from '@/lib/gsap'

/**
 * Makes a fixed-position element trail the pointer while `active`.
 * The element should be `position: fixed; left: 0; top: 0`.
 * Pass `pinX` to hold the element at a fixed horizontal position (it then only follows vertically).
 */
export function useFollowPointer(
  ref: RefObject<HTMLElement | null>,
  enabled: boolean,
  lag = 0.65,
  pinX?: () => number,
) {
  useEffect(() => {
    const el = ref.current
    if (!el || !enabled) return
    gsap.set(el, { xPercent: -50, yPercent: -50 })
    const xTo = gsap.quickTo(el, 'x', { duration: lag, ease: 'power3.out' })
    const yTo = gsap.quickTo(el, 'y', { duration: lag, ease: 'power3.out' })
    const rTo = gsap.quickTo(el, 'rotate', { duration: 0.9, ease: 'power3.out' })
    let lastX = 0
    const onMove = (e: PointerEvent) => {
      xTo(pinX ? pinX() : e.clientX)
      yTo(e.clientY)
      rTo(gsap.utils.clamp(-6, 6, (e.clientX - lastX) * 0.3))
      lastX = e.clientX
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, enabled, lag])
}
