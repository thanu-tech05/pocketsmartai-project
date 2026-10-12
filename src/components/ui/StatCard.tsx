import { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import type { ReactNode } from 'react'
import { formatINR } from '../../lib/format'

interface StatCardProps {
  label: string
  value: string
  countTo?: number
  icon: ReactNode
  tone?: 'brand' | 'good' | 'bad' | 'neutral' | 'warn'
  sub?: ReactNode
}

const toneStyles: Record<NonNullable<StatCardProps['tone']>, string> = {
  brand: 'bg-brand-50 text-brand-600',
  good: 'bg-emerald-50 text-emerald-600',
  bad: 'bg-rose-50 text-rose-600',
  warn: 'bg-amber-50 text-amber-600',
  neutral: 'bg-slate-100 text-slate-600',
}

function useCountUp(target: number, duration = 700): number {
  const [value, setValue] = useState(0)
  const raf = useRef(0)

  useEffect(() => {
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setValue(target)
      return
    }
    const start = performance.now()
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - p, 3)
      setValue(target * eased)
      if (p < 1) raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [target, duration])

  return value
}

export function StatCard({ label, value, countTo, icon, tone = 'brand', sub }: StatCardProps) {
  const animated = useCountUp(countTo ?? 0)
  const display = typeof countTo === 'number' ? formatINR(animated) : value

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-surface p-4 transition-colors hover:border-slate-300">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <span className={clsx('flex h-9 w-9 items-center justify-center rounded-xl', toneStyles[tone])}>
          {icon}
        </span>
      </div>
      <p className="mt-3 text-2xl font-bold tracking-tight text-slate-900 tabular-nums">{display}</p>
      {sub && <div className="mt-1 text-xs text-slate-500">{sub}</div>}
    </div>
  )
}
