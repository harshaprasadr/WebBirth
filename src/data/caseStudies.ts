export type CaseStudy = {
  tech: string[]
  problemStatement: string
  timeline: Array<{ phase: string; duration?: string }>
  resolved: string
  useCases: Array<{ title: string; description: string }>
}

export const caseStudies: Record<string, CaseStudy> = {
  mediify: {
    tech: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Chart.js', 'REST API', 'AWS'],
    problemStatement:
      'Medical-legal teams were juggling case files, provider records, and ER reports across disconnected tools — losing critical documentation and case timing in the process.',
    timeline: [
      { phase: 'Discovery & Requirements', duration: '2 weeks' },
      { phase: 'UX Research & Wireframing', duration: '3 weeks' },
      { phase: 'UI Design & Prototype', duration: '2 weeks' },
      { phase: 'Full-Stack Development', duration: '8 weeks' },
      { phase: 'QA, Testing & Launch', duration: '2 weeks' },
    ],
    resolved:
      'A unified case management portal that consolidates case intake, provider management, and ER report generation — with live analytics giving teams instant visibility into case status and workload distribution.',
    useCases: [
      { title: 'Case Intake', description: 'Streamlined intake forms with auto-assignment, priority flags, and real-time status tracking.' },
      { title: 'ER Report Generation', description: 'Automated ER report compilation from provider data, case notes, and diagnostic records.' },
      { title: 'Provider Management', description: 'Centralised provider directory with credentialing, availability, and case history.' },
      { title: 'Analytics Dashboard', description: 'Live case analytics, team performance metrics, and matter-stage visualisations.' },
    ],
  },

  cazenest: {
    tech: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS'],
    problemStatement:
      'Law firms were managing case parties, task assignments, damages, and team workload across disconnected spreadsheets — with no unified view of the practice.',
    timeline: [
      { phase: 'Discovery & Scoping', duration: '2 weeks' },
      { phase: 'UX Design', duration: '3 weeks' },
      { phase: 'Development', duration: '10 weeks' },
      { phase: 'Testing & Deployment', duration: '2 weeks' },
    ],
    resolved:
      'A full-featured practice management workspace unifying matter pipelines, party tracking, task assignment, and damage calculations — giving attorneys a single source of truth for every case.',
    useCases: [
      { title: 'Party Management', description: 'Track all parties, witnesses, and contacts linked to each matter with full relationship mapping.' },
      { title: 'Matter Tracking', description: 'Full lifecycle view from case open to close with milestone alerts and stage transitions.' },
      { title: 'Task Assignment', description: 'Assign and track attorney tasks by deadline, priority, and billable status.' },
      { title: 'Damage Calculations', description: 'Structured damage tracking with line items, categorisation, and running totals.' },
    ],
  },

  'zenith-health': {
    tech: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'SharePoint Integration', 'Azure AD'],
    problemStatement:
      'Employees across multiple hospital departments had no central hub for announcements, IT requests, or staff resources — creating silos that slowed clinical and administrative teams.',
    timeline: [
      { phase: 'Stakeholder Interviews', duration: '2 weeks' },
      { phase: 'Information Architecture', duration: '2 weeks' },
      { phase: 'Design System', duration: '3 weeks' },
      { phase: 'Development', duration: '9 weeks' },
      { phase: 'Rollout & Training', duration: '2 weeks' },
    ],
    resolved:
      'A modern employee intranet consolidating events, announcements, IT ticketing, policy documents, and a full staff directory — searchable and role-filtered across all departments.',
    useCases: [
      { title: 'Announcements', description: 'Department and hospital-wide announcements with role-based visibility and read receipts.' },
      { title: 'IT Ticketing', description: 'Submit, track, and resolve IT support requests with SLA status indicators.' },
      { title: 'Event Calendar', description: 'Shared calendar for staff events, training sessions, and facility bookings.' },
      { title: 'Staff Directory', description: 'Searchable directory with department, role, credentials, and direct contact details.' },
    ],
  },

  westvox: {
    tech: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Vercel', 'Resend'],
    problemStatement:
      'A premium Texas VoIP provider needed a website that could articulate complex enterprise communication solutions without overwhelming prospective business clients.',
    timeline: [
      { phase: 'Discovery', duration: '1 week' },
      { phase: 'Design', duration: '2 weeks' },
      { phase: 'Development', duration: '4 weeks' },
      { phase: 'Launch', duration: '1 week' },
    ],
    resolved:
      'A polished corporate website clearly communicating VoIP, cloud phone, and call-centre offerings — with trust signals, product tier pages, and conversion-focused contact flows.',
    useCases: [
      { title: 'Product Discovery', description: 'Clear product tiers for VoIP, cloud PBX, and enterprise call-centre solutions.' },
      { title: 'Lead Capture', description: 'Multiple conversion touchpoints for enterprise sales inquiries and demo requests.' },
      { title: 'Call Centre Showcase', description: 'Dedicated landing sections for hosted PBX and contact-centre capabilities.' },
    ],
  },

  intakepilots: {
    tech: ['React', 'TypeScript', 'Node.js', 'MongoDB', 'Socket.io', 'Tailwind CSS'],
    problemStatement:
      'Legal marketing teams had no real-time visibility into lead quality, intake pipeline stages, or campaign attribution — across English and Spanish-speaking markets.',
    timeline: [
      { phase: 'Requirements & Scoping', duration: '1 week' },
      { phase: 'UX Design', duration: '2 weeks' },
      { phase: 'Development', duration: '6 weeks' },
      { phase: 'Testing & Launch', duration: '1 week' },
    ],
    resolved:
      'A bilingual marketer portal with real-time lead tracking, visual pipeline stages, and source attribution — giving teams instant clarity on intake performance and campaign ROI.',
    useCases: [
      { title: 'Live Lead Tracking', description: 'Real-time feed of incoming leads with intake status and case-type tagging.' },
      { title: 'Pipeline View', description: 'Visual pipeline with stage transitions, dispositions, and conversion metrics.' },
      { title: 'Bilingual Interface', description: 'Full English and Spanish interface for cross-market lead management.' },
      { title: 'Source Attribution', description: 'Track which campaigns and channels are generating the highest-quality leads.' },
    ],
  },

  'ashtalakshmi-temple': {
    tech: ['React', 'Node.js', 'PostgreSQL', 'Razorpay', 'AWS S3', 'Resend'],
    problemStatement:
      'Devotees and temple administrators had no digital system for pooja bookings, prasadam orders, and education registrations — relying entirely on in-person coordination and phone calls.',
    timeline: [
      { phase: 'Community Research', duration: '2 weeks' },
      { phase: 'Platform Architecture', duration: '2 weeks' },
      { phase: 'Design', duration: '3 weeks' },
      { phase: 'Development', duration: '10 weeks' },
      { phase: 'Launch', duration: '1 week' },
    ],
    resolved:
      'A comprehensive digital community ecosystem enabling online pooja registrations, daily priest bookings, prasadam ordering, Vedic education sign-ups, and donor sponsorships — all in one hub.',
    useCases: [
      { title: 'Pooja Registrations', description: 'Online booking for Dhanurmasa poojas and priest-led daily services with scheduling.' },
      { title: 'Prasadam Ordering', description: 'Weekly prasadam orders with quantity selection and pickup coordination.' },
      { title: 'Vedic Education', description: 'Prajna course registrations, class schedules, and student tracking.' },
      { title: 'Donor Sponsorships', description: 'Online donations and festival sponsorship packages with tax receipts.' },
    ],
  },

  'aspen-capital': {
    tech: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'Vercel'],
    problemStatement:
      'Healthcare businesses and commercial real estate operators lacked a streamlined way to evaluate and apply for structured financing solutions — navigating fragmented lenders and opaque deal processes.',
    timeline: [
      { phase: 'Discovery', duration: '2 weeks' },
      { phase: 'Platform Design', duration: '3 weeks' },
      { phase: 'Development', duration: '8 weeks' },
      { phase: 'QA & Launch', duration: '1 week' },
    ],
    resolved:
      'A bespoke capital funding platform with sector-specific financing pathways for healthcare and CRE operators — supporting the full deal lifecycle from initial inquiry to structured term delivery.',
    useCases: [
      { title: 'Healthcare Financing', description: 'Tailored financing pathways for medical practices, equipment, and acquisitions.' },
      { title: 'CRE Financing', description: 'Development capital, acquisition loans, and inventory lines for real estate operators.' },
      { title: 'Working Capital', description: 'Fast-access working capital and accounts receivable funding for operational needs.' },
      { title: 'Deal Structuring', description: 'Guided deal structure calculator and financing scenario planner for clients.' },
    ],
  },

  'worth-and-right': {
    tech: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Vercel', 'Framer Motion'],
    problemStatement:
      'A premier corporate advisory firm needed a digital presence as authoritative and precise as the high-stakes business structuring and regulatory engagements they serve.',
    timeline: [
      { phase: 'Brand & Positioning', duration: '1 week' },
      { phase: 'Design', duration: '3 weeks' },
      { phase: 'Development', duration: '4 weeks' },
      { phase: 'Launch', duration: '1 week' },
    ],
    resolved:
      'A sophisticated corporate web presence communicating business structuring, regulatory advisory, and partner representation — with clarity, credibility, and premium positioning.',
    useCases: [
      { title: 'Corporate Advisory', description: 'Service pages for business structuring, M&A advisory, and partner representation.' },
      { title: 'Regulatory Filings', description: 'Clear pathways for regulatory compliance services and statutory filings.' },
      { title: 'Client Intake', description: 'Secure consultation inquiry for qualified high-stakes corporate engagements.' },
    ],
  },

  '1960-physician-associates': {
    tech: ['React', 'Node.js', 'EHR Integration', 'PostgreSQL', 'AWS', 'Google Maps API'],
    problemStatement:
      'Patients across Houston and Cypress had no unified way to schedule appointments, find the right specialist, or access care resources — across five clinic locations and multiple specialties.',
    timeline: [
      { phase: 'Patient Research', duration: '2 weeks' },
      { phase: 'EHR Integration Scoping', duration: '2 weeks' },
      { phase: 'Design', duration: '3 weeks' },
      { phase: 'Development', duration: '10 weeks' },
      { phase: 'HIPAA Compliance & Launch', duration: '2 weeks' },
    ],
    resolved:
      'A patient-first healthcare network portal with live EHR-integrated appointment scheduling, specialist directories, pediatric resources, and in-home care routing — across all five Houston-area clinics.',
    useCases: [
      { title: 'Appointment Scheduling', description: 'EHR-integrated scheduling across all clinic locations with real-time availability.' },
      { title: 'Provider Directory', description: 'Specialist profiles with credentials, specialties, and scheduling availability.' },
      { title: 'Pediatric Center', description: 'Dosage charts, immunisation schedules, and child health resources for parents.' },
      { title: 'In-Home Care', description: 'Routing and intake request forms for house call and home care services.' },
    ],
  },

  'good-roll-golf': {
    tech: ['Shopify', 'Liquid', 'React', 'Tailwind CSS', 'Stripe'],
    problemStatement:
      'A modern performance golf apparel brand needed an e-commerce experience as premium as their product line — with bundle discovery and performance storytelling built in.',
    timeline: [
      { phase: 'Brand Alignment', duration: '1 week' },
      { phase: 'Store Design', duration: '2 weeks' },
      { phase: 'Development & Integration', duration: '4 weeks' },
      { phase: 'Launch', duration: '1 week' },
    ],
    resolved:
      'A high-performance Shopify storefront with curated product collections, bundle recommendations, and performance-first product storytelling — driving direct-to-consumer conversions.',
    useCases: [
      { title: 'Product Collections', description: 'Curated collections of polos, hats, and pullovers organised by style and performance.' },
      { title: 'Bundle Discovery', description: 'Smart bundle recommendations and best-seller highlights on the storefront.' },
      { title: 'Performance Cart', description: 'Streamlined cart and checkout experience optimised for fast purchasing.' },
    ],
  },

  'generation-purple': {
    tech: ['React', 'Node.js', 'MongoDB', 'Stripe', 'Tailwind CSS', 'AWS S3'],
    problemStatement:
      'Students and early-career professionals worldwide had no single structured platform for evidence-based career development resources, workshops, and self-assessment tools.',
    timeline: [
      { phase: 'User Research', duration: '2 weeks' },
      { phase: 'Platform Architecture', duration: '2 weeks' },
      { phase: 'Design', duration: '3 weeks' },
      { phase: 'Development', duration: '8 weeks' },
      { phase: 'Launch', duration: '1 week' },
    ],
    resolved:
      'A career-development platform with self-paced workshops, a career igniter assessment, and a character toolkit — helping students and professionals build real-world readiness globally.',
    useCases: [
      { title: 'Career Workshops', description: 'Self-paced workshops on professional skills, interview prep, and career strategy.' },
      { title: 'Career Igniter', description: 'Structured assessment identifying strengths, values, and optimal career pathways.' },
      { title: 'Character Toolkit', description: 'Interactive frameworks for building leadership and interpersonal effectiveness.' },
      { title: 'Global Access', description: 'Platform serving users across 40+ countries with localised career resources.' },
    ],
  },

  documintq: {
    tech: ['React', 'TypeScript', 'Node.js', 'AWS S3', 'PDF.js', 'AI / LLM', 'PostgreSQL', 'Stripe'],
    problemStatement:
      'Document-heavy teams were juggling multiple fragmented apps — storage, PDF editors, e-signature tools, and automation platforms — each with its own login, pricing, and learning curve.',
    timeline: [
      { phase: 'Product Discovery', duration: '3 weeks' },
      { phase: 'Architecture Design', duration: '2 weeks' },
      { phase: 'Core Module Development', duration: '12 weeks' },
      { phase: 'AI Integration & Testing', duration: '4 weeks' },
      { phase: 'Beta & Launch', duration: '2 weeks' },
    ],
    resolved:
      'A single SaaS platform handling the full document lifecycle: secure cloud storage, in-browser PDF tools, e-signature workflows, process automation, reusable templates, and AI-powered summarisation.',
    useCases: [
      { title: 'Document Storage', description: 'Secure cloud storage with team folders, permission tiers, and full version history.' },
      { title: 'PDF Tools', description: 'Merge, split, compress, convert, and annotate PDFs entirely in-browser.' },
      { title: 'E-Signatures', description: 'Send and track signature requests with timestamped, legally binding records.' },
      { title: 'AI Summarisation', description: 'Instant AI-generated summaries and key-point extraction for uploaded documents.' },
    ],
  },

  itransfer: {
    tech: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Compliance API', 'FX Rate API', 'AWS'],
    problemStatement:
      'Cross-border payment senders faced high fees, opaque exchange rates, and slow compliance checks — with no single frictionless interface for initiating and tracking international transfers.',
    timeline: [
      { phase: 'Regulatory Scoping', duration: '2 weeks' },
      { phase: 'UX Design', duration: '3 weeks' },
      { phase: 'Core Development', duration: '10 weeks' },
      { phase: 'Compliance Integration', duration: '3 weeks' },
      { phase: 'Security Audit & Launch', duration: '2 weeks' },
    ],
    resolved:
      'A secure digital remittance interface with live currency conversion, instant transfer initiation, and automated KYC/AML compliance pipelines — making cross-border payments fast and transparent.',
    useCases: [
      { title: 'Cross-Border Transfers', description: 'Fast, frictionless international money transfers to 60+ destination countries.' },
      { title: 'Live FX Rates', description: 'Real-time currency conversion rates displayed before transfer confirmation.' },
      { title: 'Compliance Automation', description: 'KYC and AML compliance checks handled automatically within the transfer pipeline.' },
      { title: 'Transfer History', description: 'Full audit trail of transactions with receipts and downloadable statements.' },
    ],
  },

  easymarg: {
    tech: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Stripe', 'Tailwind CSS', 'AWS'],
    problemStatement:
      'Businesses seeking expert guidance in accounting, compliance, and financial advisory had no structured way to discover verified independent consultants or manage engagements digitally.',
    timeline: [
      { phase: 'Marketplace Research', duration: '2 weeks' },
      { phase: 'Platform Design', duration: '3 weeks' },
      { phase: 'Development', duration: '9 weeks' },
      { phase: 'Onboarding & Launch', duration: '2 weeks' },
    ],
    resolved:
      'A curated marketplace connecting businesses with verified independent experts — with transparent profiles, scoped service listings, structured booking workflows, and verified client reviews.',
    useCases: [
      { title: 'Expert Discovery', description: 'Filter and find verified experts by domain, location, experience, and client ratings.' },
      { title: 'Service Listings', description: 'Experts list clearly scoped services with defined deliverables, pricing, and timelines.' },
      { title: 'Engagement Booking', description: 'Request, schedule, and manage consultations in a structured workflow.' },
      { title: 'Reviews & Trust', description: 'Verified client reviews and credential badges strengthen expert credibility.' },
    ],
  },

  parinitha: {
    tech: ['React', 'Node.js', 'Tailwind CSS', 'Vercel', 'Resend'],
    problemStatement:
      'Growing businesses in India needed a trusted compliance partner for statutory registrations and regulatory filings — but had no easy way to find, evaluate, or engage the right consultancy online.',
    timeline: [
      { phase: 'Discovery', duration: '1 week' },
      { phase: 'Design', duration: '2 weeks' },
      { phase: 'Development', duration: '4 weeks' },
      { phase: 'Launch', duration: '1 week' },
    ],
    resolved:
      'A professional corporate website presenting Parinitha\'s full compliance suite — GST registration, company formation, regulatory filings, HR systems, and payroll — with clear service pathways.',
    useCases: [
      { title: 'Statutory Registrations', description: 'Service pages for GST, company, LLP, and MSME registration workflows.' },
      { title: 'Compliance Advisory', description: 'Regulatory compliance and filing services for businesses at every stage.' },
      { title: 'HR & Payroll', description: 'End-to-end HR systems and payroll management service offerings.' },
    ],
  },

  cadmaxx: {
    tech: ['React', 'TypeScript', 'Tailwind CSS', 'Next.js', 'Vercel', 'Framer Motion'],
    problemStatement:
      'A cutting-edge engineering R&D firm lacked a digital presence that could convey the depth and sophistication of their industrial automation and digital engineering capabilities to enterprise clients.',
    timeline: [
      { phase: 'Brand Alignment', duration: '1 week' },
      { phase: 'Content Strategy', duration: '1 week' },
      { phase: 'Design', duration: '3 weeks' },
      { phase: 'Development', duration: '5 weeks' },
      { phase: 'Launch', duration: '1 week' },
    ],
    resolved:
      'A high-impact corporate platform communicating Cadmaxx\'s industrial automation capabilities, R&D innovations, and digital engineering services — positioning them for enterprise partnerships.',
    useCases: [
      { title: 'R&D Showcase', description: 'Detailed capability sections for active research projects and technical innovations.' },
      { title: 'Automation Portfolio', description: 'Industrial automation case study highlights and technology stack overview.' },
      { title: 'Digital Engineering', description: 'Service pages for digital twin modelling and engineering simulation work.' },
    ],
  },

  'home-captain': {
    tech: ['React', 'TypeScript', 'Node.js', 'MongoDB', 'Google Maps API', 'Tailwind CSS'],
    problemStatement:
      'Property seekers in Bangalore were navigating unverified listings and dealing with unresponsive agents across fragmented classified portals — with no accountability or filtering.',
    timeline: [
      { phase: 'Market Research', duration: '2 weeks' },
      { phase: 'Platform Architecture', duration: '2 weeks' },
      { phase: 'Design', duration: '3 weeks' },
      { phase: 'Development', duration: '10 weeks' },
      { phase: 'Agent Onboarding & Launch', duration: '2 weeks' },
    ],
    resolved:
      'A verified property marketplace for Bangalore covering plots, apartments, villas, and commercial spaces — with direct agent connections, advanced search, and curated verified listings.',
    useCases: [
      { title: 'Property Search', description: 'Filter by type, micromarket, BHK, and budget across all of Bangalore.' },
      { title: 'Agent Directory', description: 'Verified agent profiles with portfolios, response ratings, and active listings.' },
      { title: 'Listing Comparison', description: 'Side-by-side property comparisons with spec and location differences highlighted.' },
      { title: 'Enquiry Management', description: 'Direct enquiry routing to listing agents with response tracking for buyers.' },
    ],
  },

  doczee: {
    tech: ['React', 'React Native', 'Node.js', 'PostgreSQL', 'Razorpay', 'AWS S3'],
    problemStatement:
      'Entrepreneurs and small businesses had no straightforward way to handle registrations and documentation — navigating confusing government portals and relying on unverified intermediaries.',
    timeline: [
      { phase: 'User Research', duration: '2 weeks' },
      { phase: 'App Architecture', duration: '2 weeks' },
      { phase: 'Design — Web & Mobile', duration: '4 weeks' },
      { phase: 'Development', duration: '12 weeks' },
      { phase: 'QA & Launch', duration: '2 weeks' },
    ],
    resolved:
      'A one-stop web platform and mobile app covering business registrations, GST, PAN, legal agreements, and expert consultations — structured as guided, step-by-step workflows.',
    useCases: [
      { title: 'Business Registration', description: 'Guided workflows for company, LLP, and sole proprietor registrations.' },
      { title: 'GST & PAN Services', description: 'GST registration, filing assistance, and PAN application management.' },
      { title: 'Legal Agreements', description: 'Ready-to-use customisable legal document templates with e-signing.' },
      { title: 'Expert Consultations', description: 'Scheduled video and chat calls with verified compliance experts.' },
    ],
  },

  'sanchara-mitra': {
    tech: ['React', 'React Native', 'Node.js', 'MongoDB', 'Google Maps API', 'Razorpay', 'Firebase'],
    problemStatement:
      'Vehicle owners facing breakdowns or needing routine servicing had no reliable way to find and book verified mechanics nearby — especially for roadside emergencies where every minute counts.',
    timeline: [
      { phase: 'Field Research', duration: '2 weeks' },
      { phase: 'Platform Architecture', duration: '2 weeks' },
      { phase: 'Design — Web & App', duration: '4 weeks' },
      { phase: 'Development', duration: '14 weeks' },
      { phase: 'Mechanic Onboarding & Launch', duration: '2 weeks' },
    ],
    resolved:
      'A vehicle-care platform and customer mobile app connecting owners to verified nearby mechanics — with real-time GPS dispatch, job tracking, and support for roadside assistance, towing, and doorstep servicing.',
    useCases: [
      { title: 'Roadside Assistance', description: 'Emergency mechanic dispatch with one-tap SOS and live GPS location sharing.' },
      { title: 'Doorstep Servicing', description: 'Schedule and track at-home vehicle servicing from booking to completion.' },
      { title: 'Mechanic Discovery', description: 'Find verified mechanics nearby filtered by proximity, specialty, and ratings.' },
      { title: 'Service Tracking', description: 'Live job status updates and ETA visibility from booking through job completion.' },
    ],
  },

  bussguru: {
    tech: ['React', 'React Native', 'Node.js', 'MongoDB', 'Google Maps API', 'Razorpay', 'Socket.io'],
    problemStatement:
      'Travellers in India lacked a unified platform for bus bookings, tour packages, and car rentals — with no live seat visibility, real-time tracking, or cross-service management.',
    timeline: [
      { phase: 'User Research', duration: '2 weeks' },
      { phase: 'App Architecture', duration: '2 weeks' },
      { phase: 'Design — Web & Mobile', duration: '4 weeks' },
      { phase: 'Development', duration: '16 weeks' },
      { phase: 'Operator Onboarding & Launch', duration: '3 weeks' },
    ],
    resolved:
      'A multi-service travel booking platform and mobile app for buses, tour packages, and car rentals — with interactive seat maps, live GPS journey tracking, and seamless multi-service checkout.',
    useCases: [
      { title: 'Bus Ticket Booking', description: 'Book inter-city and intra-city bus tickets with live availability and seat selection.' },
      { title: 'Interactive Seat Map', description: 'Real-time seat maps with gender-based filters and instant confirmation.' },
      { title: 'Tour Packages', description: 'Curated tour packages with day-by-day itineraries and group booking management.' },
      { title: 'Live Journey Tracking', description: 'Real-time GPS tracking of booked buses with ETA and delay notifications.' },
    ],
  },

  girani: {
    tech: ['React', 'React Native', 'Node.js', 'MongoDB', 'Razorpay', 'AWS S3', 'Firebase'],
    problemStatement:
      'A masala and fresh-flour brand with a loyal offline customer base had no digital channel for direct orders — missing reach, revenue, and repeat business from online buyers.',
    timeline: [
      { phase: 'Brand Research', duration: '1 week' },
      { phase: 'Store Architecture', duration: '1 week' },
      { phase: 'Design — Web & App', duration: '3 weeks' },
      { phase: 'Development', duration: '10 weeks' },
      { phase: 'Launch', duration: '1 week' },
    ],
    resolved:
      'An e-commerce storefront and companion mobile app with a full product catalogue, smart category filters, search, and a streamlined cart — built for everyday ordering of masalas and fresh flours.',
    useCases: [
      { title: 'Product Catalogue', description: 'Browsable catalogue of masalas, flours, and specialty blends with weight variants.' },
      { title: 'Smart Filters', description: 'Filter products by category, dietary preference, and pack size.' },
      { title: 'Cart & Checkout', description: 'Streamlined cart with delivery, promo codes, and Razorpay payment in a few taps.' },
      { title: 'Order Tracking', description: 'Order status updates and delivery notifications via the app and SMS.' },
    ],
  },

  'ramanuja-kuteera': {
    tech: ['React', 'React Native', 'Node.js', 'MongoDB', 'Razorpay', 'Firebase'],
    problemStatement:
      'Devotees seeking pooja products, astrology consultations, and vastu guidance had no single trusted digital destination — relying on fragmented local sources and word of mouth.',
    timeline: [
      { phase: 'Community Research', duration: '2 weeks' },
      { phase: 'Platform Design', duration: '3 weeks' },
      { phase: 'Development', duration: '10 weeks' },
      { phase: 'Launch', duration: '1 week' },
    ],
    resolved:
      'A religious e-commerce platform and mobile app covering pooja products, astrology consultations, vastu advisory, and spiritual literature — all from one trusted and verified source.',
    useCases: [
      { title: 'Pooja Products', description: 'Flowers, idols, agarbattis, and ready-to-use pooja kit bundles.' },
      { title: 'Astrology Services', description: 'Book personalised horoscope readings and kundali consultations.' },
      { title: 'Vastu Advisory', description: 'Schedule vastu inspections and remedial guidance sessions with experts.' },
      { title: 'Spiritual Library', description: 'Curated selection of religious texts, devotional books, and media.' },
    ],
  },

  'classify-interiors': {
    tech: ['React', 'TypeScript', 'Tailwind CSS', 'Next.js', 'Vercel'],
    problemStatement:
      'A growing interiors studio had no digital presence to showcase their portfolio, communicate their design process, or convert curious visitors into consultation bookings.',
    timeline: [
      { phase: 'Discovery', duration: '1 week' },
      { phase: 'Design', duration: '3 weeks' },
      { phase: 'Development', duration: '4 weeks' },
      { phase: 'Launch', duration: '1 week' },
    ],
    resolved:
      'A business website presenting design packages, a curated project gallery, an instant quote calculator, and streamlined consultation booking — converting design interest into qualified leads.',
    useCases: [
      { title: 'Portfolio Gallery', description: 'Curated project gallery organised by room type, style, and budget range.' },
      { title: 'Design Packages', description: 'Transparent package tiers for modular, semi-custom, and full-custom interiors.' },
      { title: 'Quote Calculator', description: 'Instant estimate calculator based on room area, design scope, and finish level.' },
      { title: 'Consultation Booking', description: 'Schedule a design consultation with confirmed time slot and brief intake.' },
    ],
  },

  'realty-streams': {
    tech: ['React', 'TypeScript', 'Node.js', 'MongoDB', 'Google Maps API', 'AI / ML', 'Vercel'],
    problemStatement:
      'Property seekers lacked a reliable platform to discover verified developments, connect with trusted agents, and get early access to upcoming launches in a transparent, accountable way.',
    timeline: [
      { phase: 'Market Research', duration: '2 weeks' },
      { phase: 'Platform Design', duration: '3 weeks' },
      { phase: 'Development', duration: '8 weeks' },
      { phase: 'Agent Onboarding & Launch', duration: '2 weeks' },
    ],
    resolved:
      'A real estate platform with verified property listings, a trusted agent network, and dedicated pages for upcoming residential and commercial launches — with transparent enquiry routing.',
    useCases: [
      { title: 'Property Listings', description: 'Verified listings for residential and commercial properties with full details.' },
      { title: 'Agent Network', description: 'Trusted agent profiles with verified credentials and curated active listings.' },
      { title: 'Upcoming Launches', description: 'Pre-launch registration pages for new residential and commercial developments.' },
      { title: 'Enquiry Routing', description: 'Direct, trackable enquiries routed to listing agents with follow-up management.' },
    ],
  },

  'superior-solar': {
    tech: ['React', 'Node.js', 'Tailwind CSS', 'Razorpay', 'WooCommerce'],
    problemStatement:
      'A solar appliance brand with strong offline sales had no e-commerce channel to reach home buyers and businesses seeking solar heaters, geysers, and water purification systems online.',
    timeline: [
      { phase: 'Discovery', duration: '1 week' },
      { phase: 'Store Design', duration: '2 weeks' },
      { phase: 'Development', duration: '4 weeks' },
      { phase: 'Launch', duration: '1 week' },
    ],
    resolved:
      'An e-commerce storefront showcasing solar water heaters, geysers, kitchen appliances, and purification systems — with detailed specs, category navigation, and seamless Razorpay checkout.',
    useCases: [
      { title: 'Product Discovery', description: 'Filter solar heaters, geysers, and purifiers by capacity, type, and rating.' },
      { title: 'Technical Specs', description: 'Detailed spec sheets and comparison tools to help buyers choose the right product.' },
      { title: 'Dealer Enquiry', description: 'B2B dealer and bulk order inquiry flow with structured requirements form.' },
      { title: 'Cart & Checkout', description: 'Streamlined purchase flow with Razorpay UPI, card, and net banking support.' },
    ],
  },

  'first-wave-fries': {
    tech: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Vercel'],
    problemStatement:
      'A fast-growing premium fries and shakes QSR chain had no digital storefront for showcasing the menu, locating outlets, or capturing franchise investor interest.',
    timeline: [
      { phase: 'Brand Discovery', duration: '1 week' },
      { phase: 'Design', duration: '2 weeks' },
      { phase: 'Development', duration: '3 weeks' },
      { phase: 'Launch', duration: '1 week' },
    ],
    resolved:
      'A vibrant brand website with a full digital menu, an interactive store locator, and a structured franchise inquiry intake — serving both hungry customers and potential franchise investors.',
    useCases: [
      { title: 'Digital Menu', description: 'Full menu with categories, descriptions, allergen info, and signature combos.' },
      { title: 'Store Locator', description: 'Interactive map of current outlets and announced upcoming locations.' },
      { title: 'Franchise Inquiry', description: 'Structured intake for franchise applicants with qualifying questions and investment details.' },
    ],
  },

  'fit-muscle': {
    tech: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Vercel'],
    problemStatement:
      'A premium 11,000 sq. ft. fitness facility had no website to showcase world-class amenities, communicate training programmes, or convert trial interest into memberships.',
    timeline: [
      { phase: 'Discovery', duration: '1 week' },
      { phase: 'Design', duration: '2 weeks' },
      { phase: 'Development', duration: '4 weeks' },
      { phase: 'Launch', duration: '1 week' },
    ],
    resolved:
      'A visually compelling fitness website presenting the facility, training programmes, membership tiers, and trial sign-up flows — designed to convert first-time visitors into members.',
    useCases: [
      { title: 'Amenity Showcase', description: 'Photo-led showcase of 11,000 sq. ft. facility, equipment zones, and class studios.' },
      { title: 'Training Programmes', description: 'Programme pages for strength training, cardio, group fitness, and personal coaching.' },
      { title: 'Membership Pricing', description: 'Clear tier breakdown with monthly, quarterly, and annual plan comparisons.' },
      { title: 'Trial Booking', description: 'Frictionless trial membership sign-up with time slot confirmation.' },
    ],
  },

  'swa-adhyay': {
    tech: ['React', 'Node.js', 'PostgreSQL', 'Razorpay', 'AWS S3', 'Tailwind CSS'],
    problemStatement:
      'KAS and IAS aspirants had no dedicated platform to purchase quality study materials, access downloadable resources, and stay updated on exam notifications — all in one place.',
    timeline: [
      { phase: 'Aspirant Research', duration: '2 weeks' },
      { phase: 'Platform Architecture', duration: '2 weeks' },
      { phase: 'Design', duration: '3 weeks' },
      { phase: 'Development', duration: '8 weeks' },
      { phase: 'Content Migration & Launch', duration: '2 weeks' },
    ],
    resolved:
      'A self-learning e-commerce platform combining a curated study-material shop, instant resource downloads, and an exam preparation news feed — built specifically for competitive exam aspirants.',
    useCases: [
      { title: 'Study Material Shop', description: 'Curated shop for KAS and IAS books, PDFs, and practice test bundles.' },
      { title: 'Downloadable Resources', description: 'Instant secure downloads for past papers, revision notes, and study guides.' },
      { title: 'Exam News Feed', description: 'Curated exam updates, official notifications, and important date alerts.' },
      { title: 'Personal Library', description: 'User library of purchased content with access management and re-download.' },
    ],
  },

  'alai-rescues': {
    tech: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Razorpay', 'Vercel'],
    problemStatement:
      'An animal rescue organisation had no digital presence to share their stories, recruit volunteers, showcase adoptable animals, or accept online donations — limiting their reach and impact.',
    timeline: [
      { phase: 'Community Research', duration: '1 week' },
      { phase: 'Design', duration: '2 weeks' },
      { phase: 'Development', duration: '4 weeks' },
      { phase: 'Launch', duration: '1 week' },
    ],
    resolved:
      'A compassion-led website with rescue stories, adoptable animal profiles, volunteer registration, and instant online donations — growing the rescue community and funding base digitally.',
    useCases: [
      { title: 'Adoption Profiles', description: 'Animal profiles with photos, health status, personality notes, and adoption inquiry forms.' },
      { title: 'Online Donations', description: 'One-click donation flows with custom amounts, recurring giving, and instant receipts.' },
      { title: 'Volunteer Sign-Up', description: 'Volunteer registration with role preferences, availability, and orientation scheduling.' },
      { title: 'Rescue Stories', description: 'Editorial section highlighting impactful rescues to build community and support.' },
    ],
  },

  'enrich-global-academy': {
    tech: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Vercel'],
    problemStatement:
      'A premier kindergarten needed a vibrant online presence to communicate their curriculum, showcase daily activities, and invite parent admissions enquiries — without a clear digital pathway.',
    timeline: [
      { phase: 'Discovery', duration: '1 week' },
      { phase: 'Design', duration: '3 weeks' },
      { phase: 'Development', duration: '4 weeks' },
      { phase: 'Launch', duration: '1 week' },
    ],
    resolved:
      'A child-friendly, colourful website presenting the curriculum, activity gallery, faculty profiles, and a structured admissions enquiry pathway — driving parent interest and application conversions.',
    useCases: [
      { title: 'Curriculum Overview', description: 'Grade-by-grade curriculum breakdown with learning objectives and milestone mapping.' },
      { title: 'Activity Gallery', description: 'Photo gallery of classroom activities, events, and field trip highlights.' },
      { title: 'Admissions Enquiry', description: 'Structured parent enquiry form with follow-up scheduling and grade selection.' },
      { title: 'Faculty Profiles', description: 'Teacher profiles with qualifications, specialisations, and classroom experience.' },
    ],
  },

  'sanchara-mitra-mechanic': {
    tech: ['React Native', 'Node.js', 'MongoDB', 'Google Maps API', 'Firebase', 'Socket.io'],
    problemStatement:
      'Field mechanics had no dedicated app for receiving job requests, navigating to customers, and managing payouts — relying on WhatsApp groups and manual cash-based coordination.',
    timeline: [
      { phase: 'Mechanic Interviews', duration: '2 weeks' },
      { phase: 'App Architecture', duration: '1 week' },
      { phase: 'Design', duration: '3 weeks' },
      { phase: 'Development', duration: '10 weeks' },
      { phase: 'Field Testing & Launch', duration: '2 weeks' },
    ],
    resolved:
      'A dedicated partner app for mechanics — receive nearby breakdown requests, navigate with in-app GPS, complete jobs with status updates, and receive 100% direct wallet payouts.',
    useCases: [
      { title: 'Job Requests', description: 'Nearby breakdown requests showing distance, job type, and customer details.' },
      { title: 'In-App Navigation', description: 'Turn-by-turn GPS routing to the customer\'s exact location with arrival confirmation.' },
      { title: 'Job Management', description: 'Accept, start, pause, and complete jobs with live customer status updates.' },
      { title: 'Direct Payouts', description: 'Wallet-based 100% earnings payout with withdrawal and transaction history.' },
    ],
  },
}

export const getCaseStudy = (slug: string): CaseStudy | undefined => caseStudies[slug]
