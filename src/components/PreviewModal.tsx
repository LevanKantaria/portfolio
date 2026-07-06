import { useEffect, useRef } from 'react'
import type { Product } from '../data/products'

interface Props {
  product: Product
  onClose: () => void
}

export function PreviewModal({ product, onClose }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={`Live preview of ${product.name}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="browser">
        <div className="browser-bar">
          <span className="browser-dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span className="browser-url">
            <span className="live-dot" aria-hidden="true" />
            {product.domain}
          </span>
          <div className="browser-actions">
            <a
              className="browser-open"
              href={product.url}
              target="_blank"
              rel="noreferrer"
            >
              Open site ↗
            </a>
            <button
              ref={closeRef}
              type="button"
              className="browser-close"
              onClick={onClose}
              aria-label="Close preview"
            >
              ✕
            </button>
          </div>
        </div>

        {product.embeddable ? (
          <iframe
            className="browser-frame"
            src={product.url}
            title={`Live preview of ${product.name}`}
          />
        ) : (
          <div className="browser-blocked">
            <img src={product.thumb} alt={`Screenshot of ${product.name}`} />
            <div className="browser-blocked-note">
              <p>{product.embedNote}</p>
              <a href={product.url} target="_blank" rel="noreferrer">
                Open {product.domain} ↗
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
