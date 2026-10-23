import { gsap, SplitText } from '@/lib/gsap'
import { prefersReducedMotion } from '@/lib/env'

/**
 * Declarative scroll reveals. Call inside useGSAP() so everything is reverted
 * on unmount. Opt elements in with data attributes:
 *
 *  data-reveal="lines"   masked line-by-line reveal (SplitText, re-splits on resize)
 *  data-reveal="words"   masked word-by-word reveal
 *  data-reveal="fade"    fade + rise
 *  data-reveal="clip"    clip-path wipe from bottom with a slight inner scale
 *  data-reveal="line"    hairline drawing left → right
 *
 * Optional: data-delay="0.2", data-start="top 80%"
 */
export function registerReveals(scope: Element) {
  const reduced = prefersReducedMotion()
  const isMobile = window.innerWidth < 768
  const items = gsap.utils.toArray<HTMLElement>('[data-reveal]', scope)

  items.forEach((el) => {
    const type = el.dataset.reveal
    const delay = Number(el.dataset.delay ?? 0)
    const start = el.dataset.start ?? 'top 86%'
    const scrollTrigger = { trigger: el, start, once: true }

    if (reduced) {
      gsap.from(el, { autoAlpha: 0, duration: 0.6, ease: 'none', delay, scrollTrigger })
      return
    }

    switch (type) {
      case 'lines':
      case 'words': {
        const by = type === 'lines' ? 'lines' : 'words'
        SplitText.create(el, {
          type: by === 'lines' ? 'lines' : 'words,lines',
          mask: by,
          autoSplit: true,
          linesClass: 'split-line',
          onSplit(self) {
            return gsap.from(by === 'lines' ? self.lines : self.words, {
              yPercent: 115,
              rotate: 2,
              duration: 1.25,
              stagger: by === 'lines' ? 0.09 : 0.035,
              ease: 'expo.out',
              delay,
              scrollTrigger,
            })
          },
        })
        break
      }
      case 'clip': {
        const inner = el.querySelector<HTMLElement>('[data-reveal-inner]')
        const tl = gsap.timeline({ delay, scrollTrigger: { ...scrollTrigger, start: el.dataset.start ?? 'top 90%' } })
        tl.fromTo(
          el,
          { clipPath: 'inset(100% 0% 0% 0%)' },
          { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'expo.inOut' },
        )
        if (inner) tl.fromTo(inner, { scale: 1.25 }, { scale: 1, duration: 1.8, ease: 'expo.out' }, 0.1)
        break
      }
      case 'line':
        gsap.fromTo(
          el,
          { scaleX: 0, transformOrigin: 'left center' },
          { scaleX: 1, duration: 1.4, ease: 'expo.inOut', delay, scrollTrigger },
        )
        break
      default:
        gsap.from(el, { y: isMobile ? 24 : 36, autoAlpha: 0, duration: isMobile ? 0.8 : 1.1, ease: 'expo.out', delay, scrollTrigger })
    }
  })
}

/** Gentle vertical parallax for elements with data-parallax="<-1..1 speed>". */
export function registerParallax(scope: Element) {
  if (prefersReducedMotion()) return
  gsap.utils.toArray<HTMLElement>('[data-parallax]', scope).forEach((el) => {
    const speed = Number(el.dataset.parallax || 0.15)
    gsap.fromTo(
      el,
      { yPercent: -speed * 50 },
      {
        yPercent: speed * 50,
        ease: 'none',
        scrollTrigger: { trigger: el.parentElement ?? el, start: 'top bottom', end: 'bottom top', scrub: true },
      },
    )
  })
}
