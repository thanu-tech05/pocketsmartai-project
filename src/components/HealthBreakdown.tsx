import type { HealthResult } from '../types'
import { ProgressBar } from './ui/ProgressBar'

function factorTone(pct: number): 'good' | 'warn' | 'bad' {
  if (pct >= 75) return 'good'
  if (pct >= 45) return 'warn'
  return 'bad'
}

export function HealthBreakdown({ health }: { health: HealthResult }) {
  return (
    <div className="space-y-4">
      {health.breakdown.map((f) => {
        const pct = f.max > 0 ? (f.points / f.max) * 100 : 0
        return (
          <div key={f.label}>
            <div className="mb-1.5 flex items-baseline justify-between gap-3 text-sm">
              <span className="font-medium text-slate-700">{f.label}</span>
              <span className="tabular-nums text-slate-500">
                <span className="font-semibold text-slate-900">{f.points}</span> / {f.max} pts
              </span>
            </div>
            <ProgressBar value={pct} tone={factorTone(pct)} />
            <p className="mt-1.5 text-xs text-slate-500">{f.detail}</p>
          </div>
        )
      })}
      <div className="flex items-center justify-between border-t border-slate-100 pt-3">
        <span className="text-sm font-semibold text-slate-700">Total Budget Health Score</span>
        <span className="tabular-nums text-lg font-extrabold text-slate-900">
          {health.score} / 100
        </span>
      </div>
    </div>
  )
}
