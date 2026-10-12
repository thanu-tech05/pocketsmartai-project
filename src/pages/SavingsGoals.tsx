import { useState } from 'react'
import { Calendar as CalendarClock, EditPencil as Pencil, PiggyBank, Plus, Trophy as Target, Trash as Trash2 } from 'iconoir-react'
import { useApp } from '../context/AppContext'
import { useToast } from '../context/ToastContext'
import { daysUntil, formatINR, formatDate } from '../lib/format'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { ProgressBar } from '../components/ui/ProgressBar'
import { Badge } from '../components/ui/Badge'
import { EmptyState } from '../components/ui/EmptyState'
import { GoalModal } from '../components/GoalModal'
import { ContributeGoalModal } from '../components/ContributeGoalModal'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { cn } from '../lib/cn'
import type { SavingsGoal } from '../types'

export function SavingsGoals() {
  const { state, deleteGoal } = useApp()
  const { notify } = useToast()
  const [goalOpen, setGoalOpen] = useState(false)
  const [editing, setEditing] = useState<SavingsGoal | null>(null)
  const [contributing, setContributing] = useState<SavingsGoal | null>(null)
  const [toDelete, setToDelete] = useState<SavingsGoal | null>(null)

  const goals = state.goals
  const totalSaved = goals.reduce((s, g) => s + g.saved, 0)
  const totalTarget = goals.reduce((s, g) => s + g.target, 0)

  function confirmDelete() {
    if (!toDelete) return
    deleteGoal(toDelete.id)
    notify('Savings goal deleted', 'info')
    setToDelete(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div className="flex gap-2 text-sm">
          <span className="rounded-lg bg-brand-50 px-3 py-1.5 font-semibold text-brand-700">
            Total saved {formatINR(totalSaved)}
          </span>
          <span className="rounded-lg bg-slate-100 px-3 py-1.5 font-semibold text-slate-700">
            Target {formatINR(totalTarget)}
          </span>
        </div>
        <Button
          icon={<Plus className="h-4 w-4" />}
          onClick={() => {
            setEditing(null)
            setGoalOpen(true)
          }}
        >
          New Goal
        </Button>
      </div>

      {goals.length === 0 ? (
        <Card>
          <EmptyState
            icon={<Target className="h-6 w-6" />}
            title="No savings goals yet"
            message="Create your first savings goal to start tracking progress toward a target."
            action={<Button onClick={() => setGoalOpen(true)}>Create Savings Goal</Button>}
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {goals.map((g) => {
            const pct = Math.min(100, (g.saved / g.target) * 100)
            const remaining = Math.max(0, g.target - g.saved)
            const days = daysUntil(g.targetDate)
            const monthsLeft = Math.max(1, Math.ceil(days / 30))
            const perMonth = Math.ceil(remaining / monthsLeft)
            const done = pct >= 100
            const overdue = days < 0 && !done

            return (
              <Card key={g.id} className="flex flex-col">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                      <Target className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="font-semibold text-slate-900">{g.name}</p>
                      <p className="flex items-center gap-1 text-xs text-slate-400">
                        <CalendarClock className="h-3.5 w-3.5" />
                        {formatDate(g.targetDate)}
                        {overdue && <span className="text-rose-500">· overdue</span>}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => {
                        setEditing(g)
                        setGoalOpen(true)
                      }}
                      className="rounded-lg p-2 text-slate-400 transition hover:bg-brand-50 hover:text-brand-600"
                      aria-label="Edit goal"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setToDelete(g)}
                      className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                      aria-label="Delete goal"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-sm text-slate-500">
                      {formatINR(g.saved)} <span className="text-slate-400">of</span>{' '}
                      {formatINR(g.target)}
                    </span>
                    {done ? (
                      <Badge tone="good">Completed</Badge>
                    ) : (
                      <span className="text-sm font-bold text-slate-900">{pct.toFixed(0)}%</span>
                    )}
                  </div>
                  <ProgressBar value={pct} tone={done ? 'good' : 'brand'} className="h-2.5" />
                </div>

                {!done && (
                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-xl bg-slate-50 px-3 py-2">
                      <p className="text-xs text-slate-400">Remaining</p>
                      <p className="font-semibold text-slate-800">{formatINR(remaining)}</p>
                    </div>
                    <div className="rounded-xl bg-slate-50 px-3 py-2">
                      <p className="text-xs text-slate-400">Save / month</p>
                      <p className="font-semibold text-slate-800">{formatINR(perMonth)}</p>
                    </div>
                  </div>
                )}

                <div className="mt-auto pt-4">
                  <Button
                    variant={done ? 'secondary' : 'success'}
                    size="sm"
                    icon={<PiggyBank className="h-4 w-4" />}
                    className={cn('w-full', done && 'text-slate-500')}
                    onClick={() => setContributing(g)}
                  >
                    {done ? 'Adjust Savings' : 'Add Savings'}
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      <GoalModal open={goalOpen} onClose={() => setGoalOpen(false)} editing={editing} />
      <ContributeGoalModal open={contributing !== null} onClose={() => setContributing(null)} goal={contributing} />
      <ConfirmDialog
        open={toDelete !== null}
        title="Delete savings goal?"
        message={`This will permanently remove "${toDelete?.name}". This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  )
}
