/**
 * Client testimonials — REAL, publicly verifiable reviews only.
 * Sourced directly from Google Maps listing for Webbirth.
 */

export type Source = 'google' | 'justdial'

export const sourceMeta: Record<Source, { label: string; href: string }> = {
  google: { label: 'Google', href: 'https://www.google.com/search?q=webbirth+bengaluru#lrd=0x3bae3fbdbbf9b6a1:0x40c358680140f161,1,,,,' },
  justdial: { label: 'Justdial', href: 'https://www.justdial.com/Bangalore/Webbirth-Pvt-Ltd-Ullalu' },
}

export type Testimonial = {
  id: string
  name: string
  reviewInfo: string
  rating: number
  timeAgo: string
  quote: string
  highlight: string
  source: Source
  avatarColor?: string
  avatarInitial?: string
  avatarImg?: string
  role?: string
  featured?: boolean
}

export const testimonials: Testimonial[] = [
  {
    id: 'ammu-ammu',
    name: 'Ammu Ammu',
    reviewInfo: '1 review',
    rating: 5,
    timeAgo: 'a year ago',
    quote:
      'Webbirth helped our business grow online. Their team is friendly and understands what we need. They handled our Google Ads and social media very well. We saw more people visiting our website and asking about our services. I’m really happy with their work',
    highlight:
      'Webbirth helped our business grow online. They handled our Google Ads and social media very well.',
    source: 'google',
    avatarColor: '#5d4037',
    avatarInitial: 'A',
    role: '1 review · a year ago',
  },
  {
    id: 'kiran-katagi',
    name: 'Kiran Katagi',
    reviewInfo: '1 review',
    rating: 5,
    timeAgo: '6 months ago',
    quote:
      'I would like to thank the Webbirth team for helping me resolve an error on my website’s contact page without charging any fee. Their team is brilliant, professional, and very supportive. I highly recommend them.',
    highlight:
      'Their team is brilliant, professional, and very supportive. I highly recommend them.',
    source: 'google',
    avatarColor: '#8e24aa',
    avatarInitial: 'K',
    role: '1 review · 6 months ago',
  },
  {
    id: 'giridharan-v-civil',
    name: 'GIRIDHARAN V Civil',
    reviewInfo: '1 review',
    rating: 5,
    timeAgo: 'a year ago',
    quote:
      'Webbirth did a great job with our website. Spoorthi, who handled the development, was very professional and helpful. She listened to all our ideas and made sure everything looked and worked perfectly. The website is clean, fast, and easy to use. We’re really happy with the final result and the support we got from the team.',
    highlight:
      'The website is clean, fast, and easy to use. We’re really happy with the final result and the support we got from the team.',
    source: 'google',
    avatarColor: '#e91e63',
    avatarInitial: 'G',
    role: '1 review · a year ago',
    featured: true,
  },
  {
    id: 'vijay',
    name: 'vijay',
    reviewInfo: '1 review · 4 photos',
    rating: 5,
    timeAgo: 'a year ago',
    quote:
      'I run a boutique, and honestly, I didn’t think I even needed a website. But after Webbirth built one for me, I realized how much I was missing out. Customers now find me online, view my designs, and even message me directly from the site. It feels so professional, and I’m proud to show it off',
    highlight:
      'Customers now find me online, view my designs, and even message me directly from the site. It feels so professional, and I’m proud to show it off',
    source: 'google',
    avatarColor: '#1e3a8a',
    avatarInitial: 'V',
    avatarImg: '/testimonials/vijay.webp',
    role: '1 review · 4 photos · a year ago',
  },
  {
    id: 'vedhanayagam',
    name: 'Vedhanayagam Vedhanayagam',
    reviewInfo: '1 review',
    rating: 5,
    timeAgo: 'a year ago',
    quote:
      'I got really good support from Webbirth while developing my website. Their ideas for web design and marketing were modern and creative. The team is very easy to work with and always helpful. If you are looking for a professional e-commerce website design company in Bangalore, I would definitely recommend Webbirth!',
    highlight:
      'If you are looking for a professional e-commerce website design company in Bangalore, I would definitely recommend Webbirth!',
    source: 'google',
    avatarColor: '#546e7a',
    avatarInitial: 'V',
    role: '1 review · a year ago',
  },
  {
    id: 'sivaraman',
    name: 'Sivaraman B Sivaraman B',
    reviewInfo: '1 review',
    rating: 5,
    timeAgo: 'a year ago',
    quote:
      'Webbirth gave us a stylish website that actually feels like our brand. The little design touches—like color choices and fonts—made it look premium. Customers now say our site feels trustworthy. Very satisfied',
    highlight:
      'Webbirth gave us a stylish website that actually feels like our brand. The little design touches made it look premium.',
    source: 'google',
    avatarColor: '#558b2f',
    avatarInitial: 'S',
    role: '1 review · a year ago',
  },
  {
    id: 'ajith-reddy',
    name: 'Ajith reddy',
    reviewInfo: '2 reviews',
    rating: 5,
    timeAgo: '11 months ago',
    quote:
      'Webbirth did a wonderful job on my website. The design looks neat and professional. The team was easy to talk to and very supportive throughout.',
    highlight:
      'Webbirth did a wonderful job on my website. The design looks neat and professional.',
    source: 'google',
    avatarColor: '#8d6e63',
    avatarInitial: 'A',
    role: '2 reviews · 11 months ago',
  },
  {
    id: 'bhargavi-venkatesh',
    name: 'Bhargavi Venkatesh',
    reviewInfo: '3 reviews',
    rating: 5,
    timeAgo: '10 months ago',
    quote:
      'We are so happy with Webbirth’s work. They improved our online visibility and made a clean, user-friendly website for us. Their team is easy to talk to and really cares about doing a good job.',
    highlight:
      'They improved our online visibility and made a clean, user-friendly website for us.',
    source: 'google',
    avatarColor: '#4e342e',
    avatarInitial: 'B',
    role: '3 reviews · 10 months ago',
  },
  {
    id: 'gowtham-m',
    name: 'Gowtham M',
    reviewInfo: '2 reviews',
    rating: 5,
    timeAgo: '11 months ago',
    quote:
      'Webbirth built our website and did a fantastic job. It looks neat, works fast, and they even helped us after launch. I’d definitely recommend them to others.',
    highlight:
      'Webbirth built our website and did a fantastic job. It looks neat, works fast, and they even helped us after launch.',
    source: 'google',
    avatarColor: '#334155',
    avatarInitial: 'G',
    avatarImg: '/testimonials/gowtham.webp',
    role: '2 reviews · 11 months ago',
  },
  {
    id: 'remo-senthil',
    name: 'REMO SENTHIL',
    reviewInfo: '2 reviews',
    rating: 5,
    timeAgo: 'a year ago',
    quote:
      'When I started my business, I had zero online presence. Webbirth not only built my website but also guided me on branding and marketing. They treated my startup as if it was their own. That personal touch made all the difference',
    highlight:
      'Webbirth not only built my website but also guided me on branding and marketing. That personal touch made all the difference',
    source: 'google',
    avatarColor: '#1e3a8a',
    avatarInitial: 'R',
    avatarImg: '/testimonials/remo.webp',
    role: '2 reviews · a year ago',
  },
  {
    id: 'vivek-kelkar',
    name: 'Vivek Kelkar',
    reviewInfo: '16 reviews · 1 photo',
    rating: 5,
    timeAgo: '6 months ago',
    quote:
      "Good experience. Team was efficient. Helped me restore our company's website. Sincere gratitude especially to the development team-Bhargavi, Spoorthi and Lavanya for the team support.",
    highlight:
      "Team was efficient. Helped me restore our company's website. Sincere gratitude especially to the development team.",
    source: 'google',
    avatarColor: '#475569',
    avatarInitial: 'V',
    avatarImg: '/testimonials/vivek.webp',
    role: '16 reviews · 1 photo · 6 months ago',
  },
  {
    id: 's-dharuman',
    name: 'S Dharuman',
    reviewInfo: '1 review',
    rating: 5,
    timeAgo: 'a year ago',
    quote:
      'Big thanks to Sushanth and the Webbirth team for working on our e-commerce design. The layouts and graphics came out way better than I imagined. They really paid attention to tiny details that gave our brand a fresh look. Totally satisfied.',
    highlight:
      'The layouts and graphics came out way better than I imagined. They really paid attention to tiny details that gave our brand a fresh look.',
    source: 'google',
    avatarColor: '#5c6bc0',
    avatarInitial: 'S',
    role: '1 review · a year ago',
  },
  {
    id: 'rajesh-kumar',
    name: 'Rajesh Rajesh Kumar',
    reviewInfo: '1 review',
    rating: 5,
    timeAgo: 'a year ago',
    quote:
      'Our store, Daily Fresh Mart, wanted a professional website to showcase products. Nootana and the Webbirth team did a fantastic job. The site looks neat, loads fast, and we are fully satisfied with their service.',
    highlight:
      'Nootana and the Webbirth team did a fantastic job. The site looks neat, loads fast, and we are fully satisfied.',
    source: 'google',
    avatarColor: '#d97706',
    avatarInitial: 'R',
    avatarImg: '/testimonials/rajesh.webp',
    role: '1 review · a year ago',
  },
  {
    id: 'gopinath-gopi',
    name: 'Gopinath Gopi',
    reviewInfo: '3 reviews',
    rating: 5,
    timeAgo: '11 months ago',
    quote:
      'Webbirth handled my website revamp professionally. The design is clean, the site is fast, and the team was patient with all my feedback. They made the whole process smooth and stress-free.',
    highlight:
      'The design is clean, the site is fast, and the team was patient with all my feedback. They made the whole process smooth and stress-free.',
    source: 'google',
    avatarColor: '#0f766e',
    avatarInitial: 'G',
    avatarImg: '/testimonials/gopinath.webp',
    role: '3 reviews · 11 months ago',
  },
  {
    id: 'anandharaj-e',
    name: 'ANANDHARAJ E',
    reviewInfo: '4 reviews',
    rating: 4,
    timeAgo: 'a year ago',
    quote:
      'Webbirth did a great job building my business website. They understood what I wanted, made it look professional, and were always ready to answer my questions. Really happy with their work!',
    highlight:
      'Webbirth did a great job building my business website. They understood what I wanted, made it look professional, and were always ready to answer my questions.',
    source: 'google',
    avatarColor: '#7b1fa2',
    avatarInitial: 'A',
    role: '4 reviews · a year ago',
  },
  {
    id: 'arjun-k',
    name: 'Arjun.k',
    reviewInfo: '2 reviews',
    rating: 5,
    timeAgo: 'a year ago',
    quote:
      'I’m not very tech-savvy, but Webbirth made everything easy. They designed a clean, user-friendly site for my shop and explained things step by step. Great service and friendly people!',
    highlight:
      'Webbirth made everything easy. They designed a clean, user-friendly site for my shop and explained things step by step.',
    source: 'google',
    avatarColor: '#6a1b9a',
    avatarInitial: 'A',
    role: '2 reviews · a year ago',
  },
  {
    id: 'praneeth-k',
    name: 'Praneeth K',
    reviewInfo: '1 review',
    rating: 5,
    timeAgo: 'a year ago',
    quote:
      'Design is personal, and we wanted someone we could trust with our brand. Sushanth and the Webbirth team proved to be that. They cared about the small details, respected our inputs, and gave us layouts that felt true to our brand. Completely satisfied.',
    highlight:
      'Sushanth and the Webbirth team proved to be that. They cared about the small details, respected our inputs, and gave us layouts that felt true to our brand.',
    source: 'google',
    avatarImg: '/testimonials/praneeth.webp',
    avatarInitial: 'P',
    role: '1 review · a year ago',
  },
]

/** Live platform ratings (public, verified). */
export const googleRating = { score: 4.9, count: 104 }
export const justdialRating = { score: 5.0, count: 144 }

/** Aggregate ratings strip. */
export const ratingStats: { source: Source; score: string; detail: string }[] = [
  { source: 'google', score: '4.9', detail: 'Google reviews' },
  { source: 'justdial', score: '5.0', detail: 'Justdial ratings' },
]

/** Headline proof points, animated as count-ups. Real, public figures. */
export const proofPoints: { value: number; decimals?: number; suffix: string; label: string }[] = [
  { value: 4.9, decimals: 1, suffix: '', label: 'Average rating' },
  { value: 1000, suffix: '+', label: 'Projects delivered' },
]

/**
 * What clients mention most — themes surfaced by review insights.
 */
export const clientMentions = [
  'Responsive support',
  'Modern, engaging design',
  'Quality lead generation',
  'Web-app expertise',
  'Improved online visibility',
  'Delivered on time',
]
