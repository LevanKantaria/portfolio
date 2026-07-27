/**
 * All editable site content. Stored in Firestore (project
 * levankantaria-portfolio) so /admin can change it without a redeploy.
 *
 * The public site reads it over plain REST — no Firebase SDK in the main
 * bundle — and every field falls back to the baked-in default below, so the
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

export type Theme = 'porcelain' | 'instrument' | 'press'

export const THEMES: { id: Theme; name: string; blurb: string }[] = [
  {
    id: 'porcelain',
    name: 'Porcelain',
    blurb: 'Quiet editorial. Soft grey paper, wine accent, calm cards.',
  },
  {
    id: 'instrument',
    name: 'Instrument',
    blurb: 'Dark cockpit. Telemetry panels, cyan and amber readouts, mono labels.',
  },
  {
    id: 'press',
    name: 'Press',
    blurb: 'Signage poster. Huge type, ultramarine, hard-edged blocks.',
  },
]

export interface SiteContent {
  /* appearance */
  theme: Theme
  /* hero */
  eyebrow: string
  titleLead: string
  titleAccent: string
  heroLede: string
  openToWork: boolean
  ctaLabel: string
  /* contact + links */
  email: string
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
  chatGreeting: string
  chatSuggestions: string[]
  /* footer */
  footerLocation: string
  footerNote: string
}

export const DEFAULT_SITE_CONTENT: SiteContent = {
  theme: 'porcelain',
  eyebrow: 'Full-stack · React / TypeScript · Tbilisi, Georgia',
  titleLead: 'Shipped, and',
  titleAccent: 'still running',
  heroLede:
    "I'm a full-stack engineer with a frontend core. I've shipped payment " +
    "platforms for one of Georgia's largest banks, launched my own apps for " +
    'drivers and makers, and built AI into real products — including the ' +
    'assistant on this page. Everything here is live: open any card and use ' +
    'the real thing.',
  openToWork: true,
  ctaLabel: 'See the products',
  email: 'l.kantaria1999@gmail.com',
  linkedin: 'https://www.linkedin.com/in/levan-kantaria-bb223120b/',
  cv: 'https://drive.google.com/file/d/19-35F4dmYZR8mYcoXGwL00XB_0QUZqqJ/view?usp=sharing',
  productsNote: 'Real screenshots, real domains. Click a card for a live preview.',
  caseStudiesNote: 'A deeper look at how I work through real problems.',
  aboutParagraphs: [
    'Full-stack engineer with a frontend core — 5+ years building production ' +
      'fintech interfaces, payment flows, and product-focused web and mobile ' +
      'apps. At Bank of Georgia I led a frontend team in the online payments ' +
      'division until 2026; these days I take products from idea to launch on ' +
      'my own — most recently MEGZURI, an average-speed tracking app for ' +
      'Georgian drivers.',
    'I care about clear UX, clean architecture, and measurable business impact ' +
      '— and I work AI-assisted, using Claude Code and Cursor as part of a ' +
      'structured development workflow.',
  ],
  skills: [
    {
      label: 'Frontend',
      items: 'React · TypeScript · Next.js · React Native · Redux · Tailwind CSS',
    },
    {
      label: 'Backend',
      items: 'Node.js · Express · GraphQL · PostgreSQL · MongoDB · Firebase · AWS',
    },
    {
      label: 'AI-assisted development',
      items:
        'Claude Code · Cursor · OpenAI · rapid prototyping · structured prompt workflows',
    },
  ],
  timeline: [
    {
      period: '2023 — 2026',
      role: 'Senior Web Developer / Analyst',
      place: 'Bank of Georgia',
      note: 'Led frontend delivery for Visa/MasterCard payment platforms in the online payments division.',
    },
    {
      period: '2025 — present',
      role: 'Founder & Full-stack Developer',
      place: 'MEGZURI · MakersHub',
      note: 'Building and launching my own products end to end — mobile, web, backend, and data pipelines.',
    },
    {
      period: '2022',
      role: 'React Developer',
      place: 'Manufacture',
      note: 'Manufacturing workflow and middleware platform connecting clients — manufactured.com.',
    },
    {
      period: '2021 — 2022',
      role: 'Full-stack Developer',
      place: 'ITechArt',
      note: 'Luxury travel platform: authenticated user flows and full-stack features with React, TypeScript, GraphQL, and Node.js.',
    },
    {
      period: '2020 — 2021',
      role: 'Freelancer',
      place: 'Independent clients',
      note: 'Gamiyole carpool app and a Node.js trading bot on Discord, Binance, and TradingView APIs.',
    },
  ],
  chatGreeting:
    "Hi! I'm Levan's assistant. Ask me anything about his experience, " +
    'products, or how to get in touch.',
  chatSuggestions: [
    'What did Levan build at Bank of Georgia?',
    'Tell me about MEGZURI',
    'Is he available for hire?',
  ],
  footerLocation: 'Tbilisi, Georgia',
  footerNote: 'Built with React, TypeScript, and Vite.',
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
 * Deliberately empty values (a cleared field, an emptied list) are respected —
 * they're an editor's choice, not a failure.
 */
function pick<T>(stored: unknown, fallback: T): T {
  if (stored === undefined || stored === null) return fallback
  if (Array.isArray(fallback)) return (Array.isArray(stored) ? stored : fallback) as T
  if (typeof stored !== typeof fallback) return fallback
  return stored as T
}

function mergeSite(stored: Record<string, unknown> | null): SiteContent {
  if (!stored) return DEFAULT_SITE_CONTENT
  const d = DEFAULT_SITE_CONTENT
  const theme = THEMES.some((t) => t.id === stored.theme)
    ? (stored.theme as Theme)
    : d.theme
  return {
    theme,
    eyebrow: pick(stored.eyebrow, d.eyebrow),
    titleLead: pick(stored.titleLead, d.titleLead),
    titleAccent: pick(stored.titleAccent, d.titleAccent),
    heroLede: pick(stored.heroLede, d.heroLede),
    openToWork: typeof stored.openToWork === 'boolean' ? stored.openToWork : d.openToWork,
    ctaLabel: pick(stored.ctaLabel, d.ctaLabel),
    email: pick(stored.email, d.email),
    linkedin: pick(stored.linkedin, d.linkedin),
    cv: pick(stored.cv, d.cv),
    productsNote: pick(stored.productsNote, d.productsNote),
    caseStudiesNote: pick(stored.caseStudiesNote, d.caseStudiesNote),
    aboutParagraphs: pick(stored.aboutParagraphs, d.aboutParagraphs),
    skills: pick(stored.skills, d.skills),
    timeline: pick(stored.timeline, d.timeline),
    chatGreeting: pick(stored.chatGreeting, d.chatGreeting),
    chatSuggestions: pick(stored.chatSuggestions, d.chatSuggestions),
    footerLocation: pick(stored.footerLocation, d.footerLocation),
    footerNote: pick(stored.footerNote, d.footerNote),
  }
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
    // private mode — the theme still applies for this page view
  }
}

/** Last theme this visitor saw; used for the very first paint. */
export function applyCachedTheme() {
  try {
    const cached = localStorage.getItem(THEME_KEY)
    if (cached && THEMES.some((t) => t.id === cached)) {
      document.documentElement.dataset.theme = cached
    }
  } catch {
    // ignore
  }
}
