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
