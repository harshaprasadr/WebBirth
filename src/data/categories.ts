export type WorkCategory = {
  id: string
  number: string
  title: string
  slug: string
  tagline: string
  description: string
  projectSlugs: string[]
  isAppCategory?: boolean
  isComingSoon?: boolean
}

export const workCategories: WorkCategory[] = [
  {
    id: 'cat-1',
    number: '01',
    title: 'Legal, Healthcare & Enterprise · USA',
    slug: 'legal-healthcare-enterprise',
    tagline: 'High-compliance platforms, legal management workspaces & clinical portals built for North American organizations.',
    description:
      'Engineered for rigorous compliance, data privacy, and heavy daily workflows across legal case teams, healthcare networks, and enterprise operations in the United States.',
    projectSlugs: [
      'mediify',
      'cazenest',
      'zenith-health',
      'westvox',
      'intakepilots',
      'ashtalakshmi-temple',
      'aspen-capital',
      'worth-and-right',
      '1960-physician-associates',
      'good-roll-golf',
    ],
  },
  {
    id: 'cat-2',
    number: '02',
    title: 'AI, Fintech & Productivity',
    slug: 'ai-fintech-productivity',
    tagline: 'Algorithmic investment systems, SaaS document engines & engineering intelligence suites.',
    description:
      'Precision digital infrastructure for investment portfolios, international financial transactions, automated legal document lifecycle pipelines, and engineering R&D.',
    projectSlugs: [
      'generation-purple',
      'documintq',
      'itransfer',
      'easymarg',
      'parinitha',
      'cadmaxx',
    ],
  },
  {
    id: 'cat-3',
    number: '03',
    title: 'Marketplaces, Booking & Commerce',
    slug: 'marketplaces-booking-commerce',
    tagline: 'High-velocity transaction hubs, multi-vendor marketplaces, property portals & consumer storefronts.',
    description:
      'Omnichannel commerce platforms with multi-vendor architectures, live transit tracking, real estate listings, and integrated customer & vendor applications.',
    projectSlugs: [
      'home-captain',
      'doczee',
      'sanchara-mitra',
      'bussguru',
      'girani',
      'ramanuja-kuteera',
      'classify-interiors',
      'realty-streams',
      'superior-solar',
      'first-wave-fries',
      'fit-muscle',
    ],
  },
  {
    id: 'cat-4',
    number: '04',
    title: 'Education, HR & Community',
    slug: 'education-hr-community',
    tagline: 'Ed-tech exam platforms, internal enterprise HRMS suites & non-profit community portals.',
    description:
      'Scalable learning environments, internal organizational HR operating systems, and non-profit welfare platforms designed for social impact and team empowerment.',
    projectSlugs: [
      'swa-adhyay',
      'alai-rescues',
      'enrich-global-academy',
    ],
  },
  {
    id: 'cat-5',
    number: '05',
    title: 'Apps developed',
    slug: 'apps-developed',
    tagline: 'Native and hybrid iOS & Android experiences crafted for field mechanics, shoppers, bookings & logistics.',
    description:
      'Purpose-built mobile applications with real-time location mapping, push notifications, native checkout, and smooth gesture navigation. Exhibited exclusively in mobile perspective.',
    projectSlugs: [
      'sanchara-mitra',
      'sanchara-mitra-mechanic',
      'doczee',
      'ramanuja-kuteera',
      'girani',
      'bussguru',
    ],
    isAppCategory: true,
  },
  {
    id: 'cat-6',
    number: '06',
    title: 'More of our work',
    slug: 'more-of-our-work',
    tagline: 'A curated selection from 1000+ delivered engagements across 17 industries in India.',
    description:
      'A curated selection from over 1000+ delivered engagements worldwide — spanning real estate, e-commerce, education, healthcare, technology, manufacturing, and many more industries.',
    projectSlugs: [],
  },
]

export const getCategoryBySlug = (slug: string) =>
  workCategories.find((c) => c.slug === slug)
