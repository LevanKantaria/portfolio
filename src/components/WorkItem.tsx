import { useState } from 'react'
import type { Product } from '../data/products'

function StoreLink({ label, url }: { label: string; url: string | null | undefined }) {
  if (url === undefined) return null
  if (url === null) return <li className="work-link-soon">{label}, coming soon</li>
  return (
    <li>
      <a href={url} target="_blank" rel="noreferrer">
        {label} <span aria-hidden="true">↗</span>
      </a>
    </li>
  )
}

export function WorkItem({
  product,
  onOpen,
}: {
  product: Product
  onOpen: (product: Product) => void
}) {
  const [thumbMissing, setThumbMissing] = useState(false)

  return (
    <article className="work">
      <button
        type="button"
        className="work-shot"
        onClick={() => onOpen(product)}
        aria-label={`Open a preview of ${product.name}`}
      >
        {thumbMissing ? (
          <span className="work-shot-fallback" aria-hidden="true">
            {product.name}
          </span>
        ) : (
          <img
            src={product.thumb}
            alt=""
            loading="lazy"
            onError={() => setThumbMissing(true)}
          />
        )}
        <span className="work-shot-label">
          {product.embeddable ? 'Open preview' : 'View screenshot'}
        </span>
      </button>

      <div className="work-meta">
        <p className="work-period">{product.period}</p>
        <h3 className="work-name">{product.name}</h3>
        <p className="work-role">{product.role}</p>
        <p className="work-desc">{product.description}</p>
        {product.stack.length > 0 && (
          <p className="work-stack">
            <span className="work-stack-label">Built with</span> {product.stack.join(', ')}
          </p>
        )}
        <ul className="work-links">
          {product.url && (
            <li>
              <a href={product.url} target="_blank" rel="noreferrer">
                {product.domain || 'Website'} <span aria-hidden="true">↗</span>
              </a>
            </li>
          )}
          <StoreLink label="App Store" url={product.appStore} />
          <StoreLink label="Google Play" url={product.playStore} />
        </ul>
      </div>
    </article>
  )
}
