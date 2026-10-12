import type { AppState } from '../types'
import { currentMonthKey, formatDate, formatINR, monthLabel } from './format'
import { budgetUsage, computeHealthScore, findBudget, monthSummary } from './finance'
import { buildRecommendations } from './recommendations'

function esc(s: string): string {
  return s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c] as string)
}

/** Opens a new window with a clean, printable PocketSmartAI report. */
export function printReport(state: AppState): void {
  const month = currentMonthKey()
  const summary = monthSummary(state.transactions, month)
  const budget = findBudget(state.budgets, month)
  const usage = budgetUsage(budget, summary)
  const health = computeHealthScore(summary, usage, 0)
  const recs = buildRecommendations({
    transactions: state.transactions,
    budget,
    goals: state.goals,
    month,
  })

  const row = (label: string, value: string) =>
    `<tr><td>${esc(label)}</td><td class="num">${esc(value)}</td></tr>`

  const budgetRows =
    usage.categories.length > 0
      ? usage.categories
          .map(
            (c) =>
              `<tr><td>${esc(c.category)}</td><td class="num">${formatINR(c.spent)}</td><td class="num">${
                c.budget > 0 ? formatINR(c.budget) : '—'
              }</td><td class="num">${c.percentUsed.toFixed(0)}%</td></tr>`,
          )
          .join('')
      : '<tr><td colspan="4" class="muted">No budget set for this month.</td></tr>'

  const goalRows = state.goals.length
    ? state.goals
        .map((g) => {
          const pct = Math.min(100, (g.saved / g.target) * 100)
          return `<tr><td>${esc(g.name)}</td><td class="num">${formatINR(g.saved)}</td><td class="num">${formatINR(
            g.target,
          )}</td><td class="num">${pct.toFixed(0)}%</td><td>${formatDate(g.targetDate)}</td></tr>`
        })
        .join('')
    : '<tr><td colspan="5" class="muted">No savings goals yet.</td></tr>'

  const recItems = recs
    .slice(0, 6)
    .map((r) => `<li><strong>${esc(r.title)}</strong> — <span class="muted">${esc(r.message)}</span></li>`)
    .join('')

  const healthRows = health.breakdown
    .map(
      (f) =>
        `<tr><td>${esc(f.label)}</td><td class="muted">${esc(f.detail)}</td><td class="num">${f.points} / ${f.max}</td></tr>`,
    )
    .join('')

  const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<title>PocketSmartAI Report — ${monthLabel(month)}</title>
<style>
  * { box-sizing: border-box; }
  body { font-family: "Segoe UI", Arial, sans-serif; color: #0f172a; margin: 32px; }
  h1 { margin: 0; font-size: 22px; }
  .sub { color: #64748b; font-size: 13px; margin-top: 4px; }
  h2 { font-size: 15px; margin: 26px 0 8px; border-bottom: 2px solid #1c6df3; padding-bottom: 4px; }
  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  td, th { text-align: left; padding: 7px 10px; border-bottom: 1px solid #e2e8f0; }
  th { background: #f1f5f9; font-size: 12px; text-transform: uppercase; letter-spacing: .04em; color: #475569; }
  .num { text-align: right; font-variant-numeric: tabular-nums; }
  .muted { color: #94a3b8; }
  .score { display: inline-block; padding: 10px 18px; border-radius: 12px; background: #eef7ff; color: #1756df; font-size: 26px; font-weight: 800; }
  .badge { font-size: 12px; color: #64748b; margin-left: 8px; }
  ul { font-size: 13px; padding-left: 18px; }
  li { margin-bottom: 6px; }
  .foot { margin-top: 28px; font-size: 11px; color: #94a3b8; }
</style>
</head>
<body>
  <h1>PocketSmartAI — Financial Report</h1>
  <div class="sub">Smart Budget &amp; Recommendation Assistant · ${esc(state.profile.name || 'User')} · ${monthLabel(
    month,
  )} · Generated ${formatDate(new Date().toISOString().slice(0, 10))}</div>

  <h2>Budget Health Score</h2>
  <div class="score">${health.score}/100</div><span class="badge">${esc(health.label)}</span>
  <ul>${health.reasons
    .slice(0, 4)
    .map((r) => `<li>${esc(r)}</li>`)
    .join('')}</ul>
  <table>
    <thead><tr><th>Factor</th><th>How it was measured</th><th class="num">Points</th></tr></thead>
    <tbody>${healthRows}</tbody>
  </table>

  <h2>Monthly Summary</h2>
  <table>
    <tbody>
      ${row('Monthly Income', formatINR(summary.income))}
      ${row('Total Expenses', formatINR(summary.expense))}
      ${row('Available Balance', formatINR(summary.balance))}
      ${row('Savings', formatINR(summary.savings))}
      ${row('Savings Rate', `${summary.savingsRate.toFixed(0)}%`)}
      ${row('Transactions this month', String(summary.txCount))}
    </tbody>
  </table>

  <h2>Spending by Category</h2>
  <table>
    <thead><tr><th>Category</th><th class="num">Spent</th><th class="num">Budget</th><th class="num">Used</th></tr></thead>
    <tbody>${budgetRows}</tbody>
  </table>

  <h2>Savings Goals</h2>
  <table>
    <thead><tr><th>Goal</th><th class="num">Saved</th><th class="num">Target</th><th class="num">Progress</th><th>Target date</th></tr></thead>
    <tbody>${goalRows}</tbody>
  </table>

  <h2>Smart Recommendations</h2>
  <ul>${recItems}</ul>

  <div class="foot">Generated by PocketSmartAI. Recommendations are general, rule-based guidance and are not professional financial advice.</div>
</body>
</html>`

  const win = window.open('', '_blank', 'width=900,height=700')
  if (!win) return
  win.document.open()
  win.document.write(html)
  win.document.close()
  win.focus()
  setTimeout(() => win.print(), 350)
}
