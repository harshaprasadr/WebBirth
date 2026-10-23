import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router'
import { AnimatePresence, motion } from 'framer-motion'
import { navItems, company, socials } from '@/data/site'
import { cn } from '@/lib/cn'
import { ScrollTrigger } from '@/lib/gsap'
import { useLocalTime } from '@/hooks/useLocalTime'
import { Magnetic } from './Magnetic'
import { TransitionLink, usePageTransition } from './PageTransition'
import { useSmoothScroll } from './SmoothScroll'

/** Brand mark (W + location pin) used in the navbar, intro curtain and footer. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <picture>
      <source srcSet="/brand/webbirth-mark.webp?v=2" type="image/webp" />
      <img
        src="/brand/webbirth-mark.png?v=2"
        alt=""
        width={131}
        height={96}
        decoding="async"
        className={cn('h-[1.6em] w-auto select-none', className)}
        draggable={false}
      />
    </picture>
  )
}

export function Wordmark({ className, mark = true }: { className?: string; mark?: boolean }) {
  return (
    <span className={cn('inline-flex items-center gap-2.5 font-semibold tracking-[-0.045em]', className)}>
      {mark && <LogoMark className="transition-transform duration-700 ease-[var(--ease-expo)] group-hover:-rotate-6" />}
      <span className="inline-flex items-start">
        WEBBIRTH
        <sup className="ml-0.5 mt-[0.15em] text-[0.45em] font-medium tracking-normal">®</sup>
      </span>
    </span>
  )
}

export function Availability({ className }: { className?: string }) {
  return (
    <span className={cn('type-meta inline-flex items-center gap-2', className)}>
      <span className="pulse-dot size-[7px] rounded-full bg-green-500" aria-hidden="true" />
      Available for projects
    </span>
  )
}

const NAV_PROBE = 36

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.064 2.064 0 1 1 0-4.128 2.064 2.064 0 0 1 0 4.128zm1.782 13.019H3.555V9h3.564v11.452z" />
    </svg>
  )
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  )
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M13.5 22V12.75h3.11l.465-3.614H13.5V6.83c0-.987.323-1.724 1.758-1.724l1.877-.001V1.876c-.325-.044-1.44-.14-2.738-.14-2.71 0-4.566 1.654-4.566 4.693v2.707H6.75v3.614h3.081V22h3.669z" />
    </svg>
  )
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.979-.276-.1-.477-.15-.678.15-.2.301-.778.979-.954 1.18-.176.2-.351.226-.652.075-.301-.15-1.272-.469-2.423-1.496-.895-.798-1.5-1.784-1.676-2.085-.175-.301-.019-.464.132-.614.136-.135.301-.351.452-.527.15-.175.2-.3.301-.501.1-.2.05-.376-.025-.526-.075-.15-.678-1.631-.929-2.233-.244-.587-.493-.507-.678-.517-.176-.009-.377-.01-.577-.01s-.527.075-.803.376c-.276.301-1.054 1.03-1.054 2.513 0 1.483 1.079 2.914 1.23 3.115.15.2 2.123 3.242 5.143 4.546.718.311 1.279.497 1.716.636.721.23 1.377.197 1.896.12.578-.087 1.78-.728 2.031-1.431.251-.703.251-1.305.176-1.431-.075-.126-.276-.201-.577-.351z" />
      <path d="M12.004 2C6.486 2 2.008 6.478 2.008 12c0 1.954.564 3.78 1.54 5.325L2 22l4.82-1.503A9.957 9.957 0 0 0 12.004 22C17.522 22 22 17.522 22 12c0-5.522-4.478-10-9.996-10zm0 18.026a8.006 8.006 0 0 1-4.103-1.125l-.294-.175-3.056.953.97-2.97-.191-.307A8.006 8.006 0 1 1 12.004 20.026z" />
    </svg>
  )
}

const SOCIAL_ICONS: Record<string, (props: { className?: string }) => React.JSX.Element> = {
  LinkedIn: LinkedInIcon,
  Instagram: InstagramIcon,
  Facebook: FacebookIcon,
  'X': XIcon,
  WhatsApp: WhatsAppIcon,
}

export function Navbar() {
  const location = useLocation()
  const { go, introDone } = usePageTransition()
  const { stop, start } = useSmoothScroll()
  const time = useLocalTime(company.timezone)
  const [dark, setDark] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const lastY = useRef(0)

  // Theme flips over dark sections; hides on scroll down, returns on scroll up.
  useEffect(() => {
    let lastProbe = -Infinity
    let settle = 0
    // Rect reads force layout, so the theme/active-section probe runs ~8×/s plus once after scrolling stops.
    const probe = () => {
      const y = window.scrollY
      const darkEls = document.querySelectorAll<HTMLElement>('[data-nav-theme="dark"]')
      let isDark = false
      darkEls.forEach((el) => {
        const r = el.getBoundingClientRect()
        if (r.top <= NAV_PROBE && r.bottom >= NAV_PROBE) isDark = true
      })
      setDark(isDark)

      let current: string | null = null
      navItems.forEach(({ id }) => {
        const r = document.getElementById(id)?.getBoundingClientRect()
        if (r && r.top <= window.innerHeight * 0.4 && r.bottom > window.innerHeight * 0.4) current = id
      })
      if (!current && location.pathname === '/' && y < 120) {
        current = 'home'
      }
      setActive(
        location.pathname.startsWith('/work')
          ? 'work'
          : location.pathname === '/careers'
            ? 'careers'
            : current,
      )
    }
    const update = (y: number) => {
      setScrolled(y > 40)
      const now = performance.now()
      if (now - lastProbe > 120) {
        lastProbe = now
        probe()
      }
      window.clearTimeout(settle)
      settle = window.setTimeout(probe, 150)

      const delta = y - lastY.current
      if (Math.abs(delta) > 6) setHidden(delta > 0 && y > window.innerHeight * 0.6)
      lastY.current = y
    }
    // Driven by ScrollTrigger's shared per-frame scroll read (no separate scroll listener / layout read).
    const st = ScrollTrigger.create({ start: 0, end: 'max', onUpdate: (self) => update(self.scroll()) })
    update(window.scrollY)
    return () => {
      st.kill()
      window.clearTimeout(settle)
    }
  }, [location.pathname])

  // Lock scroll + close on Escape while the mobile menu is open.
  useEffect(() => {
    if (!open) return
    stop()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    // aria-modal alone doesn't stop Tab: make everything except the header (menu toggle) and the menu inert.
    const header = document.querySelector('header')
    const menu = document.getElementById('mobile-menu')
    const outside = header?.parentElement
      ? [...header.parentElement.children].filter((el) => el !== header && el !== menu && !el.contains(menu))
      : []
    outside.forEach((el) => el.setAttribute('inert', ''))
    return () => {
      start()
      window.removeEventListener('keydown', onKey)
      outside.forEach((el) => el.removeAttribute('inert'))
    }
  }, [open, start, stop])

  useEffect(() => setOpen(false), [location.key])

  const navTo = (to: string) => {
    if (!open) return go(to)
    // Let the menu release its scroll lock before travelling.
    setOpen(false)
    window.setTimeout(() => go(to), 380)
  }

  return (
    <>
      <header
        className={cn(
          'gutter fixed inset-x-0 top-0 z-50 transition-[transform,color,opacity] duration-700 ease-[var(--ease-expo)]',
          dark || open ? 'text-paper' : 'text-ink',
          hidden && !open ? '-translate-y-full' : 'translate-y-0',
          introDone ? 'opacity-100' : 'opacity-0',
        )}
      >
        <div
          aria-hidden="true"
          className={cn(
            'absolute inset-0 -z-10 backdrop-blur-md transition-[opacity,background-color] duration-500',
            dark ? 'border-b border-line-dark bg-ink/85' : 'border-b border-line bg-paper/85',
            scrolled && !open ? 'opacity-100' : 'opacity-0',
          )}
        />
        <nav
          aria-label="Primary"
          className={cn(
            'flex items-center justify-between gap-6 transition-[height] duration-500 ease-[var(--ease-expo)]',
            scrolled && !open ? 'h-16' : 'h-[4.5rem] lg:h-[5.25rem]',
          )}
        >
          <TransitionLink
            to="/"
            aria-label="WebBirth — home"
            className="group -my-2 flex min-h-11 items-center text-[1.15rem] leading-none"
            onClick={(e) => {
              if (location.pathname === '/') {
                e.preventDefault()
                setOpen(false)
                go('/')
              }
            }}
          >
            <Wordmark />
          </TransitionLink>

          <ul className="hidden items-center gap-[clamp(1.5rem,2.8vw,3rem)] lg:flex">
            {navItems.map((item) => {
              const current = active === item.id
              return (
                <li key={item.id}>
                  <Magnetic strength={0.2}>
                    <a
                      href={item.to}
                      onClick={(e) => {
                        e.preventDefault()
                        navTo(item.to)
                      }}
                      aria-current={current ? 'true' : undefined}
                      className="group relative flex items-center gap-2 py-2"
                    >
                      <span className="relative block h-[1.25em] overflow-y-clip text-[0.95rem] font-medium tracking-[-0.018em] leading-[1.25em]">
                        <span
                          className={cn(
                            'block transition-transform duration-500 ease-[var(--ease-expo)] group-hover:-translate-y-full',
                            current ? 'font-semibold text-current' : 'text-current/85 group-hover:text-current',
                          )}
                        >
                          {item.label}
                        </span>
                        <span
                          aria-hidden="true"
                          className="absolute inset-x-0 top-full block font-semibold text-accent transition-transform duration-500 ease-[var(--ease-expo)] group-hover:-translate-y-full"
                        >
                          {item.label}
                        </span>
                      </span>

                      {/* Active / hover bottom underline indicator */}
                      <span
                        aria-hidden="true"
                        className={cn(
                          'absolute -bottom-0.5 left-0 right-0 h-[2px] rounded-full bg-accent transition-all duration-400 ease-[var(--ease-expo)]',
                          current ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-100 origin-left',
                        )}
                      />
                    </a>
                  </Magnetic>
                </li>
              )
            })}
          </ul>

          <div className="hidden items-center gap-6 lg:flex">
            <span className="type-meta tabular-nums opacity-50">
              BLR {time}
            </span>
            <Availability />
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="-mr-2 flex min-h-11 items-center px-2 lg:hidden"
          >
            <span className="relative block h-2.5 w-5" aria-hidden="true">
              <span
                className={cn(
                  'absolute left-0 h-px w-full bg-current transition-transform duration-500',
                  open ? 'top-1/2 rotate-45' : 'top-0',
                )}
              />
              <span
                className={cn(
                  'absolute left-0 h-px w-full bg-current transition-transform duration-500',
                  open ? 'top-1/2 -rotate-45' : 'bottom-0',
                )}
              />
            </span>
          </button>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-0 z-40 flex h-[100dvh] flex-col overflow-y-auto overflow-x-hidden overscroll-contain bg-[#0a0807] text-paper lg:hidden"
            initial={{ clipPath: 'circle(0% at calc(100% - 2.5rem) 2.25rem)' }}
            animate={{ clipPath: 'circle(150% at calc(100% - 2.5rem) 2.25rem)' }}
            exit={{ clipPath: 'circle(0% at calc(100% - 2.5rem) 2.25rem)' }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          >
            {/* atmosphere: warm glow + slow-turning mark watermark */}
            <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden">
              <div className="absolute -bottom-[18%] -left-[20%] size-[95vw] rounded-full glow opacity-25" />
              <img
                src="/brand/webbirth-mark-lg.webp?v=2"
                alt=""
                className="absolute -right-[22%] top-[30%] w-[85vw] max-w-[28rem] animate-[spin_80s_linear_infinite] opacity-[0.06]"
              />
            </div>

            <nav aria-label="Mobile" className="gutter relative flex flex-1 flex-col pt-[4.75rem]">
              <ul className="flex flex-1 flex-col justify-center py-2">
                {navItems.map((item, i) => {
                  const current = active === item.id
                  return (
                    <li key={item.id} className="flex max-h-[7.5rem] min-h-[3.75rem] flex-1 items-center border-b border-white/10 first:border-t">
                      <span className="block w-full overflow-clip">
                        <motion.a
                          href={item.to}
                          onClick={(e) => {
                            e.preventDefault()
                            navTo(item.to)
                          }}
                          aria-current={current ? 'true' : undefined}
                          aria-label={item.label}
                          className="group flex min-h-14 items-center gap-4"
                          exit={{ y: '-110%', transition: { duration: 0.35, ease: [0.76, 0, 0.24, 1] } }}
                        >
                          <span aria-hidden="true" className="relative block flex-1 overflow-y-clip text-[min(10vw,7svh)] leading-[1.02]">
                            {/* resting label: sans (or italic serif when current), letters flip in */}
                            <span
                              className={cn(
                                'flex transition-transform duration-500 ease-[var(--ease-expo)] [perspective:600px] group-active:-translate-y-full',
                                current ? 'font-serif italic tracking-[-0.02em] text-accent' : 'font-semibold tracking-[-0.05em] text-paper',
                              )}
                            >
                              {item.label.split('').map((ch, k) => (
                                <motion.span
                                  key={k}
                                  className="inline-block origin-bottom"
                                  initial={{ y: '100%', rotateX: -80, opacity: 0 }}
                                  animate={{ y: 0, rotateX: 0, opacity: 1 }}
                                  transition={{ duration: 0.8, delay: 0.25 + i * 0.08 + k * 0.025, ease: [0.19, 1, 0.22, 1] }}
                                >
                                  {ch}
                                </motion.span>
                              ))}
                            </span>
                            {/* pressed: rolls up into orange italic serif */}
                            <span className="absolute inset-x-0 top-full block font-serif italic tracking-[-0.02em] text-accent transition-transform duration-500 ease-[var(--ease-expo)] group-active:-translate-y-full">
                              {item.label}
                            </span>
                          </span>
                          <span
                            aria-hidden="true"
                            className={cn(
                              'flex size-10 shrink-0 items-center justify-center rounded-full border text-sm transition-transform duration-500 ease-[var(--ease-expo)] group-active:rotate-45',
                              current ? 'border-accent text-accent' : 'border-white/15 text-paper/70',
                            )}
                          >
                            ↗
                          </span>
                        </motion.a>
                      </span>
                    </li>
                  )
                })}
              </ul>
            </nav>

            <motion.div
              className="gutter relative flex flex-col gap-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.55, duration: 0.7, ease: [0.19, 1, 0.22, 1] } }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
            >
              <button
                type="button"
                onClick={() => navTo('/#contact')}
                className="flex min-h-14 items-center justify-between rounded-full bg-accent pl-6 pr-2 text-sm font-medium uppercase tracking-[0.05em] text-on-accent active:scale-[0.98]"
              >
                Start a project
                <span className="flex size-10 items-center justify-center rounded-full bg-ink text-paper" aria-hidden="true">
                  →
                </span>
              </button>

              <div className="flex items-center justify-between gap-3 border-t border-white/10 pt-4">
                <a href={`mailto:${company.email}`} className="flex min-h-11 min-w-0 items-center truncate text-base font-medium tracking-tight">
                  {company.email}
                </a>
                <span className="type-meta flex shrink-0 items-center gap-2 text-paper/60">
                  <span className="pulse-dot size-[7px] rounded-full bg-green-500" aria-hidden="true" />
                  Available
                </span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="type-meta shrink-0 tabular-nums text-paper/40 max-[359px]:hidden">BLR {time}</span>
                <ul className="flex items-center gap-1.5 min-[380px]:gap-2 max-[359px]:w-full max-[359px]:justify-between" aria-label="Social links">
                  {socials.map((s) => {
                    const Icon = SOCIAL_ICONS[s.label]
                    return (
                      <li key={s.label}>
                        <a
                          href={s.href}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={s.label}
                          className="group relative flex size-10 min-[380px]:size-11 items-center justify-center rounded-full border border-white/12 bg-white/[0.04] text-paper/80 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)] backdrop-blur-sm transition-all duration-300 ease-[var(--ease-expo)] hover:border-accent/60 hover:bg-accent/15 hover:text-accent hover:shadow-[0_0_20px_rgba(242,87,28,0.32),inset_0_1px_0_0_rgba(255,255,255,0.18)] active:scale-90 active:border-accent active:bg-accent active:text-on-accent active:shadow-[0_0_24px_rgba(242,87,28,0.5)]"
                        >
                          {Icon ? (
                            <Icon className="size-[1.12rem] transition-transform duration-300 ease-[var(--ease-expo)] group-hover:scale-110 group-active:scale-95" />
                          ) : (
                            <span className="type-meta text-[0.62rem]">{s.label.slice(0, 2)}</span>
                          )}
                        </a>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
