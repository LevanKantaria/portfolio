import type { ReactNode } from 'react'

/**
 * Tiny markdown renderer for admin-authored copy: #### headings, paragraphs,
 * "- " bullet lists, and *emphasis*. Builds React elements (never
 * dangerouslySetInnerHTML), so stored text can't inject markup.
 */

function inline(text: string, keyBase: string): ReactNode[] {
  // Split on *emphasis* — odd-indexed parts are the emphasised runs.
  return text.split(/\*([^*]+)\*/g).map((part, i) =>
    i % 2 === 1 ? <em key={`${keyBase}-${i}`}>{part}</em> : part,
  )
}

export function Markdown({ text }: { text: string }) {
  const blocks: ReactNode[] = []
  let bullets: string[] = []

  const flushBullets = () => {
    if (bullets.length === 0) return
    const items = bullets
    blocks.push(
      <ul key={`ul-${blocks.length}`}>
        {items.map((b, i) => (
          <li key={i}>{inline(b, `li-${blocks.length}-${i}`)}</li>
        ))}
      </ul>,
    )
    bullets = []
  }

  for (const rawBlock of text.replace(/\r\n/g, '\n').split(/\n{2,}/)) {
    const block = rawBlock.trim()
    if (!block) continue

    for (const line of block.split('\n')) {
      const trimmed = line.trim()
      if (!trimmed) continue

      const heading = /^(#{2,4})\s+(.*)$/.exec(trimmed)
      if (heading) {
        flushBullets()
        blocks.push(
          <h4 key={`h-${blocks.length}`}>{inline(heading[2], `h-${blocks.length}`)}</h4>,
        )
        continue
      }

      const bullet = /^[-*]\s+(.*)$/.exec(trimmed)
      if (bullet) {
        bullets.push(bullet[1])
        continue
      }

      flushBullets()
      blocks.push(
        <p key={`p-${blocks.length}`}>{inline(trimmed, `p-${blocks.length}`)}</p>,
      )
    }
    flushBullets()
  }

  return <>{blocks}</>
}
