# PocketSmartAI — Smart Budget & Recommendation Assistant

A polished, fully functional personal-finance web app built for an Indian user, using
**Indian Rupees (₹)** throughout. It is not just an expense tracker: it analyses your income,
expenses, budgets and savings goals and generates **personalised, explainable, rule-based
recommendations** and a **Budget Health Score**.

## Tech stack

- React 18 + Vite + TypeScript
- Tailwind CSS (light **and dark** mode)
- Recharts (charts)
- React Router (navigation + route-level code splitting)
- Browser `localStorage` for persistence — no backend, no API keys, no Java/Python

## Run it (easiest way)

Double-click **`run.bat`**. It installs dependencies the first time, then starts the app and
opens your browser at `http://localhost:5173`.

### Or manually

```bash
npm install
npm run dev
```

## Other commands

```bash
npm run build      # production build into dist/
npm run preview    # preview the production build
npm run typecheck  # TypeScript checks (strict)
```

## Features

- **Dashboard** — income, expenses, balance, savings, Budget Health Score, financial overview,
  month-over-month comparison, category & income-vs-expense charts, budget progress, goal
  progress, insights, recent transactions and working quick actions.
- **Transactions** — add / edit / delete income & expenses, search, filter by type, category and
  month, sort, and CSV export.
- **Budget** — monthly overall and category budgets with live usage, remaining amount and
  over/near-limit warnings.
- **Savings Goals** — create, edit, delete goals; add/withdraw savings; progress %, remaining
  amount and required monthly saving.
- **Analytics** — category donut, income vs expenses, spending trend and savings trend, plus
  automatic observations.
- **Smart Recommendations** — a rule-based engine that explains *what happened → why it matters
  → what to do*, with a transparent Budget Health Score breakdown and an alerts centre in the
  header.
- **Appearance** — light / dark / system theme, remembered across visits.
- **Backup & report** — JSON export/import and a printable financial report.
- **Settings** — profile, fixed INR currency, reset demo data and clear all data.

## Documentation

- `docs/PROJECT_REPORT.md` — full project report
- `docs/DEMO_SCRIPT.md` — guided demonstration script
- `docs/SUBMISSION_GUIDE.md` — how to run, build and submit

## Notes

- On first launch the app is pre-loaded with realistic Indian demo data so nothing is empty.
  Use **Settings → Reset Demo Data** anytime.
- Everything recalculates automatically: add or edit a transaction and the dashboard, charts,
  budgets, health score, insights and recommendations all update.
- Recommendations are general, rule-based guidance and are **not** professional financial advice.
