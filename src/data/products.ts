export interface Product {
  id: string
  name: string
  role: string
  period: string
  description: string
  stack: string[]
  url: string
  domain: string
  thumb: string
  /** Sites that set X-Frame-Options (banking platforms) can't render in an iframe. */
  embeddable: boolean
  embedNote?: string
  /** Store link, or null to show the badge greyed out (listing pending). */
  appStore?: string | null
  playStore?: string | null
}

export const products: Product[] = [
  {
    id: 'megzuri',
    name: 'MEGZURI',
    role: 'Founder · Full-stack',
    period: '2026 — present',
    description:
      'Mobile app helping Georgian drivers track average speed between section-camera zones. Trip guidance, live average-speed calculation, public leaderboard, and a daily data-ingestion pipeline for camera and traffic-fine data.',
    stack: ['React Native', 'Firebase', 'Firestore', 'Node.js', 'Cron jobs'],
    url: 'https://megzuri.info',
    domain: 'megzuri.info',
    thumb: '/thumbs/megzuri.png',
    embeddable: true,
    appStore: 'https://apps.apple.com/app/id6747527933',
    playStore: null,
  },
  {
    id: 'makershub',
    name: 'MakersHub',
    role: 'Full-stack',
    period: '2025 — 2026',
    description:
      'Marketplace where local makers open digital storefronts for handmade products. Multi-role auth, seller onboarding, listing management, admin dashboards, and transactional email — Next.js for SEO pages, a React SPA for admin.',
    stack: ['Next.js', 'React', 'Node.js', 'Express', 'MongoDB', 'Firestore'],
    url: 'https://makershub.ge',
    domain: 'makershub.ge',
    thumb: '/thumbs/makershub.png',
    embeddable: true,
  },
  {
    id: 'bogpay',
    name: 'BOG Pay',
    role: 'Lead frontend · Bank of Georgia',
    period: '2023 — 2026',
    description:
      'Public payments platform of Bank of Georgia. Config-driven dynamic forms powering 500+ uniquely structured services, built for reliability and UX clarity in a regulated environment.',
    stack: ['React', 'TypeScript', 'Redux', 'GraphQL', 'Tailwind'],
    url: 'https://bogpay.ge',
    domain: 'bogpay.ge',
    thumb: '/thumbs/bogpay.png',
    embeddable: false,
    embedNote: 'Banking platforms block embedding for security, so the preview opens on the site itself.',
  },
  {
    id: 'ibank',
    name: 'iBank',
    role: 'Lead frontend · Bank of Georgia',
    period: '2023 — 2026',
    description:
      'Online banking for business and retail customers. Secure Visa/MasterCard payment flows delivered by a dedicated frontend team working with UX, backend, and architecture.',
    stack: ['React', 'TypeScript', 'LitElement', 'GraphQL', 'Kubernetes'],
    url: 'https://ibank.bog.ge',
    domain: 'ibank.bog.ge',
    thumb: '/thumbs/ibank.png',
    embeddable: false,
    embedNote: 'Banking platforms block embedding for security, so the preview opens on the site itself.',
  },
  {
    id: 'carpool',
    name: 'Gamiyole',
    role: 'Freelance · Full-stack',
    period: '2021',
    description:
      'Carpooling app for affordable intercity travel in Georgia — drivers publish routes, passengers search and join, with profiles and driver ratings. Built end to end as a freelance project.',
    stack: ['React', 'Redux', 'Firebase'],
    url: 'https://react-http-7efc4.web.app',
    domain: 'react-http-7efc4.web.app',
    thumb: '/thumbs/carpool.png',
    embeddable: true,
    appStore: null,
    playStore: null,
  },
]
