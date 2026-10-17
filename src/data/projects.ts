/**
 * Portfolio projects — curated and categorized for WebBirth.
 * Sourced from verified client platforms, enterprise solutions, and live engagements.
 */
export type Project = {
  slug: string
  name: string
  industry: string
  discipline: string
  summary: string
  image?: string
  imageSize?: [number, number]
  fit?: 'cover' | 'contain'
  url?: string
  playStore?: string
  appStore?: string
  tone: string
  year?: string
  deliverables?: string[]
  featured?: boolean
  hasBothWebAndMobile?: boolean
  isAppOnly?: boolean
  badge?: string
}

export const projects: Project[] = [
  // ── CATEGORY 1: Legal, Healthcare & Enterprise · USA ──────────────────────
  {
    slug: 'mediify',
    name: 'Mediify',
    industry: 'Healthcare & Legal · USA',
    discipline: 'Web Application',
    summary:
      'A case management portal for medical-legal teams, cases, matters, providers and ER reports, with live case analytics.',
    tone: '#0c1a33',
    deliverables: ['Web Application', 'Dashboard', 'UI / UX Design'],
    featured: true,
  },
  {
    slug: 'cazenest',
    name: 'CazeNest',
    industry: 'Legal Case Management · USA',
    discipline: 'Web Application',
    summary:
      'A practice management workspace for case teams, parties, matters, tasks, damages and team workload in one place.',
    tone: '#111a2e',
    deliverables: ['Web Application', 'Dashboard', 'UI / UX Design'],
    featured: true,
  },
  {
    slug: 'zenith-health',
    name: 'Zenith Health Systems',
    industry: 'Healthcare · USA',
    discipline: 'Intranet Portal',
    summary:
      'An employee intranet for a health systems, events, announcements, policies, IT tickets and the staff directory in one hub.',
    tone: '#151a4d',
    deliverables: ['Web Application', 'Intranet', 'UI / UX Design'],
    featured: true,
  },
  {
    slug: 'westvox',
    name: 'WestVox',
    industry: 'Business Communications · USA',
    discipline: 'Corporate Website',
    summary:
      'A website for a Texas based provider of enterprise grade VoIP, cloud phone systems and call centre solutions.',
    tone: '#2a0c0c',
    url: 'https://westvox.com/',
    deliverables: ['Web Development', 'UI / UX Design'],
  },
  {
    slug: 'intakepilots',
    name: 'Intake Pilots',
    industry: 'Legal Lead Intake · USA',
    discipline: 'Web Application',
    summary:
      'A bilingual marketer portal that tracks legal client leads and the intake pipeline in real time.',
    tone: '#0a2140',
    url: 'https://intakepilots.com/',
    deliverables: ['Web Application', 'Dashboard', 'UI / UX Design'],
  },
  {
    slug: 'ashtalakshmi-temple',
    name: 'Ashtalakshmi Temple',
    industry: 'Cultural & Community Organization · Sugar Land, TX',
    discipline: 'Devotee Portal & Temple Management',
    summary:
      'A comprehensive digital community ecosystem for the landmark temple in Sugar Land, Texas (home of the Statue of Union) featuring online Dhanurmasa pooja registrations, daily priest service bookings & pricing, weekly prasadam ordering, Prajna Vedic education, and donor sponsorships.',
    tone: '#2a1406',
    url: 'https://ashtalakshmi.org/',
    deliverables: ['Devotee Portal', 'Priest Booking System', 'Prasadam Ordering', 'Event Registrations'],
  },
  {
    slug: 'aspen-capital',
    name: 'Aspen Capital',
    industry: 'Business Financing & Capital Solutions · USA',
    discipline: 'Corporate Financing Platform',
    summary:
      'A bespoke capital funding platform delivering structured financing solutions for businesses in Healthcare and Commercial Real Estate supporting working capital, acquisition financing, accounts receivable funding, inventory lines, development capital, and growth loans.',
    tone: '#0b1d28',
    url: 'https://aspencptl.com/',
    deliverables: ['Capital Solutions Platform', 'Deal Structuring Engine', 'Healthcare & CRE Portals', 'UI / UX Design'],
  },
  {
    slug: 'worth-and-right',
    name: 'Worth & Right',
    industry: 'Legal & Corporate Advisory · USA',
    discipline: 'Corporate Legal Website',
    summary:
      'A premier corporate advisory and legal consultation web presence designed for high stakes business structuring, regulatory filings, and partner representation.',
    tone: '#161924',
    deliverables: ['Web Development', 'Brand Architecture', 'UI / UX Design'],
  },
  {
    slug: '1960-physician-associates',
    name: '1960 Physician Associates',
    industry: 'Clinical Healthcare & Primary Care · Houston, TX',
    discipline: 'Healthcare Network & Patient Portal',
    summary:
      'A patient-first healthcare network portal across Houston and Cypress, Texas integrating live EHR appointment scheduling, pediatric care references and dosage charts, acute & chronic disease management, in home care routing, and new patient onboarding.',
    tone: '#0a2238',
    url: 'https://www.1960pa.care/',
    deliverables: ['EHR Patient Portal', 'Appointment Engine', 'Pediatric Center', 'Provider Directory'],
  },
  {
    slug: 'good-roll-golf',
    name: 'Good Roll Golf',
    industry: 'Golf Apparel · USA',
    discipline: 'E-commerce Platform',
    summary:
      'An online store for modern performance golf apparel polos, hats and pullovers, with bundles and best sellers.',
    tone: '#0d2418',
    url: 'https://goodrollgolf.com/',
    deliverables: ['E-commerce', 'UI / UX Design'],
  },

  // ── CATEGORY 2: AI, Fintech & Productivity ─────────────────────────────────
  {
    slug: 'generation-purple',
    name: 'Generation Purple',
    industry: 'Careers & Education',
    discipline: 'Web Platform',
    summary:
      'A career development platform with workshops, a career igniter and a character toolkit for students and professionals worldwide.',
    tone: '#1f0d3a',
    url: 'https://generationpurple.com/',
    deliverables: ['Web Application', 'UI / UX Design'],
  },
  {
    slug: 'documintq',
    name: 'DocumintQ',
    industry: 'Document Automation & AI',
    discipline: 'SaaS Platform',
    summary:
      'One platform for the whole document lifecycle storage, PDF tools, e-signatures, workflow automation, templates and AI summarization.',
    tone: '#062a1c',
    url: 'https://documintq.com/',
    deliverables: ['SaaS Platform', 'Web Application', 'UI / UX Design'],
    featured: true,
  },
  {
    slug: 'itransfer',
    name: 'i Transfer',
    industry: 'Fintech & Payments',
    discipline: 'Digital Remittance Platform',
    summary:
      'A secure financial technology interface for fast, frictionless cross border payments, live currency conversion rates, and automated compliance pipelines.',
    tone: '#09211b',
    deliverables: ['Fintech Platform', 'Web Application', 'UI / UX Design'],
  },
  {
    slug: 'easymarg',
    name: 'EasyMarg',
    industry: 'Professional Services',
    discipline: 'Marketplace Platform',
    summary:
      'A marketplace connecting businesses with verified independent experts in accounting, compliance, and corporate financial advisory.',
    tone: '#0c1a33',
    url: 'https://easymarg.com/',
    deliverables: ['Marketplace', 'Web Application', 'UI / UX Design'],
  },
  {
    slug: 'parinitha',
    name: 'Parinitha',
    industry: 'Business Consultancy',
    discipline: 'Corporate Website',
    summary:
      'A corporate platform for a consultancy handling statutory registrations, regulatory compliance, HR and payroll systems for growing businesses.',
    tone: '#0a1d3d',
    url: 'https://parinitha.in/',
    deliverables: ['Web Development', 'UI / UX Design'],
  },
  {
    slug: 'cadmaxx',
    name: 'Cadmaxx',
    industry: 'Engineering R&D',
    discipline: 'Corporate Website',
    summary:
      'A corporate platform for an engineering R&D, industrial automation and digital engineering powerhouse.',
    tone: '#2a1608',
    url: 'https://cadmaxx.com/',
    deliverables: ['Web Development', 'UI / UX Design'],
  },

  // ── CATEGORY 3: Marketplaces, Booking & Commerce ───────────────────────────
  {
    slug: 'home-captain',
    name: 'Home Captain',
    industry: 'Real Estate',
    discipline: 'Property Platform',
    summary:
      'A property platform to buy, sell and rent plots, apartments, villas and commercial spaces across Bangalore with verified agents.',
    tone: '#0c1a3d',
    url: 'https://homecaptain.in/',
    deliverables: ['Web Application', 'Property Listings', 'UI / UX Design'],
    featured: true,
  },
  {
    slug: 'doczee',
    name: 'DocZee',
    industry: 'Business Documentation',
    discipline: 'Web & Mobile App',
    summary:
      'A one-stop platform and mobile app for business registrations and documentation and GST, company registration, PAN, agreements and expert consultations.',
    tone: '#0d1b33',
    url: 'https://doczee.in/',
    playStore: 'https://play.google.com/store/apps/details?id=com.webbirth.doczee&hl=en_IN',
    deliverables: ['Web Application', 'Mobile App', 'UI / UX Design'],
    hasBothWebAndMobile: true,
  },
  {
    slug: 'sanchara-mitra',
    name: 'Sanchara Mitra',
    industry: 'Vehicle Care & Roadside Help',
    discipline: 'Web & Mobile App',
    summary:
      'A vehicle-care platform and customer mobile app to book verified mechanics nearby for roadside assistance, breakdown towing and doorstep servicing.',
    tone: '#3a1a06',
    url: 'https://sancharamitra.co.in/',
    playStore: 'https://play.google.com/store/apps/details?id=com.sancharamitra.sanchara_mitra_user&hl=en_IN',
    deliverables: ['Customer App', 'Web Application', 'UI / UX Design'],
    hasBothWebAndMobile: true,
  },
  {
    slug: 'bussguru',
    name: 'BussGuru',
    industry: 'Travel & Transport',
    discipline: 'Web & Mobile App',
    summary:
      'A travel booking platform and mobile app for bus tickets, tour packages, car rentals and resorts with live tracking and interactive seat selection.',
    tone: '#3a0a10',
    url: 'https://bussguru.in/',
    playStore: 'https://play.google.com/store/apps/details?id=com.bussguru&hl=en_IN',
    deliverables: ['Web Application', 'Mobile App', 'UI / UX Design'],
    featured: true,
    hasBothWebAndMobile: true,
  },
  {
    slug: 'girani',
    name: 'Girani',
    industry: 'Food & Spices',
    discipline: 'E-commerce · Web & Mobile App',
    summary:
      'An online storefront and mobile app for a masala and fresh-flour brand product catalogue, category filters, search and cart built for everyday ordering.',
    tone: '#3a1606',
    url: 'https://girani.in/',
    playStore: 'https://play.google.com/store/apps/details?id=com.girani.user&hl=en_IN',
    deliverables: ['E-commerce', 'Web Development', 'Mobile App'],
    featured: true,
    hasBothWebAndMobile: true,
  },
  {
    slug: 'ramanuja-kuteera',
    name: 'Ramanuja Kuteera',
    industry: 'Religious & Spiritual',
    discipline: 'Web & Mobile App',
    summary:
      'A one stop shop and mobile app for pooja services, astrology, vastu and religious products, from flowers and idols to spiritual books.',
    tone: '#2a0e3d',
    url: 'https://ramanujakuteera.com/',
    playStore: 'https://play.google.com/store/apps/details?id=com.user.ramanujakuteera&hl=en_IN',
    deliverables: ['E-commerce', 'Mobile App', 'Web Development'],
    hasBothWebAndMobile: true,
  },
  {
    slug: 'classify-interiors',
    name: 'Classify Interiors',
    industry: 'Interior Design',
    discipline: 'Business Website',
    summary:
      'A website for an interiors studio delivering modern, functional homes on time with customizable design packages and instant quote calculators.',
    tone: '#1f160d',
    url: 'https://classifyinteriors.com/',
    deliverables: ['Web Development', 'UI / UX Design'],
  },
  {
    slug: 'realty-streams',
    name: 'Realty Streams',
    industry: 'Real Estate & PropTech',
    discipline: 'Property Platform',
    summary:
      'A real estate platform to explore verified properties, connect with trusted agents and enquire about upcoming residential and commercial developments.',
    tone: '#14213a',
    url: 'https://realtystreams.ai/',
    deliverables: ['Web Development', 'Property Listings', 'UI / UX Design'],
  },
  {
    slug: 'superior-solar',
    name: 'Superior Solar',
    industry: 'Clean Tech & Home Appliances',
    discipline: 'E-commerce Platform',
    summary:
      'A storefront for solar water heaters, electric geysers, kitchen appliances and advanced water purification systems.',
    tone: '#071228',
    url: 'https://superiorsolar.co.in/',
    deliverables: ['E-commerce', 'Responsive Website'],
  },
  {
    slug: 'first-wave-fries',
    name: 'First Wave Fries',
    industry: 'Food & Beverage',
    discipline: 'Brand Website',
    summary:
      'A brand website for a gourmet fries and shakes chain, complete with digital menu browsing, franchise inquiry intake, and store locator.',
    tone: '#3a2a06',
    url: 'https://firstwavefries.com/',
    deliverables: ['Web Development', 'UI / UX Design'],
  },
  {
    slug: 'fit-muscle',
    name: 'Fit Muscle Premium Fitness',
    industry: 'Health & Fitness',
    discipline: 'Business Website',
    summary:
      'A website for an 11,000 sq. ft. premium gym — amenities, training programmes, pricing tiers and trial membership bookings.',
    tone: '#1a1a1a',
    url: 'https://fitmusclepremiumfitness.in/',
    deliverables: ['Web Development', 'UI / UX Design'],
  },

  // ── CATEGORY 4: Education, HR & Community ──────────────────────────────────
  {
    slug: 'swa-adhyay',
    name: 'Swa Adhyay',
    industry: 'Education & EdTech',
    discipline: 'Ed-Tech Platform',
    summary:
      'A self learning platform for KAS and IAS aspirants with a study material shop, downloadable resources and a news feed for exam preparation.',
    tone: '#06123a',
    url: 'https://swaadhyay.com/',
    deliverables: ['Web Application', 'E-commerce', 'UI / UX Design'],
    featured: true,
  },
  {
    slug: 'alai-rescues',
    name: 'Alai Rescues',
    industry: 'Animal Welfare & Non-Profit',
    discipline: 'Non-profit Website',
    summary:
      'A website for an animal rescue organization and pet clinic, showcasing rescue stories, volunteer drives, adoption profiles, and instant online donations.',
    tone: '#3a1a08',
    url: 'https://alairescues.in/',
    deliverables: ['Web Development', 'UI / UX Design'],
  },
  {
    slug: 'enrich-global-academy',
    name: 'Enrich Global Academy',
    industry: 'Early Education',
    discipline: 'School Website',
    summary:
      'A vibrant website for a premier kindergarten and early education academy curriculum overviews, activity galleries, and interactive admissions inquiry.',
    tone: '#2a0d1f',
    url: 'https://enrichglobalacademy.com/',
    deliverables: ['Web Development', 'UI / UX Design'],
  },

  // ── CATEGORY 5: Apps developed (Mobile Specific) ───────────────────────────
  {
    slug: 'sanchara-mitra-mechanic',
    name: 'Sanchara Mitra Mechanic',
    industry: 'Vehicle Care & Partner Network',
    discipline: 'Mobile Application',
    summary:
      'The dedicated partner app for field mechanics receive breakdown requests nearby, navigate with in app GPS, and complete jobs with 100% direct payouts.',
    tone: '#2a1406',
    url: 'https://sancharamitra.co.in/',
    playStore: 'https://play.google.com/store/apps/details?id=com.webbirth.sancharamithramechanic&hl=en_IN',
    deliverables: ['Partner App', 'UI / UX Design', 'Native Android/iOS'],
    isAppOnly: true,
  },
]

export const featuredProjects = projects.filter((p) => p.featured)

export const getProject = (slug: string) => projects.find((p) => p.slug === slug)
