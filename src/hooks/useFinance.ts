import { useMemo } from 'react'
import { useApp } from '../context/AppContext'
import { currentMonthKey } from '../lib/format'
import {
  budgetUsage,
  computeHealthScore,
  findBudget,
  monthSummary,
  monthlyTrend,
  percentChange,
  safeToSpend,
} from '../lib/finance'
import { buildInsights, buildRecommendations } from '../lib/recommendations'

export function useFinance() {
  const { state } = useApp()
  const month = currentMonthKey()

  return useMemo(() => {
    const summary = monthSummary(state.transactions, month)
    const previousKey = shift(month, -1)
    const previous = monthSummary(state.transactions, previousKey)
    const budget = findBudget(state.budgets, month)
    const usage = budgetUsage(budget, summary)
    const health = computeHealthScore(summary, usage, previous.expense)
    const safe = safeToSpend(usage, summary)
    const recommendations = buildRecommendations({
      transactions: state.transactions,
      budget,
      goals: state.goals,
      month,
    })
    const insights = buildInsights({
      transactions: state.transactions,
      budget,
      goals: state.goals,
      month,
    })
    const trend = monthlyTrend(state.transactions, 6)
    const expenseChange = percentChange(summary.expense, previous.expense)
    const incomeChange = percentChange(summary.income, previous.income)
    const savingsChange = percentChange(summary.savings, previous.savings)

    return {
      month,
      previousKey,
      summary,
      previous,
      budget,
      usage,
      health,
      safe,
      recommendations,
      insights,
      trend,
      expenseChange,
      incomeChange,
      savingsChange,
      transactions: state.transactions,
      goals: state.goals,
    }
  }, [state, month])
}

function shift(month: string, delta: number): string {
  const [y, m] = month.split('-').map(Number)
  const d = new Date(y, m - 1 + delta, 1)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}
