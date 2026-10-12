import { useEffect, useState } from 'react'
import { Modal } from './ui/Modal'
import { Button } from './ui/Button'
import { Input } from './ui/Field'
import { useApp } from '../context/AppContext'
import { useToast } from '../context/ToastContext'
import { formatINR } from '../lib/format'
import type { SavingsGoal } from '../types'

interface Props {
  open: boolean
  onClose: () => void
  goal: SavingsGoal | null
}

export function ContributeGoalModal({ open, onClose, goal }: Props) {
  const { addToGoal } = useApp()
  const { notify } = useToast()
  const [mode, setMode] = useState<'add' | 'withdraw'>('add')
  const [amount, setAmount] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open) return
    setMode('add')
    setAmount('')
    setError('')
  }, [open])

  if (!goal) return null

  const value = Number(amount) || 0
  const remaining = Math.max(0, goal.target - goal.saved)

  function handleSubmit() {
    if (!amount.trim() || value <= 0) {
      setError('Enter an amount greater than 0')
      return
    }
    if (mode === 'add' && value > remaining) {
      setError(`Only ${formatINR(remaining)} remaining to reach this goal`)
      return
    }
    if (mode === 'withdraw' && value > goal!.saved) {
      setError(`You can withdraw up to ${formatINR(goal!.saved)}`)
      return
    }
    addToGoal(goal!.id, mode === 'add' ? value : -value)
    notify(
      mode === 'add'
        ? `Added ${formatINR(value)} to "${goal!.name}"`
        : `Withdrew ${formatINR(value)} from "${goal!.name}"`,
    )
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Update Savings"
      subtitle={goal.name}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant={mode === 'add' ? 'success' : 'danger'} onClick={handleSubmit}>
            {mode === 'add' ? 'Add Savings' : 'Withdraw'}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-2 rounded-xl bg-slate-100 p-1">
          {(['add', 'withdraw'] as const).map((m) => (
            <button
              key={m}
              onClick={() => {
                setMode(m)
                setError('')
              }}
              className={`rounded-lg py-2 text-sm font-semibold capitalize transition ${
                mode === m ? 'bg-surface text-slate-900 shadow-soft' : 'text-slate-500'
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-sm">
          <span className="text-slate-500">Saved so far</span>
          <span className="font-semibold text-slate-800">
            {formatINR(goal.saved)} / {formatINR(goal.target)}
          </span>
        </div>

        <Input
          label="Amount (₹)"
          required
          type="number"
          min="0"
          placeholder="5000"
          value={amount}
          error={error || undefined}
          onChange={(e) => {
            setAmount(e.target.value)
            setError('')
          }}
        />
      </div>
    </Modal>
  )
}
