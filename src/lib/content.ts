/**
 * All editable site content. Stored in Firestore (project
 * levankantaria-portfolio) so /admin can change it without a redeploy.
 *
 * The public site reads it over plain REST (no Firebase SDK in the main
 * bundle), and every field falls back to the baked-in default below, so the
 * site renders instantly and never breaks if Firestore is unreachable.
 */

import { DEFAULT_PRODUCTS, type Product } from '../data/products'
import { DEFAULT_CASE_STUDIES, type CaseStudy } from '../data/caseStudies'

export type { Product, CaseStudy }

export const FIREBASE_CONFIG = {
  apiKey: 'AIzaSyDX2InhJD3HPzM-geXzoxmft3bBupbwwto',
  authDomain: 'levankantaria-portfolio.firebaseapp.com',
  projectId: 'levankantaria-portfolio',
  appId: '1:349566887471:web:924f0e266c3d5de48fc8da',
}

const DOCS_URL = `https://firestore.googleapis.com/v1/projects/${FIREBASE_CONFIG.projectId}/databases/(default)/documents`

export interface SkillRow {
  label: string
  items: string
}

export interface TimelineEntry {
  period: string
  role: string
  place: string
  note: string
}

export type Theme = 'saperavi' | 'instrument' | 'press'

export const THEMES: { id: Theme; name: string; blurb: string }[] = [
  {
    id: 'saperavi',
    name: 'Saperavi',
    blurb: 'Deep Georgian wine, a large bilingual name, serif reading type.',
  },
  {
    id: 'instrument',
    name: 'Instrument',
    blurb: 'Dark cockpit. Cyan readouts, monospace labels.',
  },
  {
    id: 'press',
    name: 'Press',
    blurb: 'Signage poster. Ultramarine field, heavy capitals, hard shadows.',
  },
]

/** Map stored or cached values (including the retired "porcelain") to a current theme. */
export function normalizeTheme(value: unknown): Theme {
  if (value === 'porcelain') return 'saperavi'
  return THEMES.some((t) => t.id === value) ? (value as Theme) : 'saperavi'
}

export interface SiteContent {
  /* appearance */
  theme: Theme
  /* hero */
  name: string
  nameNative: string
  eyebrow: string
  heroLede: string
  openToWork: boolean
  availabilityNote: string
  /* contact + links */
  email: string
  phone: string
  linkedin: string
  cv: string
  /* section intros */
  productsNote: string
  caseStudiesNote: string
  /* about */
  aboutParagraphs: string[]
  skills: SkillRow[]
  timeline: TimelineEntry[]
  /* chat */
  askHint: string
  chatGreeting: string
  chatSuggestions: string[]
  /* contact band + footer */
  contactHeading: string
  footerLocation: string
  footerNote: string
}

export const DEFAULT_SITE_CONTENT: SiteContent = {
  theme: 'saperavi',
  name: 'Levan Kantaria',
  nameNative: 'ლევან ქანთარია',
  eyebrow: 'Full-stack engineer in Tbilisi',
  heroLede:
    "I'm a full-stack engineer, strongest on the frontend. At Bank of Georgia I " +
    'worked on the bank-wide design system and built the form engine behind more ' +
    'than 500 payment services. Now I run my own products, including MEGZURI, a ' +
    'driving app used by more than 1,000 people.',
  openToWork: true,
  availabilityNote: 'Available for full-time and freelance work, remote or in Tbilisi.',
  email: 'l.kantaria1999@gmail.com',
  phone: '+995 592 282 824',
  linkedin: 'https://www.linkedin.com/in/levan-kantaria/',
  cv: 'https://drive.google.com/file/d/19-35F4dmYZR8mYcoXGwL00XB_0QUZqqJ/view?usp=sharing',
  productsNote: 'Click a screenshot to open the site.',
  caseStudiesNote: 'Two projects in more detail.',
  aboutParagraphs: [
    "I've spent more than five years building web products that people rely on " +
      'every day. At Bank of Georgia I worked in the online payments division, on ' +
      'public banking platforms with a regulated release process and a high bar ' +
      'for correctness. I built shared components for the bank-wide LitElement ' +
      'design system, wrapped them as typed React components so newer apps could ' +
      'use the same library, and designed a form engine that renders more than 500 ' +
      'differently structured services from configuration.',
    "Since mid-2025 I've been building my own products. MEGZURI helps Georgian " +
      'drivers stay under the limit between section cameras, and MakersHub gives ' +
      'local makers a place to sell online. On both I own the whole stack, from ' +
      'the React and React Native apps to the Node.js services behind them, and I ' +
      'use Claude Code and Cursor every day.',
  ],
  skills: [
    { label: 'Frontend', items: 'TypeScript, React, Next.js, React Native, Redux, Zustand, Tailwind CSS' },
    {
      label: 'Design systems',
      items: 'LitElement, Web Components, shared component libraries, component API design, Lit and React interop',
    },
    { label: 'Backend', items: 'Node.js, Express, GraphQL, REST, PostgreSQL, MongoDB, Firebase' },
    { label: 'Infrastructure', items: 'AWS, Docker, Kubernetes, CI/CD with Jenkins and GitHub Actions' },
    { label: 'Practice', items: 'Automated testing, code review, Claude API, Claude Code, Cursor' },
  ],
  timeline: [
    {
      period: 'Jun 2025 – now',
      role: 'Founder, full-stack developer',
      place: 'MEGZURI and MakersHub',
      note: 'Building and running two products of my own: the apps, the APIs, the admin tools and the releases.',
    },
    {
      period: 'Feb 2023 – Apr 2026',
      role: 'Senior web developer, analyst',
      place: 'Bank of Georgia',
      note: 'Shared components for the bank-wide LitElement design system, a typed React bridge for it, and a form engine behind more than 500 payment services.',
    },
    {
      period: '2022',
      role: 'React developer',
      place: 'Manufacture',
      note: 'A workflow platform connecting manufacturers with their clients.',
    },
    {
      period: 'Feb 2022 – Jan 2023',
      role: 'Frontend developer',
      place: 'ITechArt',
      note: 'A luxury travel platform built from scratch on the MERN stack, where I owned both the React client and the Node.js API.',
    },
    {
      period: 'Nov 2020 – Jan 2022',
      role: 'Freelance developer',
      place: 'Independent clients',
      note: 'Gamiyole, a carpooling app for travel between Georgian cities, and a trading bot connected to Binance and TradingView.',
    },
  ],
  askHint: 'An assistant I built with the Claude API. It answers from my CV and project notes.',
  chatGreeting:
    "Ask me about Levan's projects, experience or availability. " +
    'I answer from his CV and project notes.',
  chatSuggestions: [
    'What did he build at Bank of Georgia?',
    'How does MEGZURI work?',
    'Is he available for new work?',
  ],
  contactHeading: 'Get in touch',
  footerLocation: 'Tbilisi, Georgia',
  footerNote: 'I designed and built this site.',
}

