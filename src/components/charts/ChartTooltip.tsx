import type { TooltipProps } from 'recharts'
import { formatINR } from '../../lib/format'

export function ChartTooltip({
  active,
  payload,
  label,
}: TooltipProps<number, string>) {
  if (!active || !payload || payload.length === 0) return null
  return (
    <div className="rounded-xl border border-slate-200 bg-surface px-3 py-2 shadow-card">
      {label !== undefined && <p className="mb-1 text-xs font-semibold text-slate-500">{label}</p>}
      {payload.map((entry) => (
        <p key={entry.dataKey as string} className="flex items-center gap-2 text-sm text-slate-700">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: entry.color }} />
          <span className="font-medium">{entry.name}</span>
          <span className="ml-auto font-semibold tabular-nums">
            {formatINR(Number(entry.value))}
          </span>
        </p>
      ))}
    </div>
  )
}
