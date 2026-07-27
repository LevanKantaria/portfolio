import Anthropic from '@anthropic-ai/sdk'
import type { IncomingMessage, ServerResponse } from 'node:http'
import {
  EXPERIENCE_MD,
  buildAnswerSystem,
  FILTER_SYSTEM,
  OFF_TOPIC_REPLY,
  MAX_MESSAGE_CHARS,
  MAX_HISTORY_MESSAGES,
} from './_lib/persona.js'

export const config = { supportsResponseStreaming: true }

const ANSWER_MODEL = 'claude-sonnet-5'
const FILTER_MODEL = 'claude-haiku-4-5'
const ANSWER_MAX_TOKENS = 700

// Per-isolate rate limit: 20 requests per 10 minutes per IP. Serverless
// instances are ephemeral, so this is burst protection, not a hard quota —
// pair it with a spend limit on the API key.
const RATE_LIMIT = 20
const RATE_WINDOW_MS = 10 * 60 * 1000
const hits = new Map<string, number[]>()

// The experience document lives in Firestore so Levan can edit it from /admin
// without redeploying. Cached per warm instance; falls back to the baked-in
// copy if Firestore is unreachable.
const FIRESTORE_DOC =
  'https://firestore.googleapis.com/v1/projects/levankantaria-portfolio/databases/(default)/documents/content/persona'
const EXPERIENCE_CACHE_MS = 60 * 1000
let cachedExperience = EXPERIENCE_MD
let cachedAt = 0

async function getExperience(): Promise<string> {
  const now = Date.now()
  if (now - cachedAt < EXPERIENCE_CACHE_MS) return cachedExperience
  try {
    const res = await fetch(FIRESTORE_DOC, { signal: AbortSignal.timeout(3000) })
    if (res.ok) {
      const doc = (await res.json()) as {
        fields?: { experienceMd?: { stringValue?: string } }
      }
      const md = doc.fields?.experienceMd?.stringValue
      if (md && md.trim().length > 0) cachedExperience = md
    }
  } catch {
    // keep whatever we had — worst case the baked-in fallback
  }
  cachedAt = now
  return cachedExperience
}

function rateLimited(ip: string): boolean {
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS)
  recent.push(now)
  hits.set(ip, recent)
  return recent.length > RATE_LIMIT
}

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

function badRequest(message: string): Response {
  return Response.json({ error: message }, { status: 400 })
}

function validate(body: unknown): ChatMessage[] | null {
  if (typeof body !== 'object' || body === null) return null
  const { messages } = body as { messages?: unknown }
  if (!Array.isArray(messages) || messages.length === 0 || messages.length > 40) return null

  const valid: ChatMessage[] = []
  for (const m of messages) {
    if (
      typeof m !== 'object' ||
      m === null ||
      (m.role !== 'user' && m.role !== 'assistant') ||
      typeof m.content !== 'string' ||
      m.content.trim().length === 0 ||
      m.content.length > MAX_MESSAGE_CHARS
    ) {
      return null
    }
    valid.push({ role: m.role, content: m.content })
  }
  if (valid[valid.length - 1].role !== 'user') return null

  // Keep the tail of the conversation; the API requires the first message
  // to be from the user.
  let trimmed = valid.slice(-MAX_HISTORY_MESSAGES)
  while (trimmed.length > 0 && trimmed[0].role !== 'user') trimmed = trimmed.slice(1)
  return trimmed.length > 0 ? trimmed : null
}

async function isOnTopic(client: Anthropic, messages: ChatMessage[]): Promise<boolean> {
  const transcript = messages
    .slice(-6)
    .map((m) => `${m.role === 'user' ? 'Visitor' : 'Assistant'}: ${m.content}`)
    .join('\n')

  try {
    const result = await client.messages.create({
      model: FILTER_MODEL,
      max_tokens: 64,
      system: FILTER_SYSTEM,
      messages: [{ role: 'user', content: transcript }],
      output_config: {
        format: {
          type: 'json_schema',
          schema: {
            type: 'object',
            properties: { relevant: { type: 'boolean' } },
            required: ['relevant'],
            additionalProperties: false,
          },
        },
      },
    })
    const block = result.content.find((b) => b.type === 'text')
    if (!block) return true
    return (JSON.parse(block.text) as { relevant: boolean }).relevant
  } catch {
    // If the filter fails, let the grounded answer prompt do the gatekeeping
    // rather than breaking the chat.
    return true
  }
}

/** Web-standard core handler — used directly by the Vite dev server. */
export async function chatHandler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return Response.json({ error: 'Chat is not configured' }, { status: 503 })
  }

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  if (rateLimited(ip)) {
    return Response.json({ error: 'Too many requests — try again in a few minutes' }, { status: 429 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return badRequest('Invalid JSON body')
  }

  const messages = validate(body)
  if (!messages) {
    return badRequest(`Expected {messages: [{role, content}]} ending with a user message, each up to ${MAX_MESSAGE_CHARS} characters`)
  }

  const client = new Anthropic({ apiKey })

  if (!(await isOnTopic(client, messages))) {
    return new Response(OFF_TOPIC_REPLY, {
      headers: { 'content-type': 'text/plain; charset=utf-8' },
    })
  }

  const stream = client.messages.stream({
    model: ANSWER_MODEL,
    max_tokens: ANSWER_MAX_TOKENS,
    // Short factual Q&A doesn't need reasoning depth — skip thinking and run
    // at low effort for faster, cheaper replies.
    thinking: { type: 'disabled' },
    output_config: { effort: 'low' },
    system: [
      {
        type: 'text',
        text: buildAnswerSystem(await getExperience()),
        cache_control: { type: 'ephemeral' },
      },
    ],
    messages,
  })

  const encoder = new TextEncoder()
  const readable = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
            controller.enqueue(encoder.encode(event.delta.text))
          }
        }
        controller.close()
      } catch (err) {
        controller.error(err)
      }
    },
  })

  return new Response(readable, {
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  })
}

/**
 * Vercel Node.js runtime entrypoint — adapts the classic (req, res) shape
 * to the web-standard core handler and streams the response through.
 */
export default async function handler(
  req: IncomingMessage & { body?: unknown },
  res: ServerResponse,
) {
  const headers = new Headers()
  for (const [key, value] of Object.entries(req.headers)) {
    if (typeof value === 'string') headers.set(key, value)
    else if (Array.isArray(value)) headers.set(key, value.join(', '))
  }

  const request = new Request(`https://${req.headers.host ?? 'localhost'}${req.url ?? '/'}`, {
    method: req.method,
    headers,
    // Vercel pre-parses JSON bodies onto req.body; re-serialize for the core handler.
    body: req.method === 'POST' ? JSON.stringify(req.body ?? null) : undefined,
  })

  const response = await chatHandler(request)
  res.writeHead(response.status, Object.fromEntries(response.headers.entries()))
  if (response.body) {
    const reader = response.body.getReader()
    for (;;) {
      const { done, value } = await reader.read()
      if (done) break
      res.write(value)
    }
  }
  res.end()
}
