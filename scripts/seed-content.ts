/**
 * Push the baked-in defaults into Firestore.
 *
 *   ACCESS_TOKEN=$(...) npx tsx scripts/seed-content.ts
 *
 * Useful to seed a fresh project or to restore the shipped content if an edit
 * in /admin goes wrong. Overwrites content/site, content/products and
 * content/caseStudies; leaves content/persona alone.
 */

import { DEFAULT_SITE_CONTENT } from '../src/lib/content'
import { DEFAULT_PRODUCTS } from '../src/data/products'
import { DEFAULT_CASE_STUDIES } from '../src/data/caseStudies'

const PROJECT = 'levankantaria-portfolio'
const BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents/content`

type Json = string | number | boolean | null | Json[] | { [k: string]: Json }

function encode(value: Json): Record<string, unknown> {
  if (value === null) return { nullValue: null }
  if (typeof value === 'string') return { stringValue: value }
  if (typeof value === 'boolean') return { booleanValue: value }
  if (typeof value === 'number')
    return Number.isInteger(value) ? { integerValue: String(value) } : { doubleValue: value }
  if (Array.isArray(value)) return { arrayValue: { values: value.map(encode) } }
  return { mapValue: { fields: encodeFields(value) } }
}

function encodeFields(obj: Record<string, Json>): Record<string, unknown> {
  const fields: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined) continue
    fields[k] = encode(v)
  }
  return fields
}

async function write(docName: string, data: Record<string, Json>) {
  const token = process.env.ACCESS_TOKEN
  if (!token) throw new Error('ACCESS_TOKEN is required')
  const res = await fetch(`${BASE}/${docName}`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ fields: encodeFields(data) }),
  })
  if (!res.ok) throw new Error(`${docName}: ${res.status} ${await res.text()}`)
  console.log(`seeded content/${docName}`)
}

// JSON round-trip drops `undefined`, which Firestore rejects.
const plain = <T,>(v: T): Json => JSON.parse(JSON.stringify(v))

await write('site', plain(DEFAULT_SITE_CONTENT))
await write('products', { items: plain(DEFAULT_PRODUCTS) })
await write('caseStudies', { items: plain(DEFAULT_CASE_STUDIES) })
