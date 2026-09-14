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

const BANK_EMBED_NOTE = 'The bank blocks embedding, so this is a screenshot. The link opens the live site.'

/** Seed content and offline fallback. The live copy lives in Firestore. */
export const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 'megzuri',
    name: 'MEGZURI',
    role: 'Founder, full-stack',
    period: 'Jun 2025 – now',
    description:
      "An iOS app that shows Georgian drivers their average speed between section cameras, so they know they're under the limit before a fine arrives. More than 1,000 people use it, it's rated 5.0 on the App Store, and its camera and fine data update automatically every day.",
    stack: ['React Native', 'TypeScript', 'Node.js', 'Firebase', 'Firestore'],
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
    role: 'Founder, full-stack',
    period: 'Sep 2025 – now',
    description:
      'A marketplace where Georgian makers sell handmade goods, from ceramics to 3D prints. Storefronts render on the server with Next.js so they rank in search, while sellers and admins work in a separate React app. I built the onboarding, listings, dashboards and the Node.js API behind them.',
    stack: ['Next.js', 'React', 'TypeScript', 'Node.js', 'Express', 'MongoDB', 'Firestore'],
    url: 'https://makershub.ge',
    domain: 'makershub.ge',
    thumb: '/thumbs/makershub.png',
    embeddable: true,
  },
  {
    id: 'bogpay',
    name: 'BOG Pay',
    role: 'Frontend, Bank of Georgia',
    period: 'Feb 2023 – Apr 2026',
    description:
      "Bank of Georgia's public payments site. I designed the form engine behind it, which renders more than 500 differently structured services from configuration, so a new service can launch without a frontend release.",
    stack: ['React', 'TypeScript', 'Redux', 'GraphQL', 'Node.js'],
    url: 'https://bogpay.ge',
    domain: 'bogpay.ge',
    thumb: '/thumbs/bogpay.png',
    embeddable: false,
    embedNote: BANK_EMBED_NOTE,
  },
  {
    id: 'ibank',
    name: 'iBank',
    role: 'Frontend, Bank of Georgia',
    period: 'Feb 2023 – Apr 2026',
    description:
      "Online banking for Bank of Georgia's retail and business customers. I guided the five-person frontend team on its Visa and Mastercard payment flows, and built shared components for the bank-wide LitElement design system, including typed React wrappers so newer apps could use the same library.",
    stack: ['LitElement', 'Web Components', 'React', 'TypeScript', 'GraphQL'],
    url: 'https://ibank.bog.ge',
    domain: 'ibank.bog.ge',
    thumb: '/thumbs/ibank.png',
    embeddable: false,
    embedNote: BANK_EMBED_NOTE,
  },
  {
    id: 'carpool',
    name: 'Gamiyole',
    role: 'Freelance, full-stack',
    period: '2021',
    description:
      'A carpooling app for cheaper travel between Georgian cities. Drivers post routes, passengers search and book seats, and riders rate their drivers.',
    stack: ['React', 'Redux', 'Firebase'],
    url: 'https://gamiyole.me',
    domain: 'gamiyole.me',
    thumb: '/thumbs/carpool.png',
    embeddable: true,
    appStore: null,
    playStore: null,
  },
]
