import { lazy, Suspense, useCallback, useEffect, useState } from 'react'
import type { Product } from './data/products'
import { WorkItem } from './components/WorkItem'
import { PreviewModal } from './components/PreviewModal'
import { AskBar, ChatProvider, useChat } from './components/Chat'
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

function NavAsk() {
  const { open } = useChat()
  return (
    <button type="button" className="nav-ask" onClick={() => open()}>
      Ask
    </button>
  )
}

/** "https://www.linkedin.com/in/levan-kantaria-bb223120b/" -> "in/levan-kantaria-bb223120b" */
function linkedinLabel(url: string) {
  const match = /linkedin\.com\/(in\/[^/?#]+)/i.exec(url)
  return match ? match[1] : 'Profile'
}

export default function App() {
  const [preview, setPreview] = useState<Product | null>(null)
  const [{ site, products, caseStudies }, setContent] = useState<AllContent>(DEFAULT_CONTENT)
  const closePreview = useCallback(() => setPreview(null), [])

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

  const year = new Date().getFullYear()

  return (
    <ChatProvider
      greeting={site.chatGreeting}
      suggestions={site.chatSuggestions}
      hint={site.askHint}
    >
      <div className="hero-band">
        <header className="site-header">
          <div className="wrap header-inner">
            <a className="wordmark" href="#top">
              {site.name}
            </a>
            <nav aria-label="Sections">
              <a href="#work">Work</a>
              {caseStudies.length > 0 && (
                <a className="nav-optional" href="#case-studies">
                  Case studies
                </a>
              )}
              <a className="nav-optional" href="#about">
                About
              </a>
              <NavAsk />
              {site.cv && (
                <a className="nav-cv" href={site.cv} target="_blank" rel="noreferrer">
                  CV
                </a>
              )}
            </nav>
          </div>
        </header>

        <section className="hero" id="top">
          <div className="wrap hero-grid">
            <div className="hero-main">
              {site.eyebrow && <p className="hero-eyebrow">{site.eyebrow}</p>}
              <h1 className="hero-name">
                {site.name.split(' ').map((word, i) => (
                  <span key={i} className="hero-name-line">
                    {word}
                  </span>
                ))}
              </h1>
              {site.nameNative && (
                <p className="hero-native" lang="ka">
                  {site.nameNative}
                </p>
              )}
            </div>

            <img className="hero-photo" src={mePhoto} alt={site.name} />

            <div className="hero-copy">
              <p className="hero-lede">{site.heroLede}</p>
              <AskBar />
            </div>

            <dl className="hero-facts">
              {site.openToWork && site.availabilityNote && (
                <div>
                  <dt>Status</dt>
                  <dd className="fact-status">{site.availabilityNote}</dd>
                </div>
              )}
              <div>
                <dt>Email</dt>
                <dd>
                  <a href={`mailto:${site.email}`}>{site.email}</a>
                </dd>
              </div>
              {site.linkedin && (
                <div>
                  <dt>LinkedIn</dt>
                  <dd>
                    <a href={site.linkedin} target="_blank" rel="noreferrer">
                      {linkedinLabel(site.linkedin)}
                    </a>
                  </dd>
                </div>
              )}
              {site.cv && (
                <div>
                  <dt>CV</dt>
                  <dd>
                    <a href={site.cv} target="_blank" rel="noreferrer">
                      Download PDF
                    </a>
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </section>
      </div>

      <main>
        <section id="work" className="section work-section">
          <div className="wrap">
            <header className="section-head">
              <h2>Selected work</h2>
              {site.productsNote && <p>{site.productsNote}</p>}
            </header>
            <div className="work-list">
              {products.map((p) => (
                <WorkItem key={p.id} product={p} onOpen={setPreview} />
              ))}
            </div>
          </div>
        </section>

        <CaseStudies studies={caseStudies} note={site.caseStudiesNote} />

        <section id="about" className="section about">
          <div className="wrap">
            <header className="section-head">
              <h2>About</h2>
            </header>

            <div className="about-row">
              <h3 className="about-label">Background</h3>
              <div className="prose about-prose">
                {site.aboutParagraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>

            {site.timeline.length > 0 && (
              <div className="about-row">
                <h3 className="about-label">Experience</h3>
                <ol className="xp">
                  {site.timeline.map((e, i) => (
                    <li key={`${e.role}-${i}`}>
                      <span className="xp-period">{e.period}</span>
                      <div>
                        <p className="xp-role">
                          {e.role}
                          {e.place && <span className="xp-place">{e.place}</span>}
                        </p>
                        {e.note && <p className="xp-note">{e.note}</p>}
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {site.skills.length > 0 && (
              <div className="about-row">
                <h3 className="about-label">Skills</h3>
                <dl className="skills">
                  {site.skills.map((s, i) => (
                    <div key={`${s.label}-${i}`}>
                      <dt>{s.label}</dt>
                      <dd>{s.items}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>
        </section>
      </main>

      <footer id="contact" className="contact">
        <div className="wrap">
          <h2 className="contact-heading">{site.contactHeading}</h2>
          <a className="contact-email" href={`mailto:${site.email}`}>
            {/* allow a line break only after the @ on narrow screens */}
            {site.email.includes('@') ? (
              <>
                {site.email.split('@')[0]}@<wbr />
                {site.email.split('@').slice(1).join('@')}
              </>
            ) : (
              site.email
            )}
          </a>
          {site.openToWork && site.availabilityNote && (
            <p className="contact-note">{site.availabilityNote}</p>
          )}
          <ul className="contact-links">
            {site.linkedin && (
              <li>
                <a href={site.linkedin} target="_blank" rel="noreferrer">
                  LinkedIn <span aria-hidden="true">↗</span>
                </a>
              </li>
            )}
            {site.cv && (
              <li>
                <a href={site.cv} target="_blank" rel="noreferrer">
                  CV <span aria-hidden="true">↗</span>
                </a>
              </li>
            )}
          </ul>
          <div className="colophon">
            <span>
              © {year} {site.name}, {site.footerLocation}
            </span>
            {site.footerNote && <span>{site.footerNote}</span>}
          </div>
        </div>
      </footer>

      {preview && <PreviewModal product={preview} onClose={closePreview} />}
    </ChatProvider>
  )
}
