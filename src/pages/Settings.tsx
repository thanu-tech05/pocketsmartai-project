import { useEffect, useRef, useState } from 'react'
import {
  Database,
  Download,
  Computer as Monitor,
  HalfMoon as Moon,
  Printer,
  RefreshDouble as RotateCcw,
  SunLight as Sun,
  Trash as Trash2,
  Upload,
  User,
} from 'iconoir-react'
import { RupeeIcon as IndianRupee } from '../components/icons'
import { useApp } from '../context/AppContext'
import { useToast } from '../context/ToastContext'
import { useTheme, type ThemePref } from '../context/ThemeContext'
import { Card, CardHeader } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Input } from '../components/ui/Field'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { formatDate, formatINR } from '../lib/format'
import { printReport } from '../lib/report'
import { cn } from '../lib/cn'
import type { AppState } from '../types'

const THEME_OPTIONS: { value: ThemePref; label: string; icon: typeof Sun }[] = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
]

export function Settings() {
  const { state, updateProfile, importData, resetDemoData, clearAllData } = useApp()
  const { notify } = useToast()
  const { pref, setPref } = useTheme()

  const [name, setName] = useState(state.profile.name)
  const [email, setEmail] = useState(state.profile.email)
  const [emailError, setEmailError] = useState('')
  const [resetOpen, setResetOpen] = useState(false)
  const [clearOpen, setClearOpen] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setName(state.profile.name)
    setEmail(state.profile.email)
  }, [state.profile])

  const income = state.transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0)
  const expense = state.transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0)

  const initials = (state.profile.name || 'User')
    .split(' ')
    .map((s) => s[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
  const memberSince = formatDate(new Date(state.seededAt).toISOString().slice(0, 10))
  const dirty =
    name.trim() !== state.profile.name || email.trim() !== state.profile.email

  function saveProfile() {
    const trimmed = email.trim()
    if (trimmed && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setEmailError('Enter a valid email')
      notify('Please fix the highlighted field', 'error')
      return
    }
    updateProfile({ name: name.trim() || 'User', email: trimmed })
    setEmailError('')
    notify('Profile updated')
  }

  function exportJson() {
    const data: AppState = state
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `pocketsmartai-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
    notify('Backup exported as JSON')
  }

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result)) as AppState
        if (!parsed || !Array.isArray(parsed.transactions)) throw new Error('invalid')
        importData(parsed)
        notify('Data imported successfully')
      } catch {
        notify('Could not import: invalid backup file', 'error')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Card>
        <CardHeader title="Profile" subtitle="Your local account details" />
        <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-center">
          <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-xl font-bold text-white shadow-soft">
            {initials}
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="truncate text-lg font-bold text-slate-900">
                {state.profile.name || 'User'}
              </p>
              <Badge tone="info">Local account</Badge>
            </div>
            <p className="truncate text-sm text-slate-500">
              {state.profile.email || 'No email set'}
            </p>
            <p className="mt-0.5 text-xs text-slate-400">Using PocketSmartAI since {memberSince}</p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Display name"
            value={name}
            maxLength={40}
            placeholder="Your name"
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            label="Email"
            type="email"
            value={email}
            placeholder="you@example.com"
            error={emailError}
            onChange={(e) => {
              setEmail(e.target.value)
              if (emailError) setEmailError('')
            }}
          />
        </div>
        <div className="mt-4 flex items-center justify-end gap-3">
          {dirty && <span className="mr-auto text-xs font-medium text-amber-600">Unsaved changes</span>}
          <Button icon={<User className="h-4 w-4" />} onClick={saveProfile} disabled={!dirty}>
            Save Profile
          </Button>
        </div>
      </Card>

      <Card>
        <CardHeader title="Appearance" subtitle="Choose how PocketSmartAI looks" />
        <div className="grid grid-cols-3 gap-2">
          {THEME_OPTIONS.map((opt) => {
            const Icon = opt.icon
            const active = pref === opt.value
            return (
              <button
                key={opt.value}
                onClick={() => setPref(opt.value)}
                className={cn(
                  'flex flex-col items-center gap-2 rounded-xl border px-3 py-4 text-sm font-semibold transition',
                  active
                    ? 'border-brand-300 bg-brand-50 text-brand-700'
                    : 'border-slate-200 bg-surface text-slate-600 hover:bg-slate-50',
                )}
                aria-pressed={active}
              >
                <Icon className="h-5 w-5" />
                {opt.label}
              </button>
            )
          })}
        </div>
      </Card>

      <Card>
        <CardHeader title="Currency" subtitle="This project uses Indian Rupees" />
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
            <IndianRupee className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-semibold text-slate-800">Indian Rupee (INR)</p>
            <p className="text-xs text-slate-500">All values are displayed and stored in ₹ (fixed for this project).</p>
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader title="Data Summary" subtitle="Everything is stored locally in your browser" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: 'Transactions', value: String(state.transactions.length) },
            { label: 'Budgets', value: String(state.budgets.length) },
            { label: 'Goals', value: String(state.goals.length) },
            { label: 'Total income', value: formatINR(income) },
          ].map((s) => (
            <div key={s.label} className="rounded-xl bg-slate-50 px-4 py-3">
              <p className="text-xs text-slate-500">{s.label}</p>
              <p className="mt-1 text-lg font-bold tabular-nums text-slate-900">{s.value}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-slate-400">Total recorded expenses: {formatINR(expense)}</p>
      </Card>

      <Card>
        <CardHeader title="Report & Backup" subtitle="Print a report or move your data between devices" />
        <div className="space-y-3">
          <div className="flex flex-col items-start justify-between gap-3 rounded-xl border border-slate-200 px-4 py-3 sm:flex-row sm:items-center">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                <Download className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-slate-800">Export Backup (JSON)</p>
                <p className="text-xs text-slate-500">Download all your data as a file.</p>
              </div>
            </div>
            <Button variant="secondary" size="sm" onClick={exportJson}>
              Export
            </Button>
          </div>

          <div className="flex flex-col items-start justify-between gap-3 rounded-xl border border-slate-200 px-4 py-3 sm:flex-row sm:items-center">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                <Upload className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-slate-800">Import Backup</p>
                <p className="text-xs text-slate-500">Restore data from a previously exported JSON file.</p>
              </div>
            </div>
            <input ref={fileRef} type="file" accept="application/json,.json" className="hidden" onChange={handleImport} />
            <Button variant="secondary" size="sm" onClick={() => fileRef.current?.click()}>
              Import
            </Button>
          </div>

          <div className="flex flex-col items-start justify-between gap-3 rounded-xl border border-slate-200 px-4 py-3 sm:flex-row sm:items-center">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                <Printer className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-slate-800">Print Report</p>
                <p className="text-xs text-slate-500">Generate a clean printable summary for your demo.</p>
              </div>
            </div>
            <Button variant="secondary" size="sm" onClick={() => printReport(state)}>
              Print
            </Button>
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader title="Data Management" subtitle="Restore sample data or start fresh" />
        <div className="space-y-3">
          <div className="flex flex-col items-start justify-between gap-3 rounded-xl border border-slate-200 px-4 py-3 sm:flex-row sm:items-center">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                <RotateCcw className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-slate-800">Reset Demo Data</p>
                <p className="text-xs text-slate-500">Reload the sample Indian financial data.</p>
              </div>
            </div>
            <Button variant="secondary" size="sm" onClick={() => setResetOpen(true)}>
              Reset
            </Button>
          </div>

          <div className="flex flex-col items-start justify-between gap-3 rounded-xl border border-rose-100 bg-rose-50/40 px-4 py-3 sm:flex-row sm:items-center">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
                <Trash2 className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-slate-800">Clear All Data</p>
                <p className="text-xs text-slate-500">Delete all transactions, budgets and goals permanently.</p>
              </div>
            </div>
            <Button variant="danger" size="sm" onClick={() => setClearOpen(true)}>
              Clear
            </Button>
          </div>
        </div>
        <p className="mt-3 flex items-center gap-1.5 text-xs text-slate-400">
          <Database className="h-3.5 w-3.5" />
          Data is saved to your browser&apos;s localStorage and persists after refresh.
        </p>
      </Card>

      <ConfirmDialog
        open={resetOpen}
        title="Reset to demo data?"
        message="This will replace your current data with fresh sample Indian financial data."
        confirmLabel="Reset"
        tone="primary"
        onConfirm={() => {
          resetDemoData()
          notify('Demo data restored')
          setResetOpen(false)
        }}
        onCancel={() => setResetOpen(false)}
      />
      <ConfirmDialog
        open={clearOpen}
        title="Clear all data?"
        message="This will permanently delete all transactions, budgets and savings goals. This cannot be undone."
        confirmLabel="Clear Everything"
        onConfirm={() => {
          clearAllData()
          notify('All data cleared', 'info')
          setClearOpen(false)
        }}
        onCancel={() => setClearOpen(false)}
      />
    </div>
  )
}
