import clsx from 'clsx'
import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react'

function Label({ label, error, required }: { label: string; error?: string; required?: boolean }) {
  return (
    <div className="mb-1.5 flex items-center justify-between">
      <label className="text-sm font-medium text-slate-700">
        {label}
        {required && <span className="ml-0.5 text-rose-500">*</span>}
      </label>
      {error && <span className="text-xs font-medium text-rose-600">{error}</span>}
    </div>
  )
}

const base =
  'w-full rounded-xl border bg-surface px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition focus:outline-none focus:ring-2'

export function Input({
  label,
  error,
  required,
  className,
  ...rest
}: InputHTMLAttributes<HTMLInputElement> & { label?: string; error?: string }) {
  return (
    <div>
      {label && <Label label={label} error={error} required={required} />}
      <input
        className={clsx(
          base,
          error
            ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-100'
            : 'border-slate-200 focus:border-brand-400 focus:ring-brand-100',
          className,
        )}
        {...rest}
      />
    </div>
  )
}

export function Select({
  label,
  error,
  required,
  className,
  children,
  ...rest
}: SelectHTMLAttributes<HTMLSelectElement> & { label?: string; error?: string; children: ReactNode }) {
  return (
    <div>
      {label && <Label label={label} error={error} required={required} />}
      <div className="relative">
        <select
          className={clsx(
            base,
            'appearance-none pr-9',
            error
              ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-100'
              : 'border-slate-200 focus:border-brand-400 focus:ring-brand-100',
            className,
          )}
          {...rest}
        >
          {children}
        </select>
        <svg
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  )
}

export function Textarea({
  label,
  error,
  required,
  className,
  ...rest
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string; error?: string }) {
  return (
    <div>
      {label && <Label label={label} error={error} required={required} />}
      <textarea
        className={clsx(
          base,
          error
            ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-100'
            : 'border-slate-200 focus:border-brand-400 focus:ring-brand-100',
          className,
        )}
        {...rest}
      />
    </div>
  )
}
