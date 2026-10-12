import { NavLink } from 'react-router-dom'
import { Wallet } from 'iconoir-react'
import clsx from 'clsx'
import { BOTTOM_ITEMS, NAV_ITEMS } from './nav'

export function Brand() {
  return (
    <div className="flex items-center gap-2.5">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-sm">
        <Wallet className="h-5 w-5" />
      </span>
      <div className="leading-tight">
        <p className="text-sm font-extrabold tracking-tight text-slate-900">PocketSmartAI</p>
        <p className="text-xs font-medium text-slate-400">Budget &amp; Recommendation</p>
      </div>
    </div>
  )
}

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    clsx(
      'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition',
      isActive
        ? 'bg-brand-50 text-brand-700 ring-1 ring-brand-100'
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
    )

  return (
    <div className="flex h-full flex-col">
      <div className="px-4 py-5">
        <Brand />
      </div>

      <nav className="flex-1 space-y-1 px-3">
        <p className="px-3 pb-1 pt-2 text-micro font-semibold uppercase text-slate-400">
          Menu
        </p>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          return (
            <NavLink key={item.to} to={item.to} end={item.to === '/'} className={linkClass} onClick={onNavigate}>
              <Icon className="h-[18px] w-[18px]" />
              <span className="truncate">{item.label}</span>
            </NavLink>
          )
        })}
      </nav>

      <div className="space-y-1 px-3 pb-4">
        {BOTTOM_ITEMS.map((item) => {
          const Icon = item.icon
          return (
            <NavLink key={item.to} to={item.to} className={linkClass} onClick={onNavigate}>
              <Icon className="h-[18px] w-[18px]" />
              <span>{item.label}</span>
            </NavLink>
          )
        })}
      </div>
    </div>
  )
}
