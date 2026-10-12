import clsx from 'clsx'
import {
  MoneySquare as Banknote,
  Suitcase as Briefcase,
  Bus,
  Movie as Film,
  Gift,
  GraduationCap,
  Heart as HeartPulse,
  Laptop,
  Notes as ReceiptText,
  BoxIso as Shapes,
  ShoppingBag,
  GraphUp as TrendingUp,
  Cutlery as UtensilsCrossed,
} from 'iconoir-react'
import type { IconType as LucideIcon } from './icons'

interface Meta {
  icon: LucideIcon
  bg: string
  fg: string
}

export const CATEGORY_META: Record<string, Meta> = {
  Food: { icon: UtensilsCrossed, bg: 'bg-orange-50', fg: 'text-orange-600' },
  Transport: { icon: Bus, bg: 'bg-sky-50', fg: 'text-sky-600' },
  Shopping: { icon: ShoppingBag, bg: 'bg-fuchsia-50', fg: 'text-fuchsia-600' },
  Education: { icon: GraduationCap, bg: 'bg-indigo-50', fg: 'text-indigo-600' },
  Bills: { icon: ReceiptText, bg: 'bg-amber-50', fg: 'text-amber-600' },
  Entertainment: { icon: Film, bg: 'bg-purple-50', fg: 'text-purple-600' },
  Health: { icon: HeartPulse, bg: 'bg-rose-50', fg: 'text-rose-600' },
  Other: { icon: Shapes, bg: 'bg-slate-100', fg: 'text-slate-600' },
  Salary: { icon: Banknote, bg: 'bg-emerald-50', fg: 'text-emerald-600' },
  Freelance: { icon: Laptop, bg: 'bg-teal-50', fg: 'text-teal-600' },
  Business: { icon: Briefcase, bg: 'bg-cyan-50', fg: 'text-cyan-600' },
  Investment: { icon: TrendingUp, bg: 'bg-lime-50', fg: 'text-lime-600' },
  Gift: { icon: Gift, bg: 'bg-pink-50', fg: 'text-pink-600' },
}

export const CATEGORY_COLORS: Record<string, string> = {
  Food: '#f97316',
  Transport: '#0ea5e9',
  Shopping: '#d946ef',
  Education: '#6366f1',
  Bills: '#f59e0b',
  Entertainment: '#a855f7',
  Health: '#f43f5e',
  Other: '#64748b',
  Salary: '#10b981',
  Freelance: '#14b8a6',
  Business: '#06b6d4',
  Investment: '#84cc16',
  Gift: '#ec4899',
}

export function categoryColor(name: string): string {
  return CATEGORY_COLORS[name] ?? '#64748b'
}

export function CategoryIcon({ category, className }: { category: string; className?: string }) {
  const meta = CATEGORY_META[category] ?? CATEGORY_META.Other
  const Icon = meta.icon
  return (
    <span
      className={clsx(
        'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
        meta.bg,
        meta.fg,
        className,
      )}
    >
      <Icon className="h-5 w-5" />
    </span>
  )
}
