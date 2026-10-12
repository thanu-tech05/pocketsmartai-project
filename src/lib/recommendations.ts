import type {
  Budget,
  Insight,
  Recommendation,
  SavingsGoal,
  Transaction,
} from '../types'
import { formatINR, daysUntil, monthKey } from './format'
import {
  budgetUsage,
  monthSummary,
  percentChange,
  txsInMonth,
  type MonthSummary,
} from './finance'

interface Ctx {
  transactions: Transaction[]
  budget: Budget | undefined
  goals: SavingsGoal[]
  month: string
}

export function buildRecommendations(ctx: Ctx): Recommendation[] {
  const { transactions, budget, goals, month } = ctx
  const summary = monthSummary(transactions, month)
  const usage = budgetUsage(budget, summary)
  const recs: Recommendation[] = []

  // 1. Categories over budget
  for (const c of usage.categories.filter((c) => c.status === 'over')) {
    const over = c.spent - c.budget
    recs.push({
      id: `over-${c.category}`,
      title: `${c.category} Spending Alert`,
      message: `You have spent ${formatINR(c.spent)} on ${c.category} against a ${formatINR(
        c.budget,
      )} budget. Consider reducing ${c.category} expenses by about ${formatINR(over)} next month.`,
      why: `Your ${c.category} spending is ${Math.round(c.percentUsed)}% of its budget, which is above your planned limit.`,
      severity: 'danger',
      icon: 'alert',
      category: c.category,
    })
  }

  // 2. Categories near the limit
  for (const c of usage.categories.filter((c) => c.status === 'near')) {
    const left = Math.max(0, c.budget - c.spent)
    recs.push({
      id: `near-${c.category}`,
      title: `${c.category} Nearing Limit`,
      message: `You have used ${Math.round(c.percentUsed)}% of your ${c.category} budget. Only ${formatINR(
        left,
      )} remains for the rest of this month.`,
      why: `${c.category} is close to its budget of ${formatINR(c.budget)}, so a small extra expense could push it over.`,
      severity: 'warning',
      icon: 'warning',
      category: c.category,
    })
  }

  // 3. Overall monthly budget warning
  if (usage.total > 0 && usage.status === 'near') {
    recs.push({
      id: 'overall-near',
      title: 'Monthly Budget Nearly Used',
      message: `You have used ${Math.round(usage.percentUsed)}% of your monthly budget of ${formatINR(
        usage.total,
      )}. Remaining: ${formatINR(usage.remaining)}.`,
      why: 'Staying within your overall monthly budget keeps your Budget Health Score high.',
      severity: 'warning',
      icon: 'wallet',
    })
  } else if (usage.total > 0 && usage.status === 'over') {
    recs.push({
      id: 'overall-over',
      title: 'Monthly Budget Exceeded',
      message: `Your total spending of ${formatINR(usage.spent)} has exceeded your monthly budget of ${formatINR(
        usage.total,
      )}.`,
      why: 'Overspending against your overall budget reduces your financial buffer.',
      severity: 'danger',
      icon: 'wallet',
    })
  }

  // 4. High spend category concentration
  if (summary.expense > 0 && summary.byCategory.length > 0) {
    const top = summary.byCategory[0]
    const share = (top.amount / summary.expense) * 100
    if (share >= 35 && !usage.categories.some((c) => c.category === top.category && c.status === 'over')) {
      recs.push({
        id: `concentration-${top.category}`,
        title: `${top.category} is Your Largest Category`,
        message: `${top.category} accounts for ${share.toFixed(
          0,
        )}% of your total spending (${formatINR(top.amount)}). Reviewing this category could have the biggest impact.`,
        why: 'A single category dominating your expenses is often the easiest place to save.',
        severity: 'info',
        icon: 'chart',
        category: top.category,
      })
    }
  }

  // 5. Savings opportunity
  if (summary.balance > 0 && summary.income > 0) {
    const suggestion = Math.round((summary.balance * 0.25) / 100) * 100
    if (summary.balance >= 2000) {
      recs.push({
        id: 'savings-opportunity',
        title: 'Savings Opportunity',
        message: `You have ${formatINR(summary.balance)} remaining after your current expenses. Consider moving about ${formatINR(
          suggestion,
        )} toward your savings goals.`,
        why: 'Directing part of your remaining balance to savings helps you reach goals faster.',
        severity: 'success',
        icon: 'piggy',
      })
    }
  }

  // 6. Low savings rate
  if (summary.income > 0 && summary.savingsRate < 20) {
    const target = Math.round((summary.income * 0.2) / 100) * 100
    recs.push({
      id: 'low-savings',
      title: 'Increase Your Savings Rate',
      message: `You are currently saving ${summary.savingsRate.toFixed(
        0,
      )}% of your income. A realistic target is ${formatINR(target)} per month (20%).`,
      why: 'Financial experts commonly recommend saving at least 20% of income.',
      severity: summary.savingsRate <= 0 ? 'danger' : 'warning',
      icon: 'piggy',
    })
  }

  // 7. Repeated spending pattern
  const monthTx = txsInMonth(transactions, month).filter((t) => t.type === 'expense')
  const countMap = new Map<string, { count: number; total: number }>()
  for (const t of monthTx) {
    const e = countMap.get(t.category) ?? { count: 0, total: 0 }
    e.count += 1
    e.total += t.amount
    countMap.set(t.category, e)
  }
  for (const [category, e] of countMap) {
    if (e.count >= 4) {
      recs.push({
        id: `repeat-${category}`,
        title: `Repeated ${category} Spending`,
        message: `You made ${e.count} ${category} transactions this month totalling ${formatINR(
          e.total,
        )}. Frequent smaller spends add up quickly.`,
        why: `A high number of ${category} transactions suggests a recurring pattern worth reviewing.`,
        severity: 'info',
        icon: 'repeat',
        category,
      })
    }
  }

  // 8. Savings goal pace
  for (const g of goals) {
    const remaining = Math.max(0, g.target - g.saved)
    if (remaining <= 0) continue
    const days = daysUntil(g.targetDate)
    const monthsLeft = Math.max(1, Math.ceil(days / 30))
    const perMonth = Math.ceil(remaining / monthsLeft)
    if (days < 0) {
      recs.push({
        id: `goal-overdue-${g.id}`,
        title: `Goal "${g.name}" is Overdue`,
        message: `The target date for "${g.name}" has passed with ${formatINR(
          remaining,
        )} still to save. Update the target date or increase contributions.`,
        why: 'An overdue goal can lose momentum — revising it keeps you on track.',
        severity: 'warning',
        icon: 'target',
      })
    } else {
      recs.push({
        id: `goal-pace-${g.id}`,
        title: `Goal "${g.name}" Needs ${formatINR(perMonth)}/month`,
        message: `To reach ${formatINR(g.target)} by your target date, save about ${formatINR(
          perMonth,
        )} each month (${formatINR(remaining)} remaining).`,
        why: `You have roughly ${monthsLeft} month${monthsLeft > 1 ? 's' : ''} left to reach this goal.`,
        severity: 'info',
        icon: 'target',
      })
    }
  }

  // 9. Healthy surplus
  if (summary.income > 0 && summary.balance > summary.income * 0.3) {
    recs.push({
      id: 'healthy-buffer',
      title: 'Excellent Financial Buffer',
      message: `You have a strong surplus of ${formatINR(
        summary.balance,
      )} this month. This is a great time to grow your Emergency Fund.`,
      why: 'A healthy surplus improves your resilience against unexpected expenses.',
      severity: 'success',
      icon: 'check',
    })
  }

  if (recs.length === 0) {
    recs.push({
      id: 'empty',
      title: 'Add Data to Get Recommendations',
      message:
        'Add income, expenses, a monthly budget and a savings goal so PocketSmartAI can analyse your finances.',
      why: 'Recommendations are generated from your actual financial patterns.',
      severity: 'info',
      icon: 'sparkles',
    })
  }

  const order = { danger: 0, warning: 1, success: 2, info: 3 }
  return recs.sort((a, b) => order[a.severity] - order[b.severity])
}

