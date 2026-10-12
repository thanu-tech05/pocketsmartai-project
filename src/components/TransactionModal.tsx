import { useEffect, useState } from 'react'
import { Modal } from './ui/Modal'
import { Button } from './ui/Button'
import { Input, Select, Textarea } from './ui/Field'
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, type Transaction, type TxType } from '../types'
import { useApp } from '../context/AppContext'
import { useToast } from '../context/ToastContext'
import { formatINR, todayIso } from '../lib/format'

interface Props {
  open: boolean
  onClose: () => void
  editing?: Transaction | null
  defaultType?: TxType
}

interface Errors {
  amount?: string
  date?: string
  description?: string
}

export function TransactionModal({ open, onClose, editing, defaultType = 'expense' }: Props) {
  const { addTransaction, updateTransaction } = useApp()
  const { notify } = useToast()

  const [type, setType] = useState<TxType>(defaultType)
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('')
  const [date, setDate] = useState(todayIso())
  const [description, setDescription] = useState('')
  const [errors, setErrors] = useState<Errors>({})

  useEffect(() => {
    if (!open) return
    if (editing) {
      setType(editing.type)
      setAmount(String(editing.amount))
      setCategory(editing.category)
      setDate(editing.date)
      setDescription(editing.description)
    } else {
      setType(defaultType)
      setAmount('')
      setCategory(defaultType === 'income' ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0])
      setDate(todayIso())
      setDescription('')
    }
    setErrors({})
  }, [open, editing, defaultType])

  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES

  function switchType(next: TxType) {
    setType(next)
    const list = next === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES
    if (!list.includes(category as never)) setCategory(list[0])
  }

  function validate(): boolean {
    const next: Errors = {}
    const value = Number(amount)
    if (!amount.trim()) next.amount = 'Required'
    else if (Number.isNaN(value)) next.amount = 'Enter a number'
    else if (value <= 0) next.amount = 'Must be greater than 0'
    else if (value > 100000000) next.amount = 'Too large'
    if (!date) next.date = 'Required'
    if (!description.trim()) next.description = 'Required'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function handleSubmit() {
    if (!validate()) return
    const payload = {
      type,
      amount: Number(amount),
      category,
      date,
      description: description.trim(),
    }
    if (editing) {
      updateTransaction(editing.id, payload)
      notify(`${type === 'income' ? 'Income' : 'Expense'} updated successfully`)
    } else {
      addTransaction(payload)
      notify(`${type === 'income' ? 'Income' : 'Expense'} of ${formatINR(payload.amount)} added`)
    }
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editing ? 'Edit Transaction' : 'Add Transaction'}
      subtitle="All amounts are in Indian Rupees (₹)"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>{editing ? 'Save Changes' : 'Add Transaction'}</Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1">
          {(['expense', 'income'] as TxType[]).map((t) => (
            <button
              key={t}
              onClick={() => switchType(t)}
              className={`rounded-lg py-2 text-sm font-semibold capitalize transition ${
                type === t ? 'bg-surface text-slate-900 shadow-soft' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <Input
          label="Amount (₹)"
          required
          type="number"
          inputMode="decimal"
          min="0"
          step="1"
          placeholder="0"
          value={amount}
          error={errors.amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Select
            label="Category"
            required
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
          <Input
            label="Date"
            required
            type="date"
            value={date}
            error={errors.date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <Textarea
          label="Description"
          required
          rows={2}
          placeholder="e.g. Grocery shopping"
          value={description}
          error={errors.description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
    </Modal>
  )
}
