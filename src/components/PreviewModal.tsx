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
      aria-label={`Preview of ${product.name}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="preview">
        <header className="preview-bar">
          <span className="preview-url">{product.domain}</span>
          <div className="preview-actions">
            <a className="preview-open" href={product.url} target="_blank" rel="noreferrer">
              Open site <span aria-hidden="true">↗</span>
            </a>
            <button ref={closeRef} type="button" className="modal-close" onClick={onClose}>
              Close
            </button>
          </div>
        </header>

        {product.embeddable ? (
          <iframe className="preview-frame" src={product.url} title={`Preview of ${product.name}`} />
        ) : (
          <div className="preview-blocked">
            <img src={product.thumb} alt={`Screenshot of ${product.name}`} />
            {product.embedNote && <p className="preview-note">{product.embedNote}</p>}
          </div>
        )}
      </div>
    </div>
  )
}
