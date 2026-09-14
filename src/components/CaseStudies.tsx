import { useEffect, useState } from 'react'
import type { CaseStudy } from '../data/caseStudies'
import { Markdown } from './Markdown'

function CaseStudyCard({ study }: { study: CaseStudy }) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      <button type="button" className="case-card" onClick={() => setOpen(true)}>
        <span className="case-eyebrow">{study.eyebrow}</span>
        <span className="case-title">{study.title}</span>
        <span className="case-teaser">{study.teaser}</span>
        <span className="case-more">Read the case study</span>
      </button>

      {open && (
        <div
          className="modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby={`case-${study.id}`}
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false)
          }}
        >
          <article className="case-modal">
            <header className="modal-head">
              <p className="case-eyebrow">{study.eyebrow}</p>
              <button type="button" className="modal-close" onClick={() => setOpen(false)}>
                Close
              </button>
            </header>
            <div className="case-modal-body">
              <h2 id={`case-${study.id}`}>{study.title}</h2>
              <div className="prose">
                <Markdown text={study.bodyMd} />
              </div>
            </div>
          </article>
        </div>
      )}
    </>
  )
}

export function CaseStudies({ studies, note }: { studies: CaseStudy[]; note: string }) {
  if (studies.length === 0) return null

  return (
    <section id="case-studies" className="section cases">
      <div className="wrap">
        <header className="section-head">
          <h2>Case studies</h2>
          {note && <p>{note}</p>}
        </header>
        <div className="case-grid">
          {studies.map((s) => (
            <CaseStudyCard key={s.id || s.title} study={s} />
          ))}
        </div>
      </div>
    </section>
  )
}
