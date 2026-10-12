# PocketSmartAI — Project Report

**Title:** PocketSmartAI — Smart Budget & Recommendation Assistant
**Track:** AI/ML & Generative AI (Naan Mudhalvan / TN Skills, facilitated by SmartBridge)
**Category:** Personal Finance / FinTech Web Application
**Stack:** React · Vite · TypeScript · Tailwind CSS · Recharts
**Currency:** Indian Rupee (₹ / INR)
**Data storage:** Browser `localStorage` (no backend, no paid API, no Java/Python)

---

## 1. Abstract

PocketSmartAI is a browser-based personal-finance assistant that does more than record
income and expenses. It continuously analyses the user's financial data — income, spending
by category, monthly budgets and savings goals — and produces a **Budget Health Score** plus
a set of **Smart Recommendations** that explain *what happened, why it matters, and what the
user can do next*. The application is designed for an Indian user and presents every figure
in Indian Rupees.

The recommendation engine is rule-based and fully transparent: no external AI service is
required, so the project runs entirely offline and free of running costs — ideal for a
college submission and live demonstration.

## 2. Problem Statement

Most students and young earners know *how much* they spent but not *where* their money is
going or *what to change*. Manual spreadsheets require effort to maintain and provide no
guidance. Existing finance apps are either too complex, subscription-based, or built around
foreign currencies and banking systems that don't fit an Indian user's context.

## 3. Objectives

1. Provide a clean, fast way to record income and expenses in INR.
2. Visualise spending patterns through interactive charts.
3. Let the user set monthly overall and category budgets and warn them before they overspend.
4. Track savings goals with progress, remaining amount and required monthly saving.
5. Analyse the data and generate **personalised, explainable recommendations**.
6. Compute an overall **Budget Health Score** that changes as data changes.
7. Work offline, persist data locally, and require **no paid services**.

## 4. Scope

**In scope:** transaction management, budgets, savings goals, analytics, recommendation
engine, budget health score, insights, alerts, dark mode, data export/import, printable
report, demo data.

**Out of scope:** bank-account integration, real money movement, multi-user accounts,
cloud sync, investment advice.

## 5. Technology Stack

| Layer | Technology | Reason |
| :--- | :--- | :--- |
| UI library | React 18 | Component-based, widely used |
| Build tool | Vite 5 | Fast dev server and optimised builds |
| Language | TypeScript | Type safety, fewer runtime errors |
| Styling | Tailwind CSS 3 | Consistent, responsive design system |
| Charts | Recharts | Declarative, SVG-based charts |
| Routing | React Router 6 | Client-side navigation + code splitting |
| Icons | lucide-react | Clean, consistent icon set |
| Persistence | localStorage | No backend or database required |
| State | React Context + hooks | Lightweight global state |

No Java, Python, database server, or API key is required to run the project.

## 6. System Architecture

```
User
 │
 ▼
React UI (Dashboard, Transactions, Budget, Goals, Analytics, Recommendations, Settings)
 │
 ├── AppContext  ──►  localStorage  (persistent state)
 ├── ThemeContext ──► dark / light / system
 │
 ▼
Analysis Layer (lib/)
 ├── finance.ts          totals, category sums, budget usage, monthly trend, health score
 ├── recommendations.ts  rule engine  ──► Recommendations + Insights
 ├── demoData.ts         first-launch sample data
 └── report.ts           printable report generator
```

All pages read from one shared, connected data store. When a transaction is added, edited or
deleted, every derived value — totals, charts, budget usage, health score, insights and
recommendations — updates automatically.

## 7. Key Algorithms

### 7.1 Budget Health Score (0–100)

| Factor | Weight | Description |
| :--- | :--- | :--- |
| Spending vs budget | 35 | Penalty grows as utilisation passes 80% and 100% |
| Savings rate | 30 | Rewards saving ≥ 20–30% of income |
| Categories over budget | 20 | −7 per overspent category |
| Remaining balance | 15 | Penalty when nothing is left after expenses |
| Spending consistency | ±10 | Reward for lower spend than last month, penalty for spikes |

The score is recomputed on every data change and is accompanied by plain-language reasons.

### 7.2 Smart Recommendation Engine (rules)

1. **Overspending** — category spent above its budget → suggests a reduction amount.
2. **Near-limit** — category ≥ 80% of budget → warns about remaining amount.
3. **Overall budget** — monthly budget nearing/exceeding → warning/alert.
4. **Concentration** — one category ≥ 35% of spend → highlights the biggest lever.
5. **Savings opportunity** — healthy surplus → suggests a savings transfer.
6. **Low savings rate** — below 20% of income → suggests a realistic target.
7. **Repeated spending** — ≥ 4 transactions in a category → highlights the pattern.
8. **Goal pace** — computes required monthly saving per goal; flags overdue goals.
9. **Healthy buffer** — strong surplus → positive reinforcement.

Each recommendation carries a *why* explanation, demonstrating explainable, data-driven logic.

## 8. Features

- **Dashboard** — five KPI cards, income→expense→savings→balance flow, month-over-month
  comparison, category and income-vs-expense charts, budget and goal progress, insights,
  recent activity and quick actions.
- **Transactions** — add/edit/delete, search, filter by type/category/month, sort, CSV export.
- **Budget** — overall + category budgets, usage bars, over/near-limit states.
- **Savings Goals** — CRUD, add/withdraw savings, progress %, remaining, required monthly.
- **Analytics** — category donut, income vs expenses, spending and savings trends, auto
  observations.
- **Smart Recommendations** — ranked suggestions with explanations + health-score breakdown.
- **Settings** — profile, theme (light/dark/system), JSON export/import, print report,
  reset demo data, clear all data.
- **Alerts centre** — bell in the header summarising active warnings.

## 9. Testing

- **Static checks:** `npm run typecheck` (TypeScript, strict mode) — passes.
- **Build:** `npm run build` (production) — passes; pages code-split.
- **Logic smoke test:** finance + recommendation functions executed against demo data,
  producing a valid score, insights and recommendations.
- **Manual test cases** are covered in `DEMO_SCRIPT.md`.

## 10. Limitations

- Data is stored per-browser; clearing browser storage removes it (mitigated by JSON backup).
- The engine is rule-based, not a trained ML model.
- Currency formatting is INR-only (as required by the brief).

## 11. Future Scope

- Optional cloud sync / multi-device support.
- Recurring transactions and budget roll-over.
- ML-based spending prediction and anomaly detection.
- Bill reminders and notifications.
- Exportable PDF reports and UPI/bank CSV import.

## 12. Conclusion

PocketSmartAI meets the project goal of turning raw financial records into clear, explainable
guidance. It is fully functional, responsive, offline-capable and currency-appropriate for an
Indian user, and demonstrates genuine software engineering — a connected data model, a
transparent analysis engine, and a polished, production-style interface.

> PocketSmartAI provides general, rule-based guidance and is not professional financial advice.
