import type { AppState } from '../types'
import { createDemoState } from './demoData'

const KEY = 'pocketsmartai:state:v1'

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return createDemoState()
    const parsed = JSON.parse(raw) as Partial<AppState>
    if (!parsed || !Array.isArray(parsed.transactions)) {
      return createDemoState()
    }
    return {
      profile: parsed.profile ?? { name: 'User', email: '' },
      transactions: parsed.transactions ?? [],
      budgets: parsed.budgets ?? [],
      goals: parsed.goals ?? [],
      seededAt: parsed.seededAt ?? Date.now(),
    }
  } catch {
    return createDemoState()
  }
}

export function saveState(state: AppState): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    /* storage unavailable — ignore */
  }
}

export function clearStorage(): void {
  try {
    localStorage.removeItem(KEY)
  } catch {
    /* ignore */
  }
}
