export type TxType = 'income' | 'expense'

export type ExpenseCategory =
  | 'Food'
  | 'Transport'
  | 'Shopping'
  | 'Education'
  | 'Bills'
  | 'Entertainment'
  | 'Health'
  | 'Other'

export type IncomeCategory =
  | 'Salary'
  | 'Freelance'
  | 'Business'
  | 'Investment'
  | 'Gift'
  | 'Other'

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  'Food',
  'Transport',
  'Shopping',
  'Education',
  'Bills',
  'Entertainment',
  'Health',
  'Other',
]

export const INCOME_CATEGORIES: IncomeCategory[] = [
  'Salary',
  'Freelance',
  'Business',
  'Investment',
  'Gift',
  'Other',
]

export interface Transaction {
  id: string
  type: TxType
  amount: number
  category: string
  date: string // ISO yyyy-mm-dd
  description: string
  createdAt: number
}

export interface Budget {
  id: string
  month: string // yyyy-mm
  total: number
  categories: Record<string, number>
}

export interface SavingsGoal {
  id: string
  name: string
  target: number
  saved: number
  targetDate: string // ISO yyyy-mm-dd
  createdAt: number
}

export interface Profile {
  name: string
  email: string
}

export interface AppState {
  profile: Profile
  transactions: Transaction[]
  budgets: Budget[]
  goals: SavingsGoal[]
  seededAt: number | null
}

export interface HealthFactor {
  label: string
  detail: string
  points: number
  max: number
}

export interface HealthResult {
  score: number
  label: string
  tone: 'good' | 'warn' | 'bad'
  reasons: string[]
  breakdown: HealthFactor[]
}

export interface Recommendation {
  id: string
  title: string
  message: string
  why: string
  severity: 'info' | 'warning' | 'danger' | 'success'
  icon: string
  category?: string
}

export interface Insight {
  id: string
  text: string
  tone: 'good' | 'warn' | 'bad' | 'info'
}
