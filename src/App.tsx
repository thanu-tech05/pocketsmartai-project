import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'

const Dashboard = lazy(() => import('./pages/Dashboard').then((m) => ({ default: m.Dashboard })))
const Transactions = lazy(() => import('./pages/Transactions').then((m) => ({ default: m.Transactions })))
const BudgetPage = lazy(() => import('./pages/BudgetPage').then((m) => ({ default: m.BudgetPage })))
const SavingsGoals = lazy(() => import('./pages/SavingsGoals').then((m) => ({ default: m.SavingsGoals })))
const Analytics = lazy(() => import('./pages/Analytics').then((m) => ({ default: m.Analytics })))
const Settings = lazy(() => import('./pages/Settings').then((m) => ({ default: m.Settings })))

function PageLoader() {
  return (
    <div className="space-y-6" role="status" aria-live="polite">
      <span className="sr-only">Loading…</span>
      <div className="h-4 w-64 animate-pulse rounded bg-slate-200/70" />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 animate-pulse rounded-2xl border border-slate-200/80 bg-slate-100/70" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="h-48 animate-pulse rounded-2xl border border-slate-200/80 bg-slate-100/70 lg:col-span-2" />
        <div className="h-48 animate-pulse rounded-2xl border border-slate-200/80 bg-slate-100/70" />
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="h-72 animate-pulse rounded-2xl border border-slate-200/80 bg-slate-100/70" />
        <div className="h-72 animate-pulse rounded-2xl border border-slate-200/80 bg-slate-100/70" />
      </div>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route
          path="/"
          element={
            <Suspense fallback={<PageLoader />}>
              <Dashboard />
            </Suspense>
          }
        />
        <Route
          path="/transactions"
          element={
            <Suspense fallback={<PageLoader />}>
              <Transactions />
            </Suspense>
          }
        />
        <Route
          path="/budget"
          element={
            <Suspense fallback={<PageLoader />}>
              <BudgetPage />
            </Suspense>
          }
        />
        <Route
          path="/goals"
          element={
            <Suspense fallback={<PageLoader />}>
              <SavingsGoals />
            </Suspense>
          }
        />
        <Route
          path="/analytics"
          element={
            <Suspense fallback={<PageLoader />}>
              <Analytics />
            </Suspense>
          }
        />
        <Route
          path="/settings"
          element={
            <Suspense fallback={<PageLoader />}>
              <Settings />
            </Suspense>
          }
        />
        <Route
          path="*"
          element={
            <Suspense fallback={<PageLoader />}>
              <Dashboard />
            </Suspense>
          }
        />
      </Route>
    </Routes>
  )
}
