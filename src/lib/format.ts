const inr = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

const inrPrecise = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

/** Format a number as Indian Rupees, e.g. ₹25,000 */
export function formatINR(value: number, precise = false): string {
  const safe = Number.isFinite(value) ? value : 0
  return precise ? inrPrecise.format(safe) : inr.format(Math.round(safe))
}

/** Compact INR for chart axes, e.g. ₹25K, ₹1.2L */
export function formatINRCompact(value: number): string {
  const v = Math.abs(value)
  const sign = value < 0 ? '-' : ''
  if (v >= 10000000) return `${sign}₹${(v / 10000000).toFixed(2).replace(/\.00$/, '')}Cr`
  if (v >= 100000) return `${sign}₹${(v / 100000).toFixed(2).replace(/\.00$/, '')}L`
  if (v >= 1000) return `${sign}₹${(v / 1000).toFixed(1).replace(/\.0$/, '')}K`
  return `${sign}₹${Math.round(v)}`
}

export function formatPercent(value: number, digits = 0): string {
  const safe = Number.isFinite(value) ? value : 0
  return `${safe.toFixed(digits)}%`
}

export function formatDate(iso: string): string {
  if (!iso) return '—'
  const d = new Date(`${iso.slice(0, 10)}T00:00:00`)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function formatDateShort(iso: string): string {
  if (!iso) return '—'
  const d = new Date(`${iso.slice(0, 10)}T00:00:00`)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })
}

export function monthKey(dateIso: string): string {
  return dateIso.slice(0, 7)
}

export function monthLabel(key: string): string {
  const [y, m] = key.split('-').map(Number)
  if (!y || !m) return key
  return new Date(y, m - 1, 1).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
}

export function monthLabelShort(key: string): string {
  const [y, m] = key.split('-').map(Number)
  if (!y || !m) return key
  return new Date(y, m - 1, 1).toLocaleDateString('en-IN', { month: 'short' })
}

export function todayIso(): string {
  return new Date().toISOString().slice(0, 10)
}

export function currentMonthKey(): string {
  return todayIso().slice(0, 7)
}

export function addMonths(key: string, delta: number): string {
  const [y, m] = key.split('-').map(Number)
  const d = new Date(y, m - 1 + delta, 1)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

export function daysUntil(iso: string): number {
  const target = new Date(`${iso.slice(0, 10)}T00:00:00`).getTime()
  const now = new Date(todayIso() + 'T00:00:00').getTime()
  return Math.ceil((target - now) / 86400000)
}

export function greeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

export function uid(prefix = 'id'): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
}
