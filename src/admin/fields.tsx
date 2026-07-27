import { useState } from 'react'
import type { ReactNode } from 'react'

export function TextInput({
  label,
  value,
  onChange,
  placeholder,
  hint,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  hint?: string
}) {
  return (
    <label className="admin-field">
      <span className="admin-field-label">
        {label}
        {hint && <em>{hint}</em>}
      </span>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  )
}

export function TextArea({
  label,
  value,
  onChange,
  rows = 4,
  mono = false,
  hint,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  rows?: number
  mono?: boolean
  hint?: string
}) {
  return (
    <label className="admin-field">
      <span className="admin-field-label">
        {label}
        {hint && <em>{hint}</em>}
      </span>
      <textarea
        className={mono ? 'admin-mono' : undefined}
        rows={rows}
        value={value}
        spellCheck={!mono}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  )
}

export function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <label className="admin-toggle">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      {label}
    </label>
  )
}

/** Edit a list of plain strings — one input per entry. */
export function StringList({
  label,
  items,
  onChange,
  placeholder,
  multiline = false,
}: {
  label: string
  items: string[]
  onChange: (items: string[]) => void
  placeholder?: string
  multiline?: boolean
}) {
  const set = (i: number, v: string) =>
    onChange(items.map((item, idx) => (idx === i ? v : item)))

  return (
    <div className="admin-field">
      <span className="admin-field-label">{label}</span>
      {items.map((item, i) => (
        <div className="admin-row" key={i}>
          {multiline ? (
            <textarea rows={3} value={item} onChange={(e) => set(i, e.target.value)} />
          ) : (
            <input
              type="text"
              value={item}
              placeholder={placeholder}
              onChange={(e) => set(i, e.target.value)}
            />
          )}
          <button
            type="button"
            className="admin-icon-btn"
            title="Remove"
            onClick={() => onChange(items.filter((_, idx) => idx !== i))}
          >
            ✕
          </button>
        </div>
      ))}
      <button type="button" className="admin-add" onClick={() => onChange([...items, ''])}>
        + Add
      </button>
    </div>
  )
}

/** Comma-separated editor for short tag lists (e.g. a product's tech stack). */
export function TagsInput({
  label,
  items,
  onChange,
}: {
  label: string
  items: string[]
  onChange: (items: string[]) => void
}) {
  return (
    <TextInput
      label={label}
      hint="comma separated"
      value={items.join(', ')}
      onChange={(v) =>
        onChange(
          v
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean),
        )
      }
    />
  )
}

/**
 * Collapsible list of structured records with add / remove / reorder.
 * `children` renders the editor for one item.
 */
export function ListEditor<T>({
  items,
  onChange,
  newItem,
  title,
  addLabel,
  children,
}: {
  items: T[]
  onChange: (items: T[]) => void
  newItem: () => T
  title: (item: T, index: number) => string
  addLabel: string
  children: (item: T, update: (patch: Partial<T>) => void) => ReactNode
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const update = (i: number) => (patch: Partial<T>) =>
    onChange(items.map((item, idx) => (idx === i ? { ...item, ...patch } : item)))

  const move = (i: number, delta: number) => {
    const j = i + delta
    if (j < 0 || j >= items.length) return
    const next = [...items]
    ;[next[i], next[j]] = [next[j], next[i]]
    onChange(next)
    setOpenIndex(openIndex === i ? j : openIndex === j ? i : openIndex)
  }

  const remove = (i: number) => {
    if (!confirm(`Delete "${title(items[i], i)}"? This can't be undone once you save.`)) return
    onChange(items.filter((_, idx) => idx !== i))
    setOpenIndex(null)
  }

  return (
    <div className="admin-list">
      {items.map((item, i) => (
        <div className="admin-item" key={i}>
          <div className="admin-item-head">
            <button
              type="button"
              className="admin-item-title"
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
            >
              <span className="admin-caret">{openIndex === i ? '▾' : '▸'}</span>
              {title(item, i) || <em>untitled</em>}
            </button>
            <div className="admin-item-actions">
              <button
                type="button"
                className="admin-icon-btn"
                title="Move up"
                disabled={i === 0}
                onClick={() => move(i, -1)}
              >
                ↑
              </button>
              <button
                type="button"
                className="admin-icon-btn"
                title="Move down"
                disabled={i === items.length - 1}
                onClick={() => move(i, 1)}
              >
                ↓
              </button>
              <button
                type="button"
                className="admin-icon-btn admin-icon-danger"
                title="Delete"
                onClick={() => remove(i)}
              >
                ✕
              </button>
            </div>
          </div>
          {openIndex === i && (
            <div className="admin-item-body">{children(item, update(i))}</div>
          )}
        </div>
      ))}
      <button
        type="button"
        className="admin-add"
        onClick={() => {
          onChange([...items, newItem()])
          setOpenIndex(items.length)
        }}
      >
        {addLabel}
      </button>
    </div>
  )
}
