import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { AppState, Budget, Profile, SavingsGoal, Transaction } from '../types'
import { createDemoState } from '../lib/demoData'
import { clearStorage, loadState, saveState } from '../lib/storage'
import { uid } from '../lib/format'

type NewTransaction = Omit<Transaction, 'id' | 'createdAt'>
type NewGoal = Omit<SavingsGoal, 'id' | 'createdAt'>

interface AppCtx {
  state: AppState
  addTransaction: (tx: NewTransaction) => void
  updateTransaction: (id: string, tx: NewTransaction) => void
  deleteTransaction: (id: string) => void
  setBudget: (month: string, total: number, categories: Record<string, number>) => void
  addGoal: (goal: NewGoal) => void
  updateGoal: (id: string, goal: Partial<NewGoal>) => void
  deleteGoal: (id: string) => void
  addToGoal: (id: string, amount: number) => void
  updateProfile: (profile: Partial<Profile>) => void
  importData: (data: AppState) => void
  resetDemoData: () => void
  clearAllData: () => void
}

const Ctx = createContext<AppCtx | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(() => loadState())

  useEffect(() => {
    saveState(state)
  }, [state])

  const addTransaction = useCallback((tx: NewTransaction) => {
    setState((s) => ({
      ...s,
      transactions: [
        { ...tx, id: uid('tx'), createdAt: Date.now() },
        ...s.transactions,
      ].sort((a, b) => b.date.localeCompare(a.date)),
    }))
  }, [])

  const updateTransaction = useCallback((id: string, tx: NewTransaction) => {
    setState((s) => ({
      ...s,
      transactions: s.transactions
        .map((t) => (t.id === id ? { ...t, ...tx } : t))
        .sort((a, b) => b.date.localeCompare(a.date)),
    }))
  }, [])

  const deleteTransaction = useCallback((id: string) => {
    setState((s) => ({ ...s, transactions: s.transactions.filter((t) => t.id !== id) }))
  }, [])

  const setBudget = useCallback(
    (month: string, total: number, categories: Record<string, number>) => {
      setState((s) => {
        const existing = s.budgets.find((b) => b.month === month)
        const next: Budget = existing
          ? { ...existing, total, categories }
          : { id: uid('budget'), month, total, categories }
        const budgets = existing
          ? s.budgets.map((b) => (b.month === month ? next : b))
          : [...s.budgets, next]
        return { ...s, budgets }
      })
    },
    [],
  )

  const addGoal = useCallback((goal: NewGoal) => {
    setState((s) => ({
      ...s,
      goals: [...s.goals, { ...goal, id: uid('goal'), createdAt: Date.now() }],
    }))
  }, [])

  const updateGoal = useCallback((id: string, goal: Partial<NewGoal>) => {
    setState((s) => ({
      ...s,
      goals: s.goals.map((g) => (g.id === id ? { ...g, ...goal } : g)),
    }))
  }, [])

  const deleteGoal = useCallback((id: string) => {
    setState((s) => ({ ...s, goals: s.goals.filter((g) => g.id !== id) }))
  }, [])

  const addToGoal = useCallback((id: string, amount: number) => {
    setState((s) => ({
      ...s,
      goals: s.goals.map((g) =>
        g.id === id ? { ...g, saved: Math.max(0, Math.min(g.target, g.saved + amount)) } : g,
      ),
    }))
  }, [])

  const updateProfile = useCallback((profile: Partial<Profile>) => {
    setState((s) => ({ ...s, profile: { ...s.profile, ...profile } }))
  }, [])

  const importData = useCallback((data: AppState) => {
    setState({
      profile: data.profile ?? { name: 'User', email: '' },
      transactions: Array.isArray(data.transactions) ? data.transactions : [],
      budgets: Array.isArray(data.budgets) ? data.budgets : [],
      goals: Array.isArray(data.goals) ? data.goals : [],
      seededAt: data.seededAt ?? Date.now(),
    })
  }, [])

  const resetDemoData = useCallback(() => {
    setState(createDemoState())
  }, [])

  const clearAllData = useCallback(() => {
    clearStorage()
    setState({
      profile: { name: 'User', email: '' },
      transactions: [],
      budgets: [],
      goals: [],
      seededAt: Date.now(),
    })
  }, [])

  const value = useMemo<AppCtx>(
    () => ({
      state,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      setBudget,
      addGoal,
      updateGoal,
      deleteGoal,
      addToGoal,
      updateProfile,
      importData,
      resetDemoData,
      clearAllData,
    }),
    [
      state,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      setBudget,
      addGoal,
      updateGoal,
      deleteGoal,
      addToGoal,
      updateProfile,
      importData,
      resetDemoData,
      clearAllData,
    ],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useApp(): AppCtx {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
