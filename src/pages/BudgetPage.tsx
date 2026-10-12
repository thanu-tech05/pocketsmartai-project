import { useState } from 'react'
import { WarningTriangle as TriangleAlert, Wallet } from 'iconoir-react'
import { RupeeIcon as BadgeIndianRupee } from '../components/icons'
import { useFinance } from '../hooks/useFinance'
import { formatINR, monthLabel } from '../lib/format'
import { Card, CardHeader } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { ProgressBar } from '../components/ui/ProgressBar'
import { Badge } from '../components/ui/Badge'
import { EmptyState } from '../components/ui/EmptyState'
import { CategoryIcon } from '../components/CategoryIcon'
import { BudgetModal } from '../components/BudgetModal'
import { cn } from '../lib/cn'

const statusMeta = {
  healthy: { tone: 'good' as const, label: 'On Track' },
  near: { tone: 'warn' as const, label: 'Nearing Limit' },
  over: { tone: 'bad' as const, label: 'Over Budget' },
}

export function BudgetPage() {
  const f = useFinance()
  const [open, setOpen] = useState(false)
  const { usage, budget, month } = f

  const overCats = usage.categories.filter((c) => c.status === 'over')
  const nearCats = usage.categories.filter((c) => c.status === 'near')

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <p className="max-w-2xl text-sm leading-relaxed text-slate-500">
          Plan and monitor spending for {monthLabel(month)}.
        </p>
        <Button icon={<BadgeIndianRupee className="h-4 w-4" />} onClick={() => setOpen(true)}>
          {budget ? 'Edit Budget' : 'Set Budget'}
        </Button>
      </div>

      {(overCats.length > 0 || nearCats.length > 0) && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
          <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
          <div className="text-sm text-amber-800">
            {overCats.length > 0 && (
              <p>
                <span className="font-semibold">Over budget:</span>{' '}
                {overCats.map((c) => c.category).join(', ')}
              </p>
            )}
            {nearCats.length > 0 && (
              <p>
                <span className="font-semibold">Close to limit:</span>{' '}
                {nearCats.map((c) => c.category).join(', ')}
              </p>
            )}
          </div>
        </div>
      )}

      {usage.total === 0 ? (
        <Card>
          <EmptyState
            icon={<Wallet className="h-6 w-6" />}
            title="No budget set for this month"
            message="Set an overall budget and category limits to keep your spending on track."
            action={<Button onClick={() => setOpen(true)}>Set Monthly Budget</Button>}
          />
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: 'Monthly Budget', value: formatINR(usage.total), tone: 'text-slate-900' },
              { label: 'Spent', value: formatINR(usage.spent), tone: 'text-rose-600' },
              { label: 'Remaining', value: formatINR(usage.remaining), tone: 'text-emerald-600' },
              { label: 'Used', value: `${usage.percentUsed.toFixed(0)}%`, tone: 'text-brand-600' },
            ].map((s) => (
              <Card key={s.label}>
                <p className="text-sm font-medium text-slate-500">{s.label}</p>
                <p className={cn('mt-2 text-2xl font-bold tabular-nums', s.tone)}>{s.value}</p>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader
              title="Overall Budget Usage"
              subtitle={`${formatINR(usage.spent)} of ${formatINR(usage.total)} used`}
              action={
                <Badge tone={statusMeta[usage.status === 'none' ? 'healthy' : usage.status].tone}>
                  {statusMeta[usage.status === 'none' ? 'healthy' : usage.status].label}
                </Badge>
              }
            />
            <ProgressBar
              value={usage.percentUsed}
              tone={usage.status === 'over' ? 'bad' : usage.status === 'near' ? 'warn' : 'good'}
              className="h-3"
            />
            <p className="mt-2 text-xs text-slate-500">
              {usage.remaining > 0
                ? `${formatINR(usage.remaining)} remains for the rest of the month.`
                : `You have exceeded your budget by ${formatINR(Math.max(0, usage.spent - usage.total))}.`}
            </p>
          </Card>

          <Card>
            <CardHeader title="Category Budgets" subtitle="Spending vs planned limit per category" />
            <div className="space-y-5">
              {usage.categories.map((c) => (
                <div key={c.category}>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <CategoryIcon category={c.category} className="h-9 w-9" />
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{c.category}</p>
                        <p className="text-xs text-slate-400">
                          {formatINR(c.spent)} of {c.budget > 0 ? formatINR(c.budget) : 'no limit'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {c.budget > 0 && (
                        <Badge tone={statusMeta[c.status].tone}>{statusMeta[c.status].label}</Badge>
                      )}
                      <span className="w-12 text-right text-sm font-bold tabular-nums text-slate-700">
                        {c.percentUsed.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                  <ProgressBar
                    value={c.percentUsed}
                    tone={c.status === 'over' ? 'bad' : c.status === 'near' ? 'warn' : 'good'}
                  />
                </div>
              ))}
            </div>
          </Card>
        </>
      )}

      <BudgetModal open={open} onClose={() => setOpen(false)} month={month} budget={budget} />
    </div>
  )
}
