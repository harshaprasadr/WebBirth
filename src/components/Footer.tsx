import { useRef } from 'react'
import { ArrowUp } from 'lucide-react'
import { company, socials } from '@/data/site'
import { blogUrl } from '@/data/posts'
import { gsap, useGSAP } from '@/lib/gsap'
import { prefersReducedMotion } from '@/lib/env'
import { TransitionLink, usePageTransition } from './PageTransition'
import { useSmoothScroll } from './SmoothScroll'
import { Magnetic } from './Magnetic'

const footerNavItems = [
  { label: 'Home', to: '/' },
  { label: 'Work', to: '/#work' },
  { label: 'Services', to: '/#services' },
  { label: 'About', to: '/#about' },
  { label: 'Testimonials', to: '/testimonials' },
  { label: 'Careers', to: '/careers' },
  { label: 'Blogs', to: blogUrl, external: true },
  { label: 'Contact', to: '/#contact' },
] as const

export function Footer() {
  const scope = useRef<HTMLElement>(null)
  const { go } = usePageTransition()
  const { scrollTo } = useSmoothScroll()
  const year = new Date().getFullYear()

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      gsap.from('[data-footer-letter]', {
        yPercent: 100,
        stagger: 0.04,
        duration: 1.4,
        ease: 'expo.out',
        scrollTrigger: { trigger: '[data-footer-mark]', start: 'top 98%', once: true },
      })
    },
    { scope },
  )

  return (
    <footer ref={scope} data-hides-cta data-nav-theme="dark" className="gutter relative overflow-clip bg-ink pt-12 text-paper sm:pt-[clamp(3.5rem,6vw,5.5rem)]">
      <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:border-t sm:border-line-dark sm:pt-10 lg:grid-cols-12">
        <div className="col-span-2 lg:col-span-4">
          <p className="text-[clamp(1.6rem,2.6vw,2.4rem)] font-medium leading-[1.05] tracking-[-0.04em]">
            Software development.
            <br />
            Digital products.
            <br />
            <span className="text-paper/45">Technology.</span>
          </p>
        </div>

        <nav aria-label="Footer" className="col-span-1 lg:col-span-2 lg:col-start-6">
          <p className="type-meta mb-4 text-muted-dark">Navigate</p>
          <ul className="flex flex-col">
            {footerNavItems.map((n) => (
              <li key={n.label}>
                {'external' in n && n.external ? (
                  <a
                    href={n.to}
                    target="_blank"
                    rel="noreferrer"
                    className="group inline-flex min-h-11 items-center gap-1 lg:min-h-9"
                  >
                    <span className="link-reveal">{n.label}</span>
                    <span
                      aria-hidden="true"
                      className="text-paper/50 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                    >
                      ↗
                    </span>
                  </a>
                ) : (
                  <a
                    href={n.to}
                    onClick={(e) => {
                      e.preventDefault()
                      go(n.to)
                    }}
                    className="inline-flex min-h-11 items-center lg:min-h-9"
                  >
                    <span className="link-reveal">{n.label}</span>
                  </a>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="col-span-1 lg:col-span-2">
          <p className="type-meta mb-4 text-muted-dark">Social</p>
          <ul className="flex flex-col">
            {socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center lg:min-h-9">
                  <span className="link-reveal">{s.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="col-span-2 flex flex-col justify-between gap-8 sm:flex-row sm:items-end lg:col-span-3 lg:col-start-10 lg:flex-col lg:items-start">
          <div>
            <p className="type-meta mb-4 text-muted-dark">Say hello</p>
            <a href={`mailto:${company.email}`} className="inline-flex min-h-11 items-center text-xl font-medium">
              <span className="link-reveal">{company.email}</span>
            </a>
            <a href={`tel:${company.phones[0].replace(/\s/g, '')}`} className="flex min-h-11 items-center text-paper/60 hover:text-paper">
              {company.phones[0]}
            </a>
          </div>
          <Magnetic className="self-start">
            <button
              type="button"
              onClick={() => scrollTo(0)}
              className="type-meta group flex min-h-11 items-center gap-3"
              aria-label="Back to top"
            >
              <span className="flex size-11 items-center justify-center rounded-full border border-line-dark transition-colors duration-500 group-hover:border-paper group-hover:bg-paper group-hover:text-ink">
                <ArrowUp className="size-4" strokeWidth={1.5} />
              </span>
              Back to top
            </button>
          </Magnetic>
        </div>
      </div>

      <div data-footer-mark aria-hidden="true" className="mt-[clamp(3rem,6vw,5rem)] flex select-none items-start justify-between overflow-clip">
        {'WEBBIRTH'.split('').map((l, i) => (
          <span
            key={i}
            data-footer-letter
            className="inline-block text-[clamp(4rem,18.2vw,22rem)] font-semibold leading-[0.78] tracking-[-0.06em]"
          >
            {l}
          </span>
        ))}
        <span data-footer-letter className="mt-[0.05em] inline-block text-[clamp(1rem,3.5vw,3.5rem)] font-medium leading-none">®</span>
      </div>

      <div className="type-meta flex flex-col gap-3 border-t border-line-dark py-6 text-muted-dark sm:flex-row sm:items-center sm:justify-between">
        <p>© {year} WebBirth. All rights reserved.</p>
        <p className="hidden md:block">
          {company.city}, {company.country}
        </p>
        <ul className="-mx-2 flex">
          <li>
            <TransitionLink to="/privacy" className="flex min-h-11 items-center px-2">
              <span className="link-reveal">Privacy Policy</span>
            </TransitionLink>
          </li>
          <li>
            <TransitionLink to="/terms" className="flex min-h-11 items-center px-2">
              <span className="link-reveal">Terms</span>
            </TransitionLink>
          </li>
        </ul>
      </div>
    </footer>
  )
}
