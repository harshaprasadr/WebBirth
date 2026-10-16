import { useEffect, useRef } from 'react'
import { ScrollTrigger } from '@/lib/gsap'

/** Hairline reading-progress indicator pinned to the top edge. */
export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Rides ScrollTrigger's single scroll read per frame instead of reading scroll/layout itself.
    const st = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        if (barRef.current) barRef.current.style.transform = `scaleX(${self.progress})`
      },
    })
    return () => st.kill()
  }, [])

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px]">
      <div ref={barRef} className="h-full origin-left scale-x-0 bg-accent" />
    </div>
  )
}
