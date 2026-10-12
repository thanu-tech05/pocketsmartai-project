import { LightBulb as Lightbulb, PiggyBank, GraphDown as TrendingDown, GraphUp as TrendingUp } from 'iconoir-react'
import { useFinance } from '../hooks/useFinance'
import { formatINR, formatPercent, monthLabelShort } from '../lib/format'
import { Card, CardHeader } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { CategoryDonut } from '../components/charts/CategoryDonut'
import { IncomeExpenseBar } from '../components/charts/IncomeExpenseBar'
import { TrendLine } from '../components/charts/TrendLine'
import { categoryColor } from '../components/CategoryIcon'

export function Analytics() {
  const f = useFinance()
  const { summary, trend, expenseChange, incomeChange, savingsChange } = f
  const totalExpense = summary.expense

  const top = summary.byCategory.slice(0, 6)
  const averageSpend =
    trend.length > 0 ? trend.reduce((s, t) => s + t.expense, 0) / trend.length : 0

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          {
            label: 'Expense change',
            value: expenseChange,
            icon: <TrendingDown className="h-5 w-5" />,
            positiveIsGood: false,
          },
          {
            label: 'Income change',
            value: incomeChange,
            icon: <TrendingUp className="h-5 w-5" />,
            positiveIsGood: true,
          },
          {
            label: 'Savings change',
            value: savingsChange,
            icon: <PiggyBank className="h-5 w-5" />,
            positiveIsGood: true,
          },
        ].map((c) => {
          const flat = c.value === null || Math.abs(c.value) < 0.5
          const good = flat ? false : (c.value! > 0) === c.positiveIsGood
          return (
            <Card key={c.label}>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500">{c.label}</p>
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                  {c.icon}
                </span>
              </div>
              <p
                className={`mt-3 text-2xl font-bold tabular-nums ${
                  flat ? 'text-slate-500' : good ? 'text-emerald-600' : 'text-rose-600'
                }`}
              >
                {c.value === null ? '—' : `${c.value > 0 ? '+' : ''}${c.value.toFixed(0)}%`}
              </p>
              <p className="mt-1 text-xs text-slate-400">compared with last month</p>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="Spending by Category" subtitle="Share of this month's expenses" />
          <CategoryDonut data={summary.byCategory} />
          {totalExpense > 0 && (
            <div className="mt-4 space-y-2">
              {top.map((c) => (
                <div key={c.category} className="flex items-center gap-3 text-sm">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: categoryColor(c.category) }} />
                  <span className="w-24 truncate text-slate-600">{c.category}</span>
                  <span className="font-semibold tabular-nums text-slate-800">{formatINR(c.amount)}</span>
                  <span className="ml-auto text-xs text-slate-400">
                    {formatPercent((c.amount / totalExpense) * 100)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <CardHeader title="Income vs Expenses" subtitle="Last 6 months" />
          <IncomeExpenseBar data={trend} formatter={(m) => monthLabelShort(m)} />
        </Card>

        <Card>
          <CardHeader title="Monthly Spending Trend" subtitle="Expense movement over time" />
          <TrendLine data={trend} formatter={(m) => monthLabelShort(m)} dataKey="expense" color="#f43f5e" name="Spending" />
        </Card>

        <Card>
          <CardHeader title="Savings Trend" subtitle="Amount saved each month" />
          <TrendLine data={trend} formatter={(m) => monthLabelShort(m)} dataKey="savings" color="#338cff" name="Savings" />
        </Card>
      </div>

      <Card>
        <CardHeader title="Key Observations" subtitle="Automatically summarised from your data" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {summary.byCategory[0] && (
            <Observation
              text={`${summary.byCategory[0].category} accounts for ${formatPercent(
                (summary.byCategory[0].amount / Math.max(1, totalExpense)) * 100,
              )} of your total expenses this month.`}
            />
          )}
          {expenseChange !== null && (
            <Observation
              text={`Your expenses ${expenseChange >= 0 ? 'increased' : 'decreased'} by ${Math.abs(
                expenseChange,
              ).toFixed(0)}% compared with last month.`}
            />
          )}
          <Observation text={`Your average monthly spending over 6 months is ${formatINR(averageSpend)}.`} />
          <Observation
            text={`You are saving ${formatPercent(summary.savingsRate)} of your income this month.`}
          />
          {f.goals.length > 0 && (
            <Observation
              text={`You have ${f.goals.length} active savings goal${f.goals.length > 1 ? 's' : ''} totalling ${formatINR(
                f.goals.reduce((s, g) => s + g.target, 0),
              )}.`}
            />
          )}
          {summary.txCount > 0 && (
            <Observation text={`You recorded ${summary.txCount} transactions this month.`} />
          )}
        </div>
      </Card>
    </div>
  )
}

function Observation({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2 rounded-xl bg-slate-50 px-4 py-3">
      <Badge tone="brand" className="mt-0.5">
        <Lightbulb className="h-3 w-3" />
      </Badge>
      <p className="text-sm text-slate-700">{text}</p>
    </div>
  )
}
