import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import type { FormEvent, ReactNode } from 'react'

const MAX_MESSAGE_CHARS = 500
const MAX_HISTORY_MESSAGES = 12

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

const ERROR_REPLY =
  'Something went wrong. Try again in a moment, or email l.kantaria1999@gmail.com.'

interface ChatState {
  messages: ChatMessage[]
  sending: boolean
  suggestions: string[]
  hint: string
  isOpen: boolean
  send: (text: string) => void
  open: (question?: string) => void
  close: () => void
}

const ChatContext = createContext<ChatState | null>(null)

/** One conversation for the whole page: the hero ask bar and the nav both open it. */
export function ChatProvider({
  children,
  greeting,
  suggestions,
  hint,
}: {
  children: ReactNode
  greeting: string
  suggestions: string[]
  hint: string
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: greeting },
  ])
  const [sending, setSending] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  // The greeting arrives with the Firestore content fetch; swap it in as long
  // as the visitor hasn't started talking yet.
  useEffect(() => {
    setMessages((m) =>
      m.length === 1 && m[0].role === 'assistant' ? [{ role: 'assistant', content: greeting }] : m,
    )
  }, [greeting])

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
      const note =
        err instanceof Error && err.message.startsWith('Too many') ? err.message : ERROR_REPLY
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

  // Stable identity: the modal's keyboard/scroll-lock effect depends on it.
  const close = useCallback(() => setIsOpen(false), [])

  const value: ChatState = {
    messages,
    sending,
    suggestions,
    hint,
    isOpen,
    send,
    open: (question) => {
      setIsOpen(true)
      if (question?.trim()) send(question)
    },
    close,
  }

  return (
    <ChatContext.Provider value={value}>
      {children}
      <ChatModal />
    </ChatContext.Provider>
  )
}

export function useChat(): ChatState {
  const ctx = useContext(ChatContext)
  if (!ctx) throw new Error('Chat components must be rendered inside <ChatProvider>')
  return ctx
}

/** Search-style entry point in the hero. Submitting opens the conversation. */
export function AskBar() {
  const { open, hint } = useChat()
  const [text, setText] = useState('')

  function submit(e: FormEvent) {
    e.preventDefault()
    open(text)
    setText('')
  }

  return (
    <div className="ask">
      <form className="ask-bar" onSubmit={submit}>
        <label className="sr-only" htmlFor="ask-input">
          Ask a question about my work
        </label>
        <input
          id="ask-input"
          type="text"
          value={text}
          maxLength={MAX_MESSAGE_CHARS}
          placeholder="Ask a question about my work"
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit">Ask</button>
      </form>
      {hint && <p className="ask-hint">{hint}</p>}
    </div>
  )
}

function ChatModal() {
  const { messages, sending, send, suggestions, hint, isOpen, close } = useChat()
  const [input, setInput] = useState('')
  const logRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!isOpen) return
    inputRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [isOpen, close])

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight })
  }, [messages, isOpen])

  if (!isOpen) return null

  function submit(text: string) {
    send(text)
    setInput('')
  }

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="chat-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) close()
      }}
    >
      <section className="chat-modal">
        <header className="modal-head">
          <div>
            <h2 id="chat-title">Ask about my work</h2>
            {hint && <p>{hint}</p>}
          </div>
          <button type="button" className="modal-close" onClick={close}>
            Close
          </button>
        </header>

        <div className="chat-log" ref={logRef} aria-live="polite">
          {messages.map((m, i) => (
            <p key={i} className={`chat-msg chat-msg-${m.role}`}>
              {m.content || <span className="chat-typing">Thinking…</span>}
            </p>
          ))}
          {messages.length === 1 && suggestions.length > 0 && (
            <div className="chat-suggestions">
              {suggestions.map((s) => (
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
          <label className="sr-only" htmlFor="chat-input">
            Your question
          </label>
          <input
            id="chat-input"
            ref={inputRef}
            type="text"
            value={input}
            maxLength={MAX_MESSAGE_CHARS}
            placeholder="Type a question"
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" disabled={sending || input.trim() === ''}>
            Send
          </button>
        </form>
      </section>
    </div>
  )
}
