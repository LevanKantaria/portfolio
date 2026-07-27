import { useEffect, useState } from 'react'
import { initializeApp } from 'firebase/app'
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth'
import { doc, getDoc, getFirestore, setDoc } from 'firebase/firestore'
import {
  FIREBASE_CONFIG,
  DEFAULT_SITE_CONTENT,
  type SiteContent,
  type Product,
  type CaseStudy,
} from '../lib/content'
import { DEFAULT_PRODUCTS } from '../data/products'
import { DEFAULT_CASE_STUDIES } from '../data/caseStudies'
import { ListEditor, StringList, TagsInput, TextArea, TextInput, Toggle } from './fields'

const app = initializeApp(FIREBASE_CONFIG)
const auth = getAuth(app)
const db = getFirestore(app)

/** Firestore rejects `undefined`; a JSON round-trip drops it and keeps null. */
function clean<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

const TABS = ['Hero & profile', 'About', 'Products', 'Case studies', 'Chatbot'] as const
type Tab = (typeof TABS)[number]

type SaveState = 'idle' | 'saving' | 'saved' | 'error'

function SaveBar({
  state,
  dirty,
  onSave,
}: {
  state: SaveState
  dirty: boolean
  onSave: () => void
}) {
  return (
    <div className="admin-savebar">
      {dirty && state !== 'saving' && <span className="admin-dirty">Unsaved changes</span>}
      {state === 'error' && <span className="admin-error">Save failed — check your connection</span>}
      <button type="button" className="admin-save" onClick={onSave} disabled={state === 'saving'}>
        {state === 'saving' ? 'Saving…' : state === 'saved' ? 'Saved ✓' : 'Save'}
      </button>
    </div>
  )
}

/** App Store / Play Store badge: hidden, "coming soon", or a real link. */
function StoreField({
  label,
  value,
  onChange,
}: {
  label: string
  value: string | null | undefined
  onChange: (v: string | null | undefined) => void
}) {
  const mode = value === undefined ? 'none' : value === null ? 'soon' : 'link'
  return (
    <div className="admin-field">
      <span className="admin-field-label">{label}</span>
      <div className="admin-row">
        <select
          value={mode}
          onChange={(e) => {
            const m = e.target.value
            onChange(m === 'none' ? undefined : m === 'soon' ? null : '')
          }}
        >
          <option value="none">No badge</option>
          <option value="soon">Badge — coming soon</option>
          <option value="link">Badge — linked</option>
        </select>
        {mode === 'link' && (
          <input
            type="text"
            placeholder="https://…"
            value={value ?? ''}
            onChange={(e) => onChange(e.target.value)}
          />
        )}
      </div>
    </div>
  )
}

