import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  CheckCircle as CheckCircle2,
  NavArrowDown as ChevronDown,
  LightBulb as Lightbulb,
  PiggyBank,
  Plus,
  Notes as Receipt,
  Trophy as Target,
  GraphDown as TrendingDown,
  GraphUp as TrendingUp,
  WarningTriangle as TriangleAlert,
  Wallet,
  XmarkCircle as XCircle,
} from 'iconoir-react'
import { RupeeIcon as BadgeIndianRupee } from '../components/icons'
import type { IconType as LucideIcon } from '../components/icons'
import { useFinance } from '../hooks/useFinance'
import { formatINR, formatDate, monthLabelShort, monthLabel } from '../lib/format'
import { StatCard } from '../components/ui/StatCard'
import { Card, CardHeader } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { ProgressBar } from '../components/ui/ProgressBar'
import { EmptyState } from '../components/ui/EmptyState'
import { DeltaBadge } from '../components/DeltaBadge'
import { CategoryIcon } from '../components/CategoryIcon'
import { HealthBreakdown } from '../components/HealthBreakdown'
import { CategoryDonut } from '../components/charts/CategoryDonut'
import { IncomeExpenseBar } from '../components/charts/IncomeExpenseBar'
import { TrendLine } from '../components/charts/TrendLine'
import { TransactionModal } from '../components/TransactionModal'
import { BudgetModal } from '../components/BudgetModal'
import { GoalModal } from '../components/GoalModal'
import { cn } from '../lib/cn'

const insightTone: Record<string, string> = {
  good: 'border-emerald-200 bg-emerald-50/50',
  warn: 'border-amber-200 bg-amber-50/50',
  bad: 'border-rose-200 bg-rose-50/50',
  info: 'border-brand-200 bg-brand-50/50',
}

const insightIconTone: Record<string, string> = {
  good: 'text-emerald-500',
  warn: 'text-amber-500',
  bad: 'text-rose-500',
  info: 'text-brand-500',
}

const insightIcon: Record<string, LucideIcon> = {
  good: CheckCircle2,
  warn: TriangleAlert,
  bad: XCircle,
  info: Lightbulb,
}

