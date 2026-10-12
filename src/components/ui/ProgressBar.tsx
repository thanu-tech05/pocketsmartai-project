import clsx from 'clsx'

type Tone = 'brand' | 'good' | 'warn' | 'bad'

const tones: Record<Tone, string> = {
  brand: 'bg-brand-500',
  good: 'bg-emerald-500',
  warn: 'bg-amber-500',
  bad: 'bg-rose-500',
}

export function ProgressBar({
  value,
  tone = 'brand',
  className,
}: {
  value: number
  tone?: Tone
  className?: string
}) {
  const width = Math.max(0, Math.min(100, value))
  return (
    <div className={clsx('h-2 w-full overflow-hidden rounded-full bg-slate-100', className)}>
      <div
        className={clsx('h-full rounded-full transition-[width] duration-300 ease-out', tones[tone])}
        style={{ width: `${width}%` }}
      />
    </div>
  )
}