function Editor({ user }: { user: User }) {
  const [tab, setTab] = useState<Tab>('Hero & profile')
  const [site, setSite] = useState<SiteContent>(DEFAULT_SITE_CONTENT)
  const [products, setProducts] = useState<Product[]>(DEFAULT_PRODUCTS)
  const [studies, setStudies] = useState<CaseStudy[]>(DEFAULT_CASE_STUDIES)
  const [experienceMd, setExperienceMd] = useState('')
  const [loading, setLoading] = useState(true)
  const [dirty, setDirty] = useState(false)
  const [saveState, setSaveState] = useState<SaveState>('idle')

  useEffect(() => {
    Promise.all([
      getDoc(doc(db, 'content', 'site')),
      getDoc(doc(db, 'content', 'products')),
      getDoc(doc(db, 'content', 'caseStudies')),
      getDoc(doc(db, 'content', 'persona')),
    ])
      .then(([s, p, c, persona]) => {
        if (s.exists()) setSite({ ...DEFAULT_SITE_CONTENT, ...(s.data() as SiteContent) })
        const items = p.data()?.items as Product[] | undefined
        if (items?.length) setProducts(items)
        const cs = c.data()?.items as CaseStudy[] | undefined
        if (cs?.length) setStudies(cs)
        setExperienceMd((persona.data()?.experienceMd as string) ?? '')
      })
      .finally(() => setLoading(false))
  }, [])

  // Guard against closing the tab mid-edit.
  useEffect(() => {
    if (!dirty) return
    const warn = (e: BeforeUnloadEvent) => e.preventDefault()
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirty])

  const edit = <T,>(setter: (v: T) => void) => (value: T) => {
    setter(value)
    setDirty(true)
    setSaveState('idle')
  }

  const setSiteField = <K extends keyof SiteContent>(key: K) =>
    edit<SiteContent[K]>((v) => setSite((s) => ({ ...s, [key]: v })))

  async function save() {
    setSaveState('saving')
    try {
      // Every tab writes the docs it can touch, from one in-memory copy —
      // so saving from any tab can't clobber another tab's edits.
      await Promise.all([
        setDoc(doc(db, 'content', 'site'), clean(site)),
        setDoc(doc(db, 'content', 'products'), { items: clean(products) }),
        setDoc(doc(db, 'content', 'caseStudies'), { items: clean(studies) }),
        setDoc(doc(db, 'content', 'persona'), { experienceMd }),
      ])
      setDirty(false)
      setSaveState('saved')
      setTimeout(() => setSaveState((s) => (s === 'saved' ? 'idle' : s)), 2500)
    } catch {
      setSaveState('error')
    }
  }

  if (loading) return <p className="admin-status">Loading content…</p>

  return (
    <>
      <nav className="admin-tabs">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            className={t === tab ? 'admin-tab admin-tab-on' : 'admin-tab'}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </nav>

      <SaveBar state={saveState} dirty={dirty} onSave={save} />

      {tab === 'Hero & profile' && (
        <section className="admin-section">
          <TextInput label="Eyebrow" value={site.eyebrow} onChange={setSiteField('eyebrow')} />
          <div className="admin-grid-2">
            <TextInput
              label="Headline — first part"
              value={site.titleLead}
              onChange={setSiteField('titleLead')}
            />
            <TextInput
              label="Headline — accent"
              hint="shown in red"
              value={site.titleAccent}
              onChange={setSiteField('titleAccent')}
            />
          </div>
          <TextArea
            label="Intro paragraph"
            rows={5}
            value={site.heroLede}
            onChange={setSiteField('heroLede')}
          />
          <TextInput
            label="Primary button label"
            value={site.ctaLabel}
            onChange={setSiteField('ctaLabel')}
          />
          <Toggle
            label='Show "Open to work" badge'
            checked={site.openToWork}
            onChange={setSiteField('openToWork')}
          />
          <div className="admin-grid-2">
            <TextInput label="Email" value={site.email} onChange={setSiteField('email')} />
            <TextInput label="LinkedIn URL" value={site.linkedin} onChange={setSiteField('linkedin')} />
          </div>
          <TextInput
            label="CV link"
            hint="leave blank to hide the button"
            value={site.cv}
            onChange={setSiteField('cv')}
          />
        </section>
      )}

      {tab === 'About' && (
        <section className="admin-section">
          <StringList
            label="About paragraphs"
            items={site.aboutParagraphs}
            multiline
            onChange={setSiteField('aboutParagraphs')}
          />

          <span className="admin-field-label">Skills rows</span>
          <ListEditor
            items={site.skills}
            onChange={setSiteField('skills')}
            newItem={() => ({ label: '', items: '' })}
            title={(s) => s.label}
            addLabel="+ Add skills row"
          >
            {(row, update) => (
              <>
                <TextInput label="Label" value={row.label} onChange={(v) => update({ label: v })} />
                <TextInput
                  label="Items"
                  hint="separate with ·"
                  value={row.items}
                  onChange={(v) => update({ items: v })}
                />
              </>
            )}
          </ListEditor>

          <span className="admin-field-label">Timeline</span>
          <ListEditor
            items={site.timeline}
            onChange={setSiteField('timeline')}
            newItem={() => ({ period: '', role: '', place: '', note: '' })}
            title={(t) => `${t.period} — ${t.role}`}
            addLabel="+ Add timeline entry"
          >
            {(entry, update) => (
              <>
                <div className="admin-grid-2">
                  <TextInput
                    label="Period"
                    value={entry.period}
                    onChange={(v) => update({ period: v })}
                  />
                  <TextInput label="Role" value={entry.role} onChange={(v) => update({ role: v })} />
                </div>
                <TextInput label="Place" value={entry.place} onChange={(v) => update({ place: v })} />
                <TextArea
                  label="Note"
                  rows={2}
                  value={entry.note}
                  onChange={(v) => update({ note: v })}
                />
              </>
            )}
          </ListEditor>

          <div className="admin-grid-2">
            <TextInput
              label="Products section note"
              value={site.productsNote}
              onChange={setSiteField('productsNote')}
            />
            <TextInput
              label="Case studies section note"
              value={site.caseStudiesNote}
              onChange={setSiteField('caseStudiesNote')}
            />
          </div>
          <div className="admin-grid-2">
            <TextInput
              label="Footer location"
              value={site.footerLocation}
              onChange={setSiteField('footerLocation')}
            />
            <TextInput
              label="Footer note"
              value={site.footerNote}
              onChange={setSiteField('footerNote')}
            />
          </div>
        </section>
      )}

      {tab === 'Products' && (
        <section className="admin-section">
          <p className="admin-hint">
            Cards on the homepage, in this order. Thumbnails are image paths under{' '}
            <code>/thumbs/…</code> that ship with the site, or any public image URL.
          </p>
          <ListEditor
            items={products}
            onChange={edit(setProducts)}
            newItem={() => ({
              id: `product-${Date.now()}`,
              name: '',
              role: '',
              period: '',
              description: '',
              stack: [],
              url: '',
              domain: '',
              thumb: '',
              embeddable: true,
            })}
            title={(p) => p.name}
            addLabel="+ Add product"
          >
            {(p, update) => (
              <>
                <div className="admin-grid-2">
                  <TextInput label="Name" value={p.name} onChange={(v) => update({ name: v })} />
                  <TextInput
                    label="Period"
                    value={p.period}
                    onChange={(v) => update({ period: v })}
                  />
                </div>
                <TextInput label="Role" value={p.role} onChange={(v) => update({ role: v })} />
                <TextArea
                  label="Description"
                  rows={4}
                  value={p.description}
                  onChange={(v) => update({ description: v })}
                />
                <TagsInput label="Tech stack" items={p.stack} onChange={(v) => update({ stack: v })} />
                <div className="admin-grid-2">
                  <TextInput
                    label="URL"
                    placeholder="https://…"
                    value={p.url}
                    onChange={(v) => update({ url: v })}
                  />
                  <TextInput
                    label="Domain shown on the card"
                    value={p.domain}
                    onChange={(v) => update({ domain: v })}
                  />
                </div>
                <TextInput
                  label="Thumbnail"
                  hint="/thumbs/name.png or an image URL"
                  value={p.thumb}
                  onChange={(v) => update({ thumb: v })}
                />
                <Toggle
                  label="Site can be shown inside the preview window (uncheck for banking sites that block embedding)"
                  checked={p.embeddable}
                  onChange={(v) => update({ embeddable: v })}
                />
                {!p.embeddable && (
                  <TextArea
                    label="Note shown instead of the live preview"
                    rows={2}
                    value={p.embedNote ?? ''}
                    onChange={(v) => update({ embedNote: v })}
                  />
                )}
                <div className="admin-grid-2">
                  <StoreField
                    label="App Store badge"
                    value={p.appStore}
                    onChange={(v) => update({ appStore: v })}
                  />
                  <StoreField
                    label="Google Play badge"
                    value={p.playStore}
                    onChange={(v) => update({ playStore: v })}
                  />
                </div>
              </>
            )}
          </ListEditor>
        </section>
      )}

      {tab === 'Case studies' && (
        <section className="admin-section">
          <p className="admin-hint">
            Cards open a full-screen article. The body is Markdown:{' '}
            <code>#### Heading</code>, blank line between paragraphs, <code>- </code> for
            bullets, <code>*italics*</code>.
          </p>
          <ListEditor
            items={studies}
            onChange={edit(setStudies)}
            newItem={() => ({
              id: `case-${Date.now()}`,
              eyebrow: '',
              title: '',
              teaser: '',
              bodyMd: '',
            })}
            title={(s) => s.title}
            addLabel="+ Add case study"
          >
            {(s, update) => (
              <>
                <TextInput
                  label="Eyebrow"
                  hint="project · role · stack"
                  value={s.eyebrow}
                  onChange={(v) => update({ eyebrow: v })}
                />
                <TextInput label="Title" value={s.title} onChange={(v) => update({ title: v })} />
                <TextArea
                  label="Teaser"
                  hint="shown on the card"
                  rows={3}
                  value={s.teaser}
                  onChange={(v) => update({ teaser: v })}
                />
                <TextArea
                  label="Body"
                  hint="Markdown"
                  rows={22}
                  mono
                  value={s.bodyMd}
                  onChange={(v) => update({ bodyMd: v })}
                />
              </>
            )}
          </ListEditor>
        </section>
      )}

      {tab === 'Chatbot' && (
        <section className="admin-section">
          <TextArea
            label="Greeting"
            hint="first message in the chat"
            rows={3}
            value={site.chatGreeting}
            onChange={setSiteField('chatGreeting')}
          />
          <StringList
            label="Suggested questions"
            items={site.chatSuggestions}
            onChange={setSiteField('chatSuggestions')}
          />
          <TextArea
            label="Knowledge document"
            hint="everything the assistant knows — Markdown, picked up within a minute"
            rows={26}
            mono
            value={experienceMd}
            onChange={edit(setExperienceMd)}
          />
        </section>
      )}

      <footer className="admin-foot">
        <span>{user.email}</span>
        <button type="button" className="admin-signout" onClick={() => signOut(auth)}>
          Sign out
        </button>
      </footer>
    </>
  )
}

function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch {
      setError('Sign-in failed. Check the email and password.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <form className="admin-signin" onSubmit={submit}>
      <h2>Sign in</h2>
      <input
        type="email"
        placeholder="Email"
        autoComplete="username"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && <p className="admin-error">{error}</p>}
      <button type="submit" disabled={busy || !email || !password}>
        {busy ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  )
}

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(
    () =>
      onAuthStateChanged(auth, (u) => {
        setUser(u)
        setReady(true)
      }),
    [],
  )

  return (
    <div className="admin">
      <header className="admin-head">
        <h1>Site admin</h1>
        <a href="/">← back to site</a>
      </header>
      {!ready ? (
        <p className="admin-status">Loading…</p>
      ) : user ? (
        <Editor user={user} />
      ) : (
        <SignIn />
      )}
    </div>
  )
}
