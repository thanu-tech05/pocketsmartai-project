import clsx from 'clsx'
import type { ReactNode } from 'react'

type Tone = 'brand' | 'good' | 'warn' | 'bad' | 'neutral' | 'info'

const tones: Record<Tone, string> = {
  brand: 'bg-brand-50 text-brand-700 ring-brand-100',
  good: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  warn: 'bg-amber-50 text-amber-700 ring-amber-100',
  bad: 'bg-rose-50 text-rose-700 ring-rose-100',
  neutral: 'bg-slate-100 text-slate-600 ring-slate-200',
  info: 'bg-sky-50 text-sky-700 ring-sky-100',
}

export function Badge({
  children,
  tone = 'neutral',
  className,
}: {
  children: ReactNode
  tone?: Tone
  className?: string
}) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}