export function buildInsights(ctx: Ctx): Insight[] {
  const { transactions, budget, goals, month } = ctx
  const summary = monthSummary(transactions, month)
  const usage = budgetUsage(budget, summary)
  const insights: Insight[] = []

  const overCats = usage.categories.filter((c) => c.status === 'over')
  if (overCats.length > 0) {
    const c = overCats[0]
    insights.push({
      id: 'ins-over',
      text: `Your ${c.category} spending is ${Math.round(c.percentUsed - 100)}% above your planned budget.`,
      tone: 'bad',
    })
  }

  if (summary.balance > 0) {
    insights.push({
      id: 'ins-bal',
      text: `You have ${formatINR(summary.balance)} available after current expenses.`,
      tone: 'good',
    })
  } else if (summary.income > 0) {
    insights.push({
      id: 'ins-neg',
      text: `Your expenses exceed your income by ${formatINR(Math.abs(summary.balance))} this month.`,
      tone: 'bad',
    })
  }

  if (summary.income > 0 && summary.savingsRate > 0) {
    insights.push({
      id: 'ins-rate',
      text: `You are currently saving ${summary.savingsRate.toFixed(0)}% of your monthly income.`,
      tone: summary.savingsRate >= 20 ? 'good' : 'warn',
    })
  }

  if (summary.byCategory.length > 1) {
    const second = summary.byCategory[1]
    insights.push({
      id: 'ins-second',
      text: `${second.category} is your second-highest expense category at ${formatINR(second.amount)}.`,
      tone: 'info',
    })
  }

  const previous = monthSummary(transactions, shiftMonth(month, -1))
  const change = percentChange(summary.expense, previous.expense)
  if (change !== null && Math.abs(change) >= 5) {
    insights.push({
      id: 'ins-change',
      text: `Your expenses ${change > 0 ? 'increased' : 'decreased'} by ${Math.abs(change).toFixed(
        0,
      )}% compared with last month.`,
      tone: change > 0 ? 'warn' : 'good',
    })
  }

  const saved = goals.reduce((s, g) => s + g.saved, 0)
  if (goals.length > 0) {
    const totalTarget = goals.reduce((s, g) => s + g.target, 0)
    insights.push({
      id: 'ins-goals',
      text: `Across your savings goals, you have saved ${formatINR(saved)} of ${formatINR(
        totalTarget,
      )}.`,
      tone: 'info',
    })
  }

  return insights.slice(0, 5)
}

function shiftMonth(month: string, delta: number): string {
  const [y, m] = month.split('-').map(Number)
  const d = new Date(y, m - 1 + delta, 1)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

export function currentMonthSummary(txs: Transaction[]): MonthSummary {
  return monthSummary(txs, monthKey(new Date().toISOString().slice(0, 10)))
}
