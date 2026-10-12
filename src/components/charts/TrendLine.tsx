import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { ChartTooltip } from './ChartTooltip'
import { formatINRCompact } from '../../lib/format'
import { useTheme } from '../../context/ThemeContext'

interface Point {
  month: string
  income: number
  expense: number
  savings: number
}

export function TrendLine({
  data,
  formatter,
  dataKey = 'expense',
  color = '#338cff',
  name = 'Spending',
}: {
  data: Point[]
  formatter?: (m: string) => string
  dataKey?: 'expense' | 'income' | 'savings'
  color?: string
  name?: string
}) {
  const fmt = formatter ?? ((m: string) => m)
  const { resolved } = useTheme()
  const grid = resolved === 'dark' ? '#1e293b' : '#eef2f7'
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
          <defs>
            <linearGradient id={`grad-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.28} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={grid} />
          <XAxis
            dataKey="month"
            tickFormatter={fmt}
            tick={{ fontSize: 12, fill: '#94a3b8' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={(v) => formatINRCompact(Number(v))}
            tick={{ fontSize: 12, fill: '#94a3b8' }}
            axisLine={false}
            tickLine={false}
            width={56}
          />
          <Tooltip content={<ChartTooltip />} />
          <Area
            type="monotone"
            dataKey={dataKey}
            name={name}
            stroke={color}
            strokeWidth={2.5}
            fill={`url(#grad-${dataKey})`}
            dot={{ r: 3, fill: color }}
            activeDot={{ r: 5 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
