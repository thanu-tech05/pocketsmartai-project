import { useEffect, useState } from 'react'
import { Modal } from './ui/Modal'
import { Button } from './ui/Button'
import { Input } from './ui/Field'
import { EXPENSE_CATEGORIES } from '../types'
import { useApp } from '../context/AppContext'
import { useToast } from '../context/ToastContext'
import { formatINR, monthLabel } from '../lib/format'
import type { Budget } from '../types'

interface Props {
  open: boolean
  onClose: () => void
  month: string
  budget?: Budget
}

export function BudgetModal({ open, onClose, month, budget }: Props) {
  const { setBudget } = useApp()
  const { notify } = useToast()
  const [total, setTotal] = useState('')
  const [cats, setCats] = useState<Record<string, string>>({})
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open) return
    setTotal(budget ? String(budget.total) : '')
    const next: Record<string, string> = {}
    for (const c of EXPENSE_CATEGORIES) {
      next[c] = budget?.categories[c] ? String(budget.categories[c]) : ''
    }
    setCats(next)
    setError('')
  }, [open, budget])

  const catSum = EXPENSE_CATEGORIES.reduce((s, c) => s + (Number(cats[c]) || 0), 0)
  const totalNum = Number(total) || 0

  function handleSubmit() {
    if (!totalNum || totalNum <= 0) {
      setError('Enter a monthly budget greater than 0')
      return
    }
    if (catSum > totalNum) {
      setError(
        `Category budgets (${formatINR(catSum)}) cannot exceed the total budget (${formatINR(totalNum)})`,
      )
      return
    }
    const categories: Record<string, number> = {}
    for (const c of EXPENSE_CATEGORIES) {
      const v = Number(cats[c])
      if (v > 0) categories[c] = v
    }
    setBudget(month, totalNum, categories)
    notify(`Budget for ${monthLabel(month)} saved`)
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Set Monthly Budget"
      subtitle={monthLabel(month)}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Save Budget</Button>
        </>
      }
    >
      <div className="space-y-5">
        <Input
          label="Total Monthly Budget (₹)"
          required
          type="number"
          min="0"
          placeholder="35000"
          value={total}
          onChange={(e) => setTotal(e.target.value)}
        />

        <div>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-700">Category Budgets</p>
            <p className="text-xs text-slate-500">
              Allocated: <span className="font-semibold text-slate-700">{formatINR(catSum)}</span>
              {totalNum > 0 && ` / ${formatINR(totalNum)}`}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {EXPENSE_CATEGORIES.map((c) => (
              <Input
                key={c}
                label={c}
                type="number"
                min="0"
                placeholder="0"
                value={cats[c] ?? ''}
                onChange={(e) => setCats((s) => ({ ...s, [c]: e.target.value }))}
              />
            ))}
          </div>
        </div>

        {error && (
          <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">{error}</p>
        )}
      </div>
    </Modal>
  )
}