export function Dashboard() {
  const f = useFinance()
  const [txOpen, setTxOpen] = useState(false)
  const [txType, setTxType] = useState<'income' | 'expense'>('expense')
  const [budgetOpen, setBudgetOpen] = useState(false)
  const [goalOpen, setGoalOpen] = useState(false)
  const [showBreakdown, setShowBreakdown] = useState(false)

  const {
    summary,
    previous,
    usage,
    health,
    safe,
    insights,
    trend,
    incomeChange,
    expenseChange,
    savingsChange,
  } = f
  const recent = f.transactions.slice(0, 6)
  const healthTone = health.tone === 'good' ? 'good' : health.tone === 'warn' ? 'warn' : 'bad'
  const healthScoreBg =
    health.tone === 'good'
      ? 'bg-emerald-50 text-emerald-600'
      : health.tone === 'warn'
        ? 'bg-amber-50 text-amber-600'
        : 'bg-rose-50 text-rose-600'
  const topGoals = f.goals.slice(0, 2)

  function openTx(type: 'income' | 'expense') {
    setTxType(type)
    setTxOpen(true)
  }

  return (
    <div className="space-y-6">
      <p className="max-w-2xl text-balance text-sm leading-relaxed text-slate-500">
        Here&apos;s your financial overview for {monthLabel(summary.month)} — everything updates as you
        add or edit transactions.
      </p>

      {/* Top stat cards */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        <StatCard
          label="Monthly Income"
          value={formatINR(summary.income)}
          countTo={summary.income}
          tone="good"
          icon={<TrendingUp className="h-5 w-5" />}
          sub={<DeltaBadge value={incomeChange} positiveIsGood />}
        />
        <StatCard
          label="Total Expenses"
          value={formatINR(summary.expense)}
          countTo={summary.expense}
          tone="bad"
          icon={<TrendingDown className="h-5 w-5" />}
          sub={<DeltaBadge value={expenseChange} positiveIsGood={false} />}
        />
        <StatCard
          label="Available Balance"
          value={formatINR(summary.balance)}
          countTo={summary.balance}
          tone={summary.balance >= 0 ? 'brand' : 'bad'}
          icon={<Wallet className="h-5 w-5" />}
          sub={<span className="text-xs text-slate-400">{summary.txCount} transactions this month</span>}
        />
        <StatCard
          label="Savings"
          value={formatINR(summary.savings)}
          countTo={summary.savings}
          tone="warn"
          icon={<PiggyBank className="h-5 w-5" />}
          sub={<span className="text-xs text-slate-400">{summary.savingsRate.toFixed(0)}% of income</span>}
        />
      </div>

      {/* Health score + safe to spend */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader
            title="Budget Health Score"
            subtitle="A 100-point view of how well you are managing money this month"
            action={<Badge tone={healthTone}>{health.label}</Badge>}
          />
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div
              className={cn(
                'flex h-24 w-24 shrink-0 flex-col items-center justify-center rounded-2xl text-center',
                healthScoreBg,
              )}
            >
              <span className="text-3xl font-extrabold tabular-nums">{health.score}</span>
              <span className="text-micro font-semibold uppercase">out of 100</span>
            </div>
            <div className="flex-1">
              <ProgressBar value={health.score} tone={healthTone} />
              {health.reasons[0] && <p className="mt-2 text-sm text-slate-600">{health.reasons[0]}</p>}
              <button
                onClick={() => setShowBreakdown((v) => !v)}
                className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700"
                aria-expanded={showBreakdown}
              >
                {showBreakdown ? 'Hide breakdown' : 'See how this is calculated'}
                <ChevronDown
                  className={cn('h-4 w-4 transition-transform', showBreakdown && 'rotate-180')}
                />
              </button>
            </div>
          </div>
          {showBreakdown && (
            <div className="mt-5 border-t border-slate-100 pt-5">
              <HealthBreakdown health={health} />
            </div>
          )}
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader
            title="Safe to Spend"
            subtitle={
              safe.basis === 'budget' ? 'Based on your remaining budget' : 'Based on your balance'
            }
          />
          {safe.basis === 'none' ? (
            <EmptyState
              icon={<Wallet className="h-6 w-6" />}
              title="No data yet"
              message="Add income or set a budget to see how much you can safely spend each day."
              action={
                <Button size="sm" icon={<Plus className="h-4 w-4" />} onClick={() => openTx('income')}>
                  Add Income
                </Button>
              }
            />
          ) : (
            <div>
              <p className="text-3xl font-extrabold tabular-nums text-slate-900">
                {formatINR(safe.perDay)}
                <span className="text-sm font-medium text-slate-400"> / day</span>
              </p>
              <p className="mt-2 text-sm text-slate-600">
                {formatINR(safe.remaining)} left for the remaining {safe.daysLeft} day
                {safe.daysLeft === 1 ? '' : 's'} this month.
              </p>
              <div className="mt-4">
                <ProgressBar
                  value={usage.total > 0 ? usage.percentUsed : 0}
                  tone={usage.status === 'over' ? 'bad' : usage.status === 'near' ? 'warn' : 'good'}
                />
                <p className="mt-1.5 text-xs text-slate-400">
                  {usage.total > 0
                    ? `${usage.percentUsed.toFixed(0)}% of your monthly budget used`
                    : `${summary.savingsRate.toFixed(0)}% of income saved so far`}
                </p>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Financial overview flow */}
      <Card>
        <CardHeader title="Financial Overview" subtitle="Where your money goes this month" />
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          {[
            { label: 'Income', value: summary.income, tone: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Expenses', value: summary.expense, tone: 'text-rose-600', bg: 'bg-rose-50' },
            { label: 'Savings', value: summary.savings, tone: 'text-brand-600', bg: 'bg-brand-50' },
            {
              label: 'Remaining Balance',
              value: summary.balance,
              tone: 'text-slate-800',
              bg: 'bg-slate-100',
            },
          ].map((item, i, arr) => (
            <div key={item.label} className="flex flex-1 items-center gap-3">
              <div className={cn('flex-1 rounded-xl px-4 py-3', item.bg)}>
                <p className="text-xs font-medium text-slate-500">{item.label}</p>
                <p className={cn('mt-1 text-xl font-bold tabular-nums', item.tone)}>
                  {formatINR(item.value)}
                </p>
              </div>
              {i < arr.length - 1 && (
                <ArrowRight className="hidden h-5 w-5 shrink-0 text-slate-300 lg:block" />
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Month over month */}
      <Card className="print-break">
        <CardHeader
          title="This Month vs Last Month"
          subtitle={`${monthLabel(summary.month)} compared with ${monthLabel(previous.month)}`}
        />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            { label: 'Income', current: summary.income, prev: previous.income, change: incomeChange, good: true },
            { label: 'Expenses', current: summary.expense, prev: previous.expense, change: expenseChange, good: false },
            { label: 'Savings', current: summary.savings, prev: previous.savings, change: savingsChange, good: true },
          ].map((row) => (
            <div key={row.label} className="rounded-xl border border-slate-100 p-4">
              <p className="text-micro font-semibold uppercase text-slate-400">{row.label}</p>
              <p className="mt-1 text-xl font-bold tabular-nums text-slate-900">{formatINR(row.current)}</p>
              <div className="mt-1 flex items-center justify-between">
                <span className="text-xs text-slate-400">was {formatINR(row.prev)}</span>
                <DeltaBadge value={row.change} positiveIsGood={row.good} label="" />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="Spending by Category" subtitle="This month's expense split" />
          <CategoryDonut data={summary.byCategory} />
        </Card>
        <Card>
          <CardHeader title="Income vs Expenses" subtitle="Last 6 months" />
          <IncomeExpenseBar data={trend} formatter={(m) => monthLabelShort(m)} />
        </Card>
      </div>

      {/* Spending trend */}
      <Card className="print-break">
        <CardHeader
          title="Spending Trend"
          subtitle={
            expenseChange === null
              ? 'Last 6 months'
              : `Last 6 months · ${expenseChange >= 0 ? 'up' : 'down'} ${Math.abs(expenseChange).toFixed(0)}% vs last month`
          }
        />
        <TrendLine
          data={trend}
          formatter={(m) => monthLabelShort(m)}
          dataKey="expense"
          color="#f43f5e"
          name="Spending"
        />
      </Card>

      {/* Budget + savings goals */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader
            title="Monthly Budget"
            subtitle={usage.total > 0 ? `${formatINR(usage.spent)} of ${formatINR(usage.total)} used` : 'No budget set'}
            action={
              <Button size="sm" variant="secondary" onClick={() => setBudgetOpen(true)}>
                {usage.total > 0 ? 'Edit' : 'Set Budget'}
              </Button>
            }
          />
          {usage.total > 0 ? (
            <div className="space-y-4">
              <div>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-600">Overall usage</span>
                  <span className="font-semibold text-slate-800">{usage.percentUsed.toFixed(0)}%</span>
                </div>
                <ProgressBar
                  value={usage.percentUsed}
                  tone={usage.status === 'over' ? 'bad' : usage.status === 'near' ? 'warn' : 'good'}
                />
              </div>
              <div className="space-y-3">
                {usage.categories.slice(0, 4).map((c) => (
                  <div key={c.category}>
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1.5 font-medium text-slate-600">
                        {c.category}
                        {c.status === 'over' && <Badge tone="bad">Over</Badge>}
                        {c.status === 'near' && <Badge tone="warn">Near</Badge>}
                      </span>
                      <span className="tabular-nums text-slate-500">
                        {formatINR(c.spent)} / {formatINR(c.budget)}
                      </span>
                    </div>
                    <ProgressBar
                      value={c.percentUsed}
                      tone={c.status === 'over' ? 'bad' : c.status === 'near' ? 'warn' : 'good'}
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <EmptyState
              icon={<Wallet className="h-6 w-6" />}
              title="No monthly budget yet"
              message="Set a monthly budget to track how much you can safely spend."
              action={
                <Button size="sm" onClick={() => setBudgetOpen(true)}>
                  Set Budget
                </Button>
              }
            />
          )}
        </Card>

        <Card>
          <CardHeader
            title="Savings Goals"
            subtitle="Progress toward your targets"
            action={
              <Button size="sm" variant="secondary" icon={<Plus className="h-4 w-4" />} onClick={() => setGoalOpen(true)}>
                New
              </Button>
            }
          />
          {topGoals.length > 0 ? (
            <div className="space-y-4">
              {topGoals.map((g) => {
                const pct = Math.min(100, (g.saved / g.target) * 100)
                return (
                  <div key={g.id} className="rounded-xl border border-slate-100 p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                        <Target className="h-4 w-4 text-brand-500" />
                        {g.name}
                      </span>
                      <span className="text-sm font-bold text-slate-900">{pct.toFixed(0)}%</span>
                    </div>
                    <ProgressBar value={pct} tone={pct >= 100 ? 'good' : 'brand'} />
                    <p className="mt-1.5 text-xs text-slate-500">
                      {formatINR(g.saved)} saved of {formatINR(g.target)}
                    </p>
                  </div>
                )
              })}
              <Link
                to="/goals"
                className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700"
              >
                View all goals <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <EmptyState
              icon={<Target className="h-6 w-6" />}
              title="No savings goals yet"
              message="Create a goal to start tracking your progress toward a target."
              action={
                <Button size="sm" onClick={() => setGoalOpen(true)}>
                  Create Goal
                </Button>
              }
            />
          )}
        </Card>
      </div>

      {/* Insights */}
      <Card>
        <CardHeader
          title="PocketSmartAI Insights"
          subtitle="Generated from your current financial data"
        />
        {insights.length > 0 ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {insights.slice(0, 4).map((i) => {
              const Icon = insightIcon[i.tone] ?? Lightbulb
              return (
                <div
                  key={i.id}
                  className={cn(
                    'flex items-start gap-3 rounded-xl border px-4 py-3',
                    insightTone[i.tone],
                  )}
                >
                  <Icon className={cn('mt-0.5 h-4 w-4 shrink-0', insightIconTone[i.tone])} />
                  <p className="text-sm text-slate-700">{i.text}</p>
                </div>
              )
            })}
          </div>
        ) : (
          <EmptyState
            icon={<Lightbulb className="h-6 w-6" />}
            title="No insights yet"
            message="Add income, expenses and a budget to unlock personalised insights."
          />
        )}
      </Card>

      {/* Recent transactions */}
      <Card>
        <CardHeader
          title="Recent Transactions"
          subtitle="Your latest activity"
          action={
            <Link
              to="/transactions"
              className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700"
            >
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          }
        />
        {recent.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {recent.map((t) => (
              <div key={t.id} className="flex items-center gap-3 py-3">
                <CategoryIcon category={t.category} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-800">{t.description}</p>
                  <p className="text-xs text-slate-400">
                    {t.category} · {formatDate(t.date)}
                  </p>
                </div>
                <span
                  className={cn(
                    'text-sm font-bold tabular-nums',
                    t.type === 'income' ? 'text-emerald-600' : 'text-slate-800',
                  )}
                >
                  {t.type === 'income' ? '+' : '−'}
                  {formatINR(t.amount)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Receipt className="h-6 w-6" />}
            title="No transactions yet"
            message="Add your first income or expense to bring your dashboard to life."
            action={
              <Button size="sm" icon={<Plus className="h-4 w-4" />} onClick={() => openTx('expense')}>
                Add Transaction
              </Button>
            }
          />
        )}
      </Card>

      {/* Quick actions */}
      <Card>
        <CardHeader title="Quick Actions" subtitle="Common tasks at a glance" />
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            { label: 'Add Expense', icon: <TrendingDown className="h-5 w-5" />, onClick: () => openTx('expense') },
            { label: 'Add Income', icon: <TrendingUp className="h-5 w-5" />, onClick: () => openTx('income') },
            { label: 'Create Budget', icon: <BadgeIndianRupee className="h-5 w-5" />, onClick: () => setBudgetOpen(true) },
            { label: 'Add Savings Goal', icon: <Target className="h-5 w-5" />, onClick: () => setGoalOpen(true) },
          ].map((a) => (
            <button
              key={a.label}
              onClick={a.onClick}
              className="flex flex-col items-center gap-2 rounded-xl border border-slate-200 bg-surface px-4 py-5 text-sm font-semibold text-slate-700 transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 active:scale-[0.98]"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                {a.icon}
              </span>
              {a.label}
            </button>
          ))}
        </div>
      </Card>

      <TransactionModal open={txOpen} onClose={() => setTxOpen(false)} defaultType={txType} />
      <BudgetModal open={budgetOpen} onClose={() => setBudgetOpen(false)} month={summary.month} budget={f.budget} />
      <GoalModal open={goalOpen} onClose={() => setGoalOpen(false)} />
    </div>
  )
}
