import { useState } from 'react'
import type { Product } from '../data/products'
import { ProductBadges } from './ProductBadges'

interface Props {
  product: Product
  onOpen: (product: Product) => void
}

export function ProductCard({ product, onOpen }: Props) {
  const [thumbMissing, setThumbMissing] = useState(false)

  return (
    <article className="card">
      <button
        type="button"
        className="card-shot"
        onClick={() => onOpen(product)}
        aria-label={`Open live preview of ${product.name}`}
      >
        {thumbMissing ? (
          <span className="card-shot-fallback" aria-hidden="true">
            {product.name}
          </span>
        ) : (
          <img
            src={product.thumb}
            alt={`Screenshot of ${product.name}`}
            loading="lazy"
            onError={() => setThumbMissing(true)}
          />
        )}
        <span className="card-shot-cta">Live preview</span>
      </button>

      <div className="card-body">
        <header className="card-head">
          <span className="card-title">
            <h3>{product.name}</h3>
            <ProductBadges product={product} />
          </span>
          <span className="card-period">{product.period}</span>
        </header>
        <p className="card-role">{product.role}</p>
        <p className="card-desc">{product.description}</p>
        <ul className="card-stack" aria-label="Technologies">
          {product.stack.map((tech) => (
            <li key={tech}>{tech}</li>
          ))}
        </ul>
        <a
          className="card-domain"
          href={product.url}
          target="_blank"
          rel="noreferrer"
        >
          <span className="live-dot" aria-hidden="true" />
          {product.domain}
        </a>
      </div>
    </article>
  )
}
