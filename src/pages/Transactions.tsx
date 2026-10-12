import { useMemo, useState } from 'react'
import { DataTransferBoth as ArrowLeftRight, Download, EditPencil as Pencil, Plus, Search, Trash as Trash2 } from 'iconoir-react'
import { useApp } from '../context/AppContext'
import { useToast } from '../context/ToastContext'
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, type Transaction, type TxType } from '../types'
import { formatINR, formatDate, monthKey, monthLabel } from '../lib/format'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { EmptyState } from '../components/ui/EmptyState'
import { Dropdown } from '../components/ui/Dropdown'
import { CategoryIcon } from '../components/CategoryIcon'
import { TransactionModal } from '../components/TransactionModal'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'

type SortKey = 'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc'

export function Transactions() {
  const { state, deleteTransaction } = useApp()
  const { notify } = useToast()

  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Transaction | null>(null)
  const [defaultType, setDefaultType] = useState<TxType>('expense')
  const [toDelete, setToDelete] = useState<Transaction | null>(null)

  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<'all' | TxType>('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [monthFilter, setMonthFilter] = useState('all')
  const [sort, setSort] = useState<SortKey>('date-desc')

  const months = useMemo(() => {
    const set = new Set(state.transactions.map((t) => monthKey(t.date)))
    return [...set].sort((a, b) => b.localeCompare(a))
  }, [state.transactions])

  const allCategories = useMemo(
    () => [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES],
    [],
  )

  const filtered = useMemo(() => {
    let list = [...state.transactions]
    if (typeFilter !== 'all') list = list.filter((t) => t.type === typeFilter)
    if (categoryFilter !== 'all') list = list.filter((t) => t.category === categoryFilter)
    if (monthFilter !== 'all') list = list.filter((t) => monthKey(t.date) === monthFilter)
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      list = list.filter(
        (t) => t.description.toLowerCase().includes(q) || t.category.toLowerCase().includes(q),
      )
    }
    list.sort((a, b) => {
      switch (sort) {
        case 'date-asc':
          return a.date.localeCompare(b.date)
        case 'amount-desc':
          return b.amount - a.amount
        case 'amount-asc':
          return a.amount - b.amount
        default:
          return b.date.localeCompare(a.date)
      }
    })
    return list
  }, [state.transactions, typeFilter, categoryFilter, monthFilter, search, sort])

  const totals = useMemo(() => {
    const income = filtered.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0)
    const expense = filtered.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
    return { income, expense }
  }, [filtered])

  function exportCsv() {
    const header = ['Date', 'Type', 'Category', 'Description', 'Amount (INR)']
    const rows = filtered.map((t) => [
      t.date,
      t.type,
      t.category,
      `"${t.description.replace(/"/g, '""')}"`,
      t.amount,
    ])
    const csv = [header, ...rows].map((r) => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `pocketsmartai-transactions-${Date.now()}.csv`
    a.click()
    URL.revokeObjectURL(url)
    notify('Transactions exported as CSV')
  }

  function openAdd(type: TxType) {
    setEditing(null)
    setDefaultType(type)
    setOpen(true)
  }

  function openEdit(t: Transaction) {
    setEditing(t)
    setOpen(true)
  }

  function confirmDelete() {
    if (!toDelete) return
    deleteTransaction(toDelete.id)
    notify('Transaction deleted', 'info')
    setToDelete(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div className="flex gap-2 text-sm">
          <span className="rounded-lg bg-emerald-50 px-3 py-1.5 font-semibold text-emerald-700">
            Income {formatINR(totals.income)}
          </span>
          <span className="rounded-lg bg-rose-50 px-3 py-1.5 font-semibold text-rose-700">
            Expenses {formatINR(totals.expense)}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="secondary" icon={<Download className="h-4 w-4" />} onClick={exportCsv} disabled={filtered.length === 0}>
            Export
          </Button>
          <Button size="sm" variant="secondary" icon={<Plus className="h-4 w-4" />} onClick={() => openAdd('income')}>
            Income
          </Button>
          <Button size="sm" icon={<Plus className="h-4 w-4" />} onClick={() => openAdd('expense')}>
            Expense
          </Button>
        </div>
      </div>

      <Card>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <div className="relative sm:col-span-2 lg:col-span-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search transactions"
              className="w-full rounded-xl border border-slate-200 bg-surface py-2 pl-9 pr-3 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
            />
          </div>
          <Dropdown
            label="Transaction type"
            value={typeFilter}
            onChange={(v) => setTypeFilter(v as typeof typeFilter)}
            options={[
              { value: 'all', label: 'All types' },
              { value: 'income', label: 'Income' },
              { value: 'expense', label: 'Expense' },
            ]}
          />
          <Dropdown
            label="Category"
            value={categoryFilter}
            onChange={setCategoryFilter}
            options={[
              { value: 'all', label: 'All categories' },
              ...allCategories.map((c) => ({ value: c, label: c })),
            ]}
          />
          <Dropdown
            label="Month"
            value={monthFilter}
            onChange={setMonthFilter}
            options={[
              { value: 'all', label: 'All months' },
              ...months.map((m) => ({ value: m, label: monthLabel(m) })),
            ]}
          />
          <Dropdown
            label="Sort order"
            value={sort}
            onChange={(v) => setSort(v as SortKey)}
            options={[
              { value: 'date-desc', label: 'Newest first' },
              { value: 'date-asc', label: 'Oldest first' },
              { value: 'amount-desc', label: 'Highest amount' },
              { value: 'amount-asc', label: 'Lowest amount' },
            ]}
          />
        </div>
      </Card>

      <Card padded={false} className="overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-5">
            <EmptyState
              icon={<ArrowLeftRight className="h-6 w-6" />}
              title={state.transactions.length === 0 ? 'No transactions yet' : 'No matching transactions'}
              message={
                state.transactions.length === 0
                  ? 'Add your first income or expense to see it appear here.'
                  : 'Try changing your search or filters.'
              }
              action={
                state.transactions.length === 0 ? (
                  <Button size="sm" icon={<Plus className="h-4 w-4" />} onClick={() => openAdd('expense')}>
                    Add Transaction
                  </Button>
                ) : undefined
              }
            />
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-slate-100 bg-slate-50/60 text-micro uppercase text-slate-500">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Description</th>
                    <th className="px-5 py-3 font-semibold">Category</th>
                    <th className="px-5 py-3 font-semibold">Date</th>
                    <th className="px-5 py-3 text-right font-semibold">Amount</th>
                    <th className="px-5 py-3 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((t) => (
                    <tr key={t.id} className="transition hover:bg-slate-50/60">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <CategoryIcon category={t.category} className="h-9 w-9" />
                          <span className="font-medium text-slate-800">{t.description}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <Badge tone={t.type === 'income' ? 'good' : 'neutral'}>{t.category}</Badge>
                      </td>
                      <td className="px-5 py-3 text-slate-500">{formatDate(t.date)}</td>
                      <td
                        className={`px-5 py-3 text-right font-bold tabular-nums ${
                          t.type === 'income' ? 'text-emerald-600' : 'text-slate-800'
                        }`}
                      >
                        {t.type === 'income' ? '+' : '−'}
                        {formatINR(t.amount)}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex justify-end gap-1">
                          <button
                            onClick={() => openEdit(t)}
                            className="rounded-lg p-2 text-slate-400 transition hover:bg-brand-50 hover:text-brand-600"
                            aria-label="Edit"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setToDelete(t)}
                            className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                            aria-label="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile list */}
            <div className="divide-y divide-slate-100 md:hidden">
              {filtered.map((t) => (
                <div key={t.id} className="flex items-center gap-3 px-4 py-3">
                  <CategoryIcon category={t.category} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-800">{t.description}</p>
                    <p className="text-xs text-slate-400">
                      {t.category} · {formatDate(t.date)}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span
                      className={`text-sm font-bold tabular-nums ${
                        t.type === 'income' ? 'text-emerald-600' : 'text-slate-800'
                      }`}
                    >
                      {t.type === 'income' ? '+' : '−'}
                      {formatINR(t.amount)}
                    </span>
                    <div className="flex gap-1">
                      <button onClick={() => openEdit(t)} className="rounded p-1 text-slate-400" aria-label="Edit">
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => setToDelete(t)} className="rounded p-1 text-slate-400" aria-label="Delete">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </Card>

      <TransactionModal open={open} onClose={() => setOpen(false)} editing={editing} defaultType={defaultType} />
      <ConfirmDialog
        open={toDelete !== null}
        title="Delete transaction?"
        message={`This will permanently remove "${toDelete?.description}" (${formatINR(
          toDelete?.amount ?? 0,
        )}). This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  )
}
