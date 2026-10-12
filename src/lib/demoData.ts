import type { AppState, Budget, SavingsGoal, Transaction } from '../types'
import { addMonths, currentMonthKey, uid } from './format'

interface SeedTx {
  type: Transaction['type']
  amount: number
  category: string
  day: number
  description: string
}

const CURRENT_EXPENSES: SeedTx[] = [
  { type: 'expense', amount: 1200, category: 'Food', day: 2, description: 'Grocery shopping' },
  { type: 'expense', amount: 350, category: 'Food', day: 4, description: 'Swiggy order' },
  { type: 'expense', amount: 2400, category: 'Food', day: 9, description: 'Dinner with friends' },
  { type: 'expense', amount: 1450, category: 'Food', day: 14, description: 'Weekly groceries' },
  { type: 'expense', amount: 800, category: 'Food', day: 19, description: 'Cafe & snacks' },
  { type: 'expense', amount: 1200, category: 'Transport', day: 3, description: 'Metro & auto' },
  { type: 'expense', amount: 900, category: 'Transport', day: 12, description: 'Petrol' },
  { type: 'expense', amount: 650, category: 'Transport', day: 20, description: 'Cab rides' },
  { type: 'expense', amount: 3200, category: 'Shopping', day: 6, description: 'New clothes' },
  { type: 'expense', amount: 1800, category: 'Shopping', day: 17, description: 'Headphones' },
  { type: 'expense', amount: 3000, category: 'Education', day: 5, description: 'Online course fee' },
  { type: 'expense', amount: 1500, category: 'Education', day: 21, description: 'Books' },
  { type: 'expense', amount: 4000, category: 'Bills', day: 8, description: 'House rent share' },
  { type: 'expense', amount: 1350, category: 'Bills', day: 10, description: 'Electricity & water' },
  { type: 'expense', amount: 799, category: 'Bills', day: 11, description: 'Mobile recharge' },
  { type: 'expense', amount: 900, category: 'Entertainment', day: 13, description: 'Movie night' },
  { type: 'expense', amount: 600, category: 'Entertainment', day: 22, description: 'Music subscription' },
  { type: 'expense', amount: 1100, category: 'Health', day: 15, description: 'Pharmacy' },
  { type: 'expense', amount: 700, category: 'Other', day: 18, description: 'Gifts' },
]

const PREVIOUS_EXPENSES: SeedTx[] = [
  { type: 'expense', amount: 1400, category: 'Food', day: 3, description: 'Groceries' },
  { type: 'expense', amount: 900, category: 'Food', day: 11, description: 'Restaurant' },
  { type: 'expense', amount: 1100, category: 'Food', day: 23, description: 'Groceries' },
  { type: 'expense', amount: 1000, category: 'Transport', day: 5, description: 'Commute' },
  { type: 'expense', amount: 800, category: 'Transport', day: 18, description: 'Petrol' },
  { type: 'expense', amount: 2200, category: 'Shopping', day: 9, description: 'Shoes' },
  { type: 'expense', amount: 1000, category: 'Shopping', day: 24, description: 'Accessories' },
  { type: 'expense', amount: 3000, category: 'Education', day: 7, description: 'Certification exam' },
  { type: 'expense', amount: 4200, category: 'Bills', day: 8, description: 'Rent share' },
  { type: 'expense', amount: 1250, category: 'Bills', day: 12, description: 'Utilities' },
  { type: 'expense', amount: 700, category: 'Entertainment', day: 16, description: 'Outing' },
  { type: 'expense', amount: 1300, category: 'Health', day: 20, description: 'Doctor visit' },
  { type: 'expense', amount: 500, category: 'Other', day: 26, description: 'Miscellaneous' },
]

function txFor(monthKey: string, list: SeedTx[], maxDay?: number): Transaction[] {
  return list.map((t, i) => {
    const day = maxDay ? Math.min(t.day, maxDay) : t.day
    return {
      id: uid('tx'),
      type: t.type,
      amount: t.amount,
      category: t.category,
      date: `${monthKey}-${String(day).padStart(2, '0')}`,
      description: t.description,
      createdAt: Date.now() - (list.length - i) * 1000,
    }
  })
}

function dayOfMonth(day: number, maxDay: number): string {
  return String(Math.min(day, maxDay)).padStart(2, '0')
}

export function createDemoState(): AppState {
  const current = currentMonthKey()
  const previous = addMonths(current, -1)
  const today = new Date().getDate()

  const incomeCurrent: Transaction[] = [
    {
      id: uid('tx'),
      type: 'income',
      amount: 40000,
      category: 'Salary',
      date: `${current}-01`,
      description: 'Monthly salary',
      createdAt: Date.now() - 5000,
    },
    {
      id: uid('tx'),
      type: 'income',
      amount: 6000,
      category: 'Freelance',
      date: `${current}-${dayOfMonth(12, today)}`,
      description: 'Freelance project',
      createdAt: Date.now() - 4000,
    },
  ]

  const incomePrevious: Transaction[] = [
    {
      id: uid('tx'),
      type: 'income',
      amount: 40000,
      category: 'Salary',
      date: `${previous}-01`,
      description: 'Monthly salary',
      createdAt: Date.now() - 9000,
    },
  ]

  const transactions: Transaction[] = [
    ...incomePrevious,
    ...txFor(previous, PREVIOUS_EXPENSES),
    ...incomeCurrent,
    ...txFor(current, CURRENT_EXPENSES, today),
  ].sort((a, b) => b.date.localeCompare(a.date))

  const budgets: Budget[] = [
    {
      id: uid('budget'),
      month: current,
      total: 35000,
      categories: {
        Food: 5000,
        Transport: 3000,
        Shopping: 4000,
        Education: 5000,
        Bills: 7000,
        Entertainment: 2000,
        Health: 2000,
        Other: 2000,
      },
    },
  ]

  const goals: SavingsGoal[] = [
    {
      id: uid('goal'),
      name: 'New Laptop',
      target: 60000,
      saved: 25000,
      targetDate: addMonths(current, 4) + '-15',
      createdAt: Date.now() - 3000,
    },
    {
      id: uid('goal'),
      name: 'Emergency Fund',
      target: 100000,
      saved: 18000,
      targetDate: addMonths(current, 10) + '-01',
      createdAt: Date.now() - 2000,
    },
  ]

  return {
    profile: { name: 'Adithya', email: 'adithya@example.com' },
    transactions,
    budgets,
    goals,
    seededAt: Date.now(),
  }
}
