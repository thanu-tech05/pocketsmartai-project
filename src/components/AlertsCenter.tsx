import { useEffect, useRef, useState } from 'react'
import { Bell, CheckCircle as CheckCircle2, InfoCircle as Info, WarningTriangle as TriangleAlert, XmarkCircle as XCircle } from 'iconoir-react'
import { useFinance } from '../hooks/useFinance'
import { cn } from '../lib/cn'
import type { Recommendation } from '../types'

const ICONS = {
  danger: XCircle,
  warning: TriangleAlert,
  success: CheckCircle2,
  info: Info,
} as const

export function AlertsCenter() {
  const { recommendations } = useFinance()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const alerts = recommendations.filter((r) => r.severity !== 'success').slice(0, 6)
  const urgent = recommendations.filter((r) => r.severity === 'danger' || r.severity === 'warning').length

  useEffect(() => {
    if (!open) return
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [open])

  const tone: Record<Recommendation['severity'], string> = {
    danger: 'text-rose-500',
    warning: 'text-amber-500',
    success: 'text-emerald-500',
    info: 'text-brand-500',
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
        aria-label="Alerts"
        aria-expanded={open}
      >
        <Bell className="h-5 w-5" />
        {urgent > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-micro font-bold text-white">
            {urgent}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-80 max-w-[85vw] overflow-hidden rounded-2xl border border-slate-200 bg-surface shadow-card animate-scale-in">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <p className="text-sm font-semibold text-slate-800">Alerts</p>
            <span className="text-xs text-slate-400">{alerts.length} shown</span>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {alerts.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-slate-400">
                You&apos;re all clear. No active alerts.
              </p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {alerts.map((a) => {
                  const Icon = ICONS[a.severity]
                  return (
                    <li key={a.id} className="flex items-start gap-3 px-4 py-3">
                      <Icon className={cn('mt-0.5 h-4 w-4 shrink-0', tone[a.severity])} />
                      <div>
                        <p className="text-sm font-medium text-slate-800">{a.title}</p>
                        <p className="mt-0.5 line-clamp-2 text-xs text-slate-500">{a.message}</p>
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
