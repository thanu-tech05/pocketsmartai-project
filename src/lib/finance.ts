import type { Budget, HealthFactor, HealthResult, Transaction } from '../types'
import { EXPENSE_CATEGORIES } from '../types'
import { addMonths, formatINR, monthKey } from './format'

export interface MonthSummary {
  month: string
  income: number
  expense: number
  balance: number
  savings: number
  savingsRate: number
  byCategory: { category: string; amount: number }[]
  txCount: number
}

export function txsInMonth(txs: Transaction[], month: string): Transaction[] {
  return txs.filter((t) => monthKey(t.date) === month)
}

export function sumByType(txs: Transaction[], type: Transaction['type']): number {
  return txs.filter((t) => t.type === type).reduce((s, t) => s + t.amount, 0)
}

export function categoryTotals(
  txs: Transaction[],
  type: Transaction['type'],
): { category: string; amount: number }[] {
  const map = new Map<string, number>()
  for (const t of txs) {
    if (t.type !== type) continue
    map.set(t.category, (map.get(t.category) ?? 0) + t.amount)
  }
  return [...map.entries()]
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount)
}

/** Total savings contributed to goals. */
export function totalSaved(goals: { saved: number }[]): number {
  return goals.reduce((s, g) => s + g.saved, 0)
}

/**
 * Compute a summary for a given month. Savings is treated as the leftover
 * balance that the user has set aside (capped at the available balance),
 * falling back to the balance when goals are not configured.
 */
export function monthSummary(txs: Transaction[], month: string): MonthSummary {
  const monthTx = txsInMonth(txs, month)
  const income = sumByType(monthTx, 'income')
  const expense = sumByType(monthTx, 'expense')
  const balance = income - expense
  const savings = Math.max(0, balance)
  const savingsRate = income > 0 ? (savings / income) * 100 : 0
  return {
    month,
    income,
    expense,
    balance,
    savings,
    savingsRate,
    byCategory: categoryTotals(monthTx, 'expense'),
    txCount: monthTx.length,
  }
}

export function findBudget(budgets: Budget[], month: string): Budget | undefined {
  return budgets.find((b) => b.month === month)
}

export interface BudgetUsage {
  total: number
  spent: number
  remaining: number
  percentUsed: number
  status: 'healthy' | 'near' | 'over' | 'none'
  categories: {
    category: string
    budget: number
    spent: number
    remaining: number
    percentUsed: number
    status: 'healthy' | 'near' | 'over'
  }[]
}

export function budgetUsage(
  budget: Budget | undefined,
  summary: MonthSummary,
): BudgetUsage {
  const spendMap = new Map(summary.byCategory.map((c) => [c.category, c.amount]))
  if (!budget) {
    return {
      total: 0,
      spent: summary.expense,
      remaining: 0,
      percentUsed: 0,
      status: 'none',
      categories: [],
    }
  }

  const categories = EXPENSE_CATEGORIES.map((category) => {
    const cap = budget.categories[category] ?? 0
    const spent = spendMap.get(category) ?? 0
    const percentUsed = cap > 0 ? (spent / cap) * 100 : spent > 0 ? 100 : 0
    let status: 'healthy' | 'near' | 'over' = 'healthy'
    if (cap > 0 && spent > cap) status = 'over'
    else if (cap > 0 && percentUsed >= 80) status = 'near'
    return { category, budget: cap, spent, remaining: Math.max(0, cap - spent), percentUsed, status }
  }).filter((c) => c.budget > 0 || c.spent > 0)

  const spent = summary.expense
  const percentUsed = budget.total > 0 ? (spent / budget.total) * 100 : 0
  let status: BudgetUsage['status'] = 'healthy'
  if (budget.total > 0 && spent > budget.total) status = 'over'
  else if (budget.total > 0 && percentUsed >= 80) status = 'near'

  return {
    total: budget.total,
    spent,
    remaining: Math.max(0, budget.total - spent),
    percentUsed,
    status,
    categories,
  }
}

export interface SafeToSpend {
  remaining: number
  daysLeft: number
  perDay: number
  basis: 'budget' | 'balance' | 'none'
}

function daysInCurrentMonth(): { total: number; day: number } {
  const now = new Date()
  const total = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
  return { total, day: now.getDate() }
}

/**
 * How much the user can still safely spend for the rest of the month, either
 * from the remaining monthly budget or, if no budget is set, from the balance.
 */
export function safeToSpend(usage: BudgetUsage, summary: MonthSummary): SafeToSpend {
  const { total, day } = daysInCurrentMonth()
  const daysLeft = Math.max(1, total - day + 1)
  const hasBudget = usage.total > 0
  const basis: SafeToSpend['basis'] = hasBudget ? 'budget' : summary.income > 0 ? 'balance' : 'none'
  const remaining = hasBudget ? usage.remaining : Math.max(0, summary.balance)
  const perDay = basis === 'none' ? 0 : Math.max(0, remaining / daysLeft)
  return { remaining, daysLeft, perDay, basis }
}

export function monthlyTrend(
  txs: Transaction[],
  months = 6,
): { month: string; income: number; expense: number; savings: number }[] {
  const current = monthKey(new Date().toISOString().slice(0, 10))
  const out: { month: string; income: number; expense: number; savings: number }[] = []
  for (let i = months - 1; i >= 0; i--) {
    const m = addMonths(current, -i)
    const s = monthSummary(txs, m)
    out.push({ month: m, income: s.income, expense: s.expense, savings: s.savings })
  }
  return out
}

