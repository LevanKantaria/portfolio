import { useState } from 'react'
import { products, type Product } from './data/products'
import { ProductCard } from './components/ProductCard'
import { PreviewModal } from './components/PreviewModal'

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
    period: '2023 — present',
    role: 'Senior Web Developer / Analyst',
    place: 'Bank of Georgia',
    note: 'Leading frontend delivery for Visa/MasterCard payment platforms in the online payments division.',
  },
  {
    period: '2025 — present',
    role: 'Founder & Full-stack Developer',
    place: 'MEGZURI · MakersHub',
    note: 'Building and launching my own products end to end — mobile, web, backend, and data pipelines.',
  },
  {
    period: '2020 — 2022',
    role: 'React Developer & Freelancer',
    place: 'Manufacture · independent clients',
    note: 'Manufacturing middleware, a carpool app, and a Node.js trading bot on Discord, Binance, and TradingView APIs.',
  },
]

export default function App() {
  const [open, setOpen] = useState<Product | null>(null)

  return (
    <>
      <header className="topbar">
        <div className="container topbar-inner">
          <a className="wordmark" href="#top">
            Levan Kantaria
          </a>
          <nav aria-label="Sections">
            <a href="#products">Products</a>
            <a href="#about">About</a>
            <a href="mailto:l.kantaria1999@gmail.com">Contact</a>
          </nav>
        </div>
      </header>

      <main id="top">
        <section className="hero container">
          <p className="eyebrow">React / TypeScript engineer · Tbilisi, Georgia</p>
          <h1>
            Shipped, and <em>still running</em>.
          </h1>
          <p className="hero-lede">
            I'm a full-stack engineer, strongest on the frontend, and I build
            web and mobile products that stay in production — payment platforms
            for one of Georgia's largest banks, and my own apps used by drivers
            and makers across the country. Every product below is live right
            now; each card opens the real, running site.
          </p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="#products">
              See the products
            </a>
            <a className="btn" href="mailto:l.kantaria1999@gmail.com">
              l.kantaria1999@gmail.com
            </a>
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

        <section id="about" className="container about">
          <div className="section-head">
            <h2>About</h2>
          </div>
          <div className="about-cols">
            <div className="about-text">
              <p>
                Full-stack engineer with a frontend core — 5+ years building
                production fintech interfaces, payment flows, and
                product-focused web and mobile apps. At Bank of Georgia I lead
                a frontend team in the online payments division; outside of it
                I take products from idea to launch on my own — most recently
                MEGZURI, an average-speed tracking app for Georgian drivers.
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

      {open && <PreviewModal product={open} onClose={() => setOpen(null)} />}
    </>
  )
}
