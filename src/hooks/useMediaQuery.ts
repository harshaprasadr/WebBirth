import { useSyncExternalStore } from 'react'

export function useMediaQuery(query: string, serverFallback = false): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query)
      mql.addEventListener('change', onChange)
      return () => mql.removeEventListener('change', onChange)
    },
    () => window.matchMedia(query).matches,
    () => serverFallback,
  )
}

export const useReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)')

/** True for a mouse/trackpad: the only case where the custom cursor and hover previews run. */
export const useFinePointer = () => useMediaQuery('(hover: hover) and (pointer: fine)')

export const useIsDesktop = () => useMediaQuery('(min-width: 64rem)')
