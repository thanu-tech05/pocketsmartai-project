# PocketSmartAI — Demo Script

A short, reliable walkthrough for demonstrating the project (≈5 minutes).

## Before you start

- Double-click `run.bat` (or run `npm install` once, then `npm run dev`).
- The app opens at `http://localhost:5173` with realistic Indian demo data pre-loaded.
- Optional: explain that **all money is in ₹** and that data stays in your browser.

## 1. Dashboard — "how am I doing?"

1. Point out the five KPI cards: **Income, Expenses, Balance, Savings, Budget Health**.
2. Highlight the **Income → Expenses → Savings → Remaining** flow.
3. Show the **This Month vs Last Month** card — the arrows show the change.
4. Show the **Spending by Category** donut and **Income vs Expenses** bars.
5. Scroll to **PocketSmartAI Insights** — these are generated from the data, not hard-coded.

## 2. The connected system (key selling point)

1. Click **Add Expense** (quick action). Enter e.g. `Food`, `₹2,000`, today, "Team lunch".
2. Save. The toast confirms. Now point out that *everything* changed at once:
   - Total Expenses and Available Balance,
   - the category donut (Food grew),
   - Food budget progress,
   - the Budget Health Score,
   - and the **Alert bell** (a new warning may appear).
3. This demonstrates the app is one connected intelligence system, not separate pages.

## 3. Transactions

1. Go to **Transactions**. Show search, type/category/month filters and sorting.
2. Edit a transaction and delete one (confirm dialog appears).
3. Optionally click **Export** to download a CSV.

## 4. Budget

1. Open **Budget**. Show overall usage and category bars.
2. Point at an **Over** or **Near** badge and the warning banner.
3. Click **Edit Budget**, change a category limit, save, and watch statuses update.

## 5. Savings Goals

1. Open **Savings Goals**. Show progress bars and "Save / month" figures.
2. Open **Add Savings** on a goal, add ₹5,000, and show the progress jump.

## 6. Analytics

1. Open **Analytics**. Show the four charts and the automatic **Key Observations**.

## 7. Smart Recommendations (the headline feature)

1. Open **Smart Recommendations**.
2. Explain the header: the engine analyses the user's own data.
3. Walk through two cards — e.g. **Food Spending Alert** and **Savings Opportunity** — and
   read the **"Why"** line to show explainability.
4. Show the **Budget Health Score** panel and its reasons.

## 8. Dark mode, backup and report

1. Toggle the **theme** button in the header (light → dark → system).
2. In **Settings**, click **Print Report** to show the printable summary.
3. Show **Export Backup (JSON)** and explain data can be moved between devices.
4. Show **Reset Demo Data** and **Clear All Data** (with confirmation).

## 9. Wrap-up

- Recap: records data → analyses it → scores financial health → gives explainable
  recommendations, all in ₹, fully offline.
- State the disclaimer: general, rule-based guidance; not professional financial advice.

## Quick manual test checklist

- [ ] App loads with demo data (no empty dashboard).
- [ ] Add / edit / delete a transaction updates totals and charts.
- [ ] Search, filters and sorting work.
- [ ] Budget over/near states appear correctly.
- [ ] Savings goal add/withdraw updates progress.
- [ ] Recommendations and insights change when data changes.
- [ ] Budget Health Score changes with data.
- [ ] Data persists after refresh (localStorage).
- [ ] Dark mode works across every page.
- [ ] JSON export then import round-trips.
- [ ] Print report opens a clean printable page.
- [ ] Mobile layout (resize window) shows the drawer navigation.
