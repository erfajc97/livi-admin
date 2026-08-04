import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { CHART_COLORS } from '../data'

interface IncomeVsExpenseChartProps {
  totalIncome: number
  totalExpenses: number
}

export default function IncomeVsExpenseChart({
  totalIncome,
  totalExpenses,
}: IncomeVsExpenseChartProps) {
  const total = totalIncome + totalExpenses
  const data = [
    { name: 'Ingresos', value: totalIncome, color: CHART_COLORS.income },
    { name: 'Egresos', value: totalExpenses, color: CHART_COLORS.expense },
  ]

  if (total === 0) {
    return (
      <div className="min-w-0 rounded-xl border border-border bg-surface p-4 sm:p-5">
        <h3 className="mb-3 text-sm font-semibold text-text">
          Ingresos vs Egresos
        </h3>
        <p className="text-sm text-text-muted">
          Sin datos en el período seleccionado.
        </p>
      </div>
    )
  }

  return (
    <div className="min-w-0 rounded-xl border border-border bg-surface p-4 sm:p-5">
      <h3 className="mb-3 text-sm font-semibold text-text">
        Ingresos vs Egresos
      </h3>

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
                {data.map((entry, i) => (
                  <Cell key={`cell-${i}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex w-full min-w-0 flex-col gap-3">
          {data.map((entry) => {
            const percent =
              total > 0 ? Math.round((entry.value / total) * 100) : 0
            return (
              <div key={entry.name} className="flex items-center gap-3">
                <div
                  className="h-3 w-3 shrink-0 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="text-xs uppercase tracking-wide text-text-muted">
                    {entry.name}
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-base font-bold text-text">
                      ${entry.value.toFixed(2)}
                    </span>
                    <span
                      className="text-xs font-semibold"
                      style={{ color: entry.color }}
                    >
                      {percent}%
                    </span>
                  </div>
                </div>
              </div>
            )
          })}

          <div className="mt-1 border-t border-border pt-2 flex justify-between text-sm">
            <span className="text-text-muted">Total movido</span>
            <span className="font-bold text-text">${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
