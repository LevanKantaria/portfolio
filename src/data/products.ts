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

/** Seed content and offline fallback. The live copy lives in Firestore. */
export const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 'megzuri',
    name: 'MEGZURI',
    role: 'Founder, full-stack',
    period: '2026 – now',
    description:
      "An iOS app that shows Georgian drivers their average speed between section cameras while they drive, so they know they're under the limit before a fine arrives. Camera and fine data update automatically every day.",
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
    role: 'Full-stack developer',
    period: '2025 – 2026',
    description:
      'A marketplace where Georgian makers sell handmade goods, from ceramics and candles to 3D prints. I built seller onboarding, listings, moderation and the admin dashboard. Public pages use Next.js so they rank in search.',
    stack: ['Next.js', 'React', 'Node.js', 'Express', 'MongoDB', 'Firestore'],
    url: 'https://makershub.ge',
    domain: 'makershub.ge',
    thumb: '/thumbs/makershub.png',
    embeddable: true,
  },
  {
    id: 'bogpay',
    name: 'BOG Pay',
    role: 'Frontend, Bank of Georgia',
    period: '2023 – 2026',
    description:
      "Bank of Georgia's public payments site. I worked on the form framework behind it, which renders more than 500 differently structured payment services from configuration.",
    stack: ['React', 'TypeScript', 'Redux', 'GraphQL', 'Tailwind'],
    url: 'https://bogpay.ge',
    domain: 'bogpay.ge',
    thumb: '/thumbs/bogpay.png',
    embeddable: false,
    embedNote: 'The bank blocks embedding, so this is a screenshot. The link opens the live site.',
  },
  {
    id: 'ibank',
    name: 'iBank',
    role: 'Frontend, Bank of Georgia',
    period: '2023 – 2026',
    description:
      "Online banking for Bank of Georgia's retail and business customers. I guided the five-person frontend team working on Visa and Mastercard payment flows.",
    stack: ['React', 'TypeScript', 'LitElement', 'GraphQL', 'Kubernetes'],
    url: 'https://ibank.bog.ge',
    domain: 'ibank.bog.ge',
    thumb: '/thumbs/ibank.png',
    embeddable: false,
    embedNote: 'The bank blocks embedding, so this is a screenshot. The link opens the live site.',
  },
  {
    id: 'carpool',
    name: 'Gamiyole',
    role: 'Freelance, full-stack',
    period: '2021',
    description:
      'A carpooling app for cheaper travel between Georgian cities. Drivers post routes, passengers search and book seats, and riders rate their drivers.',
    stack: ['React', 'Redux', 'Firebase'],
    url: 'https://react-http-7efc4.web.app',
    domain: 'react-http-7efc4.web.app',
    thumb: '/thumbs/carpool.png',
    embeddable: true,
    appStore: null,
    playStore: null,
  },
]
