import {
  StatsUpSquare as BarChart3,
  CheckCircle as CheckCircle2,
  InfoCircle as Info,
  PiggyBank,
  Repeat,
  Sparks as Sparkles,
  Trophy as Target,
  WarningTriangle as TriangleAlert,
  Wallet,
  XmarkCircle as XCircle,
} from 'iconoir-react'
import type { IconType as LucideIcon } from '../components/icons'
import { useFinance } from '../hooks/useFinance'
import { formatINR } from '../lib/format'
import { Card, CardHeader } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { ProgressBar } from '../components/ui/ProgressBar'
import { HealthBreakdown } from '../components/HealthBreakdown'
import { cn } from '../lib/cn'
import type { Recommendation } from '../types'

const ICONS: Record<string, LucideIcon> = {
  alert: XCircle,
  warning: TriangleAlert,
  wallet: Wallet,
  chart: BarChart3,
  piggy: PiggyBank,
  repeat: Repeat,
  target: Target,
  check: CheckCircle2,
  sparkles: Sparkles,
}

const SEVERITY_STYLES: Record<
  Recommendation['severity'],
  { ring: string; icon: string; badge: 'bad' | 'warn' | 'good' | 'info'; label: string }
> = {
  danger: { ring: 'border-rose-200 bg-rose-50/40', icon: 'bg-rose-100 text-rose-600', badge: 'bad', label: 'Action needed' },
  warning: { ring: 'border-amber-200 bg-amber-50/40', icon: 'bg-amber-100 text-amber-600', badge: 'warn', label: 'Watch out' },
  success: { ring: 'border-emerald-200 bg-emerald-50/40', icon: 'bg-emerald-100 text-emerald-600', badge: 'good', label: 'Opportunity' },
  info: { ring: 'border-brand-200 bg-brand-50/40', icon: 'bg-brand-100 text-brand-600', badge: 'info', label: 'Insight' },
}

export function Recommendations() {
  const f = useFinance()
  const { recommendations, health, summary, usage } = f

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader title="Budget Health Score" subtitle="Why you got this score" />
          <div className="flex items-center gap-4">
            <div
              className={cn(
                'flex h-24 w-24 flex-col items-center justify-center rounded-2xl',
                health.tone === 'good'
                  ? 'bg-emerald-50 text-emerald-600'
                  : health.tone === 'warn'
                    ? 'bg-amber-50 text-amber-600'
                    : 'bg-rose-50 text-rose-600',
              )}
            >
              <span className="text-3xl font-extrabold">{health.score}</span>
              <span className="text-micro font-semibold uppercase">out of 100</span>
            </div>
            <div className="flex-1">
              <Badge tone={health.tone === 'good' ? 'good' : health.tone === 'warn' ? 'warn' : 'bad'}>
                {health.label}
              </Badge>
              <div className="mt-3">
                <ProgressBar
                  value={health.score}
                  tone={health.tone === 'good' ? 'good' : health.tone === 'warn' ? 'warn' : 'bad'}
                />
              </div>
              <p className="mt-2 text-xs text-slate-500">
                A 100-point score built from budget usage, savings rate, categories over budget,
                remaining balance and spending consistency — see the full breakdown below.
              </p>
            </div>
          </div>
          <ul className="mt-4 space-y-2 border-t border-slate-100 pt-4">
            {health.reasons.slice(0, 4).map((r, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                {r}
              </li>
            ))}
          </ul>
        </Card>

        <div className="space-y-4 lg:col-span-2">
          {recommendations.map((r) => {
            const Icon = ICONS[r.icon] ?? Sparkles
            const style = SEVERITY_STYLES[r.severity]
            return (
              <div key={r.id} className={cn('rounded-2xl border bg-surface p-4', style.ring)}>
                <div className="flex items-start gap-3">
                  <span className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl', style.icon)}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-slate-900">{r.title}</h3>
                      <Badge tone={style.badge}>{style.label}</Badge>
                    </div>
                    <p className="mt-1.5 text-sm leading-relaxed text-slate-700">{r.message}</p>
                    <p className="mt-2 flex items-start gap-1.5 text-xs text-slate-500">
                      <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                      <span>
                        <span className="font-semibold text-slate-600">Why: </span>
                        {r.why}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <Card>
        <CardHeader
          title="How your Budget Health Score is calculated"
          subtitle="Every point is earned, so the score is fully explainable"
        />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <HealthBreakdown health={health} />
          </div>
          <div className="lg:col-span-2">
            <div className="rounded-2xl bg-slate-50 p-4">
              <h3 className="text-sm font-semibold text-slate-800">Scoring model (100 points)</h3>
              <ul className="mt-3 space-y-2.5 text-sm text-slate-600">
                {[
                  ['Budget usage', '30 pts', 'Full marks when ≤ 80% of budget is used; tapers as you overspend.'],
                  ['Savings rate', '30 pts', '1 point per 1% of income saved, capped at 30.'],
                  ['Categories over budget', '20 pts', '−7 points for each category that exceeds its limit.'],
                  ['Remaining balance', '10 pts', 'Full marks when you keep ≥ 20% of income after expenses.'],
                  ['Spending consistency', '10 pts', 'Full marks when spending did not rise vs last month.'],
                ].map(([name, pts, rule]) => (
                  <li key={name} className="flex gap-3">
                    <span className="mt-0.5 shrink-0 rounded-md bg-white px-2 py-0.5 text-xs font-bold text-brand-700 shadow-soft">
                      {pts}
                    </span>
                    <span>
                      <span className="font-medium text-slate-700">{name}</span>
                      <span className="block text-xs text-slate-500">{rule}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-slate-500">
                Each factor is scaled linearly inside its range, then the points are summed and capped
                at 100. The same formula is used on the dashboard, in alerts and in the printed report.
              </p>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader title="This Month at a Glance" subtitle="The data behind these recommendations" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: 'Income', value: formatINR(summary.income) },
            { label: 'Expenses', value: formatINR(summary.expense) },
            { label: 'Budget used', value: usage.total > 0 ? `${usage.percentUsed.toFixed(0)}%` : 'No budget' },
            { label: 'Savings rate', value: `${summary.savingsRate.toFixed(0)}%` },
          ].map((s) => (
            <div key={s.label} className="rounded-xl bg-slate-50 px-4 py-3">
              <p className="text-xs text-slate-500">{s.label}</p>
              <p className="mt-1 text-lg font-bold tabular-nums text-slate-900">{s.value}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-slate-400">
          PocketSmartAI provides general, rule-based guidance and is not professional financial advice.
        </p>
      </Card>
    </div>
  )
}
