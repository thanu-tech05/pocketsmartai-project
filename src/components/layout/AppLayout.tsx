import { useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { Menu, Xmark as X } from 'iconoir-react'
import { Sidebar } from './Sidebar'
import { NAV_ITEMS, BOTTOM_ITEMS } from './nav'
import { useApp } from '../../context/AppContext'
import { greeting, monthLabel, currentMonthKey } from '../../lib/format'
import { ThemeToggle } from '../ThemeToggle'
import { AlertsCenter } from '../AlertsCenter'

function usePageTitle(): string {
  const { pathname } = useLocation()
  if (pathname === '/') return 'Dashboard'
  const item = [...NAV_ITEMS, ...BOTTOM_ITEMS].find((n) => n.to === pathname)
  return item?.label ?? 'Dashboard'
}

function Topbar({ onMenu }: { onMenu: () => void }) {
  const { state } = useApp()
  const title = usePageTitle()
  const initials = (state.profile.name || 'User')
    .split(' ')
    .map((s) => s[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-surface/85 backdrop-blur">
      <div className="flex items-center justify-between gap-3 px-4 py-3 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenu}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">{title}</h1>
            <p className="hidden text-xs text-slate-500 sm:block">
              {greeting()}, {state.profile.name?.split(' ')[0] || 'there'} · {monthLabel(currentMonthKey())}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <AlertsCenter />
          <ThemeToggle />
          <div className="mx-1 hidden h-6 w-px bg-slate-200 sm:block" />
          <Link
            to="/settings"
            title="Profile & settings"
            className="ml-1 flex items-center gap-2 rounded-xl px-1.5 py-1 transition hover:bg-slate-100"
          >
            <div className="hidden text-right sm:block">
              <p className="text-xs font-medium text-slate-700">{state.profile.name || 'User'}</p>
              <p className="text-xs text-slate-400">{state.profile.email || 'Local account'}</p>
            </div>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">
              {initials}
            </span>
          </Link>
        </div>
      </div>
    </header>
  )
}

export function AppLayout() {
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-slate-200/80 bg-surface lg:block">
        <Sidebar />
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div className="absolute inset-y-0 left-0 w-72 bg-surface shadow-card animate-fade-in">
            <button
              onClick={() => setOpen(false)}
              className="absolute right-3 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
            <Sidebar onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}

      <div className="lg:pl-64">
        <Topbar onMenu={() => setOpen(true)} />
        <main id="main" className="mx-auto max-w-7xl px-4 py-6 lg:px-8 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
