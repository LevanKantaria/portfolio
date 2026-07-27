# levankantaria — portfolio

Personal portfolio: React + TypeScript + Vite.

## Run

```sh
npm install
npm run dev      # local dev on http://localhost:5173
npm run build    # production build in dist/
```

## Product thumbnails

Cards read screenshots from `public/thumbs/<id>.png` (ids in `src/data/products.ts`).
To replace one, drop a new PNG over the existing file — 1440×900 or any 16:10 crop looks best.
`manufactured.png` is currently missing; the card shows a text placeholder until you add it.

## Adding a product

Add an entry to `src/data/products.ts` and a screenshot in `public/thumbs/`.
Set `embeddable: false` for sites that block iframes (banking, anything with
`X-Frame-Options`); those get a screenshot + "open site" preview instead.

## AI chat assistant

The chat widget calls `api/chat.ts` (a Vercel edge function), which answers
questions about Levan from the document in `api/_lib/persona.ts`.

Pipeline: input capped at 500 chars → request validated server-side →
`claude-haiku-4-5` classifies whether the question is about Levan (off-topic
gets a canned reply, costs almost nothing) → `claude-sonnet-5` answers from
the experience document only, streamed back to the widget. The prompt forbids
answering beyond the document — unknowns get "I don't know, email Levan".

Setup:

1. Get an API key at console.anthropic.com and set a monthly spend limit.
2. Local dev: put `ANTHROPIC_API_KEY=sk-ant-...` in `.env.local` (gitignored).
3. Production: add `ANTHROPIC_API_KEY` in Vercel → Project → Settings →
   Environment Variables. The `api/` directory deploys automatically.

To change what the bot knows or how it behaves, edit `EXPERIENCE_MD` and the
prompts in `api/_lib/persona.ts`.

## Dynamic content & admin

Editable content lives in Firestore (Firebase project `levankantaria-portfolio`,
docs `content/persona` and `content/site`) so text changes need no redeploy:

- `/admin` — password-protected editor (Firebase Auth, only Levan's account can
  write, enforced by `firestore.rules`). Tabs cover every piece of copy on the
  site: hero and profile links, about paragraphs / skills / timeline, the
  product cards (add, remove, reorder, store badges), the case studies
  (Markdown bodies), and the chatbot's greeting, suggestions, and knowledge
  document.
- **Appearance** tab switches the whole site between three designs —
  `porcelain` (quiet editorial), `instrument` (dark cockpit) and `press`
  (signage poster). Each is a `html[data-theme]` block in `src/themes.css`;
  the last-seen theme is cached in localStorage so repeat visits don't flash.
- Firestore docs: `content/site`, `content/products`, `content/caseStudies`,
  `content/persona`. Every field falls back to the baked-in defaults in
  `src/lib/content.ts`, `src/data/products.ts` and `src/data/caseStudies.ts`,
  so the site still renders if Firestore is unreachable.
- `ACCESS_TOKEN=… npx tsx scripts/seed-content.ts` re-seeds those docs from the
  baked-in defaults — handy to restore known-good content.
- The chat function re-reads the knowledge doc at most every 60s and falls back
  to the baked-in copy in `api/_lib/persona.ts` if Firestore is unreachable.
- The homepage hydrates hero fields from Firestore with baked-in defaults.

Deploy rules with `firebase deploy --only firestore:rules`.
