/**
 * Dynamic site content stored in Firestore (project: levankantaria-portfolio).
 * The public site reads it via plain REST — no Firebase SDK in the main bundle.
 * Every field has a baked-in default so the site renders instantly and never
 * breaks if Firestore is unreachable.
 */

export const FIREBASE_CONFIG = {
  apiKey: 'AIzaSyDX2InhJD3HPzM-geXzoxmft3bBupbwwto',
  authDomain: 'levankantaria-portfolio.firebaseapp.com',
  projectId: 'levankantaria-portfolio',
  appId: '1:349566887471:web:924f0e266c3d5de48fc8da',
}

const DOCS_URL = `https://firestore.googleapis.com/v1/projects/${FIREBASE_CONFIG.projectId}/databases/(default)/documents`

export interface SiteContent {
  openToWork: boolean
  heroLede: string
}

export const DEFAULT_SITE_CONTENT: SiteContent = {
  openToWork: true,
  heroLede:
    "I'm a full-stack engineer with a frontend core. I've shipped payment " +
    "platforms for one of Georgia's largest banks, launched my own apps for " +
    'drivers and makers, and built AI into real products — including the ' +
    'assistant on this page. Everything here is live: open any card and use ' +
    'the real thing.',
}

interface FirestoreValue {
  stringValue?: string
  booleanValue?: boolean
}

type FirestoreFields = Record<string, FirestoreValue>

export async function fetchSiteContent(): Promise<SiteContent> {
  try {
    const res = await fetch(`${DOCS_URL}/content/site?key=${FIREBASE_CONFIG.apiKey}`)
    if (!res.ok) return DEFAULT_SITE_CONTENT
    const doc = (await res.json()) as { fields?: FirestoreFields }
    return {
      openToWork: doc.fields?.openToWork?.booleanValue ?? DEFAULT_SITE_CONTENT.openToWork,
      heroLede: doc.fields?.heroLede?.stringValue || DEFAULT_SITE_CONTENT.heroLede,
    }
  } catch {
    return DEFAULT_SITE_CONTENT
  }
}
