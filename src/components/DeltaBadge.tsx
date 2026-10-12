import { ArrowDownRight, ArrowUpRight, Minus } from 'iconoir-react'
import clsx from 'clsx'

/**
 * Shows a month-over-month change. `positiveIsGood` controls colouring:
 * for expenses, an increase is bad; for income/savings, an increase is good.
 */
export function DeltaBadge({
  value,
  positiveIsGood = true,
  label = 'vs last month',
}: {
  value: number | null
  positiveIsGood?: boolean
  label?: string
}) {
  if (value === null) {
    return <span className="text-xs text-slate-400">{label}</span>
  }
  const flat = Math.abs(value) < 0.5
  const up = value > 0
  const good = flat ? false : up === positiveIsGood
  const Icon = flat ? Minus : up ? ArrowUpRight : ArrowDownRight

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 text-xs font-semibold',
        flat ? 'text-slate-400' : good ? 'text-emerald-600' : 'text-rose-600',
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {flat ? '0%' : `${Math.abs(value).toFixed(0)}%`}
      <span className="font-normal text-slate-400">{label}</span>
    </span>
  )
}
