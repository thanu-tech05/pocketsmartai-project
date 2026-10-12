import { useEffect, useState } from 'react'
import { Modal } from './ui/Modal'
import { Button } from './ui/Button'
import { Input } from './ui/Field'
import { useApp } from '../context/AppContext'
import { useToast } from '../context/ToastContext'
import { addMonths, currentMonthKey } from '../lib/format'
import type { SavingsGoal } from '../types'

interface Props {
  open: boolean
  onClose: () => void
  editing?: SavingsGoal | null
}

interface Errors {
  name?: string
  target?: string
  saved?: string
}

export function GoalModal({ open, onClose, editing }: Props) {
  const { addGoal, updateGoal } = useApp()
  const { notify } = useToast()

  const [name, setName] = useState('')
  const [target, setTarget] = useState('')
  const [saved, setSaved] = useState('')
  const [targetDate, setTargetDate] = useState('')
  const [errors, setErrors] = useState<Errors>({})

  useEffect(() => {
    if (!open) return
    if (editing) {
      setName(editing.name)
      setTarget(String(editing.target))
      setSaved(String(editing.saved))
      setTargetDate(editing.targetDate)
    } else {
      setName('')
      setTarget('')
      setSaved('')
      setTargetDate(`${addMonths(currentMonthKey(), 6)}-01`)
    }
    setErrors({})
  }, [open, editing])

  function validate(): boolean {
    const next: Errors = {}
    const t = Number(target)
    const s = Number(saved || 0)
    if (!name.trim()) next.name = 'Required'
    if (!target.trim()) next.target = 'Required'
    else if (Number.isNaN(t) || t <= 0) next.target = 'Must be greater than 0'
    if (saved.trim() && (Number.isNaN(s) || s < 0)) next.saved = 'Cannot be negative'
    else if (!Number.isNaN(s) && !Number.isNaN(t) && s > t) next.saved = 'Cannot exceed target'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function handleSubmit() {
    if (!validate()) return
    const payload = {
      name: name.trim(),
      target: Number(target),
      saved: Number(saved || 0),
      targetDate,
    }
    if (editing) {
      updateGoal(editing.id, payload)
      notify('Savings goal updated')
    } else {
      addGoal(payload)
      notify(`Savings goal "${payload.name}" created`)
    }
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editing ? 'Edit Savings Goal' : 'Create Savings Goal'}
      subtitle="Track progress toward something you are saving for"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>{editing ? 'Save Changes' : 'Create Goal'}</Button>
        </>
      }
    >
      <div className="space-y-4">
        <Input
          label="Goal Name"
          required
          placeholder="e.g. New Laptop"
          value={name}
          error={errors.name}
          onChange={(e) => setName(e.target.value)}
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Target Amount (₹)"
            required
            type="number"
            min="0"
            placeholder="60000"
            value={target}
            error={errors.target}
            onChange={(e) => setTarget(e.target.value)}
          />
          <Input
            label="Already Saved (₹)"
            type="number"
            min="0"
            placeholder="0"
            value={saved}
            error={errors.saved}
            onChange={(e) => setSaved(e.target.value)}
          />
        </div>
        <Input
          label="Target Date"
          type="date"
          value={targetDate}
          onChange={(e) => setTargetDate(e.target.value)}
        />
      </div>
    </Modal>
  )
}
