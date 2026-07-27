import { lazy, Suspense, useEffect, useState } from 'react'
import type { Product } from './data/products'
import { ProductCard } from './components/ProductCard'
import { PreviewModal } from './components/PreviewModal'
import { ChatProvider, ChatWidget, HeroChat } from './components/Chat'
import { CaseStudies } from './components/CaseStudies'
import {
  fetchContent,
  applyTheme,
  applyCachedTheme,
  DEFAULT_CONTENT,
  type AllContent,
} from './lib/content'
import mePhoto from './assets/me-avatar.jpg'

// Password-protected content editor, code-split so the public site never
// loads the Firebase SDK.
const AdminPage = lazy(() => import('./admin/AdminPage'))
const isAdminRoute =
  window.location.pathname === '/admin' || window.location.hash === '#/admin'

// Paint the theme this visitor saw last, before React renders anything.
if (!isAdminRoute) applyCachedTheme()

export default function App() {
  const [open, setOpen] = useState<Product | null>(null)
  const [{ site, products, caseStudies }, setContent] =
    useState<AllContent>(DEFAULT_CONTENT)

  useEffect(() => {
    if (isAdminRoute) return
    fetchContent().then((c) => {
      applyTheme(c.site.theme)
      setContent(c)
    })
  }, [])

  if (isAdminRoute) {
    return (
      <Suspense fallback={<p style={{ padding: 40 }}>Loading admin…</p>}>
        <AdminPage />
      </Suspense>
    )
  }

  return (
    <ChatProvider greeting={site.chatGreeting} suggestions={site.chatSuggestions}>
      <header className="topbar">
        <div className="container topbar-inner">
          <a className="wordmark" href="#top">
            Levan Kantaria
          </a>
          <nav aria-label="Sections">
            <a href="#products">Products</a>
            {caseStudies.length > 0 && <a href="#case-studies">Case studies</a>}
            <a href="#about">About</a>
            <a href={`mailto:${site.email}`}>Contact</a>
          </nav>
        </div>
      </header>

      <main id="top">
        <section className="hero container">
          <div className="hero-grid">
            <div className="hero-copy">
              <p className="eyebrow">{site.eyebrow}</p>
              <h1>
                {site.titleLead} <em>{site.titleAccent}</em>.
              </h1>
              <p className="hero-lede">{site.heroLede}</p>
              <div className="hero-actions">
                <a className="btn btn-primary" href="#products">
                  {site.ctaLabel}
                </a>
                <a className="btn" href={`mailto:${site.email}`}>
                  {site.email}
                </a>
              </div>
            </div>
            <div className="hero-side">
              <div className="hero-profile">
                <div className="hero-avatar-wrap">
                  <img className="hero-avatar" src={mePhoto} alt="Levan Kantaria" />
                  {site.openToWork && (
                    <span className="open-badge">
                      <span className="live-dot" aria-hidden="true" />
                      Open to work
                    </span>
                  )}
                </div>
                <div className="profile-links">
                  {site.linkedin && (
                    <a
                      className="profile-icon"
                      href={site.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Levan on LinkedIn"
                      title="LinkedIn"
                    >
                      <svg viewBox="0 0 448 512" width="16" height="16" fill="currentColor" aria-hidden="true">
                        <path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z" />
                      </svg>
                    </a>
                  )}
                  {site.cv && (
                    <a className="btn-cv" href={site.cv} target="_blank" rel="noreferrer">
                      Download CV ↗
                    </a>
                  )}
                </div>
              </div>
              <HeroChat />
            </div>
          </div>
        </section>

        <section id="products" className="container products">
          <div className="section-head">
            <h2>Products</h2>
            <p>{site.productsNote}</p>
          </div>
          <div className="product-grid">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} onOpen={setOpen} />
            ))}
          </div>
        </section>

        <CaseStudies studies={caseStudies} note={site.caseStudiesNote} />

        <section id="about" className="container about">
          <div className="section-head">
            <h2>About</h2>
          </div>
          <div className="about-cols">
            <div className="about-text">
              {site.aboutParagraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
              <dl className="skills">
                {site.skills.map((s) => (
                  <div key={s.label} className="skills-row">
                    <dt>{s.label}</dt>
                    <dd>{s.items}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <ol className="timeline">
              {site.timeline.map((e, i) => (
                <li key={`${e.role}-${i}`}>
                  <span className="timeline-period">{e.period}</span>
                  <strong>{e.role}</strong>
                  <span className="timeline-place">{e.place}</span>
                  <p>{e.note}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer-inner">
          <p>
            Levan Kantaria · {site.footerLocation} ·{' '}
            <a href={`mailto:${site.email}`}>{site.email}</a>
          </p>
          <p className="footer-note">{site.footerNote}</p>
        </div>
      </footer>

      <ChatWidget />

      {open && <PreviewModal product={open} onClose={() => setOpen(null)} />}
    </ChatProvider>
  )
}
