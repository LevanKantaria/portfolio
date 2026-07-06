import { useState } from 'react'
import { products, type Product } from './data/products'
import { ProductCard } from './components/ProductCard'
import { PreviewModal } from './components/PreviewModal'
import { ChatProvider, ChatWidget, HeroChat } from './components/Chat'
import { CaseStudies } from './components/CaseStudies'
import mePhoto from './assets/me-avatar.jpg'

const LINKS = {
  linkedin: 'https://www.linkedin.com/in/levan-kantaria-bb223120b/',
  cv: 'https://drive.google.com/file/d/1u0X6pd-tgA7HsWSdvovS8Nx4Luv9Y2hj/view?usp=sharing',
}

const skills = [
  {
    label: 'Frontend',
    items: 'React · TypeScript · Next.js · React Native · Redux · Tailwind CSS',
  },
  {
    label: 'Backend',
    items: 'Node.js · Express · GraphQL · PostgreSQL · MongoDB · Firebase · AWS',
  },
  {
    label: 'AI-assisted development',
    items: 'Claude Code · Cursor · OpenAI · rapid prototyping · structured prompt workflows',
  },
]

const experience = [
  {
    period: '2023 — 2026',
    role: 'Senior Web Developer / Analyst',
    place: 'Bank of Georgia',
    note: 'Led frontend delivery for Visa/MasterCard payment platforms in the online payments division.',
  },
  {
    period: '2025 — present',
    role: 'Founder & Full-stack Developer',
    place: 'MEGZURI · MakersHub',
    note: 'Building and launching my own products end to end — mobile, web, backend, and data pipelines.',
  },
  {
    period: '2022',
    role: 'React Developer',
    place: 'Manufacture',
    note: 'Manufacturing workflow and middleware platform connecting clients — manufactured.com.',
  },
  {
    period: '2021 — 2022',
    role: 'Full-stack Developer',
    place: 'ITechArt',
    note: 'Luxury travel platform: authenticated user flows and full-stack features with React, TypeScript, GraphQL, and Node.js.',
  },
  {
    period: '2020 — 2021',
    role: 'Freelancer',
    place: 'Independent clients',
    note: 'Gamiyole carpool app and a Node.js trading bot on Discord, Binance, and TradingView APIs.',
  },
]

export default function App() {
  const [open, setOpen] = useState<Product | null>(null)

  return (
    <ChatProvider>
      <header className="topbar">
        <div className="container topbar-inner">
          <a className="wordmark" href="#top">
            Levan Kantaria
          </a>
          <nav aria-label="Sections">
            <a href="#products">Products</a>
            <a href="#case-studies">Case studies</a>
            <a href="#about">About</a>
            <a href="mailto:l.kantaria1999@gmail.com">Contact</a>
          </nav>
        </div>
      </header>

      <main id="top">
        <section className="hero container">
          <div className="hero-grid">
            <div className="hero-copy">
              <p className="eyebrow">Full-stack · React / TypeScript · Tbilisi, Georgia</p>
              <h1>
                Shipped, and <em>still running</em>.
              </h1>
              <p className="hero-lede">
                I'm a full-stack engineer with a frontend core. I've shipped
                payment platforms for one of Georgia's largest banks, launched
                my own apps for drivers and makers, and built AI into real
                products — including the assistant on this page. Everything
                here is live: open any card and use the real thing.
              </p>
              <div className="hero-actions">
                <a className="btn btn-primary" href="#products">
                  See the products
                </a>
                <a className="btn" href="mailto:l.kantaria1999@gmail.com">
                  l.kantaria1999@gmail.com
                </a>
              </div>
            </div>
            <div className="hero-side">
              <div className="hero-profile">
                <div className="hero-avatar-wrap">
                  <img className="hero-avatar" src={mePhoto} alt="Levan Kantaria" />
                  <span className="open-badge">
                    <span className="live-dot" aria-hidden="true" />
                    Open to work
                  </span>
                </div>
                <div className="profile-links">
                  <a
                    className="profile-icon"
                    href={LINKS.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Levan on LinkedIn"
                    title="LinkedIn"
                  >
                    <svg viewBox="0 0 448 512" width="16" height="16" fill="currentColor" aria-hidden="true">
                      <path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z" />
                    </svg>
                  </a>
                  <a
                    className="btn-cv"
                    href={LINKS.cv}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Download CV ↗
                  </a>
                </div>
              </div>
              <HeroChat />
            </div>
          </div>
        </section>

        <section id="products" className="container products">
          <div className="section-head">
            <h2>Products</h2>
            <p>Real screenshots, real domains. Click a card for a live preview.</p>
          </div>
          <div className="product-grid">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} onOpen={setOpen} />
            ))}
          </div>
        </section>

        <CaseStudies />

        <section id="about" className="container about">
          <div className="section-head">
            <h2>About</h2>
          </div>
          <div className="about-cols">
            <div className="about-text">
              <p>
                Full-stack engineer with a frontend core — 5+ years building
                production fintech interfaces, payment flows, and
                product-focused web and mobile apps. At Bank of Georgia I led
                a frontend team in the online payments division until 2026;
                these days I take products from idea to launch on my own —
                most recently MEGZURI, an average-speed tracking app for
                Georgian drivers.
              </p>
              <p>
                I care about clear UX, clean architecture, and measurable
                business impact — and I work AI-assisted, using Claude Code and
                Cursor as part of a structured development workflow.
              </p>
              <dl className="skills">
                {skills.map((s) => (
                  <div key={s.label} className="skills-row">
                    <dt>{s.label}</dt>
                    <dd>{s.items}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <ol className="timeline">
              {experience.map((e) => (
                <li key={e.role}>
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
            Levan Kantaria · Tbilisi, Georgia ·{' '}
            <a href="mailto:l.kantaria1999@gmail.com">l.kantaria1999@gmail.com</a>
          </p>
          <p className="footer-note">
            Built with React, TypeScript, and Vite.
          </p>
        </div>
      </footer>

      <ChatWidget />

      {open && <PreviewModal product={open} onClose={() => setOpen(null)} />}
    </ChatProvider>
  )
}
