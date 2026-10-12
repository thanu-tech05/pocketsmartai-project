import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { CheckCircle as CheckCircle2, InfoCircle as Info, WarningTriangle as TriangleAlert, Xmark as X, XmarkCircle as XCircle } from 'iconoir-react'

type ToastKind = 'success' | 'error' | 'info' | 'warning'

interface Toast {
  id: number
  kind: ToastKind
  message: string
}

interface ToastCtx {
  notify: (message: string, kind?: ToastKind) => void
}

const Ctx = createContext<ToastCtx | null>(null)

let counter = 0

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const dismiss = useCallback((id: number) => {
    setToasts((t) => t.filter((x) => x.id !== id))
  }, [])

  const notify = useCallback(
    (message: string, kind: ToastKind = 'success') => {
      const id = ++counter
      setToasts((t) => [...t, { id, kind, message }])
      window.setTimeout(() => dismiss(id), 3800)
    },
    [dismiss],
  )

  const value = useMemo(() => ({ notify }), [notify])

  const styles: Record<ToastKind, string> = {
    success: 'border-emerald-200 bg-emerald-50 text-emerald-800',
    error: 'border-rose-200 bg-rose-50 text-rose-800',
    info: 'border-brand-200 bg-brand-50 text-brand-800',
    warning: 'border-amber-200 bg-amber-50 text-amber-800',
  }
  const icons: Record<ToastKind, ReactNode> = {
    success: <CheckCircle2 className="h-5 w-5 shrink-0" />,
    error: <XCircle className="h-5 w-5 shrink-0" />,
    info: <Info className="h-5 w-5 shrink-0" />,
    warning: <TriangleAlert className="h-5 w-5 shrink-0" />,
  }

  return (
    <Ctx.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-[min(92vw,360px)] flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-start gap-3 rounded-xl border px-4 py-3 text-sm shadow-card animate-fade-up ${styles[t.kind]}`}
          >
            {icons[t.kind]}
            <p className="flex-1 leading-snug">{t.message}</p>
            <button
              onClick={() => dismiss(t.id)}
              className="opacity-60 transition hover:opacity-100"
              aria-label="Dismiss notification"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </Ctx.Provider>
  )
}

export function useToast(): ToastCtx {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
