export const canUseDOM = typeof window !== 'undefined'

export const prefersReducedMotion = () =>
  canUseDOM && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export const hasFinePointer = () =>
  canUseDOM && window.matchMedia('(hover: hover) and (pointer: fine)').matches

/** Desktop breakpoint used for pinned / horizontal choreography. */
export const DESKTOP_QUERY = '(min-width: 64rem)'
