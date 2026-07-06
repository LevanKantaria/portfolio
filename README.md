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