export function percentChange(current: number, previous: number): number | null {
  if (previous === 0) return current === 0 ? 0 : null
  return ((current - previous) / previous) * 100
}

export function computeHealthScore(
  summary: MonthSummary,
  usage: BudgetUsage,
  previousExpense: number,
): HealthResult {
  const reasons: string[] = []
  const breakdown: HealthFactor[] = []

  // 1. Budget usage (30 pts) — how much of the monthly budget was actually spent.
  if (usage.total > 0) {
    const ratio = usage.percentUsed
    let pts: number
    if (ratio <= 80) pts = 30
    else if (ratio <= 100) pts = 30 - (ratio - 80) * 0.55
    else pts = Math.max(0, 19 - (ratio - 100) * 0.5)
    pts = Math.round(pts)
    reasons.push(
      ratio > 100
        ? `You are spending ${(ratio - 100).toFixed(0)}% above your monthly budget.`
        : ratio > 80
          ? `Budget usage is high at ${ratio.toFixed(0)}% of your monthly budget.`
          : `You have used ${ratio.toFixed(0)}% of your monthly budget.`,
    )
    breakdown.push({
      label: 'Budget usage',
      detail: `Spent ${formatINR(usage.spent)} of ${formatINR(usage.total)} budget (${ratio.toFixed(0)}%)`,
      points: pts,
      max: 30,
    })
  } else {
    reasons.push('No monthly budget has been set yet.')
    breakdown.push({ label: 'Budget usage', detail: 'No monthly budget set', points: 12, max: 30 })
  }

  // 2. Savings rate (30 pts) — share of income left after expenses.
  const sr = summary.savingsRate
  if (summary.income === 0) {
    reasons.push('No income recorded for this month.')
    breakdown.push({ label: 'Savings rate', detail: 'No income recorded', points: 0, max: 30 })
  } else {
    const pts = Math.round(Math.min(30, Math.max(0, sr)))
    reasons.push(
      sr >= 30
        ? `Strong savings rate of ${sr.toFixed(0)}% of income.`
        : sr >= 20
          ? `Healthy savings rate of ${sr.toFixed(0)}% of income.`
          : sr >= 10
            ? `Savings rate is modest at ${sr.toFixed(0)}% of income.`
            : sr >= 0
              ? `Low savings rate of ${sr.toFixed(0)}% of income.`
              : 'Expenses exceed income this month.',
    )
    breakdown.push({
      label: 'Savings rate',
      detail: `Saved ${formatINR(summary.savings)} of ${formatINR(summary.income)} income (${sr.toFixed(0)}%)`,
      points: pts,
      max: 30,
    })
  }

  // 3. Categories over budget (20 pts) — each category that exceeds its plan.
  const overCats = usage.categories.filter((c) => c.status === 'over')
  const catPts = Math.max(0, 20 - overCats.length * 7)
  if (overCats.length > 0) {
    reasons.push(
      `${overCats.map((c) => c.category).join(', ')} ${
        overCats.length === 1 ? 'is' : 'are'
      } over the planned budget.`,
    )
  }
  breakdown.push({
    label: 'Categories over budget',
    detail:
      overCats.length === 0
        ? 'All categories within budget'
        : `${overCats.length} over: ${overCats.map((c) => c.category).join(', ')}`,
    points: catPts,
    max: 20,
  })

  // 4. Remaining balance (10 pts) — cash cushion left relative to income.
  let balPts = 0
  if (summary.income > 0) {
    const balRatio = summary.balance / summary.income
    balPts = Math.round(Math.min(10, Math.max(0, (balRatio / 0.2) * 10)))
  }
  breakdown.push({
    label: 'Remaining balance',
    detail:
      summary.income > 0
        ? `${formatINR(summary.balance)} left after expenses`
        : 'No income recorded',
    points: balPts,
    max: 10,
  })

  // 5. Spending consistency (10 pts) — month-over-month change in spending.
  const change = percentChange(summary.expense, previousExpense)
  let consPts: number
  let consDetail: string
  if (change === null) {
    consPts = 6
    consDetail = 'No previous-month data to compare'
  } else if (change <= 0) {
    consPts = 10
    consDetail = `Spending ${Math.abs(change).toFixed(0)}% lower than last month`
    reasons.push(`Spending is down ${Math.abs(change).toFixed(0)}% compared with last month.`)
  } else {
    consPts = Math.round(Math.max(0, 10 - change * 0.3))
    consDetail = `Spending ${change.toFixed(0)}% higher than last month`
    if (change > 25) {
      reasons.push(`Spending is up ${change.toFixed(0)}% compared with last month.`)
    }
  }
  breakdown.push({
    label: 'Spending consistency',
    detail: consDetail,
    points: consPts,
    max: 10,
  })

  const score = Math.max(0, Math.min(100, breakdown.reduce((sum, f) => sum + f.points, 0)))

  let label = 'Excellent'
  let tone: HealthResult['tone'] = 'good'
  if (score < 50) {
    label = 'Needs Attention'
    tone = 'bad'
  } else if (score < 75) {
    label = 'Fair'
    tone = 'warn'
  } else if (score < 88) {
    label = 'Good'
    tone = 'good'
  }

  return { score, label, tone, reasons, breakdown }
}
