/**
 * Company facts. Everything here is sourced — update only with verified data.
 *  - Contact, address, socials: webbirth.in
 *  - Founded 2020, Bengaluru HQ: webbirth.in footer, Clutch, LinkedIn
 *  - 500+ projects / 500+ clients / 15+ countries: WebBirth LinkedIn company page
 */
export const company = {
  name: 'WebBirth',
  founded: 2020,
  city: 'Bengaluru',
  country: 'India',
  timezone: 'Asia/Kolkata',
  email: 'info@webbirth.in',
  phones: ['+91 95351 35278', '+91 88844 64462'],
  address: ['#17, Star Complex, 2nd Floor', '16th Cross, Ullal Main Road', 'Bengaluru 560 056, India'],
  mapUrl: 'https://maps.google.com/?q=Star+Complex+Ullal+Main+Road+Bengaluru+560056',
} as const

export const socials = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/webbirth' },
  { label: 'Instagram', href: 'https://www.instagram.com/webbirth' },
  { label: 'Facebook', href: 'https://www.facebook.com/webbirth.co' },
  { label: 'X', href: 'https://twitter.com/webbirth2' },
  { label: 'WhatsApp', href: 'https://wa.me/919535135278' },
] as const

/** Every nav item scrolls to its section on the home page (the full /work page is linked from that section). */
export const navItems = [
  { id: 'home', label: 'Home', index: '00', to: '/' },
  { id: 'work', label: 'Work', index: '01', to: '/#work' },
  { id: 'services', label: 'Services', index: '02', to: '/#services' },
  { id: 'about', label: 'About', index: '03', to: '/#about' },
  { id: 'blogs', label: 'Blogs', index: '04', to: '/#blogs' },
  { id: 'careers', label: 'Careers', index: '05', to: '/#careers' },
  { id: 'contact', label: 'Contact', index: '06', to: '/#contact' },
] as const

const yearsActive = new Date().getFullYear() - company.founded

export const stats = [
  { value: 1000, suffix: '+', label: 'Clients served' },
  { value: 15, suffix: '+', label: 'Countries reached' },
  { value: 20, suffix: '+', label: 'Industries served' },
  { value: yearsActive, suffix: '+', label: `Years building · since ${company.founded}`, pad: 2 },
] as const

export type ServiceKind =
  | 'web'
  | 'software'
  | 'design'
  | 'mobile'
  | 'commerce'
  | 'ai'
  | 'cloud'
  | 'marketing'

/** The six services offered on webbirth.in (copy from the live site, lightly tidied). */
export const services: { kind: ServiceKind; title: string; description: string; tags: string[] }[] = [
  {
    kind: 'design',
    title: 'UI / UX & Graphic Design',
    description:
      'Elevate your online presence and engage your audience with creative UI/UX — visually stunning web and mobile app designs, and branding that makes your brand shine.',
    tags: ['Web Design', 'App Design', 'Branding'],
  },
  {
    kind: 'web',
    title: 'Website Development',
    description:
      'Custom websites crafted to elevate your online presence — SEO-optimised designs that boost your search rankings and traffic.',
    tags: ['Custom Websites', 'SEO-Optimised', 'Responsive'],
  },
  {
    kind: 'commerce',
    title: 'E-Commerce Website',
    description:
      'Comprehensive e-commerce solutions with secure payment gateway integration, seamless shipping and delivery management, and intuitive shopping experiences designed to streamline your online business, boost sales, and elevate customer satisfaction.',
    tags: ['Online Stores', 'Payments', 'Catalogues'],
  },
  {
    kind: 'software',
    title: 'Web App Development',
    description:
      'Web applications tailored for diverse industries — custom web apps and web portals that deliver seamless digital solutions for your business.',
    tags: ['Web Apps', 'Web Portals', 'Dashboards'],
  },
  {
    kind: 'mobile',
    title: 'Mobile App Development',
    description:
      'Launching a business or a startup? We build custom mobile apps for Android and iOS that turn your vision into reality.',
    tags: ['Android', 'iOS', 'Cross-platform'],
  },
  {
    kind: 'marketing',
    title: 'Digital Marketing',
    description:
      'Elevate your digital presence with SEO, AEO, GEO, social media marketing, and more - building brand visibility, engaging the right audience, and delivering measurable growth.',
    tags: ['SEO', 'Social Media', 'Performance'],
  },
]

export const processSteps = [
  { title: 'Discover', description: 'Understand the business, users and problem.' },
  { title: 'Design', description: 'Create the experience and visual system.' },
  { title: 'Develop', description: 'Build scalable and maintainable technology.' },
  { title: 'Test', description: 'Validate performance, usability and reliability.' },
  { title: 'Launch', description: 'Deploy and monitor the product.' },
  { title: 'Grow', description: 'Improve, optimize and scale.' },
] as const

export type TechGroup = 'frontend' | 'mobile' | 'backend' | 'data' | 'infra' | 'intelligence'

export type Tech = {
  id: string
  label: string
  group: TechGroup
  description: string
  /** Position on a 0–100 canvas around the centre (50, 50). */
  x: number
  y: number
  links?: string[]
}

export const techGroups: Record<TechGroup, string> = {
  frontend: 'Interface',
  mobile: 'Mobile',
  backend: 'Server',
  data: 'Data',
  infra: 'Cloud',
  intelligence: 'AI',
}

// 2D fallback layout: one ring (r≈42) around the core at 50,50, a node every 30°.
export const technologies: Tech[] = [
  { id: 'react', label: 'React', group: 'frontend', x: 29, y: 14, links: ['next', 'ts', 'rn'], description: 'Component-driven interfaces for fast, interactive products.' },
  { id: 'next', label: 'Next.js', group: 'frontend', x: 50, y: 8, links: ['node'], description: 'Server-rendered React for SEO-critical sites and web apps.' },
  { id: 'ts', label: 'TypeScript', group: 'frontend', x: 14, y: 29, links: ['node'], description: 'Typed JavaScript that keeps large codebases safe to change.' },
  { id: 'rn', label: 'React Native', group: 'mobile', x: 8, y: 50, description: 'One React codebase shipping native iOS and Android apps.' },
  { id: 'flutter', label: 'Flutter', group: 'mobile', x: 14, y: 71, description: 'Pixel-perfect cross-platform apps from a single codebase.' },
  { id: 'node', label: 'Node.js', group: 'backend', x: 71, y: 14, links: ['mongo'], description: 'Event-driven backends, real-time services and APIs.' },
  { id: 'laravel', label: 'Laravel', group: 'backend', x: 86, y: 29, links: ['mysql'], description: 'Expressive PHP framework for business applications.' },
  { id: 'python', label: 'Python', group: 'backend', x: 92, y: 50, links: ['openai'], description: 'Data processing, automation scripts and ML services.' },
  { id: 'openai', label: 'OpenAI', group: 'intelligence', x: 86, y: 71, description: 'GPT-powered assistants, content generation and automation.' },
  { id: 'mysql', label: 'MySQL', group: 'data', x: 71, y: 86, description: 'Relational storage for transactional workloads.' },
  { id: 'mongo', label: 'MongoDB', group: 'data', x: 50, y: 92, description: 'Flexible document storage for evolving schemas.' },
  { id: 'aws', label: 'AWS', group: 'infra', x: 29, y: 86, links: ['node'], description: 'Cloud infrastructure that scales with demand.' },
]

export const projectTypes = [
  'Website',
  'Web Application',
  'Mobile App',
  'E-commerce',
  'Custom Software',
  'UI / UX Design',
  'AI & Automation',
  'Digital Marketing',
  'Something else',
] as const
