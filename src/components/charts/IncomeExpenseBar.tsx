import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { ChartTooltip } from './ChartTooltip'
import { formatINRCompact } from '../../lib/format'
import { useTheme } from '../../context/ThemeContext'

interface Point {
  month: string
  income: number
  expense: number
}

export function IncomeExpenseBar({
  data,
  formatter,
}: {
  data: Point[]
  formatter?: (m: string) => string
}) {
  const fmt = formatter ?? ((m: string) => m)
  const { resolved } = useTheme()
  const grid = resolved === 'dark' ? '#1e293b' : '#eef2f7'
  const axis = '#94a3b8'
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -8, bottom: 0 }} barGap={4}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={grid} />
          <XAxis
            dataKey="month"
            tickFormatter={fmt}
            tick={{ fontSize: 12, fill: axis }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={(v) => formatINRCompact(Number(v))}
            tick={{ fontSize: 12, fill: axis }}
            axisLine={false}
            tickLine={false}
            width={56}
          />
          <Tooltip content={<ChartTooltip />} cursor={{ fill: resolved === 'dark' ? '#0f172a' : '#f8fafc' }} />
          <Bar dataKey="income" name="Income" fill="#10b981" radius={[6, 6, 0, 0]} maxBarSize={34} />
          <Bar dataKey="expense" name="Expenses" fill="#f43f5e" radius={[6, 6, 0, 0]} maxBarSize={34} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
