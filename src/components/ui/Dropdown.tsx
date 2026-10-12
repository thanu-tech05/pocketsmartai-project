import { useEffect, useId, useRef, useState } from 'react'
import { Check, NavArrowDown as ChevronDown } from 'iconoir-react'
import clsx from 'clsx'

export interface DropdownOption {
  value: string
  label: string
}

interface DropdownProps {
  value: string
  onChange: (value: string) => void
  options: DropdownOption[]
  label: string
  className?: string
}

export function Dropdown({ value, onChange, options, label, className }: DropdownProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([])
  const labelId = useId()
  const selected = options.find((o) => o.value === value)

  useEffect(() => {
    if (!open) return
    function onPointer(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpen(false)
        triggerRef.current?.focus()
      }
    }
    document.addEventListener('mousedown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open ])

  function focusItem(i: number) {
    const n = options.length
    const idx = ((i % n) + n) % n
    itemRefs.current[idx]?.focus()
  }

  function onTriggerKey(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setOpen(true)
      const current = Math.max(0, options.findIndex((o) => o.value === value))
      requestAnimationFrame(() => focusItem(current))
    }
  }

  function onMenuKey(e: React.KeyboardEvent) {
    const active = itemRefs.current.findIndex((el) => el === document.activeElement)
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      focusItem(active + 1)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      focusItem(active - 1)
    } else if (e.key === 'Home') {
      e.preventDefault()
      focusItem(0)
    } else if (e.key === 'End') {
      e.preventDefault()
      focusItem(options.length - 1)
    } else if (e.key === 'Tab') {
      setOpen(false)
    }
  }

  function choose(next: string) {
    onChange(next)
    setOpen(false)
    triggerRef.current?.focus()
  }

  return (
    <div ref={rootRef} className={clsx('relative', className)}>
      <span id={labelId} className="sr-only">
        {label}
      </span>
      <button
        ref={triggerRef}
        type="button"
        aria-labelledby={labelId}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={onTriggerKey}
        className={clsx(
          'flex w-full items-center gap-2 rounded-xl border bg-surface px-3 py-2 text-left text-sm text-slate-900 transition',
          open
            ? 'border-brand-400 ring-2 ring-brand-100'
            : 'border-slate-200 hover:border-slate-300',
        )}
      >
        <span className="min-w-0 flex-1 truncate">{selected?.label ?? label}</span>
        <ChevronDown
          className={clsx('h-4 w-4 shrink-0 text-slate-400 transition-transform', open && 'rotate-180')}
        />
      </button>

      {open && (
        <div
          role="listbox"
          aria-labelledby={labelId}
          onKeyDown={onMenuKey}
          className="absolute inset-x-0 top-full z-30 mt-1.5 max-h-64 overflow-y-auto rounded-xl border border-slate-200 bg-surface p-1 shadow-card animate-scale-in"
        >
          {options.map((o, i) => {
            const active = o.value === value
            return (
              <button
                key={o.value}
                ref={(el) => {
                  itemRefs.current[i] = el
                }}
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => choose(o.value)}
                className={clsx(
                  'flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm transition-colors',
                  active
                    ? 'bg-brand-50 font-semibold text-brand-700'
                    : 'text-slate-700 hover:bg-slate-100',
                )}
              >
                <span className="min-w-0 flex-1 truncate">{o.label}</span>
                {active && <Check className="h-4 w-4 shrink-0" />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
