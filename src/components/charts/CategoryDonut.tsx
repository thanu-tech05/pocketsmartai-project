import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { categoryColor } from '../CategoryIcon'
import { ChartTooltip } from './ChartTooltip'
import { formatINR } from '../../lib/format'

export function CategoryDonut({ data }: { data: { category: string; amount: number }[] }) {
  if (data.length === 0) {
    return <p className="py-16 text-center text-sm text-slate-400">No expense data yet</p>
  }
  const total = data.reduce((s, d) => s + d.amount, 0)
  const top = data[0]
  const topPct = total > 0 ? (top.amount / total) * 100 : 0

  return (
    <div>
      <div className="relative h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="amount"
              nameKey="category"
              innerRadius={62}
              outerRadius={96}
              paddingAngle={2}
              stroke="none"
            >
              {data.map((entry) => (
                <Cell
                  key={entry.category}
                  fill={categoryColor(entry.category)}
                  stroke={entry.category === top.category ? '#ffffff' : 'none'}
                  strokeWidth={entry.category === top.category ? 2 : 0}
                />
              ))}
            </Pie>
            <Tooltip content={<ChartTooltip />} />
            <Legend
              verticalAlign="bottom"
              iconType="circle"
              iconSize={8}
              formatter={(value) => <span className="text-xs text-slate-600">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center pb-10">
          <span className="text-xs font-medium text-slate-400">Total spend</span>
          <span className="text-lg font-bold text-slate-900">{formatINR(total)}</span>
        </div>
      </div>
      <div className="mt-2 flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-sm">
        <span
          className="h-2.5 w-2.5 shrink-0 rounded-full"
          style={{ backgroundColor: categoryColor(top.category) }}
        />
        <span className="font-medium text-slate-700">Biggest: {top.category}</span>
        <span className="ml-auto tabular-nums text-slate-500">
          {topPct.toFixed(0)}% · {formatINR(top.amount)}
        </span>
      </div>
    </div>
  )
}
