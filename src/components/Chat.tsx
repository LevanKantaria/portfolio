import { createContext, useContext, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import robotPhoto from '../assets/robot-me.jpg'

const MAX_MESSAGE_CHARS = 500
const MAX_HISTORY_MESSAGES = 12

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

const SUGGESTIONS = [
  'What did Levan build at Bank of Georgia?',
  'Tell me about MEGZURI',
  'Is he available for hire?',
]

const GREETING: ChatMessage = {
  role: 'assistant',
  content:
    "Hi! I'm Levan's assistant. Ask me anything about his experience, products, or how to get in touch.",
}

const ERROR_REPLY =
  "Something went wrong on my end. Try again in a moment, or email l.kantaria1999@gmail.com directly."

interface ChatState {
  messages: ChatMessage[]
  sending: boolean
  send: (text: string) => void
}

const ChatContext = createContext<ChatState | null>(null)

/** One shared conversation — the hero chat and the floating widget stay in sync. */
export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING])
  const [sending, setSending] = useState(false)

  async function send(text: string) {
    const question = text.trim().slice(0, MAX_MESSAGE_CHARS)
    if (!question || sending) return

    const history = [...messages, { role: 'user' as const, content: question }]
    setMessages(history)
    setSending(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          // The greeting is client-side decoration; the API wants real turns.
          messages: history.slice(1).slice(-MAX_HISTORY_MESSAGES),
        }),
      })

      if (!res.ok || !res.body) {
        const detail = await res.json().catch(() => null)
        throw new Error(detail?.error ?? `Request failed (${res.status})`)
      }

      setMessages((m) => [...m, { role: 'assistant', content: '' }])
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      for (;;) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        setMessages((m) => {
          const next = [...m]
          const last = next[next.length - 1]
          next[next.length - 1] = { ...last, content: last.content + chunk }
          return next
        })
      }
    } catch (err) {
      const note = err instanceof Error && err.message.startsWith('Too many') ? err.message : ERROR_REPLY
      setMessages((m) => {
        const last = m[m.length - 1]
        if (last.role === 'assistant' && last.content === '') {
          return [...m.slice(0, -1), { role: 'assistant', content: note }]
        }
        return [...m, { role: 'assistant', content: note }]
      })
    } finally {
      setSending(false)
    }
  }

  return <ChatContext.Provider value={{ messages, sending, send }}>{children}</ChatContext.Provider>
}

function useChat(): ChatState {
  const ctx = useContext(ChatContext)
  if (!ctx) throw new Error('Chat components must be rendered inside <ChatProvider>')
  return ctx
}

function Avatar() {
  return <img className="avatar" src={robotPhoto} alt="Levan's AI assistant" />
}

function ChatPanel({ autoFocus = false }: { autoFocus?: boolean }) {
  const { messages, sending, send } = useChat()
  const [input, setInput] = useState('')
  const logRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight })
  }, [messages])

  function submit(text: string) {
    send(text)
    setInput('')
  }

  return (
    <>
      <div className="chat-log" ref={logRef} aria-live="polite">
        {messages.map((m, i) => (
          <div key={i} className={`chat-msg chat-msg-${m.role}`}>
            {m.content || <span className="chat-typing">…</span>}
          </div>
        ))}
        {messages.length === 1 && (
          <div className="chat-suggestions">
            {SUGGESTIONS.map((s) => (
              <button key={s} type="button" onClick={() => submit(s)}>
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      <form
        className="chat-input"
        onSubmit={(e) => {
          e.preventDefault()
          submit(input)
        }}
      >
        <input
          ref={inputRef}
          type="text"
          value={input}
          maxLength={MAX_MESSAGE_CHARS}
          placeholder="Ask a question…"
          onChange={(e) => setInput(e.target.value)}
          aria-label="Your question"
        />
        <button type="submit" disabled={sending || input.trim() === ''}>
          Send
        </button>
      </form>
    </>
  )
}

/** Compact launcher in the hero — expands into a large chat modal. */
export function HeroChat() {
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
      <button
        type="button"
        className="hero-chat-launcher"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
      >
        <Avatar />
        <span className="launcher-text">
          <strong>Levan Kantaria</strong>
          <span>Ask my AI assistant anything</span>
        </span>
        <span className="live-dot" aria-hidden="true" />
      </button>

      {open && (
        <div
          className="modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Chat with Levan's AI assistant"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false)
          }}
        >
          <section className="hero-chat chat-modal">
            <header className="chat-head">
              <Avatar />
              <div>
                <strong>Ask my AI assistant</strong>
                <p>Trained on my real experience · built with Claude</p>
              </div>
              <button
                type="button"
                className="chat-close"
                onClick={() => setOpen(false)}
                aria-label="Close chat"
              >
                ✕
              </button>
            </header>
            <ChatPanel autoFocus />
          </section>
        </div>
      )}
    </>
  )
}

/** Floating chat button + panel, available anywhere on the page. */
export function ChatWidget() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      <button
        type="button"
        className="chat-fab"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'Close chat' : 'Ask about Levan'}
        aria-expanded={open}
      >
        {open ? (
          '✕'
        ) : (
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
      </button>

      {open && (
        <section className="chat-panel" aria-label="Chat with Levan's assistant">
          <header className="chat-head">
            <Avatar />
            <div>
              <strong>Levan's assistant</strong>
              <p>AI · answers from his real experience</p>
            </div>
            <span className="live-dot" aria-hidden="true" />
          </header>
          <ChatPanel autoFocus />
        </section>
      )}
    </>
  )
}
