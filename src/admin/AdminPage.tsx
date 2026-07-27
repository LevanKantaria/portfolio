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
import { FIREBASE_CONFIG, DEFAULT_SITE_CONTENT } from '../lib/content'

const app = initializeApp(FIREBASE_CONFIG)
const auth = getAuth(app)
const db = getFirestore(app)

type SaveState = 'idle' | 'saving' | 'saved' | 'error'

function SaveButton({ state, onClick }: { state: SaveState; onClick: () => void }) {
  return (
    <button
      type="button"
      className="admin-save"
      onClick={onClick}
      disabled={state === 'saving'}
    >
      {state === 'saving' ? 'Saving…' : state === 'saved' ? 'Saved ✓' : state === 'error' ? 'Failed — retry' : 'Save'}
    </button>
  )
}

function useSave() {
  const [state, setState] = useState<SaveState>('idle')
  async function save(fn: () => Promise<void>) {
    setState('saving')
    try {
      await fn()
      setState('saved')
      setTimeout(() => setState('idle'), 2500)
    } catch {
      setState('error')
    }
  }
  return { state, save }
}

function Editor({ user }: { user: User }) {
  const [experience, setExperience] = useState('')
  const [heroLede, setHeroLede] = useState(DEFAULT_SITE_CONTENT.heroLede)
  const [openToWork, setOpenToWork] = useState(DEFAULT_SITE_CONTENT.openToWork)
  const [loading, setLoading] = useState(true)
  const personaSave = useSave()
  const siteSave = useSave()

  useEffect(() => {
    Promise.all([getDoc(doc(db, 'content', 'persona')), getDoc(doc(db, 'content', 'site'))])
      .then(([persona, site]) => {
        setExperience((persona.data()?.experienceMd as string) ?? '')
        const s = site.data()
        if (s) {
          setHeroLede((s.heroLede as string) ?? DEFAULT_SITE_CONTENT.heroLede)
          setOpenToWork((s.openToWork as boolean) ?? DEFAULT_SITE_CONTENT.openToWork)
        }
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="admin-status">Loading content…</p>

  return (
    <>
      <section className="admin-section">
        <header className="admin-section-head">
          <div>
            <h2>Site fields</h2>
            <p>Shown on the homepage. Changes go live within seconds — no redeploy.</p>
          </div>
          <SaveButton
            state={siteSave.state}
            onClick={() =>
              siteSave.save(() =>
                setDoc(doc(db, 'content', 'site'), { heroLede, openToWork }),
              )
            }
          />
        </header>
        <label className="admin-toggle">
          <input
            type="checkbox"
            checked={openToWork}
            onChange={(e) => setOpenToWork(e.target.checked)}
          />
          Show "Open to work" badge
        </label>
        <label className="admin-label" htmlFor="hero-lede">
          Hero intro paragraph
        </label>
        <textarea
          id="hero-lede"
          className="admin-textarea"
          rows={5}
          value={heroLede}
          onChange={(e) => setHeroLede(e.target.value)}
        />
      </section>

      <section className="admin-section">
        <header className="admin-section-head">
          <div>
            <h2>Chatbot knowledge</h2>
            <p>
              Everything the AI assistant knows about Levan. Markdown. The chat
              picks up changes within a minute.
            </p>
          </div>
          <SaveButton
            state={personaSave.state}
            onClick={() =>
              personaSave.save(() =>
                setDoc(doc(db, 'content', 'persona'), { experienceMd: experience }),
              )
            }
          />
        </header>
        <textarea
          className="admin-textarea admin-textarea-tall"
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          spellCheck={false}
        />
      </section>

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
