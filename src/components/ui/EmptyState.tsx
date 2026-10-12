import type { ReactNode } from 'react'

export function EmptyState({
  icon,
  title,
  message,
  action,
}: {
  icon: ReactNode
  title: string
  message: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 px-6 py-12 text-center">
      <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200/70 bg-surface text-slate-400">
        {icon}
      </span>
      <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
      <p className="mt-1 max-w-sm text-balance text-sm text-slate-500">{message}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
