import { useEffect, useState, type RefObject } from 'react'

let cached: boolean | null = null

/** True when the browser can create a WebGL context (checked once). */
export function hasWebGL() {
  if (cached !== null) return cached
  try {
    const c = document.createElement('canvas')
    cached = !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')))
  } catch {
    cached = false
  }
  return cached
}

/**
 * Mutable bridge between GSAP/ScrollTrigger and the 3D scenes. Scenes read it
 * inside useFrame, so scroll never triggers React renders.
 */
export const sceneState = {
  /** Hero: 0 at top → 1 when the hero has scrolled out. */
  heroScroll: 0,
  /** Spark → System: 0 (galaxy) → 1 (logo) → 2 (system grid). */
  morph: 0,
}

/** Whether an element is near the viewport — used to pause offscreen canvases. */
export function useNearViewport(ref: RefObject<Element | null>, margin = '200px') {
  const [near, setNear] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setNear(e.isIntersecting), { rootMargin: margin })
    io.observe(el)
    return () => io.disconnect()
  }, [ref, margin])
  return near
}