export interface AllContent {
  site: SiteContent
  products: Product[]
  caseStudies: CaseStudy[]
}

export const DEFAULT_CONTENT: AllContent = {
  site: DEFAULT_SITE_CONTENT,
  products: DEFAULT_PRODUCTS,
  caseStudies: DEFAULT_CASE_STUDIES,
}

/* ---------- Firestore REST decoding ---------- */

type FirestoreValue = Record<string, unknown>

function decodeValue(v: FirestoreValue): unknown {
  if ('stringValue' in v) return v.stringValue
  if ('booleanValue' in v) return v.booleanValue
  if ('integerValue' in v) return Number(v.integerValue)
  if ('doubleValue' in v) return v.doubleValue
  if ('nullValue' in v) return null
  if ('arrayValue' in v) {
    const arr = (v.arrayValue as { values?: FirestoreValue[] })?.values ?? []
    return arr.map(decodeValue)
  }
  if ('mapValue' in v) {
    const fields = (v.mapValue as { fields?: Record<string, FirestoreValue> })?.fields ?? {}
    return decodeFields(fields)
  }
  return undefined
}

function decodeFields(fields: Record<string, FirestoreValue>): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(fields)) out[k] = decodeValue(v)
  return out
}

async function fetchDoc(name: string): Promise<Record<string, unknown> | null> {
  try {
    const res = await fetch(`${DOCS_URL}/content/${name}?key=${FIREBASE_CONFIG.apiKey}`)
    if (!res.ok) return null
    const doc = (await res.json()) as { fields?: Record<string, FirestoreValue> }
    return doc.fields ? decodeFields(doc.fields) : null
  } catch {
    return null
  }
}

/**
 * Fall back to the default when a value is missing or the wrong shape.
 * Deliberately empty values (a cleared field, an emptied list) are respected:
 * they're an editor's choice, not a failure.
 */
function pick<T>(stored: unknown, fallback: T): T {
  if (stored === undefined || stored === null) return fallback
  if (Array.isArray(fallback)) return (Array.isArray(stored) ? stored : fallback) as T
  if (typeof stored !== typeof fallback) return fallback
  return stored as T
}

/** Merge a stored site doc over the defaults, field by field. */
export function mergeSite(stored: Record<string, unknown> | null): SiteContent {
  if (!stored) return DEFAULT_SITE_CONTENT
  const d = DEFAULT_SITE_CONTENT
  const merged = { ...d } as Record<string, unknown>
  for (const key of Object.keys(d) as (keyof SiteContent)[]) {
    merged[key] = pick(stored[key], d[key])
  }
  merged.theme = normalizeTheme(stored.theme)
  return merged as unknown as SiteContent
}

export async function fetchContent(): Promise<AllContent> {
  const [site, products, caseStudies] = await Promise.all([
    fetchDoc('site'),
    fetchDoc('products'),
    fetchDoc('caseStudies'),
  ])
  return {
    site: mergeSite(site),
    products: pick(products?.items, DEFAULT_PRODUCTS),
    caseStudies: pick(caseStudies?.items, DEFAULT_CASE_STUDIES),
  }
}

/* ---------- theme ---------- */

const THEME_KEY = 'lk-theme'

/** Apply immediately and remember it, so repeat visits don't flash the default. */
export function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme
  try {
    localStorage.setItem(THEME_KEY, theme)
  } catch {
    // private mode: the theme still applies for this page view
  }
}

/** Last theme this visitor saw; used for the very first paint. */
export function applyCachedTheme() {
  try {
    const cached = localStorage.getItem(THEME_KEY)
    if (cached) document.documentElement.dataset.theme = normalizeTheme(cached)
  } catch {
    // ignore
  }
}
