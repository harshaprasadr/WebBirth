import { useEffect } from 'react'

/**
 * Flags top-level page sections that are out of view with `data-offscreen`;
 * index.css pauses every CSS animation inside them. Infinite decorative loops
 * otherwise keep recalculating styles every frame even when nobody can see them.
 */
export function useOffscreenPause() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.target.toggleAttribute('data-offscreen', !e.isIntersecting)),
      { rootMargin: '120px 0px' },
    )
    // Wait a frame so pin spacers and lazily mounted sections are in place.
    const raf = requestAnimationFrame(() => {
      document.querySelectorAll('#main > *, #main > .pin-spacer > *, footer').forEach((el) => io.observe(el))
    })
    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
    }
  }, [])
}
