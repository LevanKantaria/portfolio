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
        <p className="case-eyebrow">{study.eyebrow}</p>
        <h3>{study.title}</h3>
        <p className="case-teaser">{study.teaser}</p>
        <span className="case-more">Read case study →</span>
      </button>

      {open && (
        <div
          className="modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-label={study.title}
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false)
          }}
        >
          <article className="case-modal">
            <header className="case-modal-head">
              <p className="case-eyebrow">{study.eyebrow}</p>
              <button
                type="button"
                className="case-modal-close"
                onClick={() => setOpen(false)}
                aria-label="Close case study"
              >
                ✕
              </button>
            </header>
            <div className="case-modal-body">
              <h3>{study.title}</h3>
              <div className="case-prose">
                <Markdown text={study.bodyMd} />
              </div>
            </div>
          </article>
        </div>
      )}
    </>
  )
}

export function CaseStudies({
  studies,
  note,
}: {
  studies: CaseStudy[]
  note: string
}) {
  if (studies.length === 0) return null

  return (
    <section id="case-studies" className="container case-studies">
      <div className="section-head">
        <h2>Case studies</h2>
        <p>{note}</p>
      </div>

      <div className="case-grid">
        {studies.map((s) => (
          <CaseStudyCard key={s.id || s.title} study={s} />
        ))}
      </div>
    </section>
  )
}
