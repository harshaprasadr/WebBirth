// Generated: live-site captures (desktop full page + mobile) where the client site is
// still live and matches the portfolio; otherwise the screen cropped from the portfolio mockup.
export type ShowcaseAsset = {
  kind: 'live' | 'crop' | 'app'
  desktop?: { w: number; h: number }
  mobile?: { w: number; h: number }
  /** Store screenshots fanned on the brand tone (4:3) — used where only the app is shown. */
  apps?: { w: number; h: number }
}

const site = (h = 2833) => ({ kind: 'live' as const, desktop: { w: 1200, h } })
const appScreens = { w: 1600, h: 1200 }

export const showcase: Record<string, ShowcaseAsset> = {
  // ── No live URL — cropped mockups (unchanged) ─────────────────────────────
  mediify: { kind: 'crop', desktop: { w: 1200, h: 553 } },
  cazenest: { kind: 'crop', desktop: { w: 1200, h: 564 } },
  'zenith-health': { kind: 'crop', desktop: { w: 1200, h: 609 } },

  // ── Live captures (Oct 2026) ──────────────────────────────────────────────
  westvox: site(5103),
  'ashtalakshmi-temple': site(3324),
  'aspen-capital': site(3590),
  '1960-physician-associates': site(2682),
  'good-roll-golf': site(4534),
  'generation-purple': site(7029),
  documintq: site(9551),
  easymarg: site(4846),
  parinitha: site(5254),
  cadmaxx: site(5773),
  'home-captain': site(12270),
  'classify-interiors': site(9544),
  'realty-streams': site(5178),
  'first-wave-fries': site(7597),
  'fit-muscle': site(10096),
  'alai-rescues': site(6709),
  'enrich-global-academy': site(5711),

  // ── Live captures with mobile ─────────────────────────────────────────────
  doczee: { kind: 'live', desktop: { w: 1200, h: 13768 }, mobile: { w: 420, h: 2681 }, apps: appScreens },
  'sanchara-mitra': { kind: 'live', desktop: { w: 1200, h: 4586 }, mobile: { w: 420, h: 2738 }, apps: appScreens },
  bussguru: { kind: 'live', desktop: { w: 1200, h: 1996 }, mobile: { w: 420, h: 2681 }, apps: appScreens },
  girani: { kind: 'live', desktop: { w: 1200, h: 3715 }, mobile: { w: 420, h: 2566 }, apps: appScreens },
  'ramanuja-kuteera': { kind: 'live', desktop: { w: 1200, h: 4446 }, mobile: { w: 420, h: 2526 }, apps: appScreens },
  'swa-adhyay': { kind: 'live', desktop: { w: 1200, h: 4365 } },
  'superior-solar': { kind: 'live', desktop: { w: 1200, h: 6720 } },

  // ── App only ──────────────────────────────────────────────────────────────
  'sanchara-mitra-mechanic': { kind: 'app', apps: appScreens },
}

export const showcaseSrc = (slug: string, view: 'desktop' | 'mobile' | 'apps', small = false) =>
  `/projects/showcase/${slug}-${view}${small ? '-640' : ''}.webp`
