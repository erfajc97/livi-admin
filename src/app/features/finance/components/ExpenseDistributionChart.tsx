import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { CHART_COLORS } from '../data'

interface ExpenseDistributionChartProps {
  expensesByCategory: Record<string, number>
}

export default function ExpenseDistributionChart({ expensesByCategory }: ExpenseDistributionChartProps) {
  const cats = expensesByCategory ?? {}
  const total = Object.values(cats).reduce((s, v) => s + v, 0)
  const data = Object.entries(cats)
    .map(([name, value]) => ({ name, value, percent: total > 0 ? Math.round((value / total) * 100) : 0 }))
    .sort((a, b) => b.value - a.value)

  if (data.length === 0) {
    return (
      <div className="min-w-0 rounded-xl border border-border bg-surface p-4 sm:p-5">
        <h3 className="mb-3 text-sm font-semibold text-text">Distribución de Egresos</h3>
        <p className="text-sm text-text-muted">Sin datos de egresos.</p>
      </div>
    )
  }

  return (
    <div className="min-w-0 rounded-xl border border-border bg-surface p-4 sm:p-5">
      <h3 className="mb-3 text-sm font-semibold text-text">Distribución de Egresos</h3>

      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:gap-6">
        <div className="h-40 w-40 shrink-0 sm:h-44 sm:w-44">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={70}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={CHART_COLORS.categories[index % CHART_COLORS.categories.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex w-full min-w-0 flex-col gap-2">
          {data.map((entry, index) => (
            <div key={entry.name} className="flex min-w-0 items-center gap-3">
              <div
                className="h-3 w-3 shrink-0 rounded-full"
                style={{ backgroundColor: CHART_COLORS.categories[index % CHART_COLORS.categories.length] }}
              />
              <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-0.5">
                <span className="truncate text-xs text-text-muted">{entry.name}</span>
                <span className="text-xs text-text-muted">${entry.value.toLocaleString('es-EC')}</span>
                <span className="text-sm font-semibold text-text">{entry.percent}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
