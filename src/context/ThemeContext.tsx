import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export type ThemePref = 'light' | 'dark' | 'system'

interface ThemeCtx {
  pref: ThemePref
  resolved: 'light' | 'dark'
  setPref: (pref: ThemePref) => void
  toggle: () => void
}

const KEY = 'pocketsmartai:theme'
const Ctx = createContext<ThemeCtx | null>(null)

function systemDark(): boolean {
  return typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-color-scheme: dark)').matches
}

function readPref(): ThemePref {
  try {
    const v = localStorage.getItem(KEY)
    if (v === 'light' || v === 'dark' || v === 'system') return v
  } catch {
    /* ignore */
  }
  return 'light'
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [pref, setPrefState] = useState<ThemePref>(() => readPref())
  const [resolved, setResolved] = useState<'light' | 'dark'>(() =>
    pref === 'dark' || (pref === 'system' && systemDark()) ? 'dark' : 'light',
  )

  const apply = useCallback((p: ThemePref) => {
    const dark = p === 'dark' || (p === 'system' && systemDark())
    document.documentElement.classList.toggle('dark', dark)
    setResolved(dark ? 'dark' : 'light')
  }, [])

  useEffect(() => {
    apply(pref)
    try {
      localStorage.setItem(KEY, pref)
    } catch {
      /* ignore */
    }
  }, [pref, apply])

  useEffect(() => {
    if (pref !== 'system') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => apply('system')
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [pref, apply])

  const setPref = useCallback((p: ThemePref) => setPrefState(p), [])
  const toggle = useCallback(
    () => setPrefState((p) => (p === 'dark' ? 'light' : p === 'light' ? 'system' : 'dark')),
    [],
  )

  const value = useMemo(() => ({ pref, resolved, setPref, toggle }), [pref, resolved, setPref, toggle])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useTheme(): ThemeCtx {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
